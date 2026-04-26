/**
 * Spaced Repetition engine — SuperMemo-2 lite, tuned for cert prep.
 *
 * Why SR for cert exams: ~50% of fundamentals exam questions are pure
 * memorization (acronyms, service names, port numbers, weight tables).
 * Flashcard apps (Anki, Quizlet) own this category because they own the
 * forgetting curve. PassPilot's mistake sheet captures wrong answers but
 * doesn't yet replay them on a curve — this module fixes that.
 *
 * Design:
 *   - Every wrong answer becomes an SR card keyed by questionId.
 *   - Cards have a `box` (1-7) and a `dueAt` ISO timestamp.
 *   - Box 1 = "review tomorrow", Box 7 = "review in 60 days".
 *   - Right on review → graduate to next box. Wrong → demote to box 1.
 *   - "Due today" = cards where dueAt <= end of today (local time).
 *
 * Why not full SM-2 (with EF intervals + grade 0-5):
 *   - Cert questions are binary right/wrong — no "easy/medium/hard" grade.
 *   - 7-box Leitner is empirically just as effective for binary cards
 *     and dramatically easier to debug.
 *
 * Storage: localStorage. Phase 2 will sync via the same backend that
 * mirrors usage events (TBD — currently LS-only).
 */

export interface SRCard {
  questionId: string;
  topicId: string;
  examId: string;
  box: number;            // 1-7 (Leitner box)
  dueAt: string;           // ISO timestamp; eligible for review when <= now
  lastReviewedAt: string | null;
  totalReviews: number;
  correctReviews: number;
  // Source: the original wrong attempt that created this card
  originAttemptId: string;
  createdAt: string;
}

export interface SRStats {
  totalCards: number;
  dueNow: number;
  dueToday: number;        // includes dueNow
  matureCards: number;     // box >= 5
  averageBox: number;
  longestStreak: number;
  lastReviewedAt: string | null;
}

const STORAGE_KEY = "passpilot.sr-cards.v1";

// Leitner intervals (days). box index 1..7 → days until next review.
// box 1 = 1 day; bumps roughly *2 each step out to 60 days.
const BOX_INTERVALS_DAYS = [0, 1, 2, 4, 7, 14, 30, 60];

function loadCards(): Record<string, SRCard> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveCards(cards: Record<string, SRCard>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {
    /* quota — tolerate */
  }
}

export function getAllCards(): SRCard[] {
  return Object.values(loadCards());
}

export function getCard(questionId: string): SRCard | null {
  return loadCards()[questionId] ?? null;
}

/**
 * Add or refresh an SR card for a wrong answer.
 *
 * Behavior:
 *   - First time wrong → new card in box 1, due in 1 day.
 *   - Already exists, was due → demote to box 1 (you forgot it again).
 *   - Already exists, NOT yet due → leave alone (don't punish a recent miss
 *     in the same session — the card is already on the curve).
 */
export function recordWrongAnswer(opts: {
  questionId: string;
  topicId: string;
  examId: string;
  attemptId: string;
}): SRCard {
  const cards = loadCards();
  const existing = cards[opts.questionId];
  const now = new Date();
  const isPastDue = existing && new Date(existing.dueAt) <= now;

  if (existing && !isPastDue) {
    // Don't reset progress on a same-session re-miss.
    return existing;
  }

  const card: SRCard = {
    questionId: opts.questionId,
    topicId: opts.topicId,
    examId: opts.examId,
    box: 1,
    dueAt: new Date(now.getTime() + BOX_INTERVALS_DAYS[1] * 86400000).toISOString(),
    lastReviewedAt: existing?.lastReviewedAt ?? null,
    totalReviews: existing?.totalReviews ?? 0,
    correctReviews: existing?.correctReviews ?? 0,
    originAttemptId: opts.attemptId,
    createdAt: existing?.createdAt ?? now.toISOString(),
  };

  cards[opts.questionId] = card;
  saveCards(cards);
  return card;
}

/**
 * Promote a card after a correct review.
 * Bumps box by 1 (max 7). Schedules next review per BOX_INTERVALS_DAYS.
 */
export function gradeCard(questionId: string, correct: boolean): SRCard | null {
  const cards = loadCards();
  const card = cards[questionId];
  if (!card) return null;

  const now = new Date();
  const newBox = correct
    ? Math.min(7, card.box + 1)
    : 1; // wrong → all the way back

  const nextDueDays = BOX_INTERVALS_DAYS[newBox];
  const nextDueMs = now.getTime() + nextDueDays * 86400000;

  const updated: SRCard = {
    ...card,
    box: newBox,
    dueAt: new Date(nextDueMs).toISOString(),
    lastReviewedAt: now.toISOString(),
    totalReviews: card.totalReviews + 1,
    correctReviews: card.correctReviews + (correct ? 1 : 0),
  };

  cards[questionId] = updated;
  saveCards(cards);
  return updated;
}

/**
 * Cards due NOW (dueAt <= now).
 * Sorted by oldest dueAt first (most overdue first).
 */
export function getDueCards(examId?: string): SRCard[] {
  const all = getAllCards();
  const now = Date.now();
  return all
    .filter((c) => new Date(c.dueAt).getTime() <= now)
    .filter((c) => !examId || c.examId === examId)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

/**
 * Cards due before end-of-today (local time).
 * Used for the "X cards due today" dashboard chip.
 */
export function getDueTodayCards(examId?: string): SRCard[] {
  const all = getAllCards();
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const cutoffMs = endOfToday.getTime();
  return all
    .filter((c) => new Date(c.dueAt).getTime() <= cutoffMs)
    .filter((c) => !examId || c.examId === examId)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

/**
 * Stats for the dashboard tile + settings page.
 */
export function getStats(examId?: string): SRStats {
  const all = examId
    ? getAllCards().filter((c) => c.examId === examId)
    : getAllCards();

  if (!all.length) {
    return {
      totalCards: 0,
      dueNow: 0,
      dueToday: 0,
      matureCards: 0,
      averageBox: 0,
      longestStreak: 0,
      lastReviewedAt: null,
    };
  }

  const now = Date.now();
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const cutoffMs = endOfToday.getTime();

  const dueNow = all.filter((c) => new Date(c.dueAt).getTime() <= now).length;
  const dueToday = all.filter((c) => new Date(c.dueAt).getTime() <= cutoffMs).length;
  const matureCards = all.filter((c) => c.box >= 5).length;
  const averageBox = all.reduce((s, c) => s + c.box, 0) / all.length;
  const reviewed = all.filter((c) => c.lastReviewedAt);
  const lastReviewedAt = reviewed.length
    ? reviewed
        .map((c) => c.lastReviewedAt!)
        .sort()
        .at(-1) ?? null
    : null;

  return {
    totalCards: all.length,
    dueNow,
    dueToday,
    matureCards,
    averageBox: Math.round(averageBox * 10) / 10,
    longestStreak: 0, // TODO Phase 2
    lastReviewedAt,
  };
}

/**
 * Useful for the dashboard streak / rescue logic.
 * Cards by box for histogram view.
 */
export function getBoxDistribution(examId?: string): number[] {
  const all = examId
    ? getAllCards().filter((c) => c.examId === examId)
    : getAllCards();
  const dist = [0, 0, 0, 0, 0, 0, 0, 0]; // index 1..7 used
  for (const c of all) {
    dist[c.box] = (dist[c.box] ?? 0) + 1;
  }
  return dist;
}

/**
 * For testing / settings — wipe SR state.
 */
export function clearAllCards(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export const SR_BOX_INTERVALS_DAYS = BOX_INTERVALS_DAYS;
