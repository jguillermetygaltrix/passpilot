import { AZ900_TOPICS, TOPIC_MAP } from "./data/topics";
import { getQuestionsByTopic } from "./data/questions";
import type {
  QuizAttempt,
  StudyPlan,
  StudyPlanBlock,
  Topic,
  TopicMastery,
  UserProfile,
} from "./types";
import { daysUntil } from "./scoring";

export function buildDailyPlan(
  profile: UserProfile,
  mastery: TopicMastery[],
  attempts: QuizAttempt[]
): StudyPlan {
  const daysLeft = daysUntil(profile.examDate);
  const totalMinutes = Math.max(15, Math.round(profile.hoursPerDay * 60));

  const ranked = [...mastery]
    .map((m) => ({ ...m, topic: TOPIC_MAP[m.topicId] }))
    .sort((a, b) => b.priority - a.priority);

  const blocks: StudyPlanBlock[] = [];
  let remaining = totalMinutes;

  const rescueMode = daysLeft <= 5;
  const nearExam = daysLeft <= 10;

  if (rescueMode) {
    blocks.push({
      id: "cram-opener",
      kind: "cram",
      title: "Cram sheet review — top 3 risk topics",
      description:
        "Speed-read the cram sheet for your three weakest high-weight topics. No new content.",
      minutes: Math.min(15, remaining),
      done: false,
    });
    remaining -= Math.min(15, remaining);
  } else {
    blocks.push({
      id: "warmup",
      kind: "review",
      title: "Warm-up: yesterday's mistakes",
      description:
        "Rapid 5-question re-do from your incorrect pile. Builds retention before new material.",
      minutes: Math.min(8, remaining),
      done: false,
    });
    remaining -= Math.min(8, remaining);
  }

  const focusTopics = ranked.slice(0, rescueMode ? 2 : 3);
  const studyMinutesEach = Math.max(
    10,
    Math.floor((remaining * 0.55) / Math.max(1, focusTopics.length))
  );

  focusTopics.forEach((m, idx) => {
    const topic = m.topic;
    if (!topic) return;
    const accPct = Math.round(m.accuracy * 100);
    blocks.push({
      id: `study-${topic.id}-${idx}`,
      kind: "study",
      topicId: topic.id,
      title: `Study: ${topic.name}`,
      description:
        m.attempts === 0
          ? `New territory. Read the summary and cram sheet, then try 3 practice questions.`
          : `You're at ${accPct}% here. Re-read the key facts, then do a 5-question drill.`,
      minutes: studyMinutesEach,
      done: false,
    });
    remaining -= studyMinutesEach;
  });

  const practiceMinutes = Math.max(10, Math.min(20, remaining - 5));
  if (practiceMinutes > 0) {
    blocks.push({
      id: "practice-mixed",
      kind: "practice",
      title: nearExam
        ? "Timed mixed drill (exam-like pressure)"
        : "Mixed practice drill",
      description: nearExam
        ? "10 mixed questions under pressure. Simulates exam pacing."
        : "10 mixed questions across all topics to keep breadth sharp.",
      minutes: practiceMinutes,
      done: false,
    });
    remaining -= practiceMinutes;
  }

  if (remaining >= 5) {
    blocks.push({
      id: "wrap-review",
      kind: "review",
      title: "Wrap review",
      description:
        "Glance over today's wrong answers. Add any tricky ones to your mistake sheet.",
      minutes: Math.min(remaining, 8),
      done: false,
    });
  }

  const mission = missionFor(profile, mastery, daysLeft);
  const aiInsight = insightFor(profile, mastery, attempts, daysLeft);

  return {
    date: new Date().toISOString().slice(0, 10),
    totalMinutes,
    blocks,
    mission,
    aiInsight,
  };
}

