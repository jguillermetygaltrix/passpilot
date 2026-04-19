import type {
  AnswerRecord,
  QuizAttempt,
  ReadinessSnapshot,
  RiskLevel,
  Topic,
  TopicMastery,
  UserProfile,
} from "./types";
import { AZ900_TOPICS } from "./data/topics";

export function daysUntil(isoDate: string): number {
  const target = new Date(isoDate);
  const now = new Date();
  const diff = Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(0, diff);
}

export function computeTopicMastery(
  attempts: QuizAttempt[],
  topics: Topic[] = AZ900_TOPICS
): TopicMastery[] {
  const answers = attempts.flatMap((a) => a.answers);

  return topics.map((topic) => {
    const topicAnswers = answers.filter((a) => a.topicId === topic.id);
    const attemptsCount = topicAnswers.length;
    const correct = topicAnswers.filter((a) => a.correct).length;
    const mistakes = attemptsCount - correct;
    const accuracy = attemptsCount ? correct / attemptsCount : 0;

    const lastAnswer = [...topicAnswers].sort((a, b) =>
      a.timeMs < b.timeMs ? -1 : 1
    )[topicAnswers.length - 1];

    return {
      topicId: topic.id,
      attempts: attemptsCount,
      correct,
      accuracy,
      mistakes,
      lastSeen: lastAnswer
        ? new Date(lastAnswer.timeMs || Date.now()).toISOString()
        : null,
      priority: 0,
    };
  });
}

export function computePriority(
  mastery: TopicMastery[],
  daysLeft: number,
  topics: Topic[] = AZ900_TOPICS
): TopicMastery[] {
  return mastery.map((m) => {
    const topic = topics.find((t) => t.id === m.topicId)!;
    const weakness = 1 - m.accuracy;
    const mistakePressure = Math.min(1, m.mistakes / 5);
    const urgency = daysLeft <= 7 ? 1.3 : daysLeft <= 14 ? 1.15 : 1;
    const coverage = m.attempts < 3 ? 0.25 : 0;

    const priority =
      (weakness * 0.55 + mistakePressure * 0.25 + coverage) *
      (0.6 + topic.weight) *
      urgency;

    return { ...m, priority: Number(priority.toFixed(3)) };
  });
}

export function readinessScore(
  mastery: TopicMastery[],
  attempts: QuizAttempt[],
  profile: UserProfile,
  topics: Topic[] = AZ900_TOPICS
): ReadinessSnapshot {
  const diagnostic = attempts.find((a) => a.kind === "diagnostic");
  const baseAccuracy = diagnostic
    ? diagnostic.scorePct / 100
    : mastery.reduce((sum, m) => sum + m.accuracy * 1, 0) /
      Math.max(1, mastery.length);

  const weighted = topics.reduce((sum, t) => {
    const m = mastery.find((x) => x.topicId === t.id);
    const acc = m && m.attempts > 0 ? m.accuracy : baseAccuracy * 0.85;
    return sum + acc * t.weight;
  }, 0);

  const highRiskPenalty = topics.reduce((penalty, t) => {
    const m = mastery.find((x) => x.topicId === t.id);
    if (!m) return penalty;
    if (m.accuracy < 0.5 && t.weight >= 0.2 && m.attempts >= 2) {
      return penalty + 0.05;
    }
    return penalty;
  }, 0);

  const consistency = consistencyBoost(attempts, profile);

  const raw = Math.round((weighted - highRiskPenalty + consistency) * 100);
  const score = clamp(raw, 0, 100);

  const daysLeft = daysUntil(profile.examDate);
  const risk = classifyRisk(score, daysLeft);

  const breakdown = topics.map((t) => {
    const m = mastery.find((x) => x.topicId === t.id);
    return {
      topicId: t.id,
      score: Math.round(((m?.accuracy ?? baseAccuracy) || 0) * 100),
      weight: t.weight,
    };
  });

  return {
    score,
    risk,
    daysLeft,
    asOf: new Date().toISOString(),
    breakdown,
    trend: buildTrend(attempts, score),
  };
}

