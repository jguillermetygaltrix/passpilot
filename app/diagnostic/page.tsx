"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/app-nav";
import { QuestionRunner } from "@/components/question-runner";
import { getDiagnosticQuestions } from "@/lib/data/questions";
import { getExamMeta } from "@/lib/data/exams";
import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowRight, BrainCircuit, Clock, Target, RotateCcw, TrendingUp, TrendingDown } from "lucide-react";

export default function DiagnosticPage() {
  const [started, setStarted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { profile, attempts } = useApp();
  const router = useRouter();

  // Re-take detection — show different hero / surface past trend if user has
  // already done a diagnostic for this cert.
  const pastDiagnostics = useMemo(() => {
    if (!profile) return [];
    return attempts
      .filter((a) => a.kind === "diagnostic")
      .filter((a) =>
        // Best-effort cert filter: diagnostic answers should be from this exam's topics
        a.answers.some((ans) => ans.topicId.startsWith(profile.examId.split("-")[0]))
      )
      .sort((a, b) => a.completedAt.localeCompare(b.completedAt));
  }, [attempts, profile]);

  const isRetake = pastDiagnostics.length > 0;
  const lastDiagnostic = pastDiagnostics[pastDiagnostics.length - 1] ?? null;
  const daysSinceLast = lastDiagnostic
    ? Math.floor(
        (Date.now() - new Date(lastDiagnostic.completedAt).getTime()) / 86400000
      )
    : null;

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="absolute inset-0 -z-10 mesh-bg" />
        <header className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="font-semibold text-[15px]">PassPilot</span>
          </Link>
        </header>
        <main className="container flex-1 flex items-center justify-center">
          <div className="card-surface p-8 max-w-md text-center">
            <h2 className="heading-2">Set up your plan first</h2>
            <p className="text-muted-foreground mt-2">
              Tell us about your exam so we can calibrate the diagnostic.
            </p>
            <Link href="/onboarding" className="inline-block mt-6">
              <Button variant="primary" size="lg">
                Start onboarding
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const questions = getDiagnosticQuestions(profile.examId);
  const examMeta = getExamMeta(profile.examId);

  return (
    <div className="min-h-screen">
      <header className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-semibold text-[15px]">PassPilot</span>
        </Link>
      </header>

      <main className="container max-w-2xl pb-20">
        {!started ? (
          <div className="animate-fade-in">
            <div className="absolute inset-x-0 top-0 -z-10 h-96 mesh-bg" />
            <div className="text-center pt-6 pb-10">
              <div
                className={`chip mx-auto mb-4 ${isRetake ? "bg-violet-50 dark:bg-violet-500/15 border-violet-100 text-violet-700" : "bg-brand-50 dark:bg-brand-500/15 border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300"}`}
              >
                {isRetake ? (
                  <RotateCcw className="h-3.5 w-3.5" />
                ) : (
                  <BrainCircuit className="h-3.5 w-3.5" />
                )}
                {examMeta.name} diagnostic{isRetake ? " · retake" : ""}
              </div>
              <h1 className="heading-2 text-balance">
                {isRetake
                  ? "Time to recalibrate."
                  : `${questions.length} questions to map your real starting point.`}
              </h1>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto">
                {isRetake
                  ? `Your last diagnostic was ${daysSinceLast === 0 ? "today" : daysSinceLast === 1 ? "yesterday" : `${daysSinceLast} days ago`}. Re-take to see how far you've come — readiness math updates immediately.`
                  : "This isn't a test — it's a signal. After this, PassPilot knows where to push and where you're already strong."}
              </p>
            </div>

            {/* Trend strip — only on re-takes */}
            {isRetake && pastDiagnostics.length > 0 && (
              <div className="card-surface p-5 mb-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                  Your diagnostic history
                </div>
                <div className="flex items-end justify-between gap-2 h-24 mb-2">
                  {pastDiagnostics.slice(-8).map((d, i, arr) => {
                    const heightPct = Math.max(8, d.scorePct);
                    const prev = i > 0 ? arr[i - 1].scorePct : null;
                    const delta = prev !== null ? d.scorePct - prev : 0;
                    return (
                      <div key={d.id} className="flex-1 flex flex-col items-center gap-1">
                        <div className="text-[10px] tabular-nums font-semibold text-foreground">
                          {d.scorePct}
                        </div>
                        <div className="w-full flex items-end h-16">
                          <div
                            className={`w-full rounded-t-md transition-all ${
                              i === arr.length - 1
                                ? "bg-gradient-to-t from-brand-500 to-violet-400"
                                : "bg-gradient-to-t from-slate-300 to-slate-200"
                            }`}
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-muted-foreground tabular-nums">
                          {new Date(d.completedAt).toLocaleDateString(undefined, {
                            month: "numeric",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {pastDiagnostics.length >= 2 && (
                  <div className="flex items-center justify-center gap-1.5 text-xs">
                    {(() => {
                      const last = pastDiagnostics[pastDiagnostics.length - 1].scorePct;
                      const prev = pastDiagnostics[pastDiagnostics.length - 2].scorePct;
                      const delta = last - prev;
                      if (delta > 0)
                        return (
                          <>
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700 dark:text-emerald-300 font-semibold tabular-nums">
                              +{delta} pts since last
                            </span>
                          </>
                        );
                      if (delta < 0)
                        return (
                          <>
                            <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
                            <span className="text-rose-700 dark:text-rose-300 font-semibold tabular-nums">
                              {delta} pts since last
                            </span>
                          </>
                        );
                      return (
                        <span className="text-muted-foreground">
                          Same score as last time — recalibrate to confirm
                        </span>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              <InfoTile icon={Target} label="Questions" value={`${questions.length}`} />
              <InfoTile icon={Clock} label="Approx time" value={`${Math.max(5, Math.round(questions.length * 0.7))} min`} />
              <InfoTile icon={BrainCircuit} label="Covers" value={`All ${examMeta.totalDomains} domains`} />
            </div>

            <div className="card-surface p-6">
              <div className="text-sm font-medium mb-3">
                {isRetake ? "Re-take rules" : "Before you start"}
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-600 mt-2 shrink-0" />
                  {isRetake
                    ? "Same questions per cert — your delta is the signal."
                    : "Answer honestly. There's no score you need to protect here."}
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-600 mt-2 shrink-0" />
                  Each answer explains the correct reasoning after you submit.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-600 mt-2 shrink-0" />
                  Your readiness score and plan refresh right after.
                </li>
              </ul>
            </div>

            <Button
              variant="primary"
              size="xl"
              className="w-full mt-6"
              onClick={() => setStarted(true)}
            >
              {isRetake ? (
                <>
                  <RotateCcw className="h-4 w-4" />
                  Re-take diagnostic
                </>
              ) : (
                <>
                  Start diagnostic
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        ) : (
          <QuestionRunner
            questions={questions}
            kind="diagnostic"
            title="Diagnostic"
            subtitle="Calibrating your readiness profile"
            completeHref="/diagnostic/results"
          />
        )}
      </main>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="card-surface p-4 flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-brand-50 dark:bg-brand-500/15 border border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="font-semibold tabular-nums">{value}</div>
      </div>
    </div>
  );
}
