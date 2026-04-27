/**
 * Achievement / Badges system.
 *
 * Why: every existing feature (drill / mock / SR / voice / cram / streak)
 * already has user moments worth celebrating — but right now those moments
 * pass without a dopamine hit. Badges add a reward layer over the existing
 * surface area, no new flows required.
 *
 * Design:
 *   - Each badge has a unique ID + a `check()` function that runs over
 *     the current store + sr state and returns true|false.
 *   - We persist the FIRST timestamp each badge unlocks at, so the badge
 *     wall can show "earned 3 days ago" without re-deriving.
 *   - `evaluateAll()` is cheap (LS-only, no network) and is called from
 *     anywhere a meaningful event happens (mock complete, SR review,
 *     daily completed, etc.). Newly-unlocked badges are returned so the
 *     caller can surface a toast.
 *   - Badges that aren't yet earned still expose `progress(0..1)` so the
 *     wall can render a meaningful progress bar (helps retention).
 */

import type { QuizAttempt, UserProfile } from "./types";
import { getAllCards } from "./sr";

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface BadgeContext {
  profile: UserProfile | null;
  attempts: QuizAttempt[];
  // Optional — set true if eval was triggered by a daily challenge completion
  // so the daily-tied badges fire on the right transition.
  dailyCompletedToday?: boolean;
  // Hand-rolled values caller may pass (e.g. just-completed mock score)
  recent?: {
    mockPassed?: boolean;
    mockTimeRatio?: number; // elapsedSec / durationSec
    voiceSessionCompleted?: boolean;
    cramExported?: boolean;
    perfectScore?: boolean;
  };
}

export interface BadgeDef {
  id: string;
  name: string;
  emoji: string;
  description: string; // shown when locked
  unlockedDescription?: string; // shown when unlocked (defaults to description)
  rarity: BadgeRarity;
  category: "study" | "mastery" | "memory" | "voice" | "social" | "elite";
  /** Returns true if the badge should be considered earned given the context. */
  check: (ctx: BadgeContext) => boolean;
  /** Returns 0..1 progress toward earning. Used to render bars on locked badges. */
  progress?: (ctx: BadgeContext) => number;
}

export interface UnlockedBadge {
  id: string;
  unlockedAt: string; // ISO timestamp
}

export interface BadgeView extends BadgeDef {
  unlocked: boolean;
  unlockedAt: string | null;
  progressPct: number; // 0..100
}

const STORAGE_KEY = "passpilot.badges.v1";

function loadUnlocked(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUnlocked(state: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota — tolerate */
  }
}

/* ──────────────────────────────────────────────────────────
 * Badge catalog
 *
 * Order matters here: we render in this order on the wall. Group
 * categorically — study basics first, then mastery, then memory, etc.
 * ────────────────────────────────────────────────────────── */

