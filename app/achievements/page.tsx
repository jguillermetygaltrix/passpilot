"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import { HydrationGate } from "@/components/hydration-gate";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import {
  getBadgeViews,
  unlockedCount,
  totalCount,
  evaluateAll,
  type BadgeView,
} from "@/lib/achievements";
import { fireBadgeUnlocks } from "@/components/badge-toast";
import {
  Trophy,
  Sparkles,
  Lock,
  CheckCircle2,
  Star,
  Calendar,
  Flame,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Filter = "all" | "unlocked" | "locked";

export default function AchievementsPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const { profile, attempts } = useApp();
  const [filter, setFilter] = useState<Filter>("all");
  const [version, setVersion] = useState(0); // bump on mount to re-evaluate

  // Re-evaluate on mount in case any badges should retroactively unlock
  // (e.g. a badge was added after a user already met the criteria).
  useEffect(() => {
    if (!profile) return;
    const newly = evaluateAll({ profile, attempts });
    if (newly.length > 0) {
      fireBadgeUnlocks(newly);
      setVersion((v) => v + 1);
    }
  }, [profile, attempts]);

  const views = useMemo(
    () => getBadgeViews({ profile, attempts }),
    [profile, attempts, version]
  );

  if (!profile) return null;

  const unlocked = views.filter((b) => b.unlocked);
  const locked = views.filter((b) => !b.unlocked);
  const total = views.length;
  const completionPct = Math.round((unlocked.length / total) * 100);

  const visible =
    filter === "unlocked"
      ? unlocked
      : filter === "locked"
        ? locked
        : views;

  // Group by category for the grid
  const grouped = useMemo(() => {
    const map: Record<string, BadgeView[]> = {};
    for (const v of visible) {
      map[v.category] ||= [];
      map[v.category].push(v);
    }
    return map;
  }, [visible]);

  const recentUnlocks = unlocked
    .filter((b) => b.unlockedAt)
    .sort((a, b) => (b.unlockedAt ?? "").localeCompare(a.unlockedAt ?? ""))
    .slice(0, 3);

  return (
    <>
      <AppNav />
      <AppShell>
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center space-y-3">
            <div className="chip bg-amber-50 border-amber-100 text-amber-700 mx-auto">
              <Trophy className="h-3 w-3" />
              Achievements
            </div>
            <h1 className="heading-2 text-balance">
              {unlocked.length} of {total} badges
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Earned automatically as you study, drill, master memory, and ship mocks.
            </p>
          </div>

          {/* Progress bar + recent */}
          <div className="card-surface p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">Collection progress</div>
              <div className="text-sm font-semibold tabular-nums">
                {completionPct}%
              </div>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            {recentUnlocks.length > 0 && (
              <div className="mt-4">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                  Recent unlocks
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentUnlocks.map((b) => (
                    <div
                      key={b.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800"
                    >
                      <span className="text-base leading-none">{b.emoji}</span>
                      <span className="text-xs font-medium">{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2">
            {(["all", "unlocked", "locked"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3.5 h-8 rounded-full text-xs font-medium transition-colors capitalize",
                  filter === f
                    ? "bg-foreground text-background"
                    : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
                )}
              >
                {f}
                {f === "unlocked" && ` · ${unlocked.length}`}
                {f === "locked" && ` · ${locked.length}`}
              </button>
            ))}
          </div>

          {/* Grouped grid */}
          <div className="space-y-6">
            {Object.entries(grouped).map(([cat, badges]) => (
              <div key={cat}>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3 capitalize flex items-center gap-1.5">
                  {categoryIcon(cat)}
                  {cat}
                  <span className="text-muted-foreground/60">
                    · {badges.filter((b) => b.unlocked).length}/{badges.length}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {badges.map((b) => (
                    <BadgeCard key={b.id} badge={b} />
                  ))}
                </div>
              </div>
            ))}
            {visible.length === 0 && (
              <div className="card-surface p-8 text-center text-sm text-muted-foreground">
                No badges in this filter.
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/dashboard">
              <Button variant="outline" size="md">
                Back to dashboard
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
    </>
  );
}

function BadgeCard({ badge }: { badge: BadgeView }) {
  const tone = rarityTone(badge.rarity);
  const earnedAt = badge.unlockedAt
    ? new Date(badge.unlockedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition-all relative overflow-hidden",
        badge.unlocked
          ? `${tone.border} ${tone.bg} hover:shadow-card`
          : "border-border bg-slate-50/40 grayscale-[0.6]"
      )}
    >
      {badge.unlocked && (
        <div
          className={cn(
            "absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-40",
            tone.glow
          )}
        />
      )}
      <div className="relative flex items-start gap-3">
        <div className={cn("text-4xl shrink-0 leading-none", !badge.unlocked && "opacity-40")}>
          {badge.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className={cn(
                "text-[10px] uppercase tracking-wider font-bold",
                badge.unlocked ? tone.text : "text-muted-foreground"
              )}
            >
              {badge.rarity}
            </span>
            {badge.unlocked && (
              <CheckCircle2 className={cn("h-3 w-3", tone.text)} />
            )}
            {!badge.unlocked && (
              <Lock className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <div className="text-sm font-semibold leading-snug">{badge.name}</div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
            {badge.unlocked
              ? badge.unlockedDescription || badge.description
              : badge.description}
          </p>
          {!badge.unlocked && badge.progressPct > 0 && (
            <div className="mt-2.5">
              <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={cn("h-full rounded-full", tone.progressBar)}
                  style={{ width: `${badge.progressPct}%` }}
                />
              </div>
              <div className="text-[10px] text-muted-foreground tabular-nums mt-1">
                {badge.progressPct}% there
              </div>
            </div>
          )}
          {earnedAt && (
            <div className="text-[10px] text-muted-foreground mt-1.5 inline-flex items-center gap-1">
              <Calendar className="h-2.5 w-2.5" />
              Earned {earnedAt}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function categoryIcon(cat: string) {
  switch (cat) {
    case "study":
      return <Flame className="h-3 w-3" />;
    case "mastery":
      return <Trophy className="h-3 w-3" />;
    case "memory":
      return <Sparkles className="h-3 w-3" />;
    case "voice":
      return <Zap className="h-3 w-3" />;
    case "social":
      return <Star className="h-3 w-3" />;
    case "elite":
      return <Star className="h-3 w-3" />;
    default:
      return null;
  }
}

function rarityTone(r: BadgeView["rarity"]): {
  border: string;
  bg: string;
  glow: string;
  text: string;
  progressBar: string;
} {
  switch (r) {
    case "legendary":
      return {
        border: "border-amber-400",
        bg: "bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40",
        glow: "bg-amber-300",
        text: "text-amber-700",
        progressBar: "bg-gradient-to-r from-amber-400 to-amber-600",
      };
    case "epic":
      return {
        border: "border-violet-400",
        bg: "bg-gradient-to-br from-violet-50/70 via-white to-violet-50/40",
        glow: "bg-violet-300",
        text: "text-violet-700",
        progressBar: "bg-gradient-to-r from-violet-400 to-violet-600",
      };
    case "rare":
      return {
        border: "border-cyan-400",
        bg: "bg-gradient-to-br from-cyan-50/70 via-white to-cyan-50/40",
        glow: "bg-cyan-300",
        text: "text-cyan-700",
        progressBar: "bg-gradient-to-r from-cyan-400 to-cyan-600",
      };
    default:
      return {
        border: "border-slate-300",
        bg: "bg-white",
        glow: "bg-slate-200",
        text: "text-slate-600",
        progressBar: "bg-slate-400",
      };
  }
}
