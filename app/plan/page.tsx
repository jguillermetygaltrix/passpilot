"use client";

import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { HydrationGate } from "@/components/hydration-gate";
import { AppShell } from "@/components/container";
import { Button } from "@/components/ui/button";
import { useApp, useDailyPlan, useMasteryAndReadiness } from "@/lib/store";
import { TOPIC_MAP } from "@/lib/data/topics";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Circle,
  Clock,
  Coffee,
  Dumbbell,
  LifeBuoy,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/progress";

export default function PlanPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const plan = useDailyPlan();
  const { completedBlockIds, markBlockDone } = useApp();
  const mr = useMasteryAndReadiness();

  if (!plan || !mr) return null;

  const done = plan.blocks.filter((b) =>
    completedBlockIds.includes(b.id)
  ).length;
  const total = plan.blocks.length;
  const doneMin = plan.blocks.reduce(
    (s, b) => s + (completedBlockIds.includes(b.id) ? b.minutes : 0),
    0
  );
  const pct = Math.round((doneMin / plan.totalMinutes) * 100);

  return (
    <>
      <AppNav />
      <AppShell>
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h1 className="heading-2 mt-1">Today's study plan</h1>
        </div>

        <div className="card-surface p-6 mb-5 border-l-4 border-brand-500 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-brand-100 blur-3xl opacity-60" />
          <div className="relative">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <div className="chip bg-white border-brand-100 text-brand-700 mb-1.5">
                  <Sparkles className="h-3 w-3" /> Mission
                </div>
                <div className="font-semibold text-[15px] leading-snug">
                  {plan.mission}
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {plan.aiInsight}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-5">
          <div className="card-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Blocks
            </div>
            <div className="text-2xl font-semibold mt-1 tabular-nums">
              {done}
              <span className="text-muted-foreground">/{total}</span>
            </div>
            <ProgressBar value={(done / total) * 100} className="mt-3" />
          </div>
          <div className="card-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Minutes
            </div>
            <div className="text-2xl font-semibold mt-1 tabular-nums">
              {doneMin}
              <span className="text-muted-foreground">/{plan.totalMinutes}</span>
            </div>
            <ProgressBar value={pct} className="mt-3" tone="emerald" />
          </div>
          <div className="card-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Focus topics today
            </div>
            <div className="text-sm font-medium mt-1.5 flex flex-wrap gap-1.5">
              {Array.from(
                new Set(plan.blocks.map((b) => b.topicId).filter(Boolean))
              ).map((tid) => (
                <span
                  key={tid as string}
                  className="chip bg-brand-50 border-brand-100 text-brand-700"
                >
                  {TOPIC_MAP[tid as string]?.shortName}
                </span>
              ))}
              {!plan.blocks.some((b) => b.topicId) && (
                <span className="text-sm text-muted-foreground">Mixed</span>
              )}
            </div>
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-brand-600" />
              <div className="font-semibold text-sm">Today's blocks</div>
            </div>
          </div>
          <ul className="space-y-3">
            {plan.blocks.map((b, idx) => {
              const isDone = completedBlockIds.includes(b.id);
              const icon =
                b.kind === "study"
                  ? BookOpen
                  : b.kind === "practice"
                    ? Dumbbell
                    : b.kind === "review"
                      ? ListChecks
                      : b.kind === "cram"
                        ? LifeBuoy
                        : Coffee;
              const Icon = icon;
              const actionHref =
                b.kind === "practice"
                  ? "/practice?mode=mixed"
                  : b.kind === "review"
                    ? "/practice?mode=incorrect-only"
                    : b.kind === "cram"
                      ? "/rescue"
                      : b.topicId
                        ? `/guide/${b.topicId}`
                        : "/practice";
              return (
                <li
                  key={b.id}
                  className={cn(
                    "rounded-2xl border transition-all",
                    isDone
                      ? "border-emerald-200 bg-emerald-50/40"
                      : "border-border bg-white hover:border-brand-200"
                  )}
                >
                  <div className="p-4 flex items-start gap-4">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                        isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-brand-50 text-brand-700 border border-brand-100"
                      )}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                          {b.kind === "cram" ? "Cram" : b.kind}
                        </span>
                        <span className="chip bg-slate-50 border-slate-200 text-slate-700">
                          <Clock className="h-3 w-3" /> {b.minutes}m
                        </span>
                        {b.topicId && (
                          <span className="chip bg-brand-50 border-brand-100 text-brand-700">
                            {TOPIC_MAP[b.topicId]?.shortName}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold">{b.title}</div>
                      <div className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {b.description}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Link href={actionHref}>
                          <Button variant="primary" size="sm">
                            Start block
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markBlockDone(b.id)}
                          disabled={isDone}
                        >
                          {isDone ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              Done
                            </>
                          ) : (
                            <>
                              <Circle className="h-3.5 w-3.5" />
                              Mark done
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </AppShell>
    </>
  );
}
