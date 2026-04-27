"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/app-nav";
import { useApp } from "@/lib/store";
import type {
  ConfidenceLevel,
  ExamId,
  UserProfile,
  WhyKind,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Compass,
  Gauge,
  GraduationCap,
  Heart,
  Target,
  Trophy,
} from "lucide-react";

const TOTAL_STEPS = 6;

type OutcomeKind = "pass" | "pass-comfortably" | "top-10";

interface Draft {
  examId: ExamId;
  examDate: string;
  confidence: ConfidenceLevel;
  hoursPerDay: number;
  targetOutcome: OutcomeKind;
  why: WhyKind;
}

const defaultDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 21);
  return d.toISOString().slice(0, 10);
};

export default function OnboardingPage() {
  const router = useRouter();
  const setProfile = useApp((s) => s.setProfile);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({
    examId: "az-900",
    examDate: defaultDate(),
    confidence: "some",
    hoursPerDay: 1,
    targetOutcome: "pass-comfortably",
    why: "career-switch",
  });

  const commit = () => {
    const profile: UserProfile = {
      ...draft,
      startedAt: new Date().toISOString(),
      streakDays: 0,
      lastActiveDate: new Date().toISOString(),
    };
    setProfile(profile);
    router.push("/diagnostic");
  };

  const next = () => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute inset-0 -z-10 mesh-bg" />

      <header className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-semibold text-[15px]">PassPilot</span>
        </Link>
        <div className="text-xs text-muted-foreground tabular-nums">
          Step {step + 1} of {TOTAL_STEPS}
        </div>
      </header>

      <main className="container flex-1 flex flex-col items-center justify-center py-10 max-w-xl w-full">
        <div className="w-full">
          <div className="h-1.5 w-full bg-slate-100 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            />
          </div>

          <div key={step} className="animate-fade-in">
            {step === 0 && <ExamStep value={draft.examId} onChange={(v) => setDraft({ ...draft, examId: v })} />}
            {step === 1 && (
              <DateStep
                value={draft.examDate}
                onChange={(v) => setDraft({ ...draft, examDate: v })}
              />
            )}
            {step === 2 && (
              <ConfidenceStep
                value={draft.confidence}
                onChange={(v) => setDraft({ ...draft, confidence: v })}
              />
            )}
            {step === 3 && (
              <HoursStep
                value={draft.hoursPerDay}
                onChange={(v) => setDraft({ ...draft, hoursPerDay: v })}
              />
            )}
            {step === 4 && (
              <OutcomeStep
                value={draft.targetOutcome}
                onChange={(v) => setDraft({ ...draft, targetOutcome: v })}
              />
            )}
            {step === 5 && (
              <WhyStep
                value={draft.why}
                onChange={(v) => setDraft({ ...draft, why: v })}
              />
            )}
          </div>

          <div className="flex items-center justify-between gap-3 mt-10">
            <Button
              variant="ghost"
              size="md"
              onClick={step === 0 ? () => router.push("/") : back}
              className="text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {step === 0 ? "Home" : "Back"}
            </Button>
            {step < TOTAL_STEPS - 1 ? (
              <Button variant="primary" size="lg" onClick={next}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="primary" size="lg" onClick={commit}>
                Start diagnostic
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StepHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Calendar;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center mb-8">
      <div className="h-12 w-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-4">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="heading-2 text-balance">{title}</h2>
      <p className="text-muted-foreground mt-2 max-w-sm mx-auto text-balance">
        {subtitle}
      </p>
    </div>
  );
}

function ChoiceRow({
  active,
  onClick,
  children,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl border p-5 transition-all flex items-center gap-4",
        active
          ? "border-brand-500 bg-brand-50 ring-4 ring-brand-100 shadow-soft"
          : "border-border bg-white hover:border-brand-200",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
      <ChevronRight
        className={cn(
          "h-4 w-4 ml-auto shrink-0 transition-opacity",
          active ? "text-brand-600 opacity-100" : "text-muted-foreground opacity-50"
        )}
      />
    </button>
  );
}

function ExamStep({
  value,
  onChange,
}: {
  value: ExamId;
  onChange: (v: ExamId) => void;
}) {
  const exams: {
    id: ExamId;
    badge: string;
    title: string;
    subtitle: string;
    gradient: string;
  }[] = [
    {
      id: "az-900",
      badge: "AZ",
      title: "AZ-900 · Azure Fundamentals",
      subtitle: "Microsoft · 60 min · 70% to pass · $99",
      gradient: "from-brand-500 to-brand-700",
    },
    {
      id: "aws-ccp",
      badge: "AWS",
      title: "CLF-C02 · AWS Cloud Practitioner",
      subtitle: "Amazon · 90 min · 65 questions · $100",
      gradient: "from-amber-500 to-rose-500",
    },
    {
      id: "ms-900",
      badge: "MS",
      title: "MS-900 · Microsoft 365 Fundamentals",
      subtitle: "Microsoft · 60 min · 70% to pass · $99",
      gradient: "from-emerald-500 to-cyan-500",
    },
    {
      id: "ai-900",
      badge: "AI",
      title: "AI-900 · Azure AI Fundamentals",
      subtitle: "Microsoft · 60 min · 70% to pass · $99 · NEW",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "sec-plus",
      badge: "SEC",
      title: "Security+ · SY0-701",
      subtitle: "CompTIA · 90 min · 750/900 to pass · $392",
      gradient: "from-red-500 to-orange-500",
    },
    {
      id: "aws-aip",
      badge: "AIP",
      title: "AIF-C01 · AWS AI Practitioner",
      subtitle: "Amazon · 90 min · 65 questions · $100 · NEW",
      gradient: "from-amber-500 to-orange-400",
    },
    {
      id: "gcp-cdl",
      badge: "CDL",
      title: "Cloud Digital Leader",
      subtitle: "Google Cloud · 90 min · 70% to pass · $99",
      gradient: "from-blue-500 to-emerald-500",
    },
  ];

  return (
    <div>
      <StepHeader
        icon={Target}
        title="Which certification are you chasing?"
        subtitle="Pick your exam. You can change it later in settings."
      />
      <div className="space-y-3">
        {exams.map((e) => (
          <ChoiceRow
            key={e.id}
            active={value === e.id}
            onClick={() => onChange(e.id)}
          >
            <div
              className={`h-10 w-10 rounded-xl bg-gradient-to-br ${e.gradient} text-white flex items-center justify-center font-semibold text-[11px] shrink-0 shadow-pop`}
            >
              {e.badge}
            </div>
            <div>
              <div className="font-semibold">{e.title}</div>
              <div className="text-sm text-muted-foreground">{e.subtitle}</div>
            </div>
          </ChoiceRow>
        ))}
      </div>
    </div>
  );
}

function DateStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const todayIso = new Date().toISOString().slice(0, 10);
  const daysFromNow = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  const presets = [
    { label: "1 week", v: daysFromNow(7) },
    { label: "2 weeks", v: daysFromNow(14) },
    { label: "1 month", v: daysFromNow(30) },
    { label: "6 weeks", v: daysFromNow(42) },
  ];
  const diffDays = Math.max(
    0,
    Math.ceil(
      (new Date(value).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div>
      <StepHeader
        icon={Calendar}
        title="When is your exam?"
        subtitle="We use this to calibrate urgency. Pick a rough date — you can change it later."
      />

      <div className="card-surface p-5 text-center">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Days to exam</div>
        <div className="text-5xl font-semibold tabular-nums mt-1">{diffDays}</div>
        <div className="text-sm text-muted-foreground mt-1">
          {new Date(value).toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => onChange(p.v)}
            className={cn(
              "rounded-full py-2 text-xs font-medium border transition-colors",
              value === p.v
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-border bg-white text-muted-foreground hover:border-brand-200"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <label className="block mt-5">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
          Exact date
        </span>
        <input
          type="date"
          min={todayIso}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full h-12 rounded-xl border border-border px-4 text-base focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 bg-white"
        />
      </label>
    </div>
  );
}

function ConfidenceStep({
  value,
  onChange,
}: {
  value: ConfidenceLevel;
  onChange: (v: ConfidenceLevel) => void;
}) {
  const opts: { v: ConfidenceLevel; title: string; sub: string; emoji: string }[] = [
    {
      v: "new",
      title: "Totally new",
      sub: "Never touched Azure. Starting from zero.",
      emoji: "🌱",
    },
    {
      v: "some",
      title: "Some exposure",
      sub: "Heard the concepts, not confident yet.",
      emoji: "🧭",
    },
    {
      v: "solid",
      title: "Solid foundation",
      sub: "Used Azure or another cloud a bit.",
      emoji: "⚡",
    },
    {
      v: "confident",
      title: "Confident",
      sub: "Just want to make sure I pass cleanly.",
      emoji: "🎯",
    },
  ];
  return (
    <div>
      <StepHeader
        icon={Gauge}
        title="How confident do you feel right now?"
        subtitle="Your diagnostic quiz will measure the real number — this is just a starting point."
      />
      <div className="space-y-3">
        {opts.map((o) => (
          <ChoiceRow
            key={o.v}
            active={value === o.v}
            onClick={() => onChange(o.v)}
          >
            <div className="text-2xl shrink-0">{o.emoji}</div>
            <div>
              <div className="font-semibold">{o.title}</div>
              <div className="text-sm text-muted-foreground">{o.sub}</div>
            </div>
          </ChoiceRow>
        ))}
      </div>
    </div>
  );
}

function HoursStep({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <StepHeader
        icon={Clock}
        title="How much time per day can you realistically commit?"
        subtitle="Be honest. A consistent 30 minutes beats an inconsistent 2 hours every time."
      />
      <div className="card-surface p-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Daily study
            </div>
            <div className="text-4xl font-semibold tabular-nums mt-1">
              {Math.round(value * 60)}
              <span className="text-xl text-muted-foreground font-normal ml-1">
                min
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            ~{Math.round(value * 60 * 7)} min / week
          </div>
        </div>
        <input
          type="range"
          min="0.25"
          max="4"
          step="0.25"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full mt-6 accent-brand-600"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
          <span>15m</span>
          <span>1h</span>
          <span>2h</span>
          <span>4h</span>
        </div>
      </div>
    </div>
  );
}

function OutcomeStep({
  value,
  onChange,
}: {
  value: OutcomeKind;
  onChange: (v: OutcomeKind) => void;
}) {
  const opts: {
    v: OutcomeKind;
    title: string;
    sub: string;
    icon: typeof Trophy;
  }[] = [
    {
      v: "pass",
      title: "Just pass",
      sub: "Get above 70%, move on, done.",
      icon: Check,
    },
    {
      v: "pass-comfortably",
      title: "Pass comfortably",
      sub: "Aim for a safe buffer — low stress on exam day.",
      icon: Target,
    },
    {
      v: "top-10",
      title: "Top-tier score",
      sub: "Push into the 85%+ range, master the content.",
      icon: Trophy,
    },
  ];
  return (
    <div>
      <StepHeader
        icon={Trophy}
        title="What's your target outcome?"
        subtitle="This tunes how aggressively we push your plan."
      />
      <div className="space-y-3">
        {opts.map((o) => (
          <ChoiceRow
            key={o.v}
            active={value === o.v}
            onClick={() => onChange(o.v)}
          >
            <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 border border-brand-100 flex items-center justify-center shrink-0">
              <o.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">{o.title}</div>
              <div className="text-sm text-muted-foreground">{o.sub}</div>
            </div>
          </ChoiceRow>
        ))}
      </div>
    </div>
  );
}

function WhyStep({
  value,
  onChange,
}: {
  value: WhyKind;
  onChange: (v: WhyKind) => void;
}) {
  const opts: {
    v: WhyKind;
    title: string;
    sub: string;
    icon: typeof Briefcase;
  }[] = [
    {
      v: "career-switch",
      title: "Breaking into tech",
      sub: "I want this cert to open doors to new roles.",
      icon: Compass,
    },
    {
      v: "job-mandate",
      title: "Required for my job",
      sub: "Promotion, role change, or a contract needs it.",
      icon: Briefcase,
    },
    {
      v: "curiosity",
      title: "Personal curiosity",
      sub: "Self-driven — I want to understand this stack.",
      icon: Heart,
    },
    {
      v: "school-credit",
      title: "Class or program credit",
      sub: "College, bootcamp, or certificate-program requirement.",
      icon: GraduationCap,
    },
  ];
  return (
    <div>
      <StepHeader
        icon={Trophy}
        title="What's driving you to pass?"
        subtitle="We'll tune your daily plan tone, milestones, and reminders to fit."
      />
      <div className="space-y-3">
        {opts.map((o) => (
          <ChoiceRow
            key={o.v}
            active={value === o.v}
            onClick={() => onChange(o.v)}
          >
            <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 border border-brand-100 flex items-center justify-center shrink-0">
              <o.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">{o.title}</div>
              <div className="text-sm text-muted-foreground">{o.sub}</div>
            </div>
          </ChoiceRow>
        ))}
      </div>
    </div>
  );
}
