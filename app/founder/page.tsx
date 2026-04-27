"use client";

/**
 * /founder — internal-only ops dashboard for Boss.
 *
 * Gating: simple LS-key check (`passpilot.founder-mode`) the user toggles
 * via the URL `?key=...`. NOT a security boundary — there's no PII or
 * server data on this page that's inaccessible elsewhere; this just hides
 * the surface from random users who land on /founder.
 *
 * What it shows: aggregated CLIENT-SIDE telemetry from the same
 * localStorage that drives every other PassPilot view. Until we wire a
 * real backend, this is "what does THIS device know about its own
 * usage." Useful when Boss tests on his own devices or analyzes a beta
 * tester's exported usage report.
 *
 * Future (when backend lands): swap the data sources for server-side
 * aggregates without changing the visual layout.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import { HydrationGate } from "@/components/hydration-gate";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { computeSummary, getEvents } from "@/lib/usage";
import { getAllCards } from "@/lib/sr";
import { unlockedCount, totalCount } from "@/lib/achievements";
import { getNoteCount } from "@/lib/notes";
import { EXAMS } from "@/lib/data/exams";
import {
  Crown,
  Activity,
  Brain,
  Trophy,
  StickyNote,
  Calendar,
  Users,
  ShieldCheck,
  Zap,
  TrendingUp,
} from "lucide-react";

const FOUNDER_KEY = "passpilot.founder-mode";
const ENABLE_TOKEN = "galtrix-founder-2026";

export default function FounderPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const [enabled, setEnabled] = useState(false);
  const [checking, setChecking] = useState(true);

  // Soft auth: check ?key=... or LS flag
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const key = url.searchParams.get("key");
    if (key === ENABLE_TOKEN) {
      localStorage.setItem(FOUNDER_KEY, "1");
      // Strip the key from the URL after persisting
      url.searchParams.delete("key");
      window.history.replaceState({}, "", url.toString());
      setEnabled(true);
    } else {
      setEnabled(localStorage.getItem(FOUNDER_KEY) === "1");
    }
    setChecking(false);
  }, []);

  if (checking) return null;

  if (!enabled) {
    return (
      <>
        <AppNav />
        <AppShell>
          <div className="max-w-md mx-auto card-surface p-8 text-center">
            <Crown className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h2 className="text-lg font-semibold mb-2">Restricted</h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              This is an internal ops surface. Access requires the founder key.
            </p>
            <Link href="/dashboard">
              <Button variant="outline">Back to dashboard</Button>
            </Link>
          </div>
        </AppShell>
      </>
    );
  }

  return <FounderDashboard />;
}

function FounderDashboard() {
  const { profile, attempts, completedLessonIds, license } = useApp();

  // ── Live telemetry pulled from the same LS the rest of the app uses ──
  const usage = useMemo(() => computeSummary(), []);
  const events = useMemo(() => getEvents(), []);
  const srCards = useMemo(() => getAllCards(), []);
  const matureSr = srCards.filter((c) => c.box >= 5).length;
  const dueSr = srCards.filter((c) => new Date(c.dueAt).getTime() <= Date.now()).length;
  const badgeUnlocked = unlockedCount();
  const badgeTotal = totalCount();
  const noteCount = getNoteCount();

  // Per-cert attempt distribution
  const attemptsByExam = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of attempts) {
      const ex = a.mock?.examId ?? guessExamFromAnswers(a.answers);
      if (!ex) continue;
      map[ex] = (map[ex] ?? 0) + 1;
    }
    return map;
  }, [attempts]);

  // Daily activity heatmap — last 14 days
  const activityHeatmap = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const count = attempts.filter(
        (a) => a.completedAt.slice(0, 10) === dayStr
      ).length;
      days.push({ date: dayStr, count });
    }
    return days;
  }, [attempts]);

  const maxDayCount = Math.max(1, ...activityHeatmap.map((d) => d.count));
  const totalSessionsThisWeek = activityHeatmap.slice(-7).reduce((s, d) => s + d.count, 0);

  // Mock pass-rate
  const mocks = attempts.filter((a) => a.kind === "mock");
  const mocksPassed = mocks.filter((a) => a.mock?.passed).length;
  const mockPassRate = mocks.length ? Math.round((mocksPassed / mocks.length) * 100) : null;

  return (
    <>
      <AppNav />
      <AppShell>
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Hero */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="chip bg-amber-50 border-amber-200 text-amber-800 mb-2">
                <Crown className="h-3 w-3" />
                Founder console
              </div>
              <h1 className="heading-2">Operational telemetry</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Client-side aggregates from this device. Same data the user
                sees in /account/usage, restructured for ops.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/account/usage">
                <Button variant="outline" size="md">
                  <Activity className="h-4 w-4" />
                  User-facing usage view
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="md">
                  Exit
                </Button>
              </Link>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPI
              icon={<Zap className="h-3.5 w-3.5" />}
              label="Sessions (7d)"
              value={totalSessionsThisWeek}
              tone="brand"
            />
            <KPI
              icon={<Trophy className="h-3.5 w-3.5" />}
              label="Mock pass rate"
              value={mockPassRate !== null ? `${mockPassRate}%` : "—"}
              sub={`${mocksPassed} / ${mocks.length} mocks`}
              tone="emerald"
            />
            <KPI
              icon={<Brain className="h-3.5 w-3.5" />}
              label="SR mature"
              value={matureSr}
              sub={`${srCards.length} total · ${dueSr} due`}
              tone="violet"
            />
            <KPI
              icon={<TrendingUp className="h-3.5 w-3.5" />}
              label="Badges"
              value={`${badgeUnlocked}/${badgeTotal}`}
              tone="amber"
            />
          </div>

          {/* Usage detail card */}
          <div className="card-surface p-5">
            <div className="text-sm font-semibold mb-4">Usage detail (this device)</div>
            <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
              <Row label="Total events" value={usage.totalEvents} />
              <Row label="Drills started" value={usage.drillsStarted} />
              <Row label="Drills completed" value={usage.drillsCompleted} />
              <Row label="Diagnostics done" value={usage.diagnosticsCompleted} />
              <Row label="Questions viewed" value={usage.questionsViewed} />
              <Row label="Questions answered" value={usage.questionsAnswered} />
              <Row label="AI explanations" value={usage.aiExplanationsRequested} />
              <Row label="Exports" value={usage.exports} />
              <Row label="Study minutes" value={usage.studyMinutes} />
              <Row label="Consumption %" value={usage.consumptionPct} />
              <Row label="Refund eligibility" value={usage.refundEligibility} />
              <Row label="Notes captured" value={noteCount} />
            </div>
          </div>

          {/* 14-day activity heatmap */}
          <div className="card-surface p-5">
            <div className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last 14 days · sessions per day
            </div>
            <div className="grid grid-cols-14 gap-1.5" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
              {activityHeatmap.map((d) => {
                const intensity = d.count / maxDayCount;
                const bg =
                  d.count === 0
                    ? "bg-slate-100"
                    : intensity < 0.34
                      ? "bg-emerald-200"
                      : intensity < 0.67
                        ? "bg-emerald-400"
                        : "bg-emerald-600";
                return (
                  <div
                    key={d.date}
                    className={`h-10 rounded-md ${bg} flex flex-col items-center justify-center text-[9px] font-semibold tabular-nums`}
                    title={`${d.date} · ${d.count} sessions`}
                  >
                    <span className={d.count > 0 ? "text-white" : "text-muted-foreground"}>
                      {d.count > 0 ? d.count : ""}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-1.5 tabular-nums">
              {activityHeatmap.filter((_, i) => i % 2 === 0).map((d) => (
                <span key={d.date}>{d.date.slice(5)}</span>
              ))}
            </div>
          </div>

          {/* Per-cert attempt counts */}
          {Object.keys(attemptsByExam).length > 0 && (
            <div className="card-surface p-5">
              <div className="text-sm font-semibold mb-3">Attempts by cert</div>
              <div className="space-y-2">
                {EXAMS.map((e) => {
                  const count = attemptsByExam[e.id] ?? 0;
                  if (count === 0) return null;
                  const pct = Math.round((count / attempts.length) * 100);
                  return (
                    <div key={e.id}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium">{e.name}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {count} · {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${e.accentFrom}, ${e.accentTo})`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Profile snapshot */}
          {profile && (
            <div className="card-surface p-5">
              <div className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Profile snapshot
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <Row label="Active cert" value={profile.examId} />
                <Row label="Exam date" value={profile.examDate} />
                <Row label="Started" value={profile.startedAt.slice(0, 10)} />
                <Row label="Streak" value={profile.streakDays} />
                <Row label="Shields" value={profile.streakShields ?? 0} />
                <Row label="Hours/day" value={profile.hoursPerDay} />
                <Row label="Confidence" value={profile.confidence} />
                <Row label="Outcome" value={profile.targetOutcome} />
                <Row label="Why" value={profile.why ?? "—"} />
                <Row label="Tier" value={license?.tier ?? "free"} />
              </div>
            </div>
          )}

          {/* Recent events tail */}
          <details className="card-surface p-5 group">
            <summary className="text-sm font-semibold cursor-pointer flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Last 20 events (raw)
              </span>
              <span className="text-xs text-muted-foreground group-open:hidden">
                expand
              </span>
            </summary>
            <div className="mt-3 max-h-96 overflow-y-auto">
              <div className="font-mono text-[11px] space-y-0.5">
                {events.slice(-20).reverse().map((e) => (
                  <div key={e.id} className="flex items-baseline gap-2">
                    <span className="text-muted-foreground tabular-nums shrink-0">
                      {e.timestamp.slice(11, 19)}
                    </span>
                    <span className="font-semibold text-brand-700">{e.type}</span>
                    <span className="text-muted-foreground truncate">
                      {e.examId && `· ${e.examId}`}
                      {e.questionId && ` · ${e.questionId}`}
                    </span>
                  </div>
                ))}
                {events.length === 0 && (
                  <div className="text-muted-foreground text-center py-4">
                    No events yet.
                  </div>
                )}
              </div>
            </div>
          </details>
        </div>
      </AppShell>
    </>
  );
}

function KPI({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  tone: "brand" | "violet" | "amber" | "emerald";
}) {
  const accent = {
    brand: "text-brand-700 bg-brand-50 border-brand-200",
    violet: "text-violet-700 bg-violet-50 border-violet-200",
    amber: "text-amber-700 bg-amber-50 border-amber-200",
    emerald: "text-emerald-700 bg-emerald-50 border-emerald-200",
  }[tone];
  return (
    <div className="card-surface p-4">
      <div className={`inline-flex items-center gap-1.5 chip ${accent} mb-2`}>
        {icon}
        {label}
      </div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
        {label}
      </div>
      <div className="font-medium tabular-nums">{String(value)}</div>
    </div>
  );
}

function guessExamFromAnswers(answers: { topicId: string }[]): string | null {
  // Topic IDs are exam-prefixed (e.g. "az-cloud-concepts"). Take the first
  // two segments as a best-effort cert code match.
  const t = answers[0]?.topicId;
  if (!t) return null;
  const parts = t.split("-");
  if (parts.length < 2) return null;
  return parts.slice(0, 2).join("-");
}