function missionFor(
  profile: UserProfile,
  mastery: TopicMastery[],
  daysLeft: number
): string {
  const weakest = [...mastery]
    .filter((m) => m.attempts > 0)
    .sort((a, b) => a.accuracy - b.accuracy)[0];
  const weakName = weakest ? TOPIC_MAP[weakest.topicId]?.name : null;

  if (daysLeft <= 3) {
    return weakName
      ? `Survive and stabilize. Lock in ${weakName} and hold the rest.`
      : `Survive and stabilize. Run the cram sheets, don't learn new concepts.`;
  }
  if (daysLeft <= 7) {
    return weakName
      ? `Close the ${weakName} gap and sharpen your weakest seams.`
      : `Sharpen what you already know. No new topics.`;
  }
  if (daysLeft <= 21) {
    return weakName
      ? `Convert ${weakName} from weakness to strength this week.`
      : `Build depth on your core weak areas.`;
  }
  return `Build a sturdy foundation — width first, depth after.`;
}

function insightFor(
  profile: UserProfile,
  mastery: TopicMastery[],
  attempts: QuizAttempt[],
  daysLeft: number
): string {
  const has = attempts.length > 0;
  const weakest = [...mastery]
    .filter((m) => m.attempts > 0)
    .sort((a, b) => a.accuracy - b.accuracy)[0];

  if (!has) {
    return "Take the diagnostic first — PassPilot needs a signal before it can adapt your plan.";
  }

  const topic = weakest ? TOPIC_MAP[weakest.topicId]?.name : null;
  const acc = weakest ? Math.round(weakest.accuracy * 100) : null;

  if (daysLeft <= 5 && acc !== null && acc < 60) {
    return `You have ${daysLeft} days left and ${topic} is sitting at ${acc}%. Don't chase perfection — aim for 70%+ on this one topic, then hold the line everywhere else.`;
  }
  if (acc !== null && acc < 50) {
    return `Today's best move is targeted practice on ${topic}. At ${acc}%, it's the single biggest lever you have.`;
  }
  if (acc !== null && acc < 70) {
    return `You're improving, but ${topic} still needs attention. One focused drill plus a re-read of the key facts should move it into the safe zone.`;
  }
  return `You're tracking well. A short mixed drill today keeps the edge without burning energy you'll need on exam day.`;
}

export function findWeaknessClusters(
  mastery: TopicMastery[],
  limit = 3
): { topic: Topic; mastery: TopicMastery; reason: string }[] {
  return mastery
    .filter((m) => m.attempts > 0 && m.accuracy < 0.75)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
    .map((m) => {
      const topic = TOPIC_MAP[m.topicId];
      const acc = Math.round(m.accuracy * 100);
      const pool = getQuestionsByTopic(m.topicId).length;
      const reason = buildReason(acc, topic.weight, m.mistakes, pool);
      return { topic, mastery: m, reason };
    });
}

function buildReason(
  accuracy: number,
  weight: number,
  mistakes: number,
  pool: number
): string {
  const weightPct = Math.round(weight * 100);
  const parts: string[] = [];
  parts.push(`Accuracy is ${accuracy}% on a topic worth ~${weightPct}% of the exam.`);
  if (mistakes >= 3) parts.push(`You've missed ${mistakes} questions here.`);
  if (pool > 0) parts.push(`There are ${pool} practice questions ready for retry.`);
  return parts.join(" ");
}

export function rescueTopics(mastery: TopicMastery[]): {
  prioritize: Topic[];
  deprioritize: Topic[];
} {
  const sorted = [...mastery]
    .filter((m) => m.attempts > 0)
    .sort((a, b) => b.priority - a.priority);
  const prioritize = sorted
    .slice(0, 2)
    .map((m) => TOPIC_MAP[m.topicId])
    .filter(Boolean);

  const strong = [...mastery]
    .filter((m) => m.accuracy >= 0.8 && m.attempts >= 2)
    .slice(0, 2)
    .map((m) => TOPIC_MAP[m.topicId])
    .filter(Boolean);

  return { prioritize, deprioritize: strong };
}
