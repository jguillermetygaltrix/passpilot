"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { HydrationGate } from "@/components/hydration-gate";
import { AppShell } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { TOPIC_MAP } from "@/lib/data/topics";
import { LESSON_MAP, getNextLesson } from "@/lib/data/lessons";
import { useApp } from "@/lib/store";
import type { LessonCard, LessonCardKind } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  GitCompare,
  GraduationCap,
  Home,
  Lightbulb,
  Quote,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { getLessonsForExam } from "@/lib/data/lessons";
import { useEntitlements } from "@/lib/entitlements";
import { LockCard, UpgradeWall } from "@/components/upgrade-wall";

export function LessonClient() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const router = useRouter();
  const params = useParams();
  const topicId = (params?.topicId as string) || "";
  const lessonId = (params?.lessonId as string) || "";
  const lesson = LESSON_MAP[lessonId];
  const topic = TOPIC_MAP[topicId];

  const { completedLessonIds, markLessonComplete, profile } = useApp();
  const ent = useEntitlements();
  const [index, setIndex] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [wallOpen, setWallOpen] = useState(false);

  useEffect(() => {
    setIndex(0);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [lessonId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.metaKey || e.ctrlKey)
      )
        return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "j") {
        e.preventDefault();
        const next = document.getElementById("lesson-next-btn") as HTMLButtonElement | null;
        next?.click();
      } else if (e.key === "ArrowLeft" || e.key === "k") {
        e.preventDefault();
        const prev = document.getElementById("lesson-prev-btn") as HTMLButtonElement | null;
        prev?.click();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const locked = lesson ? !ent.canAccessLesson(lesson.id) : false;

  if (lesson && topic && locked) {
    return (
      <>
        <AppNav />
        <UpgradeWall
          open={wallOpen}
          onClose={() => setWallOpen(false)}
          reason={`Lesson ${lesson.order} is a Pro lesson`}
          headline="Unlock every lesson in your exam"
          sub="Free tier gets the first lesson per topic. Pro unlocks all lessons, deep review, cram sheets, and rescue mode. One-time $19.99."
        />
        <AppShell className="max-w-lg">
          <div className="mt-4">
            <Link
              href={`/guide/${topic.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to {topic.shortName}
            </Link>
            <LockCard
              title={lesson.title}
              body="This lesson is part of Pro. You get the first lesson of each chapter free — upgrade to unlock the rest."
              reason={`${lesson.minutes} min · ${lesson.cards.length} cards · Pro`}
              onUpgrade={() => setWallOpen(true)}
            />
          </div>
        </AppShell>
      </>
    );
  }

  if (!lesson || !topic) {
    return (
      <>
        <AppNav />
        <AppShell className="max-w-md">
          <div className="card-surface p-8 text-center">
            <h2 className="heading-2">Lesson not found</h2>
            <Link href="/guide" className="inline-block mt-4">
              <Button variant="primary" size="md">
                Back to overview
              </Button>
            </Link>
          </div>
        </AppShell>
      </>
    );
  }

  const total = lesson.cards.length;
  const isLast = index === total - 1;
  const isComplete = completedLessonIds.includes(lessonId);
  const nextLesson = getNextLesson(lessonId);
  const progress = ((index + 1) / total) * 100;
  const card = lesson.cards[index];

  const handleNext = () => {
    if (index < total - 1) {
      setIndex(index + 1);
      if (typeof window !== "undefined") window.scrollTo(0, 0);
    }
  };
  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      if (typeof window !== "undefined") window.scrollTo(0, 0);
    }
  };
  const handleComplete = () => {
    if (isComplete) {
      if (nextLesson) {
        router.push(`/guide/${nextLesson.topicId}/${nextLesson.id}`);
      } else {
        router.push(`/guide/${topic.id}`);
      }
      return;
    }
    markLessonComplete(lessonId);
    setCelebrating(true);
  };

  const handleContinueFromCelebration = () => {
    setCelebrating(false);
    if (nextLesson) {
      router.push(`/guide/${nextLesson.topicId}/${nextLesson.id}`);
    } else {
      router.push(`/guide/${topic.id}`);
    }
  };

  const examLessons = getLessonsForExam(topic.examId);
  const totalLessons = examLessons.length;
  const nowCompleted =
    completedLessonIds.filter((id) => examLessons.some((l) => l.id === id))
      .length + (isComplete ? 0 : 1);

  return (
    <>
      <AppNav />
      {celebrating && (
        <CelebrationOverlay
          lessonTitle={lesson.title}
          topicName={topic.shortName}
          streakDays={profile?.streakDays ?? 0}
          completed={nowCompleted}
          total={totalLessons}
          nextLessonTitle={nextLesson?.title ?? null}
          onContinue={handleContinueFromCelebration}
        />
      )}
      <div className="container max-w-2xl pt-6 pb-24 md:pt-10 md:pb-16 animate-fade-in">
        <div className="flex items-center justify-between gap-3 mb-4">
          <Link
            href={`/guide/${topic.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {topic.shortName}
          </Link>
          <div className="text-xs text-muted-foreground tabular-nums">
            Card {index + 1} <span className="opacity-50">/ {total}</span>
          </div>
        </div>

        <ProgressBar value={progress} />

        <div className="mt-5 mb-2 flex items-center gap-2 flex-wrap">
          <span className="chip bg-brand-50 dark:bg-brand-500/15 border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300">
            <BookOpen className="h-3 w-3" />
            Lesson {lesson.order}
          </span>
          <span className="chip bg-slate-50 dark:bg-muted border-slate-200 dark:border-border text-slate-700 dark:text-slate-300">
            {lesson.minutes} min read
          </span>
          {isComplete && (
            <span className="chip bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </span>
          )}
        </div>
        <h1 className="heading-2 mb-6 text-balance">{lesson.title}</h1>

        <CardView card={card} />

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            id="lesson-prev-btn"
            variant="ghost"
            size="md"
            onClick={handlePrev}
            disabled={index === 0}
            className={cn(index === 0 && "opacity-40 pointer-events-none")}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {!isLast ? (
            <Button
              id="lesson-next-btn"
              variant="primary"
              size="lg"
              onClick={handleNext}
              className="group"
            >
              Next
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          ) : (
            <Button
              id="lesson-next-btn"
              variant="primary"
              size="lg"
              onClick={handleComplete}
              className={cn(
                "group",
                isComplete && "bg-emerald-600 hover:bg-emerald-700"
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              {isComplete
                ? nextLesson
                  ? "Continue to next"
                  : "Back to chapter"
                : nextLesson
                  ? "Complete & continue"
                  : "Complete lesson"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="h-5 px-1.5 rounded bg-white dark:bg-card border border-border font-mono">
              ←
            </kbd>
            <kbd className="h-5 px-1.5 rounded bg-white dark:bg-card border border-border font-mono">
              →
            </kbd>
            navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="h-5 px-1.5 rounded bg-white dark:bg-card border border-border font-mono">
              Space
            </kbd>
            next
          </span>
        </div>

        {isLast && (
          <div className="mt-8 grid sm:grid-cols-2 gap-3 animate-fade-in">
            <Link href={`/practice?topic=${topic.id}`}>
              <div className="rounded-2xl border border-border bg-white dark:bg-card p-4 hover:border-brand-300 hover:shadow-soft transition-all h-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <Dumbbell className="h-4 w-4 text-brand-600" />
                  <div className="font-medium text-sm">Lock it in</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Take a 5-question drill on {topic.shortName} to cement what
                  you just read.
                </div>
              </div>
            </Link>
            <Link href={`/guide/${topic.id}`}>
              <div className="rounded-2xl border border-border bg-white dark:bg-card p-4 hover:border-brand-300 hover:shadow-soft transition-all h-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <Home className="h-4 w-4 text-brand-600" />
                  <div className="font-medium text-sm">Chapter home</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  See all lessons in this chapter and the reference library.
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="mt-10 flex gap-1.5 justify-center">
          {lesson.cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index
                  ? "bg-brand-600 w-6"
                  : i < index
                    ? "bg-brand-300 w-1.5"
                    : "bg-slate-200 w-1.5 hover:bg-slate-300"
              )}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function CardView({ card }: { card: LessonCard }) {
  const palette = kindPalette(card.kind);
  const Icon = palette.icon;

  return (
    <div
      key={card.title}
      className={cn(
        "rounded-[20px] border p-6 md:p-8 animate-slide-up",
        palette.wrapper
      )}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className={cn(
            "h-8 w-8 rounded-xl flex items-center justify-center",
            palette.iconBg
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div
          className={cn(
            "text-[11px] uppercase tracking-wider font-semibold",
            palette.label
          )}
        >
          {kindLabel(card.kind)}
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold tracking-tight leading-snug mb-4 text-balance">
        {card.title}
      </h2>

      {card.body && (
        <p className="text-[15px] md:text-base leading-relaxed text-foreground/90">
          {card.body}
        </p>
      )}

      {card.bullets && card.bullets.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {card.bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[14.5px] leading-relaxed"
            >
              <span
                className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-semibold tabular-nums",
                  palette.bullet
                )}
              >
                {i + 1}
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {card.table && (
        <div className="mt-5 rounded-xl border border-border bg-white dark:bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-muted border-b border-border">
                  {card.table.columns.map((c, i) => (
                    <th
                      key={i}
                      className="text-left font-semibold text-[12px] uppercase tracking-wider text-muted-foreground px-4 py-2.5"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {card.table.rows.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-foreground align-top">
                      {r.label}
                    </td>
                    {r.cells.map((cell, j) => (
                      <td
                        key={j}
                        className="px-4 py-3 text-muted-foreground align-top"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {card.highlight && (
        <div
          className={cn(
            "mt-5 rounded-xl border-l-4 pl-4 py-3 pr-4 relative",
            palette.quote
          )}
        >
          <Quote className="h-4 w-4 absolute -top-2 -left-2 bg-white dark:bg-card rounded-full p-0.5 text-brand-600 border border-brand-100 dark:border-brand-500/30" />
          <p className="text-[15px] italic font-medium leading-snug">
            "{card.highlight}"
          </p>
        </div>
      )}
    </div>
  );
}

function kindPalette(kind: LessonCardKind) {
  switch (kind) {
    case "intro":
      return {
        wrapper: "bg-gradient-to-br from-brand-50/70 to-white border-brand-100 dark:border-brand-500/30",
        iconBg: "bg-brand-600 text-white",
        label: "text-brand-700 dark:text-brand-300",
        bullet: "bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300",
        quote: "border-brand-500 bg-brand-50 dark:bg-brand-500/15/40",
        icon: Sparkles,
      };
    case "concept":
      return {
        wrapper: "bg-white dark:bg-card border-border",
        iconBg: "bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-500/30",
        label: "text-brand-700 dark:text-brand-300",
        bullet: "bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-500/30",
        quote: "border-brand-500 bg-brand-50 dark:bg-brand-500/15/40",
        icon: Target,
      };
    case "comparison":
      return {
        wrapper: "bg-white dark:bg-card border-border",
        iconBg: "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-100",
        label: "text-sky-700 dark:text-sky-300",
        bullet: "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-100",
        quote: "border-sky-500 bg-sky-50/40",
        icon: GitCompare,
      };
    case "example":
      return {
        wrapper: "bg-emerald-50/30 dark:bg-emerald-500/10 border-emerald-100",
        iconBg: "bg-emerald-500 text-white",
        label: "text-emerald-700 dark:text-emerald-300",
        bullet: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-100",
        quote: "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-500/10",
        icon: Lightbulb,
      };
    case "tip":
      return {
        wrapper: "bg-amber-50/40 dark:bg-amber-500/10 border-amber-100",
        iconBg: "bg-amber-500 text-white",
        label: "text-amber-700 dark:text-amber-300",
        bullet: "bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-100",
        quote: "border-amber-500 bg-amber-50/60 dark:bg-amber-500/10",
        icon: Zap,
      };
    case "recap":
      return {
        wrapper: "bg-gradient-to-br from-brand-600 to-brand-700 text-white border-transparent",
        iconBg: "bg-white/15 text-white",
        label: "text-white/80",
        bullet: "bg-white/15 text-white",
        quote: "border-white/40 bg-white/10 text-white",
        icon: CheckCircle2,
      };
  }
}

function kindLabel(kind: LessonCardKind): string {
  switch (kind) {
    case "intro":
      return "Lesson intro";
    case "concept":
      return "Core concept";
    case "comparison":
      return "Comparison";
    case "example":
      return "Example";
    case "tip":
      return "Exam tip";
    case "recap":
      return "Takeaway";
  }
}

function CelebrationOverlay({
  lessonTitle,
  topicName,
  streakDays,
  completed,
  total,
  nextLessonTitle,
  onContinue,
}: {
  lessonTitle: string;
  topicName: string;
  streakDays: number;
  completed: number;
  total: number;
  nextLessonTitle: string | null;
  onContinue: () => void;
}) {
  const pct = Math.round((completed / total) * 100);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" />
      <Sparkle top="12%" left="18%" delay="0s" />
      <Sparkle top="20%" left="82%" delay="0.2s" />
      <Sparkle top="70%" left="14%" delay="0.5s" />
      <Sparkle top="62%" left="86%" delay="0.35s" />
      <Sparkle top="30%" left="50%" delay="0.6s" />
      <Sparkle top="85%" left="52%" delay="0.45s" />

      <div className="relative w-full max-w-md animate-bounce-in">
        <div className="rounded-[28px] bg-gradient-to-br from-brand-600 via-brand-500 to-violet2-600 p-[1.5px] shadow-pop">
          <div className="rounded-[27px] bg-white dark:bg-card p-7 md:p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-brand-100 dark:bg-brand-500/20 blur-3xl opacity-70" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-violet2-100 blur-3xl opacity-70" />

            <div className="relative text-center">
              <div className="relative inline-flex items-center justify-center mb-4">
                <div className="absolute inset-0 rounded-full bg-emerald-400/40 animate-pulse-ring" />
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-pop">
                  <Trophy className="h-9 w-9" />
                </div>
              </div>
              <div className="chip bg-brand-50 dark:bg-brand-500/15 border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 mx-auto mb-3">
                <Sparkles className="h-3 w-3" />
                Lesson complete
              </div>
              <h3 className="heading-3 text-[20px] text-balance leading-snug">
                {lessonTitle}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Another one in the books for {topicName}.
              </p>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <StatTile
                  label="Lessons"
                  value={`${completed}/${total}`}
                  icon={GraduationCap}
                  tone="brand"
                />
                <StatTile
                  label="Streak"
                  value={`${streakDays}d`}
                  icon={Flame}
                  tone="amber"
                />
                <StatTile
                  label="Progress"
                  value={`${pct}%`}
                  icon={CheckCircle2}
                  tone="emerald"
                />
              </div>

              {nextLessonTitle && (
                <div className="mt-6 rounded-xl border border-brand-100 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-500/15/60 p-3.5 text-left">
                  <div className="text-[11px] uppercase tracking-wider text-brand-700 dark:text-brand-300 font-semibold">
                    Up next
                  </div>
                  <div className="text-sm font-semibold mt-0.5 truncate">
                    {nextLessonTitle}
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-full mt-6"
                onClick={onContinue}
              >
                {nextLessonTitle ? "Continue to next lesson" : "Back to chapter"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkle({
  top,
  left,
  delay,
}: {
  top: string;
  left: string;
  delay: string;
}) {
  return (
    <div
      className="absolute animate-sparkle text-amber-300"
      style={{ top, left, animationDelay: delay }}
    >
      <Sparkles className="h-5 w-5" />
    </div>
  );
}

function StatTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof Trophy;
  tone: "brand" | "amber" | "emerald";
}) {
  const bg =
    tone === "brand"
      ? "bg-brand-50 dark:bg-brand-500/15 border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300"
      : tone === "amber"
        ? "bg-amber-50 dark:bg-amber-500/10 border-amber-100 text-amber-700 dark:text-amber-300"
        : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 text-emerald-700 dark:text-emerald-300";
  return (
    <div className={cn("rounded-xl border p-3", bg)}>
      <div className="flex items-center justify-center gap-1 mb-0.5">
        <Icon className="h-3.5 w-3.5" />
        <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
          {label}
        </div>
      </div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}
