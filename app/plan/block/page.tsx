"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { HydrationGate } from "@/components/hydration-gate";
import { AppShell } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { QuestionRunner } from "@/components/question-runner";
import { useApp } from "@/lib/store";
import { LESSON_MAP } from "@/lib/data/lessons";
import { TOPIC_MAP } from "@/lib/data/topics";
import { getQuestionsByTopic, sampleQuestions } from "@/lib/data/questions";
import type { LessonCard } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Sparkles,
} from "lucide-react";

/**
 * /plan/block?id=<blockId>&lesson=<lessonId>&topic=<topicId>
 *
 * DEC-052 — guided "lesson + 3-Q quiz" loop. The daily plan emits one of
 * these per focus topic; tapping "Start block" lands here.
 *
 * Phases:
 *   1. READ — flip through the lesson's cards (simplified renderer; the
 *      full guide page is /guide/[topicId]/[lessonId] for deep study).
 *   2. QUIZ — 3-question mini-drill on the topic via <QuestionRunner>.
 *      Coach pill is available on every reveal (DEC-051).
 *   3. DONE — auto-marks block + lesson complete, offers "Next block" or
 *      "Back to plan" CTAs.
 *
 * Why query-params not [id]/[lesson]/[topic] dynamic segments: this app
 * uses Next.js static export (`output: "export"` in next.config). Dynamic
 * segments would need generateStaticParams for every possible permutation;
 * search params don't need pre-rendering and work fine in static builds.
 *
 * Why mount QuestionRunner instead of redirecting to /practice: keeps the
 * user inside the plan flow — when they finish the quiz they bounce back to
 * /plan, not into the practice browser. Flow > friction.
 */
export default function PlanBlockPage() {
  return (
    <HydrationGate>
      {/* useSearchParams() requires a Suspense boundary in App Router. */}
      <Suspense fallback={null}>
        <Inner />
      </Suspense>
    </HydrationGate>
  );
}

type Phase = "read" | "quiz" | "done";