export const BADGES: BadgeDef[] = [
  // ── Study basics ──
  {
    id: "diagnostician",
    name: "Diagnostician",
    emoji: "🧭",
    description: "Take the diagnostic to know where you stand.",
    rarity: "common",
    category: "study",
    check: (ctx) => ctx.attempts.some((a) => a.kind === "diagnostic"),
  },
  {
    id: "first-drill",
    name: "First Drill",
    emoji: "🎯",
    description: "Finish your very first practice drill.",
    rarity: "common",
    category: "study",
    check: (ctx) =>
      ctx.attempts.some(
        (a) => a.kind === "topic" || a.kind === "mixed"
      ),
  },
  {
    id: "century-club",
    name: "Century Club",
    emoji: "💯",
    description: "Answer 100 unique questions.",
    rarity: "rare",
    category: "study",
    check: (ctx) => uniqueAnswered(ctx.attempts) >= 100,
    progress: (ctx) => Math.min(1, uniqueAnswered(ctx.attempts) / 100),
  },
  {
    id: "marathoner",
    name: "Marathoner",
    emoji: "🏃",
    description: "Answer 500 unique questions.",
    rarity: "epic",
    category: "study",
    check: (ctx) => uniqueAnswered(ctx.attempts) >= 500,
    progress: (ctx) => Math.min(1, uniqueAnswered(ctx.attempts) / 500),
  },

  // ── Streaks ──
  {
    id: "streak-7",
    name: "Week Warrior",
    emoji: "🔥",
    description: "Keep a 7-day streak alive.",
    rarity: "rare",
    category: "study",
    check: (ctx) => (ctx.profile?.streakDays ?? 0) >= 7,
    progress: (ctx) => Math.min(1, (ctx.profile?.streakDays ?? 0) / 7),
  },
  {
    id: "streak-30",
    name: "Month Strong",
    emoji: "⚡",
    description: "Keep a 30-day streak alive.",
    rarity: "epic",
    category: "study",
    check: (ctx) => (ctx.profile?.streakDays ?? 0) >= 30,
    progress: (ctx) => Math.min(1, (ctx.profile?.streakDays ?? 0) / 30),
  },
  {
    id: "comeback",
    name: "Comeback",
    emoji: "🌅",
    description: "Return to study after 7+ days off.",
    rarity: "rare",
    category: "study",
    check: (ctx) => detectComeback(ctx.attempts),
  },

  {
    id: "re-calibrator",
    name: "Re-Calibrator",
    emoji: "🔄",
    description: "Re-take a diagnostic to measure your progress.",
    rarity: "rare",
    category: "study",
    check: (ctx) => ctx.attempts.filter((a) => a.kind === "diagnostic").length >= 2,
    progress: (ctx) =>
      Math.min(1, ctx.attempts.filter((a) => a.kind === "diagnostic").length / 2),
  },

  // ── Mastery (mock + accuracy) ──
  {
    id: "mock-attempted",
    name: "Game Day Rehearsal",
    emoji: "🎬",
    description: "Take your first full-length mock exam.",
    rarity: "common",
    category: "mastery",
    check: (ctx) => ctx.attempts.some((a) => a.kind === "mock"),
  },
  {
    id: "mock-champion",
    name: "Mock Champion",
    emoji: "🏆",
    description: "Pass a mock exam at the cert's pass score.",
    rarity: "epic",
    category: "mastery",
    check: (ctx) => ctx.recent?.mockPassed === true ||
      ctx.attempts.some((a) => a.kind === "mock" && a.mock?.passed === true),
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    emoji: "💨",
    description: "Pass a mock in under half the allotted time.",
    rarity: "epic",
    category: "mastery",
    check: (ctx) => {
      if (ctx.recent?.mockPassed && (ctx.recent?.mockTimeRatio ?? 1) < 0.5) {
        return true;
      }
      return ctx.attempts.some(
        (a) =>
          a.kind === "mock" &&
          a.mock?.passed === true &&
          a.mock.durationSec > 0 &&
          a.mock.elapsedSec / a.mock.durationSec < 0.5
      );
    },
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    emoji: "💎",
    description: "Score 100% on a drill of 8+ questions.",
    rarity: "epic",
    category: "mastery",
    check: (ctx) =>
      ctx.recent?.perfectScore === true ||
      ctx.attempts.some(
        (a) =>
          (a.kind === "topic" || a.kind === "mixed" || a.kind === "incorrect-only") &&
          a.scorePct === 100 &&
          a.answers.length >= 8
      ),
  },

  // ── Memory (SR) ──
  {
    id: "sr-starter",
    name: "Memory Loop",
    emoji: "🧠",
    description: "Complete your first spaced-repetition review.",
    rarity: "common",
    category: "memory",
    check: (ctx) => ctx.attempts.some((a) => a.kind === "sr-review"),
  },
  {
    id: "sr-master-10",
    name: "Memory Master",
    emoji: "🪄",
    description: "Get 10 SR cards into the mature box (Box 5+).",
    rarity: "epic",
    category: "memory",
    check: () => matureSrCards() >= 10,
    progress: () => Math.min(1, matureSrCards() / 10),
  },
  {
    id: "sr-master-50",
    name: "Memory Sage",
    emoji: "🦉",
    description: "50 SR cards mature.",
    rarity: "legendary",
    category: "memory",
    check: () => matureSrCards() >= 50,
    progress: () => Math.min(1, matureSrCards() / 50),
  },

  // ── Voice mode ──
  {
    id: "hands-free",
    name: "Hands-Free Hero",
    emoji: "🎧",
    description: "Finish a Voice / Commute Mode session.",
    rarity: "rare",
    category: "voice",
    check: (ctx) => ctx.recent?.voiceSessionCompleted === true,
  },

  // ── Social / cram ──
  {
    id: "cram-ready",
    name: "Cram Ready",
    emoji: "📋",
    description: "Print or save your cram sheet PDF.",
    rarity: "rare",
    category: "social",
    check: (ctx) => ctx.recent?.cramExported === true,
  },

  // ── Time-of-day curiosities ──
  {
    id: "early-bird",
    name: "Early Bird",
    emoji: "🌄",
    description: "Complete a study session before 7 AM.",
    rarity: "rare",
    category: "elite",
    check: (ctx) => ctx.attempts.some((a) => hourOf(a.completedAt) < 7),
  },
  {
    id: "night-owl",
    name: "Night Owl",
    emoji: "🦇",
    description: "Complete a study session after 10 PM.",
    rarity: "rare",
    category: "elite",
    check: (ctx) => ctx.attempts.some((a) => hourOf(a.completedAt) >= 22),
  },

  // ── Daily challenge tied ──
  {
    id: "daily-first",
    name: "Daily Done",
    emoji: "✅",
    description: "Complete your first Daily Challenge.",
    rarity: "common",
    category: "study",
    check: (ctx) => ctx.dailyCompletedToday === true || hasDailyAttempt(ctx.attempts),
  },
  {
    id: "daily-streak-3",
    name: "Three In A Row",
    emoji: "🎲",
    description: "Complete the Daily Challenge 3 days in a row.",
    rarity: "rare",
    category: "study",
    check: (ctx) => dailyChallengeStreak(ctx.attempts) >= 3,
    progress: (ctx) => Math.min(1, dailyChallengeStreak(ctx.attempts) / 3),
  },
  {
    id: "daily-streak-10",
    name: "Daily Devotion",
    emoji: "🌟",
    description: "Complete the Daily Challenge 10 days in a row.",
    rarity: "epic",
    category: "study",
    check: (ctx) => dailyChallengeStreak(ctx.attempts) >= 10,
    progress: (ctx) => Math.min(1, dailyChallengeStreak(ctx.attempts) / 10),
  },

  // ── Elite ──
  {
    id: "renaissance",
    name: "Renaissance Pilot",
    emoji: "🎓",
    description: "Touch (drill or mock) 2+ different certs.",
    rarity: "epic",
    category: "elite",
    check: (ctx) => uniqueExamIdsTouched(ctx.attempts) >= 2,
    progress: (ctx) =>
      Math.min(1, uniqueExamIdsTouched(ctx.attempts) / 2),
  },
];

