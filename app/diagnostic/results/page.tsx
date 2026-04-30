"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/app-nav";
import { HydrationGate } from "@/components/hydration-gate";
import { ReadinessRing } from "@/components/readiness-ring";
import { RiskBadge } from "@/components/risk-badge";
import { TopicMasteryList } from "@/components/topic-mastery-list";
import { NextCertCard } from "@/components/next-cert-card";
import { useApp, useMasteryAndReadiness } from "@/lib/store";
import { topInsight } from "@/lib/scoring";
import { TOPIC_MAP } from "@/lib/data/topics";
import {
  ArrowRight,
  Calendar,
  CircleAlert,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export default function DiagnosticResultsPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const { profile, attempts } = useApp();
  const mr = useMasteryAndReadiness();
  const router = useRouter();

  if (!profile || !mr) return null;

  const diagnosticAttempt = [...attempts]
    .reverse()
    .find((a) => a.kind === "diagnostic");

  const mastery = mr.mastery;
  const readiness = mr.readiness;

  const weakest = [...mastery]
    .filter((m) => m.attempts > 0)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);
  const strongest = [...mastery]
    .filter((m) => m.attempts > 0)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 2);

  const insight = topInsight(readiness, mastery);

  const copy =
    readiness.risk === "high"
      ? "You're in the high-risk zone. That's not a verdict — it's a starting line. The plan below will move you fast."
      : readiness.risk === "borderline"
        ? "You're in the borderline zone. A focused week of the right practice could cross you into safer territory."
        : readiness.risk === "safer"
          ? "You're in the safer zone. Don't coast — we'll keep you sharp and fill the last few seams."
          : "You're already tracking toward a strong pass. Your plan focuses on precision and exam-day sharpness.";

  return (
    <div className="min-h-screen">
      <header className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-semibold text-[15px]">PassPilot</span>
        </Link>
      </header>

      <main className="container max-w-3xl pb-20 animate-fade-in">
        <div className="text-center pt-4 pb-10">
          <div className="chip bg-brand-50 dark:bg-brand-500/15 border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 mx-auto mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Diagnostic complete
          </div>
          <h1 className="heading-2 text-balance">Here's where you really stand.</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-balance">
            {copy}
          </p>
        </div>

        <div className="card-surface p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-brand-100 dark:bg-brand-500/20 blur-3xl opacity-50" />
          <div className="relative grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center">
            <ReadinessRing
              score={readiness.score}
              risk={readiness.risk}
              size={180}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <RiskBadge risk={readiness.risk} />
                <span className="chip bg-white dark:bg-card border-border text-foreground">
                  <Calendar className="h-3 w-3" />
                  {readiness.daysLeft} days to exam
                </span>
                {diagnosticAttempt && (
                  <span className="chip bg-slate-50 dark:bg-muted border-slate-200 dark:border-border text-slate-700 dark:text-slate-300">
                    {diagnosticAttempt.scorePct}% diagnostic accuracy
                  </span>
                )}
              </div>
              <div className="text-sm text-foreground leading-relaxed">
                {insight}
              </div>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push("/plan")}
                  className="flex-1 sm:flex-none"
                >
                  Generate study plan
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-6">
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="h-4 w-4 text-rose-600" />
              <div className="font-semibold text-sm">Weakest topics</div>
            </div>
            {weakest.length ? (
              <ul className="space-y-3">
                {weakest.map((m) => (
                  <li
                    key={m.topicId}
                    className="flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-medium">
                        {TOPIC_MAP[m.topicId]?.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        worth {Math.round((TOPIC_MAP[m.topicId]?.weight ?? 0) * 100)}% · {m.correct}/{m.attempts} correct
                      </div>
                    </div>
                    <div className="text-sm font-semibold tabular-nums text-rose-600">
                      {Math.round(m.accuracy * 100)}%
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">
                Not enough data yet.
              </div>
            )}
          </div>

          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <div className="font-semibold text-sm">Strongest topics</div>
            </div>
            {strongest.length ? (
              <ul className="space-y-3">
                {strongest.map((m) => (
                  <li
                    key={m.topicId}
                    className="flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-medium">
                        {TOPIC_MAP[m.topicId]?.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {m.correct}/{m.attempts} correct
                      </div>
                    </div>
                    <div className="text-sm font-semibold tabular-nums text-emerald-600">
                      {Math.round(m.accuracy * 100)}%
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">
                Not enough data yet.
              </div>
            )}
          </div>
        </div>

        <div className="card-surface p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-brand-600" />
            <div className="font-semibold text-sm">Recommended focus order</div>
          </div>
          <TopicMasteryList mastery={mastery} showLink={false} />
        </div>

        {/* Multi-cert recommender — fires after the focus list so it doesn't
            distract from the immediate next step (study plan generation). */}
        <div className="mt-6">
          <NextCertCard
            currentExamId={profile.examId}
            currentReadinessScore={readiness.score}
          />
        </div>

        <div className="card-surface p-6 mt-6 border-l-4 border-brand-500">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
              <CircleAlert className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">
                Your pass-risk read
              </div>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                PassPilot blends accuracy, topic weight, and exam urgency into
                one score. Every practice session you complete recalculates
                this — so the needle moves with your real effort, not just
                activity.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