function Inner() {
  const router = useRouter();
  const params = useSearchParams();
  const blockId = params?.get("id") ?? "";
  const lessonId = params?.get("lesson") ?? "";
  const topicId = params?.get("topic") ?? "";

  const lesson = LESSON_MAP[lessonId];
  const topic = TOPIC_MAP[topicId];
  const { markBlockDone, markLessonComplete, profile } = useApp();

  // Sample 3 questions from the topic. Memoized so a re-render doesn't
  // re-shuffle mid-drill (which would jump questions out from under the user).
  const quizQuestions = useMemo(() => {
    if (!topicId) return [];
    const pool = getQuestionsByTopic(topicId);
    if (!pool.length) return [];
    return sampleQuestions(
      pool.map((q) => q.id),
      Math.min(3, pool.length)
    );
  }, [topicId, blockId]);

  const [phase, setPhase] = useState<Phase>("read");
  const [cardIdx, setCardIdx] = useState(0);

  // Sanity: missing/bad URL → friendly fallback, don't blow up.
  if (!blockId || !lessonId || !topicId || !lesson || !topic) {
    return (
      <>
        <AppNav />
        <AppShell className="max-w-md">
          <div className="card-surface p-8 text-center">
            <h2 className="heading-2">Block not found</h2>
            <p className="text-sm text-muted-foreground mt-2">
              This study block can't be loaded. Head back to today's plan.
            </p>
            <Link href="/plan" className="inline-block mt-4">
              <Button variant="primary" size="md">
                Back to plan
              </Button>
            </Link>
          </div>
        </AppShell>
      </>
    );
  }

  const total = lesson.cards.length;
  const card = lesson.cards[cardIdx];
  const isLastCard = cardIdx === total - 1;
  const readPct = ((cardIdx + 1) / total) * 100;

  const handleStartQuiz = () => {
    setPhase("quiz");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  const handleQuizFinish = () => {
    markLessonComplete(lessonId);
    markBlockDone(blockId);
    setPhase("done");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  return (
    <>
      <AppNav />
      <AppShell className="max-w-2xl">
        {/* Top crumb back to plan, persistent across all phases */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <Link
            href="/plan"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Today's plan
          </Link>
          <div className="text-xs text-muted-foreground tabular-nums">
            {phase === "read"
              ? `Card ${cardIdx + 1} / ${total}`
              : phase === "quiz"
                ? "Mini-quiz"
                : "Done"}
          </div>
        </div>

        {/* Header — block context. Always visible so user knows what they're doing. */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="chip bg-brand-50 dark:bg-brand-500/15 border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300">
              <BookOpen className="h-3 w-3" />
              {topic.shortName}
            </span>
            <span className="chip bg-slate-50 dark:bg-muted border-slate-200 dark:border-border text-slate-700 dark:text-slate-300">
              <Sparkles className="h-3 w-3" />
              Read + quiz
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold leading-snug text-balance">
            {lesson.title}
          </h1>
          {lesson.summary && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {lesson.summary}
            </p>
          )}
        </div>

        {phase === "read" && (
          <>
            <ProgressBar value={readPct} />

            <div className="mt-5">
              <BlockCardView card={card} />
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setCardIdx((i) => Math.max(0, i - 1))}
                disabled={cardIdx === 0}
                className={cn(cardIdx === 0 && "opacity-40 pointer-events-none")}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {!isLastCard ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setCardIdx((i) => Math.min(total - 1, i + 1))}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartQuiz}
                  className="group"
                >
                  <Dumbbell className="h-4 w-4" />
                  Quiz me on this
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              )}
            </div>

            {/* Card progress dots */}
            <div className="mt-8 flex gap-1.5 justify-center">
              {lesson.cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCardIdx(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === cardIdx
                      ? "bg-brand-600 w-6"
                      : i < cardIdx
                        ? "bg-brand-300 w-1.5"
                        : "bg-slate-200 w-1.5 hover:bg-slate-300"
                  )}
                  aria-label={`Go to card ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {phase === "quiz" && quizQuestions.length > 0 && (
          <QuestionRunner
            questions={quizQuestions}
            kind="topic"
            topicId={topicId}
            title="Mini-quiz"
            subtitle={`${topic.shortName} · ${quizQuestions.length} questions`}
            onFinish={handleQuizFinish}
          />
        )}

        {phase === "quiz" && quizQuestions.length === 0 && (
          <div className="card-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No questions are wired to this topic yet. Marking the block done
              from the read-only flow.
            </p>
            <Button
              variant="primary"
              size="md"
              className="mt-4"
              onClick={handleQuizFinish}
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark complete
            </Button>
          </div>
        )}

        {phase === "done" && (
          <div className="card-surface p-8 text-center animate-fade-in">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Block complete
            </div>
            <h2 className="text-2xl font-semibold tracking-tight mt-2">
              Lesson + quiz locked in
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-md mx-auto">
              You read the lesson and immediately tested it — that's the
              encoding pattern that actually sticks.
              {profile?.streakDays
                ? ` Day ${profile.streakDays} of your streak counts.`
                : ""}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/plan" className="flex-1 sm:flex-none">
                <Button variant="primary" size="lg" className="w-full">
                  Back to plan
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                href={`/guide/${topic.id}/${lesson.id}`}
                className="flex-1 sm:flex-none"
              >
                <Button variant="outline" size="lg" className="w-full">
                  Re-read in full guide
                </Button>
              </Link>
            </div>
          </div>
        )}
      </AppShell>
    </>
  );
}

/**
 * Compact inline card renderer. The full /guide/[topicId]/[lessonId] page
 * has a richer themed layout (per-kind palettes, big quote treatment); we
 * stay deliberately plainer here so the read phase reads as "warm-up before
 * the quiz" rather than competing for the user's attention.
 */
function BlockCardView({ card }: { card: LessonCard }) {
  return (
    <div className="rounded-2xl border border-border bg-white dark:bg-card p-5 sm:p-6 animate-slide-up">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
        {kindLabel(card.kind)}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold tracking-tight leading-snug mb-3 text-balance">
        {card.title}
      </h3>

      {card.body && (
        <p className="text-[15px] leading-relaxed text-foreground/90">
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
              <span className="h-5 w-5 rounded-full bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-500/30 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-semibold tabular-nums">
                {i + 1}
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {card.table && (
        <div className="mt-5 rounded-xl border border-border bg-slate-50/50 dark:bg-muted/40 overflow-hidden">
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
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 font-medium align-top">
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
        <div className="mt-5 rounded-xl border-l-4 border-brand-500 bg-brand-50/40 dark:bg-brand-500/10 pl-4 py-3 pr-4">
          <p className="text-[15px] italic font-medium leading-snug">
            "{card.highlight}"
          </p>
        </div>
      )}
    </div>
  );
}

function kindLabel(kind: LessonCard["kind"]): string {
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
