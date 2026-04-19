"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { HydrationGate } from "@/components/hydration-gate";
import { AppShell } from "@/components/container";
import { QuestionRunner } from "@/components/question-runner";
import { Button } from "@/components/ui/button";
import {
  QUESTION_MAP,
  getQuestionsByTopic,
  getQuestionsForExam,
  sampleQuestions,
} from "@/lib/data/questions";
import { TOPIC_MAP, getTopicsForExam } from "@/lib/data/topics";
import { useApp } from "@/lib/store";
import {
  AlertTriangle,
  Dumbbell,
  ListChecks,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PracticePage() {
  return (
    <HydrationGate>
      <Suspense>
        <Inner />
      </Suspense>
    </HydrationGate>
  );
}

type Mode = "topic" | "mixed" | "incorrect-only";

function Inner() {
  const params = useSearchParams();
  const router = useRouter();
  const { attempts, profile } = useApp();
  const examId = profile?.examId ?? "az-900";
  const examQuestions = getQuestionsForExam(examId);
  const examTopics = getTopicsForExam(examId);
  const initialTopic = params.get("topic") || "";
  const initialMode: Mode =
    (params.get("mode") as Mode) || (initialTopic ? "topic" : "mixed");

  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [topicId, setTopicId] = useState(initialTopic);
  const [questionCount, setQuestionCount] = useState(8);

  const incorrectIds = useMemo(() => {
    const ids = new Set<string>();
    for (const a of attempts) {
      for (const ans of a.answers) {
        if (!ans.correct) ids.add(ans.questionId);
      }
    }
    return Array.from(ids);
  }, [attempts]);

  const selectedQuestions = useMemo(() => {
    if (mode === "topic" && topicId) {
      const pool = getQuestionsByTopic(topicId);
      return sampleQuestions(
        pool.map((q) => q.id),
        Math.min(questionCount, pool.length)
      );
    }
    if (mode === "incorrect-only") {
      if (!incorrectIds.length) return [];
      return incorrectIds
        .map((id) => QUESTION_MAP[id])
        .filter(Boolean)
        .slice(0, Math.min(questionCount, incorrectIds.length));
    }
    return sampleQuestions(
      examQuestions.map((q) => q.id),
      Math.min(questionCount, examQuestions.length)
    );
  }, [mode, topicId, questionCount, incorrectIds, examQuestions]);

  if (started) {
    return (
      <>
        <AppNav />
        <AppShell className="max-w-2xl">
          <QuestionRunner
            questions={selectedQuestions}
            kind={mode}
            topicId={mode === "topic" ? topicId : undefined}
            title={
              mode === "topic"
                ? TOPIC_MAP[topicId]?.name || "Topic drill"
                : mode === "incorrect-only"
                  ? "Review drill"
                  : "Mixed drill"
            }
            subtitle={
              mode === "topic"
                ? "Topic-focused practice"
                : mode === "incorrect-only"
                  ? "Questions you've previously missed"
                  : "All topics, mixed difficulty"
            }
          />
        </AppShell>
      </>
    );
  }

  return (
    <>
      <AppNav />
      <AppShell className="max-w-3xl">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Practice
          </div>
          <h1 className="heading-2 mt-1">Pick your drill</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Choose a mode. Every answer feeds your readiness score and adapts
            the plan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <ModeCard
            icon={Shuffle}
            title="Mixed drill"
            body="Questions pulled across all 5 domains."
            selected={mode === "mixed"}
            onClick={() => setMode("mixed")}
          />
          <ModeCard
            icon={Dumbbell}
            title="Topic drill"
            body="Deep-dive on a single weak topic."
            selected={mode === "topic"}
            onClick={() => setMode("topic")}
          />
          <ModeCard
            icon={RotateCcw}
            title="Review incorrect"
            body="Re-face only the questions you've missed."
            selected={mode === "incorrect-only"}
            onClick={() => setMode("incorrect-only")}
            disabled={!incorrectIds.length}
            disabledText={
              !incorrectIds.length ? "No misses yet — answer some questions first." : undefined
            }
          />
        </div>

        {mode === "topic" && (
          <div className="card-surface p-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="h-4 w-4 text-brand-600" />
              <div className="font-semibold text-sm">Choose a topic</div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {examTopics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTopicId(t.id)}
                  className={cn(
                    "text-left rounded-xl border p-4 transition-all",
                    topicId === t.id
                      ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200"
                      : "border-border bg-white hover:border-brand-200"
                  )}
                >
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {getQuestionsByTopic(t.id).length} questions · weight{" "}
                    {Math.round(t.weight * 100)}%
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="card-surface p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-sm">Question count</div>
            <div className="text-sm font-semibold tabular-nums">
              {questionCount}
            </div>
          </div>
          <input
            type="range"
            min={5}
            max={20}
            step={1}
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
          </div>
        </div>

        <Button
          variant="primary"
          size="xl"
          className="w-full"
          disabled={
            (mode === "topic" && !topicId) ||
            (mode === "incorrect-only" && !incorrectIds.length) ||
            !selectedQuestions.length
          }
          onClick={() => setStarted(true)}
        >
          Start drill · {selectedQuestions.length} questions
        </Button>

        {!incorrectIds.length && (
          <div className="mt-6 card-surface p-5 flex items-start gap-3 border-brand-100">
            <div className="h-9 w-9 rounded-xl bg-brand-50 text-brand-700 border border-brand-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-medium">
                No review drill yet
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Complete a mixed or topic drill first. Every question you miss
                gets added to your review pile automatically.
              </div>
              <Link
                href="/diagnostic"
                className="text-sm text-brand-700 hover:text-brand-800 font-medium inline-block mt-2"
              >
                Or take the diagnostic →
              </Link>
            </div>
          </div>
        )}
      </AppShell>
    </>
  );
}

function ModeCard({
  icon: Icon,
  title,
  body,
  selected,
  onClick,
  disabled,
  disabledText,
}: {
  icon: typeof Shuffle;
  title: string;
  body: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  disabledText?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "text-left rounded-2xl border p-5 transition-all h-full",
        selected
          ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200 shadow-soft"
          : "border-border bg-white hover:border-brand-200 hover:shadow-soft",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div
        className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center mb-3",
          selected
            ? "bg-brand-600 text-white"
            : "bg-brand-50 text-brand-700 border border-brand-100"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="font-semibold text-[15px]">{title}</div>
      <div className="text-sm text-muted-foreground mt-1 leading-relaxed">
        {disabled && disabledText ? disabledText : body}
      </div>
    </button>
  );
}
