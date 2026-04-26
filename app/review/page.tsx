"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import { HydrationGate } from "@/components/hydration-gate";
import { QuestionRunner } from "@/components/question-runner";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { useEntitlements } from "@/lib/entitlements";
import {
  getDueCards,
  getDueTodayCards,
  getStats,
  getBoxDistribution,
  SR_BOX_INTERVALS_DAYS,
  type SRCard,
} from "@/lib/sr";
import { QUESTION_MAP } from "@/lib/data/questions";
import { TOPIC_MAP } from "@/lib/data/topics";
import {
  RotateCcw,
  Sparkles,
  Trophy,
  Zap,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Brain,
  TrendingUp,
} from "lucide-react";

export default function ReviewPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const router = useRouter();
  const { profile } = useApp();
  const ent = useEntitlements();
  const [started, setStarted] = useState(false);
  const [version, setVersion] = useState(0); // bump to force re-read of LS after grading

  if (!profile) return null;

  // Force re-read of LS after each review session
  // (the runner mutates LS via gradeCard but we want the post-session view fresh)
  const dueCards = useMemo(() => getDueCards(profile.examId), [profile.examId, version]);
  const dueTodayCards = useMemo(
    () => getDueTodayCards(profile.examId),
    [profile.examId, version]
  );
  const stats = useMemo(() => getStats(profile.examId), [profile.examId, version]);
  const boxDist = useMemo(() => getBoxDistribution(profile.examId), [profile.examId, version]);

  const dueQuestions = useMemo(
    () =>
      dueCards
        .map((c) => QUESTION_MAP[c.questionId])
        .filter(Boolean),
    [dueCards]
  );

  // Free-tier limit: review is always free for cards you've already seen
  // (no upgrade gate — SR is the retention loop, must always work)
  const canReview = dueQuestions.length > 0;

  if (started && canReview) {
    return (
      <>
        <AppNav />
        <AppShell>
          <QuestionRunner
            questions={dueQuestions}
            kind="sr-review"
            title="Spaced Repetition"
            subtitle={`${dueQuestions.length} card${dueQuestions.length === 1 ? "" : "s"} due now`}
            onFinish={() => {
              // Bump version so the post-session view re-reads SR state
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
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center space-y-3">
            <div className="chip bg-violet-50 border-violet-100 text-violet-700 mx-auto">
              <Brain className="h-3 w-3" />
              Spaced Repetition
            </div>
            <h1 className="heading-2 text-balance">
              {dueCards.length > 0
                ? `${dueCards.length} card${dueCards.length === 1 ? "" : "s"} due now`
                : dueTodayCards.length > 0
                  ? `${dueTodayCards.length} due later today`
                  : stats.totalCards > 0
                    ? "All caught up"
                    : "No review cards yet"}
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Every question you miss in a drill becomes a review card. We resurface
              them right before you'd forget — 1 day, 3 days, 7 days, 14 days, then a
              month, then two.
            </p>
          </div>

          {/* CTA */}
          {dueCards.length > 0 ? (
            <div className="card-surface p-6 sm:p-8 text-center bg-gradient-to-br from-violet-50/40 via-white to-brand-50/30">
              <div className="text-5xl font-semibold tabular-nums tracking-tight mb-1">
                {dueCards.length}
              </div>
              <div className="text-sm text-muted-foreground mb-5">
                ready for review · ~{Math.ceil(dueCards.length * 0.5)} min
              </div>
              <Button
                variant="primary"
                size="xl"
                className="w-full sm:w-auto group"
                onClick={() => setStarted(true)}
              >
                <Zap className="h-4 w-4" />
                Start review session
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          ) : stats.totalCards === 0 ? (
            <div className="card-surface p-8 text-center">
              <div className="h-14 w-14 rounded-2xl bg-violet-50 border border-violet-100 text-violet-700 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="text-base font-semibold mb-2">
                Take a drill to start your review queue
              </div>
              <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto leading-relaxed">
                Wrong answers automatically join your review queue. The forgetting
                curve gets you on the first miss — we start putting it back together
                from the second.
              </p>
              <Link href="/practice">
                <Button variant="primary" size="lg">
                  <RotateCcw className="h-4 w-4" />
                  Start practicing
                </Button>
              </Link>
            </div>
          ) : (
            <div className="card-surface p-8 text-center bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/30">
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="text-base font-semibold mb-2">
                Nothing due right now
              </div>
              <p className="text-sm text-muted-foreground mb-1 max-w-md mx-auto leading-relaxed">
                {dueTodayCards.length > 0
                  ? `${dueTodayCards.length} more card${dueTodayCards.length === 1 ? "" : "s"} will become due later today.`
                  : "Come back tomorrow — we don't surface cards before they're ripe."}
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Total review queue: {stats.totalCards} card
                {stats.totalCards === 1 ? "" : "s"} · {stats.matureCards} mature
              </p>
            </div>
          )}

          {/* Box distribution */}
          {stats.totalCards > 0 && (
            <div className="card-surface p-5">
              <div className="text-sm font-medium mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-600" />
                Your retention curve
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((box) => {
                  const count = boxDist[box] ?? 0;
                  const max = Math.max(...boxDist.slice(1, 8), 1);
                  const heightPct = (count / max) * 100;
                  const isMature = box >= 5;
                  return (
                    <div key={box} className="flex flex-col items-center gap-1.5">
                      <div className="h-20 w-full flex items-end">
                        <div
                          className={`w-full rounded-t-md transition-all ${
                            count === 0
                              ? "bg-slate-100"
                              : isMature
                                ? "bg-gradient-to-t from-emerald-500 to-emerald-400"
                                : "bg-gradient-to-t from-brand-500 to-violet-400"
                          }`}
                          style={{ height: `${Math.max(heightPct, count > 0 ? 8 : 4)}%` }}
                        />
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold tabular-nums">
                        {SR_BOX_INTERVALS_DAYS[box]}d
                      </div>
                      <div className="text-xs font-semibold tabular-nums">
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-[11px] text-muted-foreground text-center leading-relaxed">
                Cards graduate right → mature box (≥5) means you've nailed it 4+ times
                in a row. Resurface gap doubles each time.
              </div>
            </div>
          )}

          {/* Card preview list */}
          {dueCards.length > 0 && (
            <details className="card-surface p-5 group">
              <summary className="text-sm font-medium cursor-pointer flex items-center justify-between">
                <span>What's in this session</span>
                <span className="text-xs text-muted-foreground group-open:hidden">
                  {dueCards.length} card{dueCards.length === 1 ? "" : "s"} · expand
                </span>
              </summary>
              <div className="mt-4 space-y-2.5">
                {dueCards.slice(0, 10).map((card) => (
                  <CardPreviewRow key={card.questionId} card={card} />
                ))}
                {dueCards.length > 10 && (
                  <div className="text-xs text-muted-foreground text-center pt-2">
                    + {dueCards.length - 10} more
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Quick stats footer */}
          {stats.totalCards > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Total cards" value={stats.totalCards} />
              <Stat label="Mature" value={stats.matureCards} />
              <Stat label="Avg box" value={stats.averageBox} />
            </div>
          )}
        </div>
      </AppShell>
    </>
  );
}

function CardPreviewRow({ card }: { card: SRCard }) {
  const q = QUESTION_MAP[card.questionId];
  const topic = TOPIC_MAP[card.topicId];
  const accuracy = card.totalReviews
    ? Math.round((card.correctReviews / card.totalReviews) * 100)
    : 0;
  return (
    <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-slate-50/60 border border-border">
      <span className="chip bg-violet-50 border-violet-200 text-violet-700 text-[10px] tabular-nums shrink-0">
        Box {card.box}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{q?.prompt ?? "Question removed"}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {topic?.shortName ?? card.topicId}
          {card.totalReviews > 0 && (
            <>
              {" · "}
              {accuracy}% on {card.totalReviews} review
              {card.totalReviews === 1 ? "" : "s"}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-surface p-4 text-center">
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mt-1">
        {label}
      </div>
    </div>
  );
}
