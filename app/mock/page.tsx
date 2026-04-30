"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import { HydrationGate } from "@/components/hydration-gate";
import { MockExamRunner } from "@/components/mock-exam-runner";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { useEntitlements } from "@/lib/entitlements";
import { EXAMS, getExamMeta } from "@/lib/data/exams";
import { getQuestionsForExam, sampleQuestions } from "@/lib/data/questions";
import {
  Clock,
  Trophy,
  Flag,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Lock,
  GraduationCap,
} from "lucide-react";
import { UpgradeWall } from "@/components/upgrade-wall";

const FREE_MOCK_COOLDOWN_DAYS = 7;
const PRO_MOCK_COOLDOWN_HOURS = 24;

export default function MockPage() {
  return (
    <HydrationGate>
      <Suspense>
        <Inner />
      </Suspense>
    </HydrationGate>
  );
}

function Inner() {
  const params = useSearchParams();
  const { profile, attempts } = useApp();
  const ent = useEntitlements();
  const requestedExamId = params.get("exam");
  const examId = requestedExamId || profile?.examId || "az-900";
  const exam = useMemo(() => getExamMeta(examId as any), [examId]);
  const [started, setStarted] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Check cooldown — free tier 7d, pro tier 24h
  const lastMockForExam = useMemo(() => {
    return attempts
      .filter((a) => a.kind === "mock" && a.mock?.examId === examId)
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
  }, [attempts, examId]);

  const cooldownMs = ent.hasPro
    ? PRO_MOCK_COOLDOWN_HOURS * 60 * 60 * 1000
    : FREE_MOCK_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  const lastMockTimeMs = lastMockForExam
    ? new Date(lastMockForExam.completedAt).getTime()
    : 0;
  const cooldownExpiresAt = lastMockTimeMs + cooldownMs;
  const cooldownActive = Date.now() < cooldownExpiresAt;
  const cooldownRemainingMs = Math.max(0, cooldownExpiresAt - Date.now());
  const cooldownHours = Math.floor(cooldownRemainingMs / (60 * 60 * 1000));
  const cooldownDays = Math.floor(cooldownHours / 24);

  // Build the mock question set: sample N questions weighted by topic blueprint
  const allQuestions = useMemo(() => getQuestionsForExam(examId as any), [examId]);

  // Mock exam Q count = avg of catalog range, clamped to available pool
  const targetCount = Math.min(
    Math.round((exam.questionCountRange[0] + exam.questionCountRange[1]) / 2),
    allQuestions.length
  );

  const mockQuestions = useMemo(() => {
    if (!started) return [];
    // Weighted sample: respect each topic's `weight` from EXAMS catalog
    const totalWeight = exam.domains.reduce((s, d) => s + (d.weight || 1), 0);
    const seed = Date.now();
    const collected: typeof allQuestions = [];

    for (const topic of exam.domains) {
      const topicShare = (topic.weight || 1) / totalWeight;
      const topicTarget = Math.max(1, Math.round(targetCount * topicShare));
      const pool = allQuestions.filter((q) => q.topicId === topic.id);
      if (!pool.length) continue;
      const sampled = sampleQuestions(
        pool.map((q) => q.id),
        Math.min(topicTarget, pool.length),
        seed + topic.id.charCodeAt(0)
      );
      collected.push(...sampled);
    }

    // If under-sampled (rounding), top up from remaining pool
    if (collected.length < targetCount) {
      const usedIds = new Set(collected.map((q) => q.id));
      const remaining = allQuestions.filter((q) => !usedIds.has(q.id));
      const topUp = sampleQuestions(
        remaining.map((q) => q.id),
        targetCount - collected.length,
        seed
      );
      collected.push(...topUp);
    }

    // If over-sampled (rounding up), trim
    return collected.slice(0, targetCount);
  }, [started, exam, allQuestions, targetCount]);

  if (started && mockQuestions.length > 0) {
    return (
      <>
        <AppNav />
        <AppShell>
          <MockExamRunner
            exam={exam}
            questions={mockQuestions}
            durationSec={exam.durationMin * 60}
          />
        </AppShell>
      </>
    );
  }

  // Past mock attempts for this cert
  const previousMocks = attempts
    .filter((a) => a.kind === "mock" && a.mock?.examId === examId)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, 3);

  return (
    <>
      <AppNav />
      <AppShell>
        <UpgradeWall
          open={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          reason="Free tier: 1 mock per cert per 7 days"
          headline="Unlock unlimited mock exams"
          sub="Pro members can retake every 24 hours per certification."
        />

        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center space-y-3">
            <div className="chip bg-brand-50 dark:bg-brand-500/15 border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 mx-auto">
              <Trophy className="h-3 w-3" />
              Mock Exam Mode
            </div>
            <h1 className="heading-2 text-balance">
              Take a full {exam.name} exam.
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              This is the calibration moment — full length, real timer, no per-question
              hints. Pass this and you're ready to book.
            </p>
          </div>

          {/* Exam summary card */}
          <div className="card-surface p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                  {exam.vendor} · {exam.shortCode}
                </div>
                <h2 className="text-xl font-semibold leading-snug">
                  {exam.fullTitle}
                </h2>
              </div>
              <div
                className="h-12 w-12 rounded-xl text-white flex items-center justify-center shadow-pop text-xs font-bold shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${exam.accentFrom}, ${exam.accentTo})`,
                }}
              >
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <Stat
                icon={<Clock className="h-3.5 w-3.5" />}
                label="Time"
                value={`${exam.durationMin} min`}
              />
              <Stat
                icon={<Flag className="h-3.5 w-3.5" />}
                label="Questions"
                value={`${targetCount}`}
              />
              <Stat
                icon={<Trophy className="h-3.5 w-3.5" />}
                label="Pass at"
                value={`${exam.passScore}%`}
              />
            </div>

            <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50/40 dark:bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200 mb-6">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-300 mt-0.5 shrink-0" />
                <div className="space-y-1.5">
                  <div className="font-medium">Read before you start</div>
                  <ul className="text-[13px] leading-relaxed text-amber-900 dark:text-amber-200/90 list-disc pl-4 space-y-0.5">
                    <li>Once you click Start, the timer doesn't pause.</li>
                    <li>No answers shown until the end (real exam behavior).</li>
                    <li>Skip + flag questions to revisit; navigate freely.</li>
                    <li>Auto-submits when the timer hits 0.</li>
                    <li>
                      {ent.hasPro
                        ? "Pro: retake every 24 hours per cert."
                        : `Free: 1 mock per cert per ${FREE_MOCK_COOLDOWN_DAYS} days.`}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {cooldownActive ? (
              <div className="rounded-xl border border-border bg-slate-50 dark:bg-muted/60 p-5 text-center">
                <Lock className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                <div className="font-semibold text-sm mb-1">
                  Mock cooldown active
                </div>
                <div className="text-xs text-muted-foreground mb-4">
                  Available again in{" "}
                  <span className="font-semibold tabular-nums">
                    {cooldownDays > 0 ? `${cooldownDays}d ` : ""}
                    {cooldownHours % 24}h
                  </span>
                  {!ent.hasPro && (
                    <>
                      {" · "}
                      <button
                        onClick={() => setShowUpgrade(true)}
                        className="text-brand-700 dark:text-brand-300 hover:underline"
                      >
                        Upgrade to Pro for 24h cooldown
                      </button>
                    </>
                  )}
                </div>
                <Link href="/practice">
                  <Button variant="outline" size="md">
                    Drill weak topics instead
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                variant="primary"
                size="xl"
                className="w-full group"
                onClick={() => {
                  if (
                    confirm(
                      `Start the ${exam.name} mock exam?\n\nYou'll have ${exam.durationMin} minutes for ${targetCount} questions. Once started, the timer won't pause.`
                    )
                  ) {
                    setStarted(true);
                  }
                }}
              >
                <Sparkles className="h-4 w-4" />
                Start mock exam
              </Button>
            )}
          </div>

          {/* Previous mocks for this cert */}
          {previousMocks.length > 0 && (
            <div className="card-surface p-5">
              <div className="text-sm font-medium mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-600" />
                Your recent mocks for {exam.name}
              </div>
              <div className="space-y-2">
                {previousMocks.map((a) => {
                  const passed = a.mock?.passed ?? a.scorePct >= exam.passScore;
                  const date = new Date(a.completedAt);
                  return (
                    <div
                      key={a.id}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-muted/60 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={
                            passed
                              ? "chip bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                              : "chip bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300"
                          }
                        >
                          {passed ? "Passed" : "Below pass"}
                        </span>
                        <span className="text-sm font-semibold tabular-nums">
                          {a.scorePct}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground tabular-nums">
                        {date.toLocaleDateString()} ·{" "}
                        {Math.round((a.mock?.elapsedSec ?? 0) / 60)}m
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Switch cert */}
          {ent.hasMulti && EXAMS.length > 1 && (
            <div className="card-surface p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                Take a mock for a different cert
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EXAMS.filter((e) => e.id !== examId).map((e) => (
                  <Link
                    key={e.id}
                    href={`/mock?exam=${e.id}`}
                    className="rounded-lg border border-border bg-white dark:bg-card px-3 py-2.5 text-sm font-medium hover:border-brand-300 hover:bg-brand-50 dark:bg-brand-500/15/40 transition-colors flex items-center justify-between"
                  >
                    <span className="truncate">{e.name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0 ml-2">
                      {e.durationMin}m
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </AppShell>
    </>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center px-3 py-3 rounded-xl bg-slate-50 dark:bg-muted/60 border border-border">
      <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
        {icon}
        {label}
      </div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}
