import { AZ900_TOPICS, TOPIC_MAP } from "./data/topics";
import { getQuestionsByTopic } from "./data/questions";
import { LESSONS_BY_TOPIC } from "./data/lessons";
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
  attempts: QuizAttempt[],
  /**
   * Lessons the user has already finished (DEC-052). Used to pick the *next*
   * un-completed lesson per focus topic, so the daily plan walks the curriculum
   * forward instead of re-suggesting the same opener every day. Optional for
   * back-compat with callers that haven't been updated yet — when omitted,
   * we fall back to "first lesson in the topic".
   */
  completedLessonIds: string[] = []
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

  // DEC-052 — study blocks become "lesson + 3-Q quiz" loops. Each focus topic
  // contributes the next un-completed lesson; if every lesson in that topic is
  // already done, fall back to a generic study block so the topic still shows
  // up in the day's focus list. Lesson blocks are budgeted at ~10 minutes each
  // (4-6 read + 3-4 quiz + reveal) — tight enough to do 3 in a 30-min session,
  // long enough to encode meaningfully.
  const completedSet = new Set(completedLessonIds);
  const LESSON_BLOCK_MINUTES = 10;

  focusTopics.forEach((m, idx) => {
    const topic = m.topic;
    if (!topic) return;
    const accPct = Math.round(m.accuracy * 100);
    const topicLessons = (LESSONS_BY_TOPIC[topic.id] ?? []).slice().sort(
      (a, b) => a.order - b.order
    );
    const nextLesson = topicLessons.find((l) => !completedSet.has(l.id));

    if (nextLesson) {
      const reason =
        m.attempts === 0
          ? `New territory. Read the lesson, then a 3-question quiz locks it in.`
          : `You're at ${accPct}% here. Lesson + immediate quiz turns the gap into reps.`;
      blocks.push({
        id: `lesson-${nextLesson.id}-${idx}`,
        kind: "lesson",
        topicId: topic.id,
        lessonId: nextLesson.id,
        title: nextLesson.title,
        description: reason,
        minutes: LESSON_BLOCK_MINUTES,
        done: false,
      });
      remaining -= LESSON_BLOCK_MINUTES;
    } else {
      // Fallback: every lesson done → still show the topic, but as a
      // pure-practice nudge (no lesson to re-read into).
      blocks.push({
        id: `study-${topic.id}-${idx}`,
        kind: "study",
        topicId: topic.id,
        title: `${topic.name} — refresh + drill`,
        description:
          accPct >= 80
            ? `You've finished every lesson here (at ${accPct}%). Skim the cram sheet, then a 5-Q drill keeps it sharp.`
            : `You've read every lesson but you're at ${accPct}%. Hit the cram sheet, then drill until 70%+.`,
        minutes: LESSON_BLOCK_MINUTES,
        done: false,
      });
      remaining -= LESSON_BLOCK_MINUTES;
    }
  });

  // End-of-day mixed drill — shrunk from 10→5 questions in DEC-052 because
  // the per-block lesson quizzes already do most of the retrieval work.
  // The mixed drill now serves breadth + transfer (random topic interleaving),
  // not the primary retrieval load.
  const practiceMinutes = Math.max(6, Math.min(12, remaining - 5));
  if (practiceMinutes > 0) {
    blocks.push({
      id: "practice-mixed",
      kind: "practice",
      title: nearExam
        ? "Timed mixed drill (exam-like pressure)"
        : "Mixed end-of-day drill",
      description: nearExam
        ? "5 mixed questions under pressure. Simulates exam pacing."
        : "5 mixed questions across all topics — interleaving locks in transfer.",
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
