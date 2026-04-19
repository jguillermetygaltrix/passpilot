"use client";

import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { HydrationGate } from "@/components/hydration-gate";
import { AppShell } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { useApp, useMasteryAndReadiness } from "@/lib/store";
import { findWeaknessClusters } from "@/lib/planner";
import { TOPIC_MAP } from "@/lib/data/topics";
import { QUESTION_MAP } from "@/lib/data/questions";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Shield,
} from "lucide-react";

export default function WeaknessPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const { attempts } = useApp();
  const mr = useMasteryAndReadiness();
  if (!mr) return null;

  const clusters = findWeaknessClusters(mr.mastery);

  const incorrectMap: Record<string, { prompt: string; count: number; topic: string }> = {};
  attempts
    .flatMap((a) => a.answers)
    .filter((a) => !a.correct)
    .forEach((a) => {
      const q = QUESTION_MAP[a.questionId];
      if (!q) return;
      const key = q.id;
      if (!incorrectMap[key]) {
        incorrectMap[key] = { prompt: q.prompt, count: 0, topic: q.topicId };
      }
      incorrectMap[key].count += 1;
    });
  const topMisses = Object.entries(incorrectMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4);

  return (
    <>
      <AppNav />
      <AppShell>
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Risk map
          </div>
          <h1 className="heading-2 mt-1">Weakness review</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            PassPilot clusters repeated mistakes by topic and ranks them by
            how likely they are to drag your pass score down.
          </p>
        </div>

        {clusters.length === 0 ? (
          <div className="card-surface p-10 text-center">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">No weak clusters detected</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Either you haven't practiced enough yet, or you're genuinely
              strong across the board. Run a mixed drill to stress-test it.
            </p>
            <Link href="/practice" className="inline-block mt-5">
              <Button variant="primary" size="lg">
                Run a drill
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {clusters.map((c, idx) => {
              const acc = Math.round(c.mastery.accuracy * 100);
              return (
                <div key={c.topic.id} className="card-surface p-6">
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-[220px]">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                          Risk #{idx + 1}
                        </span>
                        <span className="chip bg-rose-50 text-rose-700 border-rose-200">
                          Priority {c.mastery.priority.toFixed(2)}
                        </span>
                      </div>
                      <div className="font-semibold text-[15px]">
                        {c.topic.name}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {c.reason}
                      </p>

                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                          <span>Your accuracy</span>
                          <span className="tabular-nums font-semibold text-foreground">
                            {acc}%
                          </span>
                        </div>
                        <ProgressBar
                          value={acc}
                          tone={acc < 50 ? "rose" : acc < 65 ? "amber" : "brand"}
                        />
                      </div>

                      <div className="mt-4 rounded-xl border border-border bg-slate-50/60 p-4">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                          Mini summary
                        </div>
                        <p className="text-sm leading-relaxed">
                          {c.topic.summary}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link href={`/practice?topic=${c.topic.id}`}>
                          <Button variant="primary" size="sm">
                            <RotateCcw className="h-3.5 w-3.5" />
                            Retry quiz
                          </Button>
                        </Link>
                        <Link href={`/guide/${c.topic.id}`}>
                          <Button variant="outline" size="sm">
                            <BookOpen className="h-3.5 w-3.5" />
                            Cram sheet
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {topMisses.length > 0 && (
          <div className="card-surface p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="h-4 w-4 text-brand-600" />
              <div className="font-semibold text-sm">Most-missed questions</div>
            </div>
            <ul className="divide-y-soft">
              {topMisses.map(([id, v]) => (
                <li key={id} className="py-3 flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 flex items-center justify-center shrink-0 text-[11px] font-semibold tabular-nums">
                    ×{v.count}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium leading-snug">
                      {v.prompt}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {TOPIC_MAP[v.topic]?.name}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/practice?mode=incorrect-only" className="inline-block mt-4">
              <Button variant="outline" size="sm">
                Review all incorrect
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        )}
      </AppShell>
    </>
  );
}
