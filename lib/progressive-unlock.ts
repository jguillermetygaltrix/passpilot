/**
 * Progressive Unlock — Layer 3 of the PassPilot abuse-defense stack.
 *
 * Purchased content unlocks over 7 days instead of all-at-once:
 *   Day 0 (purchase):  20%  unlocked
 *   Day 1:              31%
 *   Day 3:              54%
 *   Day 5:              77%
 *   Day 7+:            100%  (fully unlocked)
 *
 * Why:
 *   Defeats the "buy → screenshot everything in 10 min → refund" pattern.
 *   An abuser can only screenshot 20% on day 1 — and our usage tracker
 *   (Layer 2) flags that as partial consumption anyway.
 *
 * Who it applies to:
 *   - Pro / Multi tier users only (license.verifiedAt within last 7 days)
 *   - FREE tier is not affected (they have a 3-drill daily limit instead)
 *   - Legacy users (license pre-dates this feature) default to fully unlocked
 *
 * Integration:
 *   Use `useUnlockStatus()` in React components.
 *   Use `filterByUnlock(items, pct)` wherever content lists are rendered.
 *
 * Diagnostic: NEVER gated — it's a 10-question assessment, always full access.
 */

"use client";

import { useMemo } from "react";
import { useApp } from "./store";
import { useEntitlements } from "./entitlements";

export const UNLOCK_WINDOW_DAYS = 7;
export const INITIAL_UNLOCK_PCT = 20;

export interface UnlockStatus {
  /** 0-100. 100 = everything unlocked. */
  pct: number;
  /** Days since license.verifiedAt (floor). */
  daysActive: number;
  /** Days until 100% unlock. 0 if already full. */
  daysUntilFull: number;
  /** ISO date when everything unlocks. null if already unlocked. */
  fullUnlockDate: string | null;
  /** True if progressive unlock is active (i.e. content is being gated). */
  isActive: boolean;
  /** True if user is in the initial 7-day window. */
  isInWindow: boolean;
}

/**
 * Compute unlock percentage based on days since license verification.
 * Linear from 20% at day 0 to 100% at day 7.
 */
export function computeUnlockPct(verifiedAt: string | null | undefined): number {
  if (!verifiedAt) return 100; // free tier or legacy — no gating
  const verified = new Date(verifiedAt).getTime();
  if (isNaN(verified)) return 100; // bogus timestamp — don't penalize legit users
  const now = Date.now();
  // 🛡️  LEGION HARDENING (2026-04-24, HIGH):
  // Future-dated verifiedAt is a clock-tamper signal (user changed device clock
  // backward to pretend they bought further in the past). Gate at the minimum
  // (20%) instead of fully unlocking. Real users never trip this — system
  // clocks don't go backward by accident in any meaningful way.
  if (verified > now) return INITIAL_UNLOCK_PCT;
  const msActive = now - verified;
  const daysActive = msActive / (24 * 60 * 60 * 1000);
  if (daysActive >= UNLOCK_WINDOW_DAYS) return 100;
  const pct = INITIAL_UNLOCK_PCT + (daysActive / UNLOCK_WINDOW_DAYS) * (100 - INITIAL_UNLOCK_PCT);
  return Math.max(INITIAL_UNLOCK_PCT, Math.min(100, pct));
}

/**
 * Get full unlock status for UI rendering.
 */
export function getUnlockStatus(verifiedAt: string | null | undefined): UnlockStatus {
  const pct = computeUnlockPct(verifiedAt);
  if (!verifiedAt || pct >= 100) {
    return {
      pct: 100,
      daysActive: UNLOCK_WINDOW_DAYS,
      daysUntilFull: 0,
      fullUnlockDate: null,
      isActive: false,
      isInWindow: false,
    };
  }
  const verified = new Date(verifiedAt).getTime();
  const msActive = Date.now() - verified;
  const daysActive = Math.max(0, msActive / (24 * 60 * 60 * 1000));
  const daysUntilFull = Math.max(0, UNLOCK_WINDOW_DAYS - daysActive);
  const fullUnlockMs = verified + UNLOCK_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  return {
    pct: Math.round(pct * 10) / 10,
    daysActive: Math.floor(daysActive),
    daysUntilFull: Math.ceil(daysUntilFull),
    fullUnlockDate: new Date(fullUnlockMs).toISOString(),
    isActive: true,
    isInWindow: true,
  };
}

/**
 * Filter a list of items by unlock percentage.
 * Respects original array order — first N% stays, rest is hidden.
 */
export function filterByUnlock<T>(items: T[], pct: number): T[] {
  if (pct >= 100) return items;
  const keep = Math.max(1, Math.floor(items.length * (pct / 100)));
  return items.slice(0, keep);
}

/**
 * React hook — combines store license with unlock computation.
 * Call this from any component that renders gated content.
 *
 * Example:
 *   const { pct, isActive, daysUntilFull } = useUnlockStatus();
 *   const unlockedQuestions = useUnlocked(allQuestions);
 */
export function useUnlockStatus(): UnlockStatus {
  const { license } = useApp();
  const ent = useEntitlements();
  return useMemo(() => {
    // No gating for free tier — they have daily limits instead
    if (!ent.hasPro) {
      return {
        pct: 100,
        daysActive: UNLOCK_WINDOW_DAYS,
        daysUntilFull: 0,
        fullUnlockDate: null,
        isActive: false,
        isInWindow: false,
      };
    }
    return getUnlockStatus(license?.verifiedAt);
  }, [license?.verifiedAt, ent.hasPro]);
}

/**
 * React hook — returns a filtered copy of `items` based on current unlock status.
 * Pass-through when unlock is inactive (free tier, fully unlocked, or legacy license).
 */
export function useUnlocked<T>(items: T[]): T[] {
  const status = useUnlockStatus();
  return useMemo(() => {
    if (!status.isActive) return items;
    return filterByUnlock(items, status.pct);
  }, [items, status.isActive, status.pct]);
}

/**
 * Convenience — compute how many more items will unlock at the next 24h tick.
 * Used for UI messaging like "48 more questions unlock in 14 hours".
 */
export function nextUnlockBatch(items: number, status: UnlockStatus): { count: number; atISO: string | null } {
  if (!status.isActive || !status.fullUnlockDate) return { count: 0, atISO: null };
  const now = Date.now();
  const verifiedMs = new Date(status.fullUnlockDate).getTime() - UNLOCK_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const hoursActive = Math.floor((now - verifiedMs) / (60 * 60 * 1000));
  const nextDayMs = verifiedMs + Math.ceil((hoursActive + 1) / 24) * 24 * 60 * 60 * 1000;
  const nextPct = computeUnlockPct(new Date(nextDayMs - 1).toISOString());
  const currentUnlocked = Math.floor(items * (status.pct / 100));
  const nextUnlocked = Math.floor(items * (nextPct / 100));
  return {
    count: Math.max(0, nextUnlocked - currentUnlocked),
    atISO: new Date(nextDayMs).toISOString(),
  };
}