/* ──────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────── */

function uniqueAnswered(attempts: QuizAttempt[]): number {
  const set = new Set<string>();
  for (const a of attempts) {
    for (const ans of a.answers) {
      set.add(ans.questionId);
    }
  }
  return set.size;
}

function detectComeback(attempts: QuizAttempt[]): boolean {
  if (attempts.length < 2) return false;
  const sorted = [...attempts].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );
  for (let i = 1; i < sorted.length; i++) {
    const gap =
      new Date(sorted[i].completedAt).getTime() -
      new Date(sorted[i - 1].completedAt).getTime();
    if (gap >= 7 * 86400000) return true;
  }
  return false;
}

function matureSrCards(): number {
  try {
    return getAllCards().filter((c) => c.box >= 5).length;
  } catch {
    return 0;
  }
}

function hourOf(iso: string): number {
  return new Date(iso).getHours();
}

function uniqueExamIdsTouched(attempts: QuizAttempt[]): number {
  const ids = new Set<string>();
  for (const a of attempts) {
    if (a.mock?.examId) ids.add(a.mock.examId);
    // Best-effort: scan answers for hints of cert variety
    for (const ans of a.answers) {
      // topicId is examId-prefixed in our content (e.g. "az-cloud-concepts")
      // — rough but good enough for the badge
      if (ans.topicId) ids.add(ans.topicId.split("-").slice(0, 2).join("-"));
    }
  }
  return ids.size;
}

function hasDailyAttempt(attempts: QuizAttempt[]): boolean {
  return attempts.some((a) => a.topicId === "__daily__");
}

function dailyChallengeStreak(attempts: QuizAttempt[]): number {
  // Daily challenge attempts are tagged with topicId="__daily__".
  // Count consecutive day-stamps walking backward from today (local).
  const dailyDays = new Set(
    attempts
      .filter((a) => a.topicId === "__daily__")
      .map((a) => a.completedAt.slice(0, 10))
  );
  if (dailyDays.size === 0) return 0;
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const day = cursor.toISOString().slice(0, 10);
    if (dailyDays.has(day)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      // Allow today to be missing if it's still in progress
      if (i === 0) {
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return streak;
}

/* ──────────────────────────────────────────────────────────
 * Public API
 * ────────────────────────────────────────────────────────── */

/**
 * Run all badge checks. Persists newly-earned badges and returns the
 * list of badges that just unlocked (for toast / celebration UI).
 */
export function evaluateAll(ctx: BadgeContext): BadgeDef[] {
  const state = loadUnlocked();
  const newlyUnlocked: BadgeDef[] = [];
  const now = new Date().toISOString();

  for (const badge of BADGES) {
    if (state[badge.id]) continue; // already earned
    let earned = false;
    try {
      earned = badge.check(ctx);
    } catch {
      earned = false;
    }
    if (earned) {
      state[badge.id] = now;
      newlyUnlocked.push(badge);
    }
  }

  if (newlyUnlocked.length > 0) {
    saveUnlocked(state);
  }
  return newlyUnlocked;
}

/** Snapshot — for the badge wall + dashboard count chip. */
export function getBadgeViews(ctx: BadgeContext): BadgeView[] {
  const state = loadUnlocked();
  return BADGES.map((b) => {
    const ts = state[b.id] ?? null;
    let pct = ts ? 100 : 0;
    if (!ts && b.progress) {
      try {
        pct = Math.round((b.progress(ctx) ?? 0) * 100);
      } catch {
        pct = 0;
      }
    }
    return {
      ...b,
      unlocked: !!ts,
      unlockedAt: ts,
      progressPct: pct,
    };
  });
}

export function unlockedCount(): number {
  return Object.keys(loadUnlocked()).length;
}

export function totalCount(): number {
  return BADGES.length;
}

/** For testing / settings — wipe badge state. */
export function clearAllBadges(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
