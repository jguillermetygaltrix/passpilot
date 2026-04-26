"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { HydrationGate } from "@/components/hydration-gate";
import { ReadinessRing } from "@/components/readiness-ring";
import { RiskBadge } from "@/components/risk-badge";
import { StatCard } from "@/components/stat-card";
import { TopicMasteryList } from "@/components/topic-mastery-list";
import { TrendChart } from "@/components/trend-chart";
import { StreakBadge } from "@/components/streak-badge";
import { ShareableReadiness } from "@/components/shareable-readiness";
import { Button } from "@/components/ui/button";
import { GradientBorder } from "@/components/ui/gradient-border";
import { CountUp } from "@/components/count-up";
import { AppShell } from "@/components/container";
import { useApp, useDailyPlan, useMasteryAndReadiness } from "@/lib/store";
import { useEntitlements } from "@/lib/entitlements";
import { UpgradeWall } from "@/components/upgrade-wall";
import { EXAMS } from "@/lib/data/exams";
import { useEffect, useState } from "react";
import { topInsight } from "@/lib/scoring";
import { TOPIC_MAP } from "@/lib/data/topics";
import { getLessonsForExam } from "@/lib/data/lessons";
import { getExamMeta } from "@/lib/data/exams";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Command,
  FileDown,
  Flame,
  GraduationCap,
  Headphones,
  LifeBuoy,
  LineChart as LineChartIcon,
  Lock,
  PlayCircle,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const router = useRouter();
  const { profile, attempts, completedBlockIds, completedLessonIds, updateProfile } = useApp();
  const mr = useMasteryAndReadiness();
  const plan = useDailyPlan();
  const ent = useEntitlements();
  const [examMenuOpen, setExamMenuOpen] = useState(false);
  const [wallOpen, setWallOpen] = useState(false);
  const [wallProps, setWallProps] = useState({
    reason: "",
    headline: "",
    sub: "",
  });
  const openWall = (reason: string, headline: string, sub: string) => {
    setWallProps({ reason, headline, sub });
    setWallOpen(true);
  };

  if (!profile || !mr || !plan) return null;

  const examMeta = getExamMeta(profile.examId);
  const examLessons = getLessonsForExam(profile.examId);
  const { mastery, readiness } = mr;
  const insight = topInsight(readiness, mastery);
  const weak = [...mastery]
    .filter((m) => m.attempts > 0 && m.accuracy < 0.7)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);

  const recentAttempts = [...attempts]
    .filter((a) => a.kind !== "diagnostic")
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(0, 4);

  const todayMinutes = plan.blocks.reduce(
    (s, b) => s + (completedBlockIds.includes(b.id) ? b.minutes : 0),
    0
  );
  const planDone = plan.blocks.every((b) => completedBlockIds.includes(b.id));

  const rescueNeeded = readiness.daysLeft <= 7 || readiness.risk === "high";

  return (
    <>
      <AppNav />
      <UpgradeWall
        open={wallOpen}
        onClose={() => setWallOpen(false)}
        reason={wallProps.reason}
        headline={wallProps.headline}
        sub={wallProps.sub}
      />
      <AppShell>
        {!ent.hasPro && <ProBanner openWall={openWall} drillsLeft={ent.drillsLeftToday} />}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                {greeting()}
              </div>
              <span className="text-muted-foreground/40">·</span>
              <div className="relative">
                <button
                  onClick={() => setExamMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-brand-700 transition-colors group"
                >
                  <span
                    className="h-4 w-4 rounded-md text-white flex items-center justify-center text-[8px] font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${examMeta.accentFrom}, ${examMeta.accentTo})`,
                    }}
                  >
                    {examMeta.id === "aws-ccp"
                      ? "A"
                      : examMeta.id === "ms-900"
                        ? "M"
                        : "Z"}
                  </span>
                  {examMeta.name} path
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${examMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {examMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setExamMenuOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-border bg-white shadow-card overflow-hidden z-40 animate-scale-in">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 py-2 border-b border-border bg-slate-50">
                        Switch certification
                      </div>
                      {EXAMS.map((e) => {
                        const isActive = e.id === profile.examId;
                        const isLocked = !isActive && !ent.canSwitchExams;
                        return (
                          <button
                            key={e.id}
                            onClick={() => {
                              if (isLocked) {
                                setExamMenuOpen(false);
                                openWall(
                                  "Multi-Cert unlocks all exams",
                                  "Switch between 3 certifications",
                                  "Multi-Cert unlocks AZ-900, AWS Cloud Practitioner, and MS-900 with one purchase. Track progress across all three."
                                );
                                return;
                              }
                              updateProfile({ examId: e.id });
                              setExamMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${
                              isActive
                                ? "bg-brand-50"
                                : isLocked
                                  ? "opacity-70 hover:bg-slate-50"
                                  : "hover:bg-muted/50"
                            }`}
                          >
                            <div
                              className="h-7 w-7 rounded-lg text-white flex items-center justify-center text-[10px] font-bold shrink-0"
                              style={{
                                background: `linear-gradient(135deg, ${e.accentFrom}, ${e.accentTo})`,
                              }}
                            >
                              {e.id === "aws-ccp"
                                ? "AWS"
                                : e.id === "ms-900"
                                  ? "MS"
                                  : "AZ"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {e.name}
                              </div>
                              <div className="text-[11px] text-muted-foreground truncate">
                                {e.fullTitle}
                              </div>
                            </div>
                            {isActive && (
                              <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
                            )}
                            {isLocked && (
                              <span className="chip bg-rose-50 border-rose-200 text-rose-700 text-[9px] px-1.5 py-0.5 shrink-0">
                                <Lock className="h-2.5 w-2.5" />
                                Multi
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
            <h1 className="heading-2">Your pass dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/plan">
              <Button variant="outline" size="md">
                <Calendar className="h-4 w-4" /> Today's plan
              </Button>
            </Link>
            <SRReviewButton />
            <Link href="/listen">
              <Button variant="outline" size="md" className="group border-cyan-300 bg-cyan-50/40 text-cyan-800 hover:bg-cyan-50">
                <Headphones className="h-4 w-4" /> Listen
              </Button>
            </Link>
            <Link href="/cram">
              <Button variant="outline" size="md" className="group border-amber-300 bg-amber-50/40 text-amber-800 hover:bg-amber-50">
                <FileDown className="h-4 w-4" /> Cram sheet
              </Button>
            </Link>
            <Link href="/mock">
              <Button variant="outline" size="md" className="group border-rose-300 bg-rose-50/40 text-rose-800 hover:bg-rose-50">
                <Sparkles className="h-4 w-4" /> Mock exam
              </Button>
            </Link>
            <Link href="/practice">
              <Button variant="primary" size="md" className="group">
                Practice now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <GradientBorder
            gradient={`linear-gradient(135deg, ${examMeta.accentFrom}40, ${examMeta.accentTo}40, #06b6d440)`}
            radius="16px"
            thickness={1.5}
            className="lg:col-span-2"
            innerClassName="p-6 md:p-7 relative overflow-hidden"
          >
            <div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-50"
              style={{ background: examMeta.accentFrom }}
            />
            <div className="relative grid sm:grid-cols-[auto_1fr] gap-6 items-center">
              <ReadinessRing
                score={readiness.score}
                risk={readiness.risk}
                size={148}
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <RiskBadge risk={readiness.risk} />
                  <span className="chip bg-white border-border text-foreground">
                    <Sparkles className="h-3 w-3 text-brand-600" />
                    AI read
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{insight}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/plan">
                    <Button variant="primary" size="sm" className="group">
                      Open today's mission
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                  {rescueNeeded && (
                    <Link href="/rescue">
                      <Button variant="danger" size="sm">
                        <LifeBuoy className="h-3.5 w-3.5" />
                        Rescue mode
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </GradientBorder>

          <div className="grid grid-cols-2 gap-5">
            <StatCard
              label="Days to exam"
              value={<CountUp to={readiness.daysLeft} />}
              sub={new Date(profile.examDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
              icon={Calendar}
              tone={readiness.daysLeft <= 7 ? "rose" : "brand"}
            />
            <StatCard
              label="Streak"
              value={
                <>
                  <CountUp to={profile.streakDays} />
                  <span className="text-muted-foreground">d</span>
                </>
              }
              sub={profile.streakDays ? "Keep the fire alive" : "Start today"}
              icon={Flame}
              tone="amber"
            />
            <StatCard
              label="Today"
              value={
                <>
                  <CountUp to={todayMinutes} />
                  <span className="text-muted-foreground">/{plan.totalMinutes}m</span>
                </>
              }
              sub={planDone ? "Plan complete" : "Keep going"}
              icon={Clock}
              tone={planDone ? "emerald" : "brand"}
            />
            <StatCard
              label="Lessons"
              value={
                <>
                  <CountUp
                    to={
                      completedLessonIds.filter((id) =>
                        examLessons.some((l) => l.id === id)
                      ).length
                    }
                  />
                  <span className="text-muted-foreground">/{examLessons.length}</span>
                </>
              }
              sub={
                completedLessonIds.length === 0
                  ? "open the guide to start"
                  : completedLessonIds.filter((id) =>
                        examLessons.some((l) => l.id === id)
                      ).length === examLessons.length
                    ? "all chapters complete"
                    : "keep reading"
              }
              icon={GraduationCap}
              tone={
                completedLessonIds.filter((id) =>
                  examLessons.some((l) => l.id === id)
                ).length === examLessons.length
                  ? "emerald"
                  : "default"
              }
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mt-5">
          <div className="card-surface p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-sm">Today's mission</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {plan.mission}
                </div>
              </div>
              <Link
                href="/plan"
                className="text-xs font-medium text-brand-700 hover:text-brand-800 flex items-center gap-1"
              >
                Full plan <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <ul className="space-y-2.5">
              {plan.blocks.slice(0, 4).map((b) => {
                const done = completedBlockIds.includes(b.id);
                return (
                  <li
                    key={b.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-white"
                  >
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        done
                          ? "bg-emerald-500 text-white"
                          : "bg-brand-50 text-brand-700 border border-brand-100"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-semibold tabular-nums">
                          {b.minutes}m
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {b.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {b.description}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="card-surface p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-sm">Readiness trend</div>
              <span className="text-xs text-muted-foreground">last sessions</span>
            </div>
            <TrendChart data={readiness.trend} />
          </div>

          <StreakBadge variant="full" />

          {profile && (
            <ShareableReadiness
              examId={profile.examId}
              examName={getExamMeta(profile.examId)?.name ?? profile.examId}
              readinessScore={readiness.score}
              daysToExam={readiness.daysLeft}
              risk={readiness.risk}
            />
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mt-5">
          <div className="card-surface p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-sm">Topic mastery</div>
              <Link
                href="/weakness"
                className="text-xs font-medium text-brand-700 hover:text-brand-800 flex items-center gap-1"
              >
                Weakness review <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <TopicMasteryList mastery={mastery} />
          </div>

          <div className="space-y-5">
            {(() => {
              const nextLesson =
                examLessons.find(
                  (l) => !completedLessonIds.includes(l.id)
                ) || null;
              const lessonsPct = Math.round(
                (completedLessonIds.length / examLessons.length) * 100
              );
              return (
                <div className="card-surface p-6 bg-gradient-to-br from-brand-600 to-brand-700 text-white border-transparent relative overflow-hidden">
                  <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-white/10 blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-4 w-4" />
                      <div className="font-semibold text-sm">
                        {nextLesson ? "Continue learning" : "All chapters read"}
                      </div>
                    </div>
                    {nextLesson ? (
                      <>
                        <div className="text-[15px] font-semibold leading-snug">
                          {nextLesson.title}
                        </div>
                        <div className="text-xs text-white/75 mt-0.5">
                          {TOPIC_MAP[nextLesson.topicId]?.shortName} ·{" "}
                          {nextLesson.minutes} min
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-[11px] text-white/70 mb-1.5">
                            <span>Lessons progress</span>
                            <span className="tabular-nums font-semibold text-white">
                              {completedLessonIds.length}/{examLessons.length}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full transition-all"
                              style={{ width: `${lessonsPct}%` }}
                            />
                          </div>
                        </div>
                        <Link
                          href={`/guide/${nextLesson.topicId}/${nextLesson.id}`}
                          className="mt-4 inline-flex items-center gap-1.5 chip bg-white text-brand-700 border-transparent hover:bg-white/90"
                        >
                          <PlayCircle className="h-3.5 w-3.5" />
                          Resume
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="text-[15px] font-semibold leading-snug">
                          You've read every lesson.
                        </div>
                        <div className="text-xs text-white/75 mt-0.5">
                          Now lock it in with drills.
                        </div>
                        <Link
                          href="/practice"
                          className="mt-4 inline-flex items-center gap-1.5 chip bg-white text-brand-700 border-transparent hover:bg-white/90"
                        >
                          <PlayCircle className="h-3.5 w-3.5" />
                          Start drills
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="card-surface p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <div className="font-semibold text-sm">Weak-topic alerts</div>
              </div>
              {weak.length ? (
                <ul className="space-y-3">
                  {weak.map((m) => (
                    <li
                      key={m.topicId}
                      className="flex items-start justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/practice?topic=${m.topicId}`}
                          className="text-sm font-medium hover:text-brand-700"
                        >
                          {TOPIC_MAP[m.topicId]?.name}
                        </Link>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {Math.round(m.accuracy * 100)}% accuracy · priority{" "}
                          {m.priority.toFixed(2)}
                        </div>
                      </div>
                      <Link
                        href={`/practice?topic=${m.topicId}`}
                        className="chip bg-rose-50 border-rose-200 text-rose-700 shrink-0"
                      >
                        Drill
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No high-risk topics detected. Keep practicing to stay sharp.
                </div>
              )}
            </div>

            <div className="card-surface p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-sm">Recent sessions</div>
              </div>
              {recentAttempts.length ? (
                <ul className="space-y-3">
                  {recentAttempts.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-medium capitalize">
                          {kindLabel(a.kind)}
                          {a.topicId ? ` · ${TOPIC_MAP[a.topicId]?.shortName}` : ""}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(a.completedAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div
                        className={`text-sm font-semibold tabular-nums ${
                          a.scorePct >= 80
                            ? "text-emerald-600"
                            : a.scorePct >= 60
                              ? "text-brand-600"
                              : "text-rose-600"
                        }`}
                      >
                        {a.scorePct}%
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No practice yet. Complete your first drill and the trend
                  starts building here.
                </div>
              )}
            </div>
          </div>
        </div>
      </AppShell>
    </>
  );
}

function SRReviewButton() {
  const { profile } = useApp();
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    if (!profile) return;
    // Dynamic import keeps SR off the SSR path (LS-only)
    import("@/lib/sr").then((m) => {
      setDueCount(m.getDueCards(profile.examId).length);
    });
  }, [profile]);

  if (!profile) return null;

  const hasDue = dueCount > 0;

  return (
    <Link href="/review">
      <Button
        variant="outline"
        size="md"
        className={
          hasDue
            ? "group border-violet-300 bg-violet-50/60 text-violet-800 hover:bg-violet-100"
            : "group border-border"
        }
      >
        <Brain className="h-4 w-4" />
        Review
        {hasDue && (
          <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-violet-600 text-white text-[10px] font-semibold tabular-nums">
            {dueCount}
          </span>
        )}
      </Button>
    </Link>
  );
}

function kindLabel(
  k: "diagnostic" | "topic" | "mixed" | "incorrect-only" | "rescue" | "mock" | "sr-review"
) {
  if (k === "incorrect-only") return "Review drill";
  if (k === "mock") return "Mock exam";
  if (k === "sr-review") return "SR review";
  return k;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 18) return "Afternoon";
  return "Evening";
}

function ProBanner({
  openWall,
  drillsLeft,
}: {
  openWall: (reason: string, headline: string, sub: string) => void;
  drillsLeft: number;
}) {
  return (
    <div className="mb-5 rounded-2xl p-[1.5px] bg-gradient-to-br from-brand-500/60 via-violet2-500/60 to-cyan-500/60">
      <div className="rounded-[calc(1rem-1.5px)] bg-white p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet2-600 text-white flex items-center justify-center shadow-pop shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">
              You're on the free plan
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {drillsLeft === 0
                ? "No free drills left today. Upgrade for unlimited."
                : `${drillsLeft} free drills left today · unlock unlimited with Pro`}
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href="/redeem">
            <Button variant="ghost" size="sm">
              I have a key
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              openWall(
                "Unlock the full pass plan",
                "Study until you actually pass",
                "Unlimited drills, all 19 lessons, Rescue Mode, cram sheets. $19.99 one-time, lifetime access."
              )
            }
            className="group"
          >
            Upgrade
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
