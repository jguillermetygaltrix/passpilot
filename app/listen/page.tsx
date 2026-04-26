"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import { HydrationGate } from "@/components/hydration-gate";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import {
  getCapability,
  speak,
  stopSpeaking,
  listenOnce,
  transcriptToChoiceIndex,
  ttsClean,
} from "@/lib/voice";
import { getDueCards, gradeCard } from "@/lib/sr";
import { recordWrongAnswer } from "@/lib/sr";
import { QUESTION_MAP, getQuestionsForExam, sampleQuestions } from "@/lib/data/questions";
import { TOPIC_MAP } from "@/lib/data/topics";
import { track } from "@/lib/usage";
import {
  Mic,
  MicOff,
  Headphones,
  Pause,
  Play,
  SkipForward,
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "due" | "shuffle";
type Source = "sr" | "drill";

export default function ListenPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const params = useSearchParams();
  const { profile } = useApp();
  const cap = useMemo(() => getCapability(), []);
  const [started, setStarted] = useState(false);
  const [handsFree, setHandsFree] = useState<boolean>(cap.sttAvailable);
  const [rate, setRate] = useState(1.0);
  const [source, setSource] = useState<Source>("sr");

  if (!profile) return null;

  // Build the question pool
  const dueCards = useMemo(
    () => getDueCards(profile.examId),
    [profile.examId, started]
  );
  const drillPool = useMemo(
    () => sampleQuestions(
      getQuestionsForExam(profile.examId).map((q) => q.id),
      12,
      Date.now()
    ),
    [profile.examId, started]
  );

  const dueQuestions = useMemo(
    () => dueCards.map((c) => QUESTION_MAP[c.questionId]).filter(Boolean),
    [dueCards]
  );

  const sessionQuestions = source === "sr" ? dueQuestions : drillPool;

  if (!cap.ttsAvailable) {
    return (
      <>
        <AppNav />
        <AppShell>
          <div className="max-w-xl mx-auto card-surface p-8 text-center">
            <AlertTriangle className="h-8 w-8 text-amber-600 mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-2">Voice mode not supported here</h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Your browser doesn't expose the Speech Synthesis API. Try Chrome,
              Edge, Safari, or the PassPilot Android app once it ships.
            </p>
            <Link href="/practice">
              <Button variant="primary">Use regular practice</Button>
            </Link>
          </div>
        </AppShell>
      </>
    );
  }

  if (started && sessionQuestions.length > 0) {
    return (
      <>
        <AppNav />
        <AppShell>
          <ListenRunner
            questions={sessionQuestions}
            source={source}
            handsFree={handsFree && cap.sttAvailable}
            rate={rate}
            examId={profile.examId}
            onExit={() => setStarted(false)}
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
            <div className="chip bg-cyan-50 border-cyan-100 text-cyan-700 mx-auto">
              <Headphones className="h-3 w-3" />
              Commute Mode
            </div>
            <h1 className="heading-2 text-balance">
              Study with your eyes closed.
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              We read each question, you answer with your voice. Perfect for
              the commute, the gym, doing dishes — anywhere your hands are busy.
            </p>
          </div>

          {/* Source picker */}
          <div className="card-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              Session source
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSource("sr")}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all",
                  source === "sr"
                    ? "border-violet-500 bg-violet-50/60 ring-2 ring-violet-200"
                    : "border-border hover:border-violet-200 hover:bg-violet-50/30"
                )}
              >
                <div className="text-sm font-semibold mb-1 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                  Review queue
                </div>
                <div className="text-xs text-muted-foreground">
                  {dueCards.length} card{dueCards.length === 1 ? "" : "s"} due now
                </div>
              </button>
              <button
                onClick={() => setSource("drill")}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all",
                  source === "drill"
                    ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-200"
                    : "border-border hover:border-brand-200 hover:bg-brand-50/30"
                )}
              >
                <div className="text-sm font-semibold mb-1 flex items-center gap-2">
                  <Volume2 className="h-3.5 w-3.5 text-brand-600" />
                  Mixed drill
                </div>
                <div className="text-xs text-muted-foreground">12 questions across all topics</div>
              </button>
            </div>
            {source === "sr" && dueQuestions.length === 0 && (
              <div className="mt-3 text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-700 mt-0.5 shrink-0" />
                <span>
                  No cards due right now. Pick "Mixed drill" or come back after
                  a practice session.
                </span>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="card-surface p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium flex items-center gap-2">
                  {handsFree ? (
                    <Mic className="h-4 w-4 text-cyan-600" />
                  ) : (
                    <MicOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  Hands-free mode
                </div>
                <button
                  onClick={() => setHandsFree((h) => !h)}
                  disabled={!cap.sttAvailable}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    handsFree && cap.sttAvailable
                      ? "bg-cyan-600"
                      : "bg-slate-300"
                  )}
                  aria-label="Toggle hands-free"
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow",
                      handsFree && cap.sttAvailable ? "translate-x-5" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {!cap.sttAvailable
                  ? "Microphone capture isn't available in this browser. Use the on-screen buttons to answer."
                  : handsFree
                    ? "Say the letter (A, B, C, or D). Works headphone-only."
                    : "Tap the answer on screen. Audio plays through your headphones."}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Speech rate</div>
                <div className="text-xs text-muted-foreground tabular-nums">
                  {rate.toFixed(2)}x
                </div>
              </div>
              <input
                type="range"
                min={0.7}
                max={1.5}
                step={0.05}
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-600"
              />
              <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-1">
                <span>Slower</span>
                <span>Normal</span>
                <span>Faster</span>
              </div>
            </div>
          </div>

          {/* Start CTA */}
          <Button
            variant="primary"
            size="xl"
            className="w-full group"
            disabled={sessionQuestions.length === 0}
            onClick={() => {
              track.drillStarted(profile.examId, source === "sr" ? "sr-listen" : "listen");
              setStarted(true);
            }}
          >
            <Play className="h-4 w-4" />
            Start listening · {sessionQuestions.length} question
            {sessionQuestions.length === 1 ? "" : "s"}
          </Button>

          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            Tip: plug in headphones. Voice mode plays out loud by default.
          </p>
        </div>
      </AppShell>
    </>
  );
}

