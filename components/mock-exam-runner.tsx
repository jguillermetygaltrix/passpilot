"use client";

/**
 * MockExamRunner — full-length timed exam simulation.
 *
 * Differs from QuestionRunner (drills):
 *   - Real exam duration (60-90 min, from EXAMS catalog)
 *   - Real exam Q count (avg of questionCountRange)
 *   - NO per-question reveal (answers shown only on debrief, like real exam)
 *   - Auto-submit on timer expiry
 *   - "Flag for review" per question
 *   - Question navigator strip — jump back to flagged or unanswered
 *   - Pass/fail debrief with topic breakdown + retry-tomorrow gate
 *
 * Usage flow:
 *   /mock → MockSelection (cert summary + Start) → confirm modal →
 *   MockExamRunner (timed runner) → debrief screen → /dashboard
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flag,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Trophy,
  AlertCircle,
} from "lucide-react";
import type { AnswerRecord, ExamId, Question } from "@/lib/types";
import type { ExamMeta } from "@/lib/data/exams";
import { TOPIC_MAP } from "@/lib/data/topics";
import { Button } from "./ui/button";
import { ProgressBar } from "./ui/progress";
import { useApp } from "@/lib/store";
import { track } from "@/lib/usage";
import { cn } from "@/lib/utils";
import { evaluateAll } from "@/lib/achievements";
import { fireBadgeUnlocks } from "./badge-toast";
import { shuffleQuestions, newDrillSeed } from "@/lib/shuffle";

interface Props {
  exam: ExamMeta;
  questions: Question[];
  durationSec: number; // exam.durationMin * 60
  onComplete?: (passed: boolean, scorePct: number) => void;
}

interface QState {
  selected: number | null;
  flagged: boolean;
  startedAtMs: number; // epoch ms when user first viewed this Q
  timeMs: number;      // accumulated time on this Q
}

export function MockExamRunner({ exam, questions: rawQuestions, durationSec, onComplete }: Props) {
  const router = useRouter();
  const recordAttempt = useApp((s) => s.recordAttempt);

  // DEC-053 — shuffle each question's choices with a per-mock seed.
  // Source data has correctIndex bias; without runtime shuffle a real
  // mock exam would still teach pattern recognition. Seed stable per
  // mock instance via useState initializer.
  const [drillSeed] = useState(() => newDrillSeed());
  const questions = useMemo(
    () => shuffleQuestions(rawQuestions, drillSeed),
    [rawQuestions, drillSeed]
  );

  const [index, setIndex] = useState(0);
  const [states, setStates] = useState<QState[]>(() =>
    questions.map(() => ({
      selected: null,
      flagged: false,
      startedAtMs: 0,
      timeMs: 0,
    }))
  );
  const [submitted, setSubmitted] = useState(false);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(durationSec);
  const startedAtRef = useRef<number>(Date.now());
  const submittedRef = useRef(false);

  // Track mock start once
  useEffect(() => {
    track.mockStarted(exam.id);
  }, [exam.id]);

  // Per-question time accounting
  useEffect(() => {
    setStates((prev) => {
      const next = [...prev];
      const now = Date.now();
      // Stop the clock on outgoing question (if we were on one)
      // and start it on the new one.
      next[index] = { ...next[index], startedAtMs: now };
      return next;
    });
    // On unmount of this index (i.e. when index changes), accumulate timeMs.
    return () => {
      setStates((prev) => {
        const next = [...prev];
        const s = next[index];
        if (s.startedAtMs) {
          next[index] = {
            ...s,
            timeMs: s.timeMs + (Date.now() - s.startedAtMs),
            startedAtMs: 0,
          };
        }
        return next;
      });
    };
  }, [index]);

  // Countdown timer
  useEffect(() => {
    if (submitted) return;
    const tick = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(tick);
          // Auto-submit at 0
          if (!submittedRef.current) {
            submittedRef.current = true;
            setAutoSubmitted(true);
            setTimeout(() => handleSubmit(true), 0);
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const currentQ = questions[index];
  const currentState = states[index];
  const answeredCount = states.filter((s) => s.selected !== null).length;
  const flaggedCount = states.filter((s) => s.flagged).length;
  const progressPct = ((index + 1) / questions.length) * 100;

  const handleSelect = (i: number) => {
    if (submitted) return;
    setStates((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], selected: i };
      return next;
    });
  };

  const handleFlag = () => {
    setStates((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], flagged: !next[index].flagged };
      return next;
    });
  };

  const handleNav = (delta: number) => {
    setIndex((i) => Math.max(0, Math.min(questions.length - 1, i + delta)));
  };

  const handleJumpTo = (i: number) => setIndex(i);

  const handleSubmit = (auto = false) => {
    if (submittedRef.current && !auto) return;
    submittedRef.current = true;

    // Finalize timeMs on currently-displayed question
    const finalStates = states.map((s, i) => {
      if (i === index && s.startedAtMs) {
        return {
          ...s,
          timeMs: s.timeMs + (Date.now() - s.startedAtMs),
          startedAtMs: 0,
        };
      }
      return s;
    });

    const answers: AnswerRecord[] = finalStates.map((s, i) => {
      const q = questions[i];
      const selectedIndex = s.selected ?? -1;
      return {
        questionId: q.id,
        topicId: q.topicId,
        selectedIndex,
        correct: selectedIndex === q.correctIndex,
        timeMs: s.timeMs || 0,
      };
    });

    const correctCount = answers.filter((a) => a.correct).length;
    const scorePct = answers.length
      ? Math.round((correctCount / answers.length) * 100)
      : 0;
    const passed = scorePct >= exam.passScore;
    const elapsedSec = Math.round((Date.now() - startedAtRef.current) / 1000);
    const flaggedQuestionIds = finalStates
      .map((s, i) => (s.flagged ? questions[i].id : null))
      .filter(Boolean) as string[];

    recordAttempt("mock", answers, undefined, {
      examId: exam.id,
      durationSec,
      elapsedSec,
      questionCount: questions.length,
      passScore: exam.passScore,
      passed,
      flaggedQuestionIds,
      autoSubmittedOnTimeout: auto,
    });

    track.mockCompleted(exam.id, {
      questionCount: questions.length,
      correctCount,
      durationSec: elapsedSec,
      passed,
    });

    // Fire badge evaluation — Mock Champion / Speed Demon / Game Day Rehearsal
    // can all hit on this attempt. Pass `recent` so badges that depend on the
    // just-finished mock fire even before store.attempts re-reads.
    try {
      const store = useApp.getState();
      const newly = evaluateAll({
        profile: store.profile,
        attempts: store.attempts,
        recent: {
          mockPassed: passed,
          mockTimeRatio: durationSec > 0 ? elapsedSec / durationSec : 1,
        },
      });
      if (newly.length > 0) fireBadgeUnlocks(newly);
    } catch {
      /* ignore — badges are non-blocking */
    }

    setSubmitted(true);
    setSubmittedScore(scorePct);
    onComplete?.(passed, scorePct);
  };

  // Format mm:ss
  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  const timeStr = `${mm}:${ss.toString().padStart(2, "0")}`;
  const timeWarn = secondsLeft < 300; // <5 min
  const timeCrit = secondsLeft < 60;

  // Debrief view
  if (submitted && submittedScore !== null) {
    const passed = submittedScore >= exam.passScore;
    const correctCount = states.filter(
      (s, i) => s.selected !== null && s.selected === questions[i].correctIndex
    ).length;
    const elapsedSec = Math.round((Date.now() - startedAtRef.current) / 1000);
    const elapsedMm = Math.floor(elapsedSec / 60);
    const elapsedSs = elapsedSec % 60;

    // Topic breakdown
    const byTopic: Record<string, { correct: number; total: number }> = {};
    states.forEach((s, i) => {
      const q = questions[i];
      byTopic[q.topicId] ||= { correct: 0, total: 0 };
      byTopic[q.topicId].total += 1;
      if (s.selected === q.correctIndex) byTopic[q.topicId].correct += 1;
    });

    const weakestTopics = Object.entries(byTopic)
      .map(([tid, v]) => ({
        tid,
        pct: Math.round((v.correct / v.total) * 100),
        ...v,
      }))
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 3);

    return (
      <div className="space-y-5 animate-fade-in">
        {/* Pass/Fail hero */}
        <div
          className={cn(
            "rounded-2xl p-8 text-center text-white relative overflow-hidden",
            passed
              ? "bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700"
              : "bg-gradient-to-br from-rose-700 via-rose-600 to-amber-700"
          )}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 chip bg-white/20 border-white/30 text-white backdrop-blur mb-4">
              {passed ? <Trophy className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
              {passed ? "Mock exam passed" : "Mock exam — needs work"}
            </div>
            <div className="text-7xl font-semibold tracking-tight tabular-nums">
              {submittedScore}
              <span className="text-3xl text-white/70">%</span>
            </div>
            <div className="text-sm text-white/80 mt-2">
              {correctCount} of {questions.length} correct ·
              {" "}
              <span className={passed ? "" : "font-semibold"}>
                Pass = {exam.passScore}%
              </span>
            </div>
            <div className="text-xs text-white/70 mt-3">
              Time: {elapsedMm}m {elapsedSs}s of {Math.floor(durationSec / 60)}m
              {autoSubmitted && " · auto-submitted on timeout"}
            </div>
          </div>
        </div>

        {/* Topic breakdown */}
        <div className="card-surface p-5">
          <div className="text-sm font-medium mb-3 flex items-center gap-2">
            <Flag className="h-4 w-4 text-brand-600" />
            Score by topic
          </div>
          <div className="space-y-3">
            {Object.entries(byTopic).map(([tid, v]) => {
              const pct = Math.round((v.correct / v.total) * 100);
              const tone = pct >= 80 ? "emerald" : pct >= exam.passScore ? "brand" : pct >= 50 ? "amber" : "rose";
              return (
                <div key={tid}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium truncate pr-2">
                      {TOPIC_MAP[tid]?.name ?? tid}
                    </span>
                    <span className="text-muted-foreground tabular-nums shrink-0">
                      {v.correct}/{v.total} · {pct}%
                    </span>
                  </div>
                  <ProgressBar value={pct} tone={tone as any} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Next steps */}
        {!passed && weakestTopics.length > 0 && (
          <div className="card-surface p-5 border-amber-200 dark:border-amber-500/30 bg-amber-50/40 dark:bg-amber-500/10">
            <div className="text-sm font-medium mb-2 flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              What to study before retrying
            </div>
            <ul className="space-y-2 text-sm">
              {weakestTopics.map((t) => (
                <li key={t.tid} className="flex items-start gap-2">
                  <span className="text-amber-700 dark:text-amber-300 font-semibold tabular-nums shrink-0">
                    {t.pct}%
                  </span>
                  <span className="text-foreground">
                    {TOPIC_MAP[t.tid]?.name ?? t.tid}
                    <Link
                      href={`/practice?topic=${t.tid}&mode=topic`}
                      className="ml-2 text-brand-700 dark:text-brand-300 hover:underline text-xs"
                    >
                      Drill this →
                    </Link>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Review answers (collapsible) */}
        <details className="card-surface p-5 group">
          <summary className="text-sm font-medium cursor-pointer flex items-center justify-between">
            <span>Review all {questions.length} answers</span>
            <span className="text-xs text-muted-foreground group-open:hidden">
              Click to expand
            </span>
          </summary>
          <div className="mt-4 space-y-4">
            {states.map((s, i) => {
              const q = questions[i];
              const selected = s.selected;
              const correct = selected === q.correctIndex;
              const skipped = selected === null;
              return (
                <div
                  key={q.id}
                  className="border-t border-border pt-4 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-start gap-2 mb-2">
                    {skipped ? (
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    ) : correct ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                    )}
                    <div className="text-sm font-medium">
                      <span className="text-muted-foreground mr-2 tabular-nums">Q{i + 1}.</span>
                      {q.prompt}
                    </div>
                  </div>
                  {skipped && (
                    <div className="text-xs text-amber-700 dark:text-amber-300 ml-6 mb-1 italic">
                      You didn't answer this question.
                    </div>
                  )}
                  {!correct && (
                    <div className="text-xs text-muted-foreground ml-6 mb-1">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">Correct:</span>{" "}
                      {q.choices[q.correctIndex]}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground ml-6">{q.explanation}</div>
                </div>
              );
            })}
          </div>
        </details>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => router.push("/dashboard")}
          >
            Back to dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => router.push("/practice")}
          >
            Drill weak topics
          </Button>
        </div>
      </div>
    );
  }

  // Active exam runner
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Sticky timer + progress bar */}
      <div className="sticky top-16 z-30 bg-background/85 backdrop-blur border-b border-border -mx-4 sm:-mx-0 px-4 sm:px-0 py-3">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            {exam.name} · Mock Exam
          </div>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 chip tabular-nums font-semibold",
              timeCrit
                ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 animate-pulse"
                : timeWarn
                  ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300"
                  : "bg-slate-50 dark:bg-muted border-border text-foreground"
            )}
            aria-live={timeCrit ? "assertive" : "off"}
          >
            <Clock className="h-3.5 w-3.5" />
            {timeStr}
          </div>
        </div>
        <ProgressBar value={progressPct} />
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>
            Q{index + 1} <span className="text-muted-foreground/60">/ {questions.length}</span>
          </span>
          <span>
            {answeredCount} answered · {flaggedCount} flagged
          </span>
        </div>
      </div>

      {/* Question card */}
      <div className="card-surface p-6 sm:p-8 animate-slide-up">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="chip bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border-brand-100 dark:border-brand-500/30">
            {TOPIC_MAP[currentQ.topicId]?.shortName ?? currentQ.topicId}
          </span>
          <button
            onClick={handleFlag}
            className={cn(
              "chip transition-colors",
              currentState.flagged
                ? "bg-amber-100 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300"
                : "bg-slate-50 dark:bg-muted border-border text-muted-foreground hover:bg-amber-50 dark:bg-amber-500/10 hover:text-amber-700 dark:text-amber-300"
            )}
            aria-pressed={currentState.flagged}
          >
            <Flag className="h-3 w-3" />
            {currentState.flagged ? "Flagged" : "Flag for review"}
          </button>
        </div>
        <h2 className="text-[17px] sm:text-lg font-semibold leading-snug text-balance">
          {currentQ.prompt}
        </h2>

        <div className="mt-5 space-y-2.5">
          {currentQ.choices.map((choice, i) => {
            const isSelected = currentState.selected === i;
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={cn(
                  "w-full text-left rounded-xl border px-4 py-3.5 text-[14.5px] transition-all flex items-start gap-3",
                  isSelected
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/15 ring-2 ring-brand-200"
                    : "hover:border-brand-300 hover:bg-brand-50 dark:bg-brand-500/15/40"
                )}
              >
                <span
                  className={cn(
                    "h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold tabular-nums",
                    isSelected
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-border text-muted-foreground"
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="leading-relaxed">{choice}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav controls */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleNav(-1)}
          disabled={index === 0}
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        {index < questions.length - 1 ? (
          <Button variant="primary" size="lg" onClick={() => handleNav(1)}>
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              if (
                confirm(
                  `Submit exam? You answered ${answeredCount} of ${questions.length}.${
                    answeredCount < questions.length
                      ? " Skipped questions count as wrong."
                      : ""
                  }`
                )
              ) {
                handleSubmit(false);
              }
            }}
          >
            Submit exam
            <Trophy className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Question navigator strip */}
      <div className="card-surface p-4">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2.5">
          Jump to question
        </div>
        <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5">
          {questions.map((_, i) => {
            const s = states[i];
            const isCurrent = i === index;
            const isAnswered = s.selected !== null;
            const isFlagged = s.flagged;
            return (
              <button
                key={i}
                onClick={() => handleJumpTo(i)}
                className={cn(
                  "h-8 w-full rounded-md text-[11px] font-semibold tabular-nums border transition-all relative",
                  isCurrent
                    ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                    : isAnswered
                      ? "border-brand-200 dark:border-brand-500/40 bg-brand-50 dark:bg-brand-500/15 text-brand-800 dark:text-brand-300 hover:bg-brand-100 dark:bg-brand-500/20"
                      : "border-border bg-slate-50 dark:bg-muted text-muted-foreground hover:bg-slate-100"
                )}
                aria-label={`Question ${i + 1}${isAnswered ? ", answered" : ", unanswered"}${isFlagged ? ", flagged" : ""}`}
              >
                {i + 1}
                {isFlagged && (
                  <Flag className="h-2 w-2 absolute -top-0.5 -right-0.5 text-amber-600 fill-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit early shortcut */}
      <div className="text-center">
        <button
          onClick={() => {
            if (
              confirm(
                `Submit exam early? You answered ${answeredCount} of ${questions.length}.`
              )
            ) {
              handleSubmit(false);
            }
          }}
          className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
        >
          Submit early
        </button>
      </div>
    </div>
  );
}
