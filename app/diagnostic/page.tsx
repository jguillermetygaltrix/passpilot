"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/app-nav";
import { QuestionRunner } from "@/components/question-runner";
import { getDiagnosticQuestions } from "@/lib/data/questions";
import { getExamMeta } from "@/lib/data/exams";
import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ArrowRight, BrainCircuit, Clock, Target } from "lucide-react";

export default function DiagnosticPage() {
  const [started, setStarted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { profile } = useApp();
  const router = useRouter();

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
              <div className="chip bg-brand-50 border-brand-100 text-brand-700 mx-auto mb-4">
                <BrainCircuit className="h-3.5 w-3.5" />
                {examMeta.name} diagnostic
              </div>
              <h1 className="heading-2 text-balance">
                {questions.length} questions to map your real starting point.
              </h1>
              <p className="text-muted-foreground mt-3 max-w-md mx-auto">
                This isn't a test — it's a signal. After this, PassPilot knows
                where to push and where you're already strong.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              <InfoTile icon={Target} label="Questions" value={`${questions.length}`} />
              <InfoTile icon={Clock} label="Approx time" value={`${Math.max(5, Math.round(questions.length * 0.7))} min`} />
              <InfoTile icon={BrainCircuit} label="Covers" value={`All ${examMeta.totalDomains} domains`} />
            </div>

            <div className="card-surface p-6">
              <div className="text-sm font-medium mb-3">Before you start</div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-600 mt-2 shrink-0" />
                  Answer honestly. There's no score you need to protect here.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-600 mt-2 shrink-0" />
                  Each answer explains the correct reasoning after you submit.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-600 mt-2 shrink-0" />
                  Your readiness score and plan are generated right after.
                </li>
              </ul>
            </div>

            <Button
              variant="primary"
              size="xl"
              className="w-full mt-6"
              onClick={() => setStarted(true)}
            >
              Start diagnostic
              <ArrowRight className="h-4 w-4" />
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
      <div className="h-9 w-9 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="font-semibold tabular-nums">{value}</div>
      </div>
    </div>
  );
}
