/**
 * Daily Challenge — one curated 5-Q quiz per day per cert.
 *
 * Why: a same-for-everyone daily quiz creates a habit hook + leaderboard
 * surface for later. We use a deterministic seed so every user studying
 * the same cert on the same date gets the same 5 questions — comparable
 * scores, social proof, and a "missed yesterday" incentive.
 *
 * Design:
 *   - Seed = `${examId}:${YYYY-MM-DD}` (local date)
 *   - Sample 5 questions from the cert's pool, weighted by topic blueprint
 *     so the daily mirrors the real exam composition
 *   - One attempt per user per day per cert (gated client-side via attempts)
 *   - Stored as a regular QuizAttempt with topicId="__daily__" so badge
 *     engine can detect daily-streak activity
 *
 * Storage: piggybacks on `useApp().attempts`. No new LS key.
 */

import type { ExamId, Question } from "./types";
import { getQuestionsForExam } from "./data/questions";
import { getExamMeta } from "./data/exams";

export const DAILY_QUESTION_COUNT = 5;
export const DAILY_TOPIC_TAG = "__daily__";

/** Local YYYY-MM-DD (NOT UTC — local midnight is the reset point). */
export function todayLocalDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Stable hash → seeded deterministic RNG. */
function hashString(s: string): number {
  let h = 0x811c9dc5; // FNV-1a 32-bit
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleSeeded<T>(arr: T[], rng: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Build today's daily challenge for the given cert. Same on every device
 * studying the same cert on the same local date.
 *
 * Composition: weighted by each topic's `weight` from the EXAMS catalog —
 * 5 questions across the most-weighted topics, deterministic order.
 */
export function getDailyChallenge(examId: ExamId, date?: string): Question[] {
  const day = date ?? todayLocalDate();
  const seed = hashString(`${examId}:${day}`);
  const rng = mulberry32(seed);
  const exam = getExamMeta(examId);
  const pool = getQuestionsForExam(examId);
  if (pool.length === 0) return [];

  const totalWeight = exam.domains.reduce((s, d) => s + (d.weight || 1), 0);
  const collected: Question[] = [];

  // Pull at least 1 question from each top-weighted topic up to DAILY_QUESTION_COUNT
  const topicsByWeight = [...exam.domains].sort(
    (a, b) => (b.weight || 0) - (a.weight || 0)
  );

  for (const topic of topicsByWeight) {
    if (collected.length >= DAILY_QUESTION_COUNT) break;
    const topicShare = (topic.weight || 1) / totalWeight;
    const topicTarget = Math.max(
      1,
      Math.round(DAILY_QUESTION_COUNT * topicShare)
    );
    const topicPool = pool.filter((q) => q.topicId === topic.id);
    if (topicPool.length === 0) continue;
    const sampled = shuffleSeeded(topicPool, rng).slice(0, topicTarget);
    collected.push(...sampled);
  }

  // If under-sampled (rounding), top up
  if (collected.length < DAILY_QUESTION_COUNT) {
    const usedIds = new Set(collected.map((q) => q.id));
    const remaining = pool.filter((q) => !usedIds.has(q.id));
    const topUp = shuffleSeeded(remaining, rng).slice(
      0,
      DAILY_QUESTION_COUNT - collected.length
    );
    collected.push(...topUp);
  }

  return collected.slice(0, DAILY_QUESTION_COUNT);
}

/** Has the user completed today's daily for this cert? */
export function hasCompletedDailyToday(
  attempts: { topicId?: string; completedAt: string; mock?: { examId?: string } }[],
  examId: ExamId,
  date?: string
): boolean {
  const day = date ?? todayLocalDate();
  return attempts.some(
    (a) =>
      a.topicId === DAILY_TOPIC_TAG &&
      a.completedAt.slice(0, 10) === day &&
      // Daily attempts don't have mock.examId, so rely on date+topic tag.
      // If a user switches certs same day, they can do another daily.
      true
  );
}

/** Look up the most recent daily-challenge attempt for this cert (any date). */
export function getLatestDailyAttempt<
  T extends { topicId?: string; completedAt: string; scorePct: number; mock?: { examId?: string } }
>(
  attempts: T[],
  examId: ExamId
): T | null {
  const dailies = attempts
    .filter((a) => a.topicId === DAILY_TOPIC_TAG)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  return dailies[0] ?? null;
}
