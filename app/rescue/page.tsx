"use client";

import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { HydrationGate } from "@/components/hydration-gate";
import { AppShell } from "@/components/container";
import { Button } from "@/components/ui/button";
import { useApp, useMasteryAndReadiness } from "@/lib/store";
import { rescueTopics } from "@/lib/planner";
import { TOPIC_MAP } from "@/lib/data/topics";
import {
  AlarmClock,
  ArrowRight,
  BookOpen,
  CheckCheck,
  Flame,
  LifeBuoy,
  Minus,
  ShieldAlert,
  Zap,
} from "lucide-react";

export default function RescuePage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const { profile } = useApp();
  const mr = useMasteryAndReadiness();
  if (!profile || !mr) return null;

  const { readiness, mastery } = mr;
  const { prioritize, deprioritize } = rescueTopics(mastery);

  const days = readiness.daysLeft;
  const critical = days <= 3;
  const urgent = days <= 7;

  const headline = critical
    ? `${days === 0 ? "Today is exam day." : `${days} days left.`} Stabilize, don't spiral.`
    : urgent
      ? `${days} days left. Time to stop exploring and start consolidating.`
      : readiness.risk === "high"
        ? `You're still ${days} days out — but readiness is low. We need to reset the plan.`
        : `${days} days out. Rescue mode is available if things tighten.`;

  const subcopy = critical
    ? "In this window, every hour spent on new concepts is an hour stolen from retention. Protect your wins, lock your weakest seam, and rest."
    : urgent
      ? "One or two topics will decide this. Everything else is noise. Use the plan below to pick your battles."
      : readiness.risk === "high"
        ? "You have time, but not infinite time. This mode strips the plan down to what will move the needle fastest."
        : "You're on track — keep Rescue Mode in your back pocket for the final week.";

  return (
    <>
      <AppNav />
      <AppShell className="max-w-3xl">
        <div className="mb-6">
          <div className="chip bg-rose-50 border-rose-200 text-rose-700 mb-3">
            <LifeBuoy className="h-3.5 w-3.5" />
            Rescue mode
          </div>
          <h1 className="heading-2 text-balance">{headline}</h1>
          <p className="text-muted-foreground mt-3 max-w-xl leading-relaxed">
            {subcopy}
          </p>
        </div>

        <div className="card-surface p-6 border-l-4 border-rose-500 mb-5 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-rose-100 blur-3xl opacity-60" />
          <div className="relative flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <AlarmClock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">
                Condensed survival plan
              </div>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Replace your normal plan with three short cycles today. Each
                cycle repeats the same pattern: read → drill → review. No new
                topics. No rabbit holes.
              </p>
            </div>
          </div>
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            <Cycle num={1} title="Re-read cram sheet" minutes={10} />
            <Cycle num={2} title="5-question drill" minutes={8} />
            <Cycle num={3} title="Review misses out loud" minutes={5} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-4 w-4 text-rose-600" />
              <div className="font-semibold text-sm">Prioritize these</div>
            </div>
            {prioritize.length ? (
              <ul className="space-y-3">
                {prioritize.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-start justify-between gap-3 group"
                  >
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Worth {Math.round(t.weight * 100)}% · this is where
                        the points live for you
                      </div>
                    </div>
                    <Link
                      href={`/practice?topic=${t.id}`}
                      className="chip bg-rose-50 border-rose-200 text-rose-700 shrink-0"
                    >
                      Drill
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">
                We need more practice data first. Take 5 questions, then come
                back.
              </div>
            )}
          </div>

          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <Minus className="h-4 w-4 text-slate-500" />
              <div className="font-semibold text-sm">Safe to skip today</div>
            </div>
            {deprioritize.length ? (
              <ul className="space-y-3">
                {deprioritize.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        You're solid here — don't burn energy
                      </div>
                    </div>
                    <span className="chip bg-emerald-50 border-emerald-200 text-emerald-700 shrink-0">
                      <CheckCheck className="h-3 w-3" /> Hold
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">
                Nothing's solid enough to skip yet. Every topic still earns its
                time.
              </div>
            )}
          </div>
        </div>

        <div className="card-surface p-6 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="h-4 w-4 text-brand-600" />
            <div className="font-semibold text-sm">
              What to do in the last 24 hours
            </div>
          </div>
          <ul className="space-y-3 text-sm">
            <Tip
              emoji="🌙"
              title="Sleep over study"
              body="A rested brain retrieves 15–20% better than a caffeinated one. Stop studying 2+ hours before bed."
            />
            <Tip
              emoji="📄"
              title="Read cram sheets only"
              body="Your last pass should be pattern recognition, not new material. Cram sheets are your friend."
            />
            <Tip
              emoji="🚫"
              title="Don't learn anything new"
              body="Novelty in the final window creates false memories. If it's new, skip it."
            />
            <Tip
              emoji="🧘"
              title="Run through the exam tour"
              body="Know the rules, check-in time, ID requirements, and bathroom policy. Remove surprises."
            />
          </ul>
        </div>

        <div className="card-surface p-6 bg-gradient-to-br from-brand-50 to-white border-brand-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <div className="text-sm font-semibold">Truth moment</div>
              <p className="text-sm text-muted-foreground mt-1 max-w-md leading-relaxed">
                {critical
                  ? `At this readiness, you're ${readiness.score >= 70 ? "in pass territory if you hold the line." : "under the pass line — one focused block can still shift it."}`
                  : `You're at ${readiness.score}/100. ${readiness.score >= 75 ? "You're trending to pass — protect the lead." : "There's time to earn real ground — but only with focused effort."}`}
              </p>
            </div>
            <Link href="/practice">
              <Button variant="primary" size="lg">
                Start a rescue drill
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
    </>
  );
}

function Cycle({
  num,
  title,
  minutes,
}: {
  num: number;
  title: string;
  minutes: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
        Cycle {num}
      </div>
      <div className="text-sm font-semibold mt-0.5">{title}</div>
      <div className="text-xs text-muted-foreground mt-1">{minutes} min</div>
    </div>
  );
}

function Tip({
  emoji,
  title,
  body,
}: {
  emoji: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="text-xl shrink-0">{emoji}</span>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-muted-foreground leading-relaxed">{body}</div>
      </div>
    </li>
  );
}
