"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnswerRecord, Question } from "@/lib/types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./ui/progress";
import { useApp } from "@/lib/store";
import { CheckCircle2, XCircle, ArrowRight, Flag } from "lucide-react";
import { TOPIC_MAP } from "@/lib/data/topics";
import { WhyWrongExplainer } from "./why-wrong-explainer";
import { track } from "@/lib/usage";
import { recordWrongAnswer, gradeCard, getCard } from "@/lib/sr";

interface Props {
  questions: Question[];
  kind: "diagnostic" | "topic" | "mixed" | "incorrect-only" | "rescue" | "sr-review";
  topicId?: string;
  title?: string;
  subtitle?: string;
  onFinish?: (attemptId: string, score: number) => void;
  completeHref?: string;
}

export function QuestionRunner({
  questions,
  kind,
  topicId,
  title = "Practice",
  subtitle,
  onFinish,
  completeHref,
}: Props) {
  const router = useRouter();
  const recordAttempt = useApp((s) => s.recordAttempt);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [completedAttemptId, setCompletedAttemptId] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const { profile } = useApp();
  const examId = profile?.examId;

  // Track drill start on mount (once)
  useEffect(() => {
    track.drillStarted(examId, kind);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setStartedAt(Date.now());
    setSelected(null);
    setRevealed(false);
    // Track question VIEW when new question renders
    if (questions[index]?.id) {
      track.questionViewed(questions[index].id, examId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const q = questions[index];
  const progress = ((index + (revealed ? 1 : 0)) / questions.length) * 100;
  const done = completedAttemptId !== null;

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = selected === q.correctIndex;
    const record: AnswerRecord = {
      questionId: q.id,
      topicId: q.topicId,
      selectedIndex: selected,
      correct,
      timeMs: Date.now() - startedAt,
    };
    // Track answer submission (usage tracking)
    track.questionAnswered(q.id, correct, examId);

    // Spaced Repetition wiring:
    //   - SR review session: grade the existing card (right → graduate, wrong → demote)
    //   - Any other session: a wrong answer creates/refreshes an SR card. A right
    //     answer on a card that already exists grades it (treat the regular drill
    //     as an implicit review).
    if (kind === "sr-review") {
      gradeCard(q.id, correct);
    } else {
      const existing = getCard(q.id);
      if (existing) {
        gradeCard(q.id, correct);
      } else if (!correct && examId) {
        recordWrongAnswer({
          questionId: q.id,
          topicId: q.topicId,
          examId,
          attemptId: `inline-${Date.now()}`,
        });
      }
    }

    setAnswers((a) => [...a, record]);
    setRevealed(true);
  };

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      const finalAnswers = answers;
      const attempt = recordAttempt(kind, finalAnswers, topicId);
      setCompletedAttemptId(attempt.id);
      setFinalScore(attempt.scorePct);
      // Track drill completion (usage tracking)
      const minutes = Math.round(
        finalAnswers.reduce((s, a) => s + a.timeMs, 0) / 60000
      );
      const correctCount = finalAnswers.filter((a) => a.correct).length;
      track.drillCompleted(examId || "unknown", {
        questionCount: finalAnswers.length,
        correctCount,
        minutes,
        kind,
      });
      if (kind === "diagnostic") {
        track.diagnosticCompleted(examId);
      }
      onFinish?.(attempt.id, attempt.scorePct);
    }
  };

  const summary = useMemo(() => {
    if (!done) return null;
    const correct = answers.filter((a) => a.correct).length;
    const byTopic: Record<string, { correct: number; total: number }> = {};
    answers.forEach((a) => {
      byTopic[a.topicId] ||= { correct: 0, total: 0 };
      byTopic[a.topicId].total += 1;
      if (a.correct) byTopic[a.topicId].correct += 1;
    });
    return { correct, total: answers.length, byTopic };
  }, [done, answers]);

  if (!questions.length) {
    return (
      <div className="card-surface p-8 text-center">
        <p className="text-muted-foreground">No questions available.</p>
      </div>
    );
  }

  if (done && summary && finalScore !== null) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="card-surface p-8 text-center">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Session complete
          </div>
          <div className="text-6xl font-semibold tracking-tight mt-3 tabular-nums">
            {finalScore}%
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {summary.correct} of {summary.total} correct
          </div>
        </div>

        <div className="card-surface p-5">
          <div className="text-sm font-medium mb-3">Breakdown by topic</div>
          <div className="space-y-3">
            {Object.entries(summary.byTopic).map(([tid, v]) => {
              const pct = Math.round((v.correct / v.total) * 100);
              const tone =
                pct >= 80
                  ? "emerald"
                  : pct >= 65
                    ? "brand"
                    : pct >= 50
                      ? "amber"
                      : "rose";
              return (
                <div key={tid}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium">
                      {TOPIC_MAP[tid]?.name ?? tid}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {v.correct}/{v.total} · {pct}%
                    </span>
                  </div>
                  <ProgressBar value={pct} tone={tone as any} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-surface p-5">
          <div className="text-sm font-medium mb-3">Review your answers</div>
          <div className="space-y-4">
            {answers.map((a, i) => {
              const question = questions[i];
              return (
                <div
                  key={question.id}
                  className="border-t border-border pt-4 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-start gap-2 mb-2">
                    {a.correct ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                    )}
                    <div className="text-sm font-medium">{question.prompt}</div>
                  </div>
                  {!a.correct && (
                    <div className="text-xs text-muted-foreground ml-6 mb-1">
                      Correct: {question.choices[question.correctIndex]}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground ml-6">
                    {question.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => {
              if (completeHref) router.push(completeHref);
              else router.push("/dashboard");
            }}
          >
            {completeHref ? "See my results" : "Back to dashboard"}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => router.push("/practice")}
          >
            More practice
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {title}
          </div>
          <div className="text-sm font-medium truncate">{subtitle}</div>
        </div>
        <div className="text-sm text-muted-foreground tabular-nums shrink-0">
          Q{index + 1} <span className="text-muted-foreground/60">/ {questions.length}</span>
        </div>
      </div>

      <ProgressBar value={progress} />

      <div className="card-surface p-6 sm:p-8 animate-slide-up">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="chip bg-brand-50 text-brand-700 border-brand-100">
            {TOPIC_MAP[q.topicId]?.shortName ?? q.topicId}
          </span>
          <span className="chip bg-slate-50 text-slate-700 border-slate-200 capitalize">
            {q.difficulty}
          </span>
        </div>
        <h2 className="text-[17px] sm:text-lg font-semibold leading-snug text-balance">
          {q.prompt}
        </h2>

        <div className="mt-5 space-y-2.5">
          {q.choices.map((choice, i) => {
            const isSelected = selected === i;
            const isCorrect = i === q.correctIndex;
            const showState = revealed;
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                className={cn(
                  "w-full text-left rounded-xl border px-4 py-3.5 text-[14.5px] transition-all flex items-start gap-3",
                  !revealed && "hover:border-brand-300 hover:bg-brand-50/40",
                  !revealed && isSelected &&
                    "border-brand-500 bg-brand-50 ring-2 ring-brand-200",
                  !revealed && !isSelected && "border-border bg-white",
                  showState && isCorrect && "border-emerald-400 bg-emerald-50",
                  showState && isSelected && !isCorrect &&
                    "border-rose-400 bg-rose-50",
                  showState && !isCorrect && !isSelected &&
                    "border-border bg-white opacity-60"
                )}
              >
                <span
                  className={cn(
                    "h-6 w-6 rounded-full border flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5",
                    !revealed && isSelected &&
                      "border-brand-500 bg-brand-500 text-white",
                    !revealed && !isSelected && "border-border bg-white text-muted-foreground",
                    showState && isCorrect && "border-emerald-500 bg-emerald-500 text-white",
                    showState && isSelected && !isCorrect &&
                      "border-rose-500 bg-rose-500 text-white"
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{choice}</span>
                {showState && isCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                )}
                {showState && isSelected && !isCorrect && (
                  <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div
            className={cn(
              "mt-5 rounded-xl border p-4 animate-fade-in text-sm",
              selected === q.correctIndex
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-amber-200 bg-amber-50/60"
            )}
          >
            <div className="font-medium mb-1 flex items-center gap-2">
              <Flag className="h-4 w-4" />
              {selected === q.correctIndex ? "Nice — that's correct." : "Not quite."}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {q.explanation}
            </p>
            {selected !== null && selected !== q.correctIndex && (
              <WhyWrongExplainer
                examId={q.examId}
                topicName={TOPIC_MAP[q.topicId]?.name ?? q.topicId}
                question={q.prompt}
                choices={q.choices}
                correctIndex={q.correctIndex}
                userSelectedIndex={selected}
                officialExplanation={q.explanation}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {!revealed ? (
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={selected === null}
            onClick={handleSubmit}
          >
            Submit answer
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleNext}
          >
            {index === questions.length - 1 ? "Finish" : "Next question"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
