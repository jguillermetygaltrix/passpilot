"use client";

import { useApp } from "@/lib/store";
import { Flame, Snowflake } from "lucide-react";
import { useMemo } from "react";

/**
 * Visible streak indicator — shows consecutive days with study activity.
 *
 * Variants:
 *   - compact:  inline pill (nav bar, dashboard header)
 *   - full:     card with message + streak-freeze hint
 */
export function StreakBadge({ variant = "compact" }: { variant?: "compact" | "full" }) {
  const { profile } = useApp();

  const { streak, status } = useMemo(() => {
    const days = profile?.streakDays ?? 0;
    const today = new Date().toISOString().slice(0, 10);
    const last = profile?.lastActiveDate ?? "";
    // "at-risk" = hasn't drilled today yet but has an active streak
    const isAtRisk = days > 0 && last !== today;
    return {
      streak: days,
      status: isAtRisk ? "at-risk" : days === 0 ? "inactive" : "active",
    } as const;
  }, [profile?.streakDays, profile?.lastActiveDate]);

  if (variant === "compact") {
    return <CompactBadge streak={streak} status={status} />;
  }
  return <FullCard streak={streak} status={status} />;
}

function CompactBadge({
  streak,
  status,
}: {
  streak: number;
  status: "active" | "at-risk" | "inactive";
}) {
  if (status === "inactive") {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
        <Flame className="w-3.5 h-3.5" />
        Start your streak
      </div>
    );
  }

  const color =
    status === "at-risk"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
      : "border-orange-500/40 bg-orange-500/15 text-orange-200";

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${color}`}
      title={status === "at-risk" ? "Drill today to keep your streak alive" : undefined}
    >
      <Flame className="w-3.5 h-3.5" />
      {streak}-day streak
      {status === "at-risk" && <span className="ml-0.5 opacity-80">· save it</span>}
    </div>
  );
}

function FullCard({
  streak,
  status,
}: {
  streak: number;
  status: "active" | "at-risk" | "inactive";
}) {
  if (status === "inactive") {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/5 p-2">
            <Flame className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">No streak yet</div>
            <div className="text-xs text-gray-400">Complete today&apos;s drill to start one.</div>
          </div>
        </div>
      </div>
    );
  }

  const message =
    status === "at-risk"
      ? `Your ${streak}-day streak ends tonight unless you drill.`
      : streak >= 30
        ? `${streak} days. You're building a real habit.`
        : streak >= 7
          ? `${streak} days in a row. Momentum's real.`
          : `Day ${streak} locked in.`;

  return (
    <div
      className={`rounded-xl p-5 ${
        status === "at-risk"
          ? "border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5"
          : "border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-red-500/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`rounded-full p-2 ${status === "at-risk" ? "bg-amber-500/20" : "bg-orange-500/20"}`}
        >
          <Flame
            className={`w-6 h-6 ${status === "at-risk" ? "text-amber-300" : "text-orange-300"}`}
          />
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold text-white">{streak}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-orange-200/80">
            Day streak
          </div>
        </div>
        {streak >= 7 && (
          <div
            className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-2 text-cyan-300"
            title="You have 1 streak freeze available"
          >
            <Snowflake className="w-4 h-4" />
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-gray-300">{message}</p>
    </div>
  );
}