function consistencyBoost(
  attempts: QuizAttempt[],
  profile: UserProfile
): number {
  const streakFactor = Math.min(0.05, (profile.streakDays || 0) * 0.008);
  const improvement =
    attempts.length >= 2
      ? Math.max(
          0,
          (attempts[attempts.length - 1].scorePct -
            attempts[0].scorePct) /
            300
        )
      : 0;
  return streakFactor + improvement;
}

export function classifyRisk(score: number, daysLeft: number): RiskLevel {
  if (score >= 82) return "strong";
  if (score >= 72) return "safer";
  if (score >= 58) return "borderline";
  if (daysLeft <= 7 && score < 72) return "high";
  return "high";
}

export function riskLabel(risk: RiskLevel): string {
  switch (risk) {
    case "strong":
      return "Strong Ready";
    case "safer":
      return "Safer Zone";
    case "borderline":
      return "Borderline";
    case "high":
      return "High Risk";
  }
}

export function riskColor(risk: RiskLevel): string {
  switch (risk) {
    case "strong":
      return "text-emerald-600";
    case "safer":
      return "text-brand-600";
    case "borderline":
      return "text-amber-600";
    case "high":
      return "text-rose-600";
  }
}

export function riskBg(risk: RiskLevel): string {
  switch (risk) {
    case "strong":
      return "bg-emerald-50 border-emerald-200 text-emerald-700";
    case "safer":
      return "bg-brand-50 border-brand-200 text-brand-700";
    case "borderline":
      return "bg-amber-50 border-amber-200 text-amber-700";
    case "high":
      return "bg-rose-50 border-rose-200 text-rose-700";
  }
}

export function scoreAttempt(answers: AnswerRecord[]): number {
  if (!answers.length) return 0;
  const correct = answers.filter((a) => a.correct).length;
  return Math.round((correct / answers.length) * 100);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function buildTrend(
  attempts: QuizAttempt[],
  currentScore: number
): { date: string; score: number }[] {
  if (!attempts.length) {
    const now = Date.now();
    return [
      { date: labelFor(now - 86400000 * 6), score: Math.max(0, currentScore - 18) },
      { date: labelFor(now - 86400000 * 4), score: Math.max(0, currentScore - 12) },
      { date: labelFor(now - 86400000 * 2), score: Math.max(0, currentScore - 5) },
      { date: labelFor(now), score: currentScore },
    ];
  }
  return attempts
    .slice(-6)
    .map((a, idx, arr) => ({
      date: labelFor(new Date(a.completedAt).getTime()),
      score: Math.round(
        arr.slice(0, idx + 1).reduce((s, x) => s + x.scorePct, 0) /
          (idx + 1)
      ),
    }));
}

function labelFor(ms: number): string {
  const d = new Date(ms);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function topInsight(
  snapshot: ReadinessSnapshot,
  mastery: TopicMastery[],
  topics: Topic[] = AZ900_TOPICS
): string {
  const weakest = [...mastery]
    .filter((m) => m.attempts > 0)
    .sort((a, b) => a.accuracy - b.accuracy)[0];

  if (!weakest) {
    return "Start with a diagnostic quiz so PassPilot can map your risk profile.";
  }

  const topic = topics.find((t) => t.id === weakest.topicId);
  const acc = Math.round(weakest.accuracy * 100);

  if (snapshot.risk === "high") {
    return `Your biggest risk right now is ${topic?.name}. You're at ${acc}% there — a focused 20 min drill could move your readiness meaningfully.`;
  }
  if (snapshot.risk === "borderline") {
    return `You're close to the safer zone. Tighten up ${topic?.name} (${acc}% accuracy) and you'll cross into pass-ready territory.`;
  }
  if (snapshot.risk === "safer") {
    return `You're in the safer zone. Don't coast — ${topic?.name} at ${acc}% is the one weak seam that could swing the result.`;
  }
  return `You're trending strong. Maintain sharpness with a short mixed drill and one review pass on ${topic?.name}.`;
}
