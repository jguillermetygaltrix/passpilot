"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { explainWrongAnswer, isAIAvailable } from "@/lib/ai";
import type { ExamId } from "@/lib/types";
import { getExamMeta } from "@/lib/data/exams";
import { track } from "@/lib/usage";

interface Props {
  examId: ExamId;
  topicName: string;
  question: string;
  choices: string[];
  correctIndex: number;
  userSelectedIndex: number;
  officialExplanation: string;
}

/**
 * AI-powered "Why was this wrong?" button.
 *
 * Appears after the user gets a question wrong in practice/diagnostic.
 * First click: Gemini generates personalized explanation in plain language.
 * Falls back silently to the official explanation if AI is unavailable.
 */
export function WhyWrongExplainer(props: Props) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [explanation, setExplanation] = useState<string | null>(null);

  if (!isAIAvailable()) return null;

  const handleClick = async () => {
    if (state !== "idle") return;
    setState("loading");
    // Track AI explanation request — costs us Gemini tokens, part of refund policy
    track.aiExplanationRequested(props.question.slice(0, 60), props.examId);
    try {
      const examMeta = getExamMeta(props.examId);
      const text = await explainWrongAnswer({
        examName: examMeta?.name ?? props.examId,
        topicName: props.topicName,
        question: props.question,
        choices: props.choices,
        correctIndex: props.correctIndex,
        userSelectedIndex: props.userSelectedIndex,
        officialExplanation: props.officialExplanation,
      });
      setExplanation(text);
      setState("done");
    } catch {
      setExplanation(props.officialExplanation);
      setState("done");
    }
  };

  if (state === "done" && explanation) {
    return (
      <div className="mt-4 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
            PassPilot AI
          </span>
        </div>
        <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
          {explanation}
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "loading"}
      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {state === "loading" ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Thinking...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          Why was this wrong? (AI)
        </>
      )}
    </button>
  );
}
