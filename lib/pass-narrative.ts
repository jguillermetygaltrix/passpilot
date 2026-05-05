/**
 * pass-narrative — structured story-mode for the readiness score (DEC-053).
 *
 * Replaces the bare 0-100 readiness number with a real narrative:
 *
 *   "73% likely to pass if you took it today.
 *    Identity & Governance is your weakest seam at 50%.
 *    Bring it to 80% → readiness jumps to 89%.
 *    A focused 20-min drill could move it 15+ points."
 *
 * Pure function — no React, no store. Returns structured pieces so the UI
 * layer can render however it wants (compact on mobile, expanded on web,
 * spoken via TTS for Listen mode in the future).
 *
 * The math behind "what gets you to 90%":
 *   - Find the topic with the highest "lever score" = (1 - accuracy) × weight
 *   - Compute counterfactual readiness with that topic at 80%
 *   - Surface the delta as the user's #1 actionable move
 */

import type {
  ReadinessSnapshot,
  TopicMastery,
  Topic,
  UserProfile,
} from "./types";
import { TOPIC_MAP, AZ900_TOPICS } from "./data/topics";

export interface PassNarrative {
  /** Plain-English headline. ~6-10 words. */
  headline: string;
  /**
   * Pass probability percentage (0-100). NOT the same as readiness score —
   * this is calibrated to "% likely to pass on exam day given current state."
   * Mapping (DEC-053):
   *   readiness >= 82 → ~95%   (strong)
   *   readiness >= 72 → ~85%   (safer)
   *   readiness >= 58 → ~55%   (borderline)
   *   readiness <  58 → ~25%   (high risk)
   * Tightened by daysLeft factor: closer to exam = tighter bracket.
   */
  passProbabilityPct: number;
  /** One-sentence description of the user's biggest lever. */
  leverHeadline: string;
  /**
   * Concrete counterfactual: "Bring X from N% → 80% and your readiness
   * jumps to M%." Null when no clear lever (mastery already strong, or
   * not enough data).
   */
  leverDetail: string | null;
  /** The next concrete action, time-quantified. */
  microAction: string;
  /** Streak/days-left framing string for emotional grounding. */
  contextLine: string;
}

/**
 * Map readiness score (0-100) → pass probability (0-100).
 * Calibrated to common cert-prep heuristics: most people who score ≥72%
 * on practice consistently pass the real exam; <58% is a coinflip at best.
 * The daysLeft multiplier squeezes this when exam is imminent (less
 * room for variance to swing the outcome).
 */
function passProbability(readinessScore: number, daysLeft: number): number {
  // Base probability from readiness band
  let base: number;
  if (readinessScore >= 82) base = 95;
  else if (readinessScore >= 72) base = 85;
  else if (readinessScore >= 65) base = 70;
  else if (readinessScore >= 58) base = 55;
  else if (readinessScore >= 50) base = 35;
  else if (readinessScore >= 40) base = 25;
  else base = 15;

  // Imminent-exam tightening: ≤7 days from exam, current state matters more
  // (less time to improve). Pull probabilities toward the extremes by ~5pp.
  if (daysLeft <= 7) {
    if (base >= 50) base = Math.min(98, base + 3);
    else base = Math.max(5, base - 5);
  }

  return Math.round(base);
}

/**
 * Find the topic with the highest "lever score" — biggest readiness lift
 * available per minute of study. Returns null when nothing's actionable
 * (every topic mastered, or no data yet).
 */
