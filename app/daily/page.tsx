"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import { HydrationGate } from "@/components/hydration-gate";
import { QuestionRunner } from "@/components/question-runner";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { getExamMeta } from "@/lib/data/exams";
import {
  getDailyChallenge,
  hasCompletedDailyToday,
  getLatestDailyAttempt,
  todayLocalDate,
  DAILY_QUESTION_COUNT,
  DAILY_TOPIC_TAG,
} from "@/lib/daily";
import {
  Sparkles,
  Trophy,
  Calendar,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe,
} from "lucide-react";

export default function DailyPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const { profile, attempts } = useApp();
  const [started, setStarted] = useState(false);
  const [version, setVersion] = useState(0);

  if (!profile) return null;

  const exam = useMemo(() => getExamMeta(profile.examId), [profile.examId]);
  const today = todayLocalDate();

  const completed = useMemo(
    () => hasCompletedDailyToday(attempts, profile.examId, today),
    [attempts, profile.examId, today, version]
  );

  const todayAttempt = useMemo(() => {
    if (!completed) return null;
    return attempts
      .filter(
        (a) =>
          a.topicId === DAILY_TOPIC_TAG &&
          a.completedAt.slice(0, 10) === today
      )
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0] ?? null;
  }, [attempts, today, completed, version]);

  const lastDaily = useMemo(
    () => getLatestDailyAttempt(attempts, profile.examId),
    [attempts, profile.examId, version]
  );

  const dailyQuestions = useMemo(
    () => getDailyChallenge(profile.examId, today),
    [profile.examId, today]
  );

  // Hours until midnight (when next daily resets)
  const msToMidnight = useMemo(() => {
    const m = new Date();
    m.setHours(24, 0, 0, 0);
    return m.getTime() - Date.now();
  }, []);
  const hoursToReset = Math.floor(msToMidnight / 3600000);
  const minutesToReset = Math.floor((msToMidnight % 3600000) / 60000);

  // Daily-challenge streak across all certs (the badge engine uses topicId,
  // doesn't care which cert). For UI, count consecutive days with any daily.
  const streak = useMemo(() => {
    const dailyDays = new Set(
      attempts
        .filter((a) => a.topicId === DAILY_TOPIC_TAG)
        .map((a) => a.completedAt.slice(0, 10))
    );
    if (dailyDays.size === 0) return 0;
    let s = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const day = cursor.toISOString().slice(0, 10);
      if (dailyDays.has(day)) {
        s++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        if (i === 0) {
          cursor.setDate(cursor.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return s;
  }, [attempts, version]);

  // Active runner — note: we pass topicId=__daily__ so attempts are tagged
  // and the runner's recordAttempt call uses our daily flag.
  if (started && !completed && dailyQuestions.length > 0) {
    return (
      <>
        <AppNav />
        <AppShell>
          <QuestionRunner
            questions={dailyQuestions}
            kind="mixed"
            topicId={DAILY_TOPIC_TAG}
            title="Daily Challenge"
            subtitle={`5 questions · same for everyone studying ${exam.name} today`}
            onFinish={() => {
              setStarted(false);
              setVersion((v) => v + 1);
            }}
          />
        </AppShell>
      </>
    );
  }

  return (
    <>
      <AppNav />
      <AppShell>
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Hero */}
          <div className="text-center space-y-3">
            <div className="chip bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 text-emerald-700 dark:text-emerald-300 mx-auto">
              <Sparkles className="h-3 w-3" />
              Daily Challenge
            </div>
            <h1 className="heading-2 text-balance">
              {completed ? "Today's challenge: done." : "Today's challenge"}
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {DAILY_QUESTION_COUNT} questions, ~5 minutes, mixed across the {exam.name} blueprint.
              Same questions for everyone studying this cert today —{" "}
              <span className="text-foreground font-medium">your score is comparable</span>.
            </p>
          </div>

          {/* Status card */}
          {completed && todayAttempt ? (
            <div className="card-surface p-6 sm:p-8 text-center bg-gradient-to-br from-emerald-50/50 via-white to-cyan-50/40">
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="text-5xl font-semibold tabular-nums tracking-tight mb-1">
                {todayAttempt.scorePct}%
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                {todayAttempt.answers.filter((a) => a.correct).length} of{" "}
                {todayAttempt.answers.length} correct
              </div>
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1 bg-slate-50 dark:bg-muted border border-border rounded-full px-3 py-1.5">
                <Clock className="h-3 w-3" />
                Next challenge unlocks in{" "}
                <span className="font-semibold tabular-nums">
                  {hoursToReset}h {minutesToReset}m
                </span>
              </div>
            </div>
          ) : (
            <div className="card-surface p-6 sm:p-8 text-center bg-gradient-to-br from-emerald-50/40 via-white to-cyan-50/30">
              <div className="grid grid-cols-3 gap-3 mb-5">
                <Stat
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                  label="Questions"
                  value={`${DAILY_QUESTION_COUNT}`}
                />
                <Stat
                  icon={<Clock className="h-3.5 w-3.5" />}
                  label="Time"
                  value="~5 min"
                />
                <Stat
                  icon={<Globe className="h-3.5 w-3.5" />}
                  label="Cohort"
                  value="Today"
                />
              </div>
              <Button
                variant="primary"
                size="xl"
                className="w-full group"
                onClick={() => setStarted(true)}
              >
                <Zap className="h-4 w-4" />
                Start today's challenge
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                Don't break the chain — completing daily keeps your streak alive.
              </p>
            </div>
          )}

          {/* Streak */}
          <div className="card-surface p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-600" />
                Your daily streak
              </div>
              <div className="text-2xl font-semibold tabular-nums">
                {streak}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  day{streak === 1 ? "" : "s"}
                </span>
              </div>
            </div>
            {streak === 0 ? (
              <p className="text-xs text-muted-foreground leading-relaxed">
                Complete today's challenge to start a streak. 3 days unlocks the{" "}
                <b>Three In A Row</b> badge · 10 days unlocks <b>Daily Devotion</b>.
              </p>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Keep coming back daily — next milestone:{" "}
                <span className="text-foreground font-semibold">
                  {streak < 3 ? `${3 - streak} day${streak === 2 ? "" : "s"} → Three In A Row badge` : streak < 10 ? `${10 - streak} days → Daily Devotion badge` : `you've unlocked all daily badges`}
                </span>
              </div>
            )}
          </div>

          {/* Recent dailies (last 5) */}
          {lastDaily && (
            <details className="card-surface p-5 group">
              <summary className="text-sm font-medium cursor-pointer flex items-center justify-between">
                <span>Your recent daily scores</span>
                <span className="text-xs text-muted-foreground group-open:hidden">
                  expand
                </span>
              </summary>
              <div className="mt-4 space-y-2">
                {attempts
                  .filter((a) => a.topicId === DAILY_TOPIC_TAG)
                  .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
                  .slice(0, 5)
                  .map((a) => {
                    const date = new Date(a.completedAt);
                    return (
                      <div
                        key={a.id}
                        className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-muted/60 border border-border"
                      >
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {date.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-sm font-semibold tabular-nums">
                          {a.scorePct}%
                        </span>
                      </div>
                    );
                  })}
              </div>
            </details>
          )}

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
    <div className="text-center px-3 py-2.5 rounded-xl bg-white dark:bg-card border border-border">
      <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
        {icon}
        {label}
      </div>
      <div className="text-base font-semibold tabular-nums">{value}</div>
    </div>
  );
}
