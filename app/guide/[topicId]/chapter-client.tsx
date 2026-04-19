"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { HydrationGate } from "@/components/hydration-gate";
import { AppShell } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { TOPIC_MAP, getTopicsForExam } from "@/lib/data/topics";
import { getTopicLessons } from "@/lib/data/lessons";
import { QUESTION_MAP } from "@/lib/data/questions";
import { useApp } from "@/lib/store";
import type { ReviewSection, TopicReview } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Dumbbell,
  FileText,
  GraduationCap,
  Lightbulb,
  ListChecks,
  PlayCircle,
  ShieldAlert,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";

type RefMode = "review" | "cram" | "keyfacts" | "mistakes";

export function ChapterClient() {
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
  const topic = TOPIC_MAP[topicId];
  const { attempts, completedLessonIds } = useApp();
  const [refOpen, setRefOpen] = useState(false);
  const [refMode, setRefMode] = useState<RefMode>("review");

  if (!topic) {
    return (
      <>
        <AppNav />
        <AppShell className="max-w-md">
          <div className="card-surface p-8 text-center">
            <h2 className="heading-2">Topic not found</h2>
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

  const examTopics = getTopicsForExam(topic.examId);
  const topicIndex = examTopics.findIndex((t) => t.id === topicId);
  const lessons = getTopicLessons(topicId);
  const done = lessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  const totalMin = lessons.reduce((s, l) => s + l.minutes, 0);
  const nextLesson =
    lessons.find((l) => !completedLessonIds.includes(l.id)) || lessons[0];
  const ctaLabel = done === 0 ? "Start chapter" : done === lessons.length ? "Review lessons" : "Continue";

  const topicMistakes = attempts
    .flatMap((a) => a.answers)
    .filter((a) => !a.correct && a.topicId === topic.id)
    .map((a) => QUESTION_MAP[a.questionId])
    .filter(Boolean)
    .reduce<typeof QUESTION_MAP[string][]>((acc, q) => {
      if (!acc.find((x) => x.id === q.id)) acc.push(q);
      return acc;
    }, []);

  return (
    <>
      <AppNav />
      <AppShell>
        <div className="mb-5">
          <Link
            href="/guide"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Overview
          </Link>
        </div>

        <div className="card-surface p-6 md:p-8 mb-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-100 blur-3xl opacity-60" />
          <div className="relative">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="chip bg-brand-50 border-brand-100 text-brand-700">
                Chapter {topicIndex + 1} of {examTopics.length}
              </span>
              <span className="chip bg-slate-50 border-slate-200 text-slate-700">
                <Target className="h-3 w-3" />
                Weight {Math.round(topic.weight * 100)}%
              </span>
              <span className="chip bg-slate-50 border-slate-200 text-slate-700">
                <Clock className="h-3 w-3" />
                {totalMin} min
              </span>
            </div>
            <h1 className="heading-2 mb-3">{topic.name}</h1>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              {topic.summary}
            </p>

            <div className="mt-5 max-w-md">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Chapter progress</span>
                <span className="tabular-nums font-semibold text-foreground">
                  {done} / {lessons.length}
                </span>
              </div>
              <ProgressBar value={pct} tone={pct === 100 ? "emerald" : "brand"} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link href={`/guide/${topic.id}/${nextLesson.id}`}>
                <Button variant="primary" size="lg">
                  <PlayCircle className="h-4 w-4" />
                  {ctaLabel}
                </Button>
              </Link>
              <Link href={`/practice?topic=${topic.id}`}>
                <Button variant="outline" size="lg">
                  <Dumbbell className="h-4 w-4" />
                  Drill this topic
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-4 w-4 text-brand-600" />
            <h2 className="font-semibold text-sm">Lessons</h2>
          </div>
          <ul className="space-y-3">
            {lessons.map((l, i) => {
              const isDone = completedLessonIds.includes(l.id);
              const isNext = l.id === nextLesson.id && !isDone;
              return (
                <li key={l.id}>
                  <Link
                    href={`/guide/${topic.id}/${l.id}`}
                    className={cn(
                      "group block rounded-2xl border p-5 transition-all",
                      isDone
                        ? "border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/60"
                        : isNext
                          ? "border-brand-500 bg-brand-50/40 ring-2 ring-brand-100 hover:bg-brand-50/70"
                          : "border-border bg-white hover:border-brand-200 hover:shadow-soft"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 font-semibold text-sm",
                          isDone
                            ? "bg-emerald-500 text-white"
                            : isNext
                              ? "bg-brand-600 text-white"
                              : "bg-brand-50 border border-brand-100 text-brand-700"
                        )}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="tabular-nums">{i + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {isNext && (
                            <span className="chip bg-brand-600 text-white border-transparent">
                              <PlayCircle className="h-3 w-3" />
                              Start here
                            </span>
                          )}
                          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                            Lesson {l.order} · {l.minutes} min · {l.cards.length} cards
                          </span>
                        </div>
                        <div className="font-semibold text-[15px] leading-snug">
                          {l.title}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {l.summary}
                        </div>
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-5 w-5 shrink-0 transition-transform",
                          "text-muted-foreground group-hover:translate-x-0.5 group-hover:text-brand-700"
                        )}
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card-surface overflow-hidden">
          <button
            onClick={() => setRefOpen((v) => !v)}
            className="w-full p-5 md:p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold text-sm">Reference library</div>
                <div className="text-xs text-muted-foreground">
                  Deep review, cram sheet, key facts, your mistakes
                </div>
              </div>
            </div>
            <ChevronRight
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform",
                refOpen && "rotate-90"
              )}
            />
          </button>

          {refOpen && (
            <div className="border-t border-border p-5 md:p-6 animate-fade-in">
              <div className="flex gap-2 mb-5 overflow-x-auto">
                <RefTab
                  active={refMode === "review"}
                  onClick={() => setRefMode("review")}
                  icon={GraduationCap}
                  label="Deep review"
                />
                <RefTab
                  active={refMode === "cram"}
                  onClick={() => setRefMode("cram")}
                  icon={FileText}
                  label="Cram sheet"
                />
                <RefTab
                  active={refMode === "keyfacts"}
                  onClick={() => setRefMode("keyfacts")}
                  icon={Lightbulb}
                  label="Key facts"
                />
                <RefTab
                  active={refMode === "mistakes"}
                  onClick={() => setRefMode("mistakes")}
                  icon={X}
                  label="Mistakes"
                />
              </div>

              {refMode === "review" && <ReviewView review={topic.review} />}
              {refMode === "cram" && (
                <ul className="space-y-3">
                  {topic.cramSheet.map((c, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-amber-200/60 bg-amber-50/40 p-4"
                    >
                      <span className="h-7 w-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-semibold shrink-0 tabular-nums">
                        {i + 1}
                      </span>
                      <div className="text-sm leading-relaxed">{c}</div>
                    </li>
                  ))}
                </ul>
              )}
              {refMode === "keyfacts" && (
                <ul className="space-y-3">
                  {topic.keyFacts.map((k, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-border bg-white p-4"
                    >
                      <CheckCircle2 className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" />
                      <div className="text-sm leading-relaxed">{k}</div>
                    </li>
                  ))}
                </ul>
              )}
              {refMode === "mistakes" &&
                (topicMistakes.length ? (
                  <ul className="space-y-4">
                    {topicMistakes.map((q) => (
                      <li
                        key={q.id}
                        className="rounded-xl border border-border p-4"
                      >
                        <div className="font-medium text-sm leading-snug">
                          {q.prompt}
                        </div>
                        <div className="text-sm text-emerald-700 mt-2">
                          ✓ Correct answer: {q.choices[q.correctIndex]}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                          {q.explanation}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                    No mistakes tracked for this topic yet.
                  </div>
                ))}
            </div>
          )}
        </div>
      </AppShell>
    </>
  );
}

function RefTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof BookOpen;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 h-9 px-3.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
        active
          ? "bg-brand-600 text-white"
          : "bg-slate-50 text-muted-foreground hover:bg-slate-100"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function ReviewView({ review }: { review: TopicReview }) {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/70 to-white p-5">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="h-4 w-4 text-brand-700" />
          <div className="text-[11px] uppercase tracking-wider text-brand-700 font-semibold">
            Overview · {review.examWeight}
          </div>
        </div>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          {review.overview}
        </p>
      </div>

      <div className="space-y-6">
        {review.sections.map((s, i) => (
          <SectionBlock key={i} index={i + 1} section={s} />
        ))}
      </div>

      {review.gotchas.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <h3 className="font-semibold text-[15px]">Commonly confused</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {review.gotchas.map((g, i) => (
              <div
                key={i}
                className="rounded-xl border border-amber-200/70 bg-amber-50/30 p-4"
              >
                <div className="text-sm font-semibold text-amber-900">
                  {g.confusion}
                </div>
                <div className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {g.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {review.examTips.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-brand-600" />
            <h3 className="font-semibold text-[15px]">Exam pattern tips</h3>
          </div>
          <ul className="space-y-2">
            {review.examTips.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/30 p-3.5"
              >
                <Zap className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" />
                <div className="text-sm leading-relaxed">{t}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SectionBlock({
  index,
  section,
}: {
  index: number;
  section: ReviewSection;
}) {
  return (
    <section>
      <div className="flex items-start gap-3 mb-3">
        <div className="h-7 w-7 rounded-lg bg-brand-600 text-white text-xs font-semibold flex items-center justify-center shrink-0 tabular-nums">
          {index}
        </div>
        <h3 className="font-semibold text-[16px] leading-snug pt-1">
          {section.heading}
        </h3>
      </div>
      <div className="pl-10 space-y-3">
        {section.body && (
          <p className="text-[14.5px] leading-relaxed text-foreground/90">
            {section.body}
          </p>
        )}

        {section.bullets && section.bullets.length > 0 && (
          <ul className="space-y-2">
            {section.bullets.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[14px] leading-relaxed"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600 mt-[0.55rem] shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        {section.table && (
          <div className="rounded-xl border border-border bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-border">
                    {section.table.columns.map((c, i) => (
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
                  {section.table.rows.map((r, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-b-0 hover:bg-slate-50/40"
                    >
                      <td className="px-4 py-3 font-medium text-foreground align-top w-[28%]">
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
      </div>
    </section>
  );
}