function findBiggestLever(
  mastery: TopicMastery[],
  topics: Topic[]
): { topic: Topic; mastery: TopicMastery } | null {
  const candidates = mastery
    .filter((m) => m.attempts >= 1) // need data to be honest
    .filter((m) => m.accuracy < 0.78) // already strong topics aren't the lever
    .map((m) => {
      const topic = topics.find((t) => t.id === m.topicId);
      if (!topic) return null;
      const lever = (1 - m.accuracy) * topic.weight;
      return { topic, mastery: m, lever };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.lever - a.lever);

  if (!candidates.length) return null;
  return { topic: candidates[0].topic, mastery: candidates[0].mastery };
}

/**
 * Compute counterfactual readiness if the lever topic were boosted to 80%.
 * Approximation — recomputes the weighted accuracy with that one topic
 * substituted, ignores high-risk penalty + consistency boost (close enough
 * for a directional "jumps to ~M%" claim).
 */
function counterfactualReadiness(
  current: number,
  leverMastery: TopicMastery,
  leverTopic: Topic,
  mastery: TopicMastery[],
  topics: Topic[]
): number {
  // What's the weighted-acc contribution from the lever topic right now?
  const currentContribution = leverMastery.accuracy * leverTopic.weight;
  // What would it be at 80%?
  const boostedContribution = 0.8 * leverTopic.weight;
  // Net delta (in 0-1 weighted-accuracy space)
  const delta = boostedContribution - currentContribution;
  // Translate to 0-100 readiness scale (the score function already operates
  // in roughly the same space, so 1pp weighted = ~1pt readiness)
  const projected = Math.round(current + delta * 100);
  return Math.min(100, Math.max(0, projected));
}

/**
 * Build the full narrative. Topics defaults to AZ900 if not supplied — but
 * dashboard always passes the user's actual exam topics.
 */
export function buildPassNarrative(
  readiness: ReadinessSnapshot,
  mastery: TopicMastery[],
  profile: UserProfile,
  topics: Topic[] = AZ900_TOPICS
): PassNarrative {
  const prob = passProbability(readiness.score, readiness.daysLeft);
  const lever = findBiggestLever(mastery, topics);

  // ── Headline ──
  let headline: string;
  if (readiness.score === 0 && mastery.every((m) => m.attempts === 0)) {
    headline = "Take the diagnostic — we need a signal";
  } else if (prob >= 90) {
    headline = `${prob}% likely to pass — you're locked in`;
  } else if (prob >= 70) {
    headline = `${prob}% likely to pass today`;
  } else if (prob >= 50) {
    headline = `${prob}% likely to pass — coinflip territory`;
  } else if (prob >= 30) {
    headline = `${prob}% likely to pass — needs work`;
  } else {
    headline = `${prob}% likely to pass — high risk zone`;
  }

  // ── Lever copy ──
  let leverHeadline: string;
  let leverDetail: string | null = null;
  let microAction: string;

  if (!lever) {
    leverHeadline =
      readiness.score >= 78
        ? "Every topic is solid — maintain the edge."
        : "Take a topic drill so we can find your weakest seam.";
    microAction =
      readiness.score >= 78
        ? "A 10-min mixed drill keeps things sharp."
        : "Pick any topic from the Practice tab and run a 5-Q drill.";
  } else {
    const accPct = Math.round(lever.mastery.accuracy * 100);
    const projected = counterfactualReadiness(
      readiness.score,
      lever.mastery,
      lever.topic,
      mastery,
      topics
    );
    const lift = projected - readiness.score;
    const weightPct = Math.round(lever.topic.weight * 100);

    leverHeadline = `${lever.topic.name} is your weakest seam (${accPct}%).`;

    if (lift >= 3) {
      leverDetail = `It's worth ~${weightPct}% of the exam — bringing it to 80% lifts your readiness from ${readiness.score} → ~${projected}.`;
    } else {
      // Lever exists but math says low impact — still offer the action without
      // the misleading "jumps to" line.
      leverDetail = `Worth ~${weightPct}% of the exam — even a few correct answers here move the needle.`;
    }

    microAction =
      readiness.daysLeft <= 7
        ? `Open the Plan tab — today's first lesson block targets exactly this.`
        : `A 15-20 min focused drill on ${lever.topic.shortName} is your single highest-leverage move today.`;
  }

  // ── Context line — streak + days-left framing ──
  const streak = profile.streakDays || 0;
  let contextLine: string;
  if (readiness.daysLeft <= 3) {
    contextLine = `${readiness.daysLeft} day${readiness.daysLeft === 1 ? "" : "s"} until exam — every minute compounds.`;
  } else if (readiness.daysLeft <= 7) {
    contextLine = `${readiness.daysLeft} days left. Stabilize what you know, don't chase new concepts.`;
  } else if (streak >= 7) {
    contextLine = `Day ${streak} of your streak. Most people quit by day 3 — you're past the hump.`;
  } else if (streak >= 3) {
    contextLine = `Day ${streak} of your streak — keep the rhythm, day 7 unlocks a streak shield.`;
  } else if (streak === 0) {
    contextLine = `Start today's plan to begin a streak. ${readiness.daysLeft} days until exam.`;
  } else {
    contextLine = `Day ${streak} of your streak. ${readiness.daysLeft} days until exam.`;
  }

  return {
    headline,
    passProbabilityPct: prob,
    leverHeadline,
    leverDetail,
    microAction,
    contextLine,
  };
}
