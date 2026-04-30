"use client";

/**
 * UnlockBanner — shows progressive unlock status to Pro users in the 7-day window.
 *
 * Deterrent + transparency: the user sees exactly how much is unlocked,
 * when more drops, and why. Nobody's surprised. Screenshot-abusers see
 * that they can't grab everything in one session.
 */

import { useUnlockStatus } from "@/lib/progressive-unlock";
import { Lock, Sparkles } from "lucide-react";

type Props = {
  /** Total items in the category (e.g. total questions for the exam). */
  totalItems?: number;
  /** Render as compact inline pill instead of full banner. */
  compact?: boolean;
  className?: string;
};

export function UnlockBanner({ totalItems, compact = false, className = "" }: Props) {
  const status = useUnlockStatus();
  if (!status.isActive) return null;

  const unlockedCount = totalItems ? Math.floor(totalItems * (status.pct / 100)) : null;
  const lockedCount = totalItems ? totalItems - (unlockedCount ?? 0) : null;
  const nextUnlockHours = Math.max(0, status.daysUntilFull * 24);

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-amber-200 dark:border-amber-500/30 bg-amber-50/70 dark:bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-800 dark:text-amber-300 ${className}`}
      >
        <Lock className="h-3 w-3" />
        {status.pct.toFixed(0)}% unlocked · full in {status.daysUntilFull}d
      </span>
    );
  }

  return (
    <div className={`rounded-xl border border-amber-200 dark:border-amber-500/30 bg-gradient-to-br from-amber-50 to-yellow-50/50 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-lg bg-amber-100 p-2">
          <Sparkles className="h-4 w-4 text-amber-700 dark:text-amber-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Content unlocks over 7 days
            </h3>
            <span className="text-xs font-mono text-amber-700 dark:text-amber-300">
              {status.pct.toFixed(0)}% available
            </span>
          </div>
          <p className="mt-1 text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
            You have access to{" "}
            <strong>
              {unlockedCount !== null ? `${unlockedCount} of ${totalItems} questions` : `${status.pct.toFixed(0)}% of the content`}
            </strong>
            {" "}right now. The rest drops gradually — full access in{" "}
            <strong>{status.daysUntilFull} {status.daysUntilFull === 1 ? "day" : "days"}</strong>.
          </p>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 w-full rounded-full bg-amber-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all"
              style={{ width: `${status.pct}%` }}
            />
          </div>

          <p className="mt-2.5 text-[11px] text-amber-700 dark:text-amber-300/80 leading-relaxed">
            Why gradual? It keeps digital content priced fairly — and stops screenshot-then-refund abuse.
            Legit studiers aren't bottlenecked; you get more than enough to start, and the rest arrives while you sleep.
          </p>
        </div>
      </div>
    </div>
  );
}
