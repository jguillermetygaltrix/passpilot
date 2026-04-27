/**
 * Streak engine — extends the simple "consecutive days" counter with
 * shield protection so users don't lose a 30-day streak to one bad day.
 *
 * Rules (kept simple — complexity is the enemy of streak retention UX):
 *   1. Activity today → streak unchanged if already tracked, else streak + 1
 *      vs yesterday-was-tracked, else streak resets to 1.
 *   2. If lastActive was 2 days ago AND user has shields ≥ 1 → consume one
 *      shield, treat the gap as if covered, streak + 1.
 *   3. Every 7-day streak milestone reached for the FIRST time grants +1
 *      shield (cap 3). Re-passing the same milestone after losing the
 *      streak does NOT re-grant — shields are earned, not refunded.
 *   4. Gaps > 2 days = streak reset, no matter how many shields.
 *
 * Why these rules:
 *   - Single-day-grace (one shield = one missed day) matches Duolingo's
 *     model that's been A/B-tested into the ground; deviating loses the
 *     mental model users already have.
 *   - Shield earnings tied to a 7-day milestone makes them feel rare and
 *     worth protecting (cap 3 = enough for one bad week per quarter).
 *   - Two-day gap cap prevents "I quit for 3 weeks then claim my streak
 *     back" abuse.
 */

import type { UserProfile } from "./types";

export interface StreakState {
  streakDays: number;
  streakShields: number;
  lastActiveDate: string; // ISO timestamp
  /** Whether a shield was just consumed (so UI can flash a shield-saved animation). */
  shieldConsumed: boolean;
  /** Whether a shield was just earned (so UI can celebrate). */
  shieldEarned: boolean;
}

const SHIELD_MILESTONE_DAYS = 7;
const MAX_SHIELDS = 3;

/** What's stored on the profile — keep optional for back-compat. */
export interface ProfileStreakBits {
  streakDays?: number;
  streakShields?: number;
  lastActiveDate?: string;
  /** Track which milestone shields have already been awarded so we don't double-grant. */
  shieldsEarnedAtStreaks?: number[];
}

/**
 * Compute the new streak state given current profile + a fresh activity event.
 *
 * Pure function — no LS access. Caller (store.ts) merges the result into the
 * persisted profile.
 */
export function applyActivity(
  profile: ProfileStreakBits,
  nowMs: number = Date.now()
): StreakState {
  const today = ymd(new Date(nowMs));
  const yesterday = ymd(new Date(nowMs - 86400000));
  const dayBeforeYesterday = ymd(new Date(nowMs - 2 * 86400000));

  const last = (profile.lastActiveDate ?? "").slice(0, 10);
  const currStreak = profile.streakDays ?? 0;
  const currShields = profile.streakShields ?? 0;
  const earnedAt = profile.shieldsEarnedAtStreaks ?? [];

  let nextStreak = currStreak;
  let nextShields = currShields;
  let shieldConsumed = false;
  let shieldEarned = false;

  if (last === today) {
    // Already counted for today — no change to streak, but if streak is 0
    // (very first activity) bump to 1 so we don't have a 0-streak active user.
    if (nextStreak === 0) nextStreak = 1;
  } else if (last === yesterday) {
    nextStreak = currStreak + 1;
  } else if (last === dayBeforeYesterday && currShields >= 1) {
    // Single-day gap — consume a shield and continue the streak
    nextShields = currShields - 1;
    nextStreak = currStreak + 1;
    shieldConsumed = true;
  } else {
    // Larger gap or no shield — reset
    nextStreak = 1;
  }

  // Earn a shield at every 7-day milestone (FIRST TIME ONLY per milestone)
  const reachedMilestone =
    nextStreak > 0 &&
    nextStreak % SHIELD_MILESTONE_DAYS === 0 &&
    !earnedAt.includes(nextStreak) &&
    nextShields < MAX_SHIELDS;

  if (reachedMilestone) {
    nextShields = Math.min(MAX_SHIELDS, nextShields + 1);
    shieldEarned = true;
  }

  return {
    streakDays: nextStreak,
    streakShields: nextShields,
    lastActiveDate: new Date(nowMs).toISOString(),
    shieldConsumed,
    shieldEarned,
  };
}

/**
 * Merge the streak result back into the profile, including the
 * shieldsEarnedAtStreaks bookkeeping array.
 */
export function mergeStreakIntoProfile<T extends ProfileStreakBits>(
  profile: T,
  next: StreakState
): T {
  const earnedAt = profile.shieldsEarnedAtStreaks ?? [];
  const newEarnedAt =
    next.shieldEarned && !earnedAt.includes(next.streakDays)
      ? [...earnedAt, next.streakDays]
      : earnedAt;

  return {
    ...profile,
    streakDays: next.streakDays,
    streakShields: next.streakShields,
    lastActiveDate: next.lastActiveDate,
    shieldsEarnedAtStreaks: newEarnedAt,
  };
}

function ymd(d: Date): string {
  // Local-timezone date — streaks are relative to the user's day, not UTC.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export const STREAK_CONSTANTS = {
  SHIELD_MILESTONE_DAYS,
  MAX_SHIELDS,
};