/* ──────────────────────────────────────────────────────────
 * Listen runner — does the actual voice flow
 * ────────────────────────────────────────────────────────── */

interface ListenRunnerProps {
  questions: ReturnType<typeof getQuestionsForExam>;
  source: Source;
  handsFree: boolean;
  rate: number;
  examId: string;
  onExit: () => void;
}

function ListenRunner({
  questions,
  source,
  handsFree,
  rate,
  examId,
  onExit,
}: ListenRunnerProps) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"narrating" | "listening" | "feedback" | "done">(
    "narrating"
  );
  const [paused, setPaused] = useState(false);
  const [lastSelected, setLastSelected] = useState<number | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [results, setResults] = useState<{ correct: boolean; questionId: string }[]>([]);
  const [micActive, setMicActive] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  const q = questions[index];
  const totalQ = questions.length;

  // Run the narration → listen → feedback cycle for the current question
  useEffect(() => {
    if (paused || phase === "done") return;
    let mounted = true;
    cancelledRef.current = false;

    (async () => {
      try {
        // 1. Narrate question + choices
        setPhase("narrating");
        setLastSelected(null);
        setLastCorrect(null);
        setTranscript(null);

        const intro = `Question ${index + 1} of ${totalQ}.`;
        const promptText = ttsClean(q.prompt);
        const choicesText = q.choices
          .map((c, i) => `${String.fromCharCode(65 + i)}. ${ttsClean(c)}`)
          .join(". ");

        await speak(`${intro} ${promptText}. Your choices: ${choicesText}.`, {
          rate,
        });
        if (!mounted || cancelledRef.current) return;

        // 2. Capture answer
        if (handsFree) {
          await speak("Say A, B, C, or D.", { rate });
          if (!mounted || cancelledRef.current) return;
          setPhase("listening");
          setMicActive(true);
          let chosen = -1;
          try {
            const said = await listenOnce({ timeoutMs: 8000 });
            setTranscript(said);
            chosen = transcriptToChoiceIndex(said, q.choices.length);
          } catch {
            chosen = -1;
          }
          setMicActive(false);
          if (!mounted || cancelledRef.current) return;
          if (chosen === -1) {
            await speak("I didn't catch that. Skipping for now.", { rate });
            await advance(false, -1);
            return;
          }
          await scoreAndAnnounce(chosen);
        } else {
          // Tap-to-answer mode — wait for user click; effect waits via state
          setPhase("listening");
        }
      } catch {
        // speech cancelled or errored — soft-stop
      }
    })();

    return () => {
      mounted = false;
      cancelledRef.current = true;
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, handsFree, rate]);

  async function scoreAndAnnounce(chosen: number) {
    const correct = chosen === q.correctIndex;
    setLastSelected(chosen);
    setLastCorrect(correct);
    setPhase("feedback");

    // Update SR state — this question was just reviewed
    if (source === "sr") {
      gradeCard(q.id, correct);
    } else if (!correct) {
      recordWrongAnswer({
        questionId: q.id,
        topicId: q.topicId,
        examId,
        attemptId: `voice-${Date.now()}`,
      });
    } else {
      // Mixed drill, correct answer — if there's an existing card, grade it
      gradeCard(q.id, correct);
    }

    track.questionAnswered(q.id, correct, examId);

    const verdict = correct
      ? "Correct."
      : `Not quite. The answer is ${String.fromCharCode(65 + q.correctIndex)}.`;
    await speak(`${verdict} ${ttsClean(q.explanation)}`, { rate });
    await advance(correct, chosen);
  }

  async function advance(_correct: boolean, _chosen: number) {
    setResults((r) => [...r, { correct: _correct, questionId: q.id }]);
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setPhase("done");
      stopSpeaking();
      const correctCount = [...results, { correct: _correct, questionId: q.id }].filter(
        (r) => r.correct
      ).length;
      track.drillCompleted(examId, {
        questionCount: questions.length,
        correctCount,
        minutes: 0,
        kind: source === "sr" ? "sr-review-voice" : "voice-drill",
      });
      const score = Math.round((correctCount / questions.length) * 100);
      await speak(
        `Session complete. You got ${correctCount} out of ${questions.length}. That's ${score} percent.`,
        { rate }
      );
    }
  }

  function tapAnswer(i: number) {
    if (phase !== "listening") return;
    if (handsFree) return; // shouldn't fire but guard anyway
    stopSpeaking();
    scoreAndAnnounce(i);
  }

  function skip() {
    stopSpeaking();
    cancelledRef.current = true;
    advance(false, -1);
  }

  function exit() {
    stopSpeaking();
    cancelledRef.current = true;
    onExit();
  }

  if (phase === "done") {
    const correctCount = results.filter((r) => r.correct).length;
    const score = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="space-y-5 max-w-xl mx-auto">
        <div className="card-surface p-8 text-center bg-gradient-to-br from-cyan-50/50 via-white to-brand-50/40">
          <Headphones className="h-8 w-8 text-cyan-600 mx-auto mb-3" />
          <div className="text-6xl font-semibold tabular-nums tracking-tight">
            {score}%
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {correctCount} of {questions.length} correct
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="primary" size="lg" className="flex-1" onClick={exit}>
            Back to listen settings
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header strip */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Commute Mode
        </div>
        <div className="text-xs text-muted-foreground tabular-nums">
          Q{index + 1} / {totalQ}
        </div>
      </div>

      {/* Mic / status orb */}
      <div className="card-surface p-8 text-center relative overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 -z-10 transition-opacity duration-500",
            phase === "narrating"
              ? "bg-gradient-to-br from-cyan-50/60 via-white to-brand-50/40 opacity-100"
              : phase === "listening"
                ? "bg-gradient-to-br from-violet-50/60 via-white to-cyan-50/50 opacity-100"
                : "opacity-50"
          )}
        />

        <div
          className={cn(
            "h-32 w-32 rounded-full mx-auto mb-4 flex items-center justify-center transition-all relative",
            phase === "narrating" &&
              "bg-gradient-to-br from-cyan-400 to-brand-500 shadow-pop animate-pulse",
            phase === "listening" &&
              (handsFree
                ? "bg-gradient-to-br from-violet-400 to-cyan-500 shadow-pop ring-8 ring-violet-200/60 animate-pulse"
                : "bg-gradient-to-br from-violet-300 to-cyan-400 shadow-card"),
            phase === "feedback" &&
              (lastCorrect
                ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-pop"
                : "bg-gradient-to-br from-rose-400 to-amber-500 shadow-pop")
          )}
        >
          {phase === "narrating" && <Volume2 className="h-12 w-12 text-white" />}
          {phase === "listening" && handsFree && (
            <Mic className="h-12 w-12 text-white" />
          )}
          {phase === "listening" && !handsFree && (
            <Headphones className="h-12 w-12 text-white" />
          )}
          {phase === "feedback" && lastCorrect && (
            <CheckCircle2 className="h-14 w-14 text-white" />
          )}
          {phase === "feedback" && !lastCorrect && (
            <XCircle className="h-14 w-14 text-white" />
          )}
        </div>

        <div className="text-base font-semibold mb-1">
          {phase === "narrating" && "Reading the question…"}
          {phase === "listening" &&
            handsFree &&
            (micActive ? "Listening… say A, B, C, or D" : "Listening soon…")}
          {phase === "listening" && !handsFree && "Tap your answer below"}
          {phase === "feedback" &&
            (lastCorrect ? "Correct" : "Not quite — keep going")}
        </div>
        <div className="text-xs text-muted-foreground">
          {q.topicId && TOPIC_MAP[q.topicId]?.shortName}
          {transcript && ` · heard: "${transcript}"`}
        </div>
      </div>

      {/* Tap-to-answer choices (visible whenever phase is listening + not hands-free) */}
      {!handsFree && phase === "listening" && (
        <div className="space-y-2">
          {q.choices.map((c, i) => (
            <button
              key={i}
              onClick={() => tapAnswer(i)}
              className="w-full text-left rounded-xl border border-border bg-white px-4 py-3.5 hover:border-brand-300 hover:bg-brand-50/40 transition-all flex items-start gap-3"
            >
              <span className="h-7 w-7 rounded-full border border-border flex items-center justify-center shrink-0 text-sm font-semibold tabular-nums">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="leading-relaxed text-[14.5px]">{c}</span>
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="md" onClick={exit}>
          Exit
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              if (paused) {
                setPaused(false);
              } else {
                setPaused(true);
                stopSpeaking();
              }
            }}
            aria-label={paused ? "Resume" : "Pause"}
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {paused ? "Resume" : "Pause"}
          </Button>
          <Button variant="outline" size="md" onClick={skip}>
            <SkipForward className="h-4 w-4" />
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}
