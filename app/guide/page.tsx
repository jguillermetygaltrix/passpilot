"use client";

import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { HydrationGate } from "@/components/hydration-gate";
import { AppShell } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";
import { Spotlight } from "@/components/spotlight";
import { getTopicsForExam } from "@/lib/data/topics";
import { getLessonsForExam, getTopicLessons } from "@/lib/data/lessons";
import { getExamMeta } from "@/lib/data/exams";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck2,
  GraduationCap,
  LayoutGrid,
  MapPin,
  PlayCircle,
  ScrollText,
  Sparkles,
  Target,
} from "lucide-react";

export default function GuideOverviewPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const { completedLessonIds, profile } = useApp();
  if (!profile) return null;
  const examMeta = getExamMeta(profile.examId);
  const examTopics = getTopicsForExam(profile.examId);
  const examLessons = getLessonsForExam(profile.examId);

  const totalLessons = examLessons.length;
  const doneLessons = completedLessonIds.filter((id) =>
    examLessons.some((l) => l.id === id)
  ).length;
  const overallPct = totalLessons
    ? Math.round((doneLessons / totalLessons) * 100)
    : 0;

  const nextLesson =
    examLessons.find((l) => !completedLessonIds.includes(l.id)) ||
    examLessons[0];
  const resumeLabel = doneLessons === 0 ? "Start learning" : "Continue learning";

  const estTotalMinutes = examLessons.reduce((s, l) => s + l.minutes, 0);

  return (
    <>
      <AppNav />
      <AppShell>
        <div
          className="relative overflow-hidden rounded-[28px] mb-6 p-6 md:p-10 text-white shadow-pop"
          style={{
            background: `linear-gradient(135deg, ${examMeta.accentFrom} 0%, ${examMeta.accentTo} 100%)`,
          }}
        >
          <Spotlight color="rgba(255,255,255,0.12)" size={500} />
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-float-slow" />
          <div className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-float-slow [animation-delay:2s]" />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div className="max-w-xl">
              <div className="chip bg-white/15 border-white/20 text-white mb-3 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                {examMeta.vendor} · {examMeta.tagline}
              </div>
              <h1 className="heading-1 text-white">
                {examMeta.name}
                <span className="block text-lg md:text-xl font-normal text-white/80 mt-1 tracking-normal">
                  {examMeta.fullTitle}
                </span>
              </h1>
              <p className="mt-4 text-white/85 leading-relaxed">
                {examMeta.description}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/guide/${nextLesson.topicId}/${nextLesson.id}`}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto bg-white text-brand-700 hover:bg-white/90 border-transparent group"
                  >
                    <PlayCircle className="h-4 w-4" />
                    {resumeLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <Link href="/diagnostic">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10"
                  >
                    Take diagnostic
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <OverviewRing pct={overallPct} />
              <div className="mt-3 text-center text-white/80 text-sm">
                <CountUp to={doneLessons} /> of {totalLessons} lessons
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Reveal delay={0}>
            <FactCard
              icon={FileCheck2}
              label="Pass score"
              value={`~${examMeta.passScore}%`}
              sub="required to pass"
            />
          </Reveal>
          <Reveal delay={80}>
            <FactCard
              icon={LayoutGrid}
              label="Questions"
              value={
                examMeta.questionCountRange[0] ===
                examMeta.questionCountRange[1]
                  ? `${examMeta.questionCountRange[0]}`
                  : `${examMeta.questionCountRange[0]}–${examMeta.questionCountRange[1]}`
              }
              sub="multiple choice"
            />
          </Reveal>
          <Reveal delay={160}>
            <FactCard
              icon={Clock}
              label="Duration"
              value={`${examMeta.durationMin} min`}
              sub="online or test center"
            />
          </Reveal>
          <Reveal delay={240}>
            <FactCard
              icon={DollarSign}
              label="Exam fee"
              value={`$${examMeta.priceUSD} USD`}
              sub="may vary by region"
            />
          </Reveal>
        </div>

        <Reveal>
          <div className="card-surface p-6 md:p-8 mb-6 relative overflow-hidden">
            <Spotlight color="rgba(61, 96, 255, 0.06)" size={500} />
            <div className="relative">
              <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-brand-600" />
                    <div className="text-[11px] uppercase tracking-wider text-brand-700 font-semibold">
                      Domain weights
                    </div>
                  </div>
                  <h2 className="font-semibold text-lg">What you're tested on</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                    Each domain below has short lessons, deep review, and
                    practice drills. Tap a domain to start its chapter.
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  ~<CountUp to={estTotalMinutes} /> min of reading ·{" "}
                  <CountUp to={totalLessons} /> lessons
                </div>
              </div>

              <WeightBar topics={examTopics} />

              <div className="mt-6 grid md:grid-cols-2 gap-3">
                {examTopics.map((t, idx) => (
                  <Reveal key={t.id} delay={idx * 80}>
                    <DomainCard
                      index={idx + 1}
                      topicId={t.id}
                      name={t.name}
                      weight={t.weight}
                      summary={t.summary}
                      completedIds={completedLessonIds}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5">
          <Reveal>
          <div className="card-surface p-6 hover-lift h-full">
            <div className="flex items-center gap-2 mb-3">
              <ScrollText className="h-4 w-4 text-brand-600" />
              <div className="font-semibold text-sm">
                Recommended study path
              </div>
            </div>
            <ol className="space-y-3 text-sm">
              <PathStep
                num="1"
                title="Learn the lessons in order"
                body="Start with Cloud Concepts and work through each chapter. Takes about 90 minutes total to read."
              />
              <PathStep
                num="2"
                title="Take the diagnostic"
                body="12 questions that map your starting point and generate your pass-readiness score."
              />
              <PathStep
                num="3"
                title="Run targeted drills"
                body="Weak topics get priority. PassPilot picks the next drill based on where you're losing points."
              />
              <PathStep
                num="4"
                title="Review the cram sheets"
                body="In the final 24–72 hours, switch to the cram sheet per topic. No new material."
              />
            </ol>
          </div>
          </Reveal>

          <Reveal delay={120}>
          <div className="card-surface p-6 hover-lift h-full">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-brand-600" />
              <div className="font-semibold text-sm">
                What {examMeta.name} actually asks
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              {examQuickFacts(profile.examId).map((f, i) => (
                <Fact key={i} label={f.label} body={f.body} />
              ))}
            </ul>
          </div>
          </Reveal>
        </div>
      </AppShell>
    </>
  );
}

function OverviewRing({ pct }: { pct: number }) {
  const size = 140;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="white"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] uppercase tracking-wider text-white/75">
          Progress
        </span>
        <span className="text-3xl font-semibold tabular-nums">{pct}%</span>
      </div>
    </div>
  );
}

function FactCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof FileCheck2;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="card-surface p-4">
      <div className="flex items-center gap-2 mb-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[11px] uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}

function WeightBar({ topics }: { topics: ReturnType<typeof getTopicsForExam> }) {
  const totalW = topics.reduce((s, t) => s + t.weight, 0);
  const colors = [
    "bg-brand-600",
    "bg-brand-500",
    "bg-sky-500",
    "bg-emerald-500",
    "bg-amber-500",
  ];
  return (
    <div>
      <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner bg-slate-100">
        {topics.map((t, i) => (
          <div
            key={t.id}
            className={cn(
              "h-full first:rounded-l-full last:rounded-r-full transition-all",
              colors[i % colors.length]
            )}
            style={{ width: `${(t.weight / totalW) * 100}%` }}
            title={`${t.name} · ${Math.round((t.weight / totalW) * 100)}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
        {topics.map((t, i) => (
          <div
            key={t.id}
            className="flex items-center gap-2 text-[12px] text-muted-foreground"
          >
            <span
              className={cn("h-2.5 w-2.5 rounded-sm", colors[i % colors.length])}
            />
            <span className="text-foreground font-medium">{t.shortName}</span>
            <span className="tabular-nums">
              {Math.round((t.weight / totalW) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function examQuickFacts(
  examId: ReturnType<typeof getExamMeta>["id"]
): { label: string; body: string }[] {
  if (examId === "aws-ccp") {
    return [
      { label: "Scenario matching", body: "Most questions describe a need and ask which AWS service fits." },
      { label: "Security is the biggest domain", body: "30% of the exam — shared responsibility, IAM, and the Defender-like services (CloudTrail, GuardDuty, Config)." },
      { label: "Know the 7 Rs of migration", body: "Rehost, replatform, refactor, repurchase — each maps to a scenario." },
      { label: "Support plans show up reliably", body: "Basic vs Developer vs Business vs Enterprise — memorize what each unlocks." },
    ];
  }
  if (examId === "ms-900") {
    return [
      { label: "Productivity + admin + security", body: "Teams, SharePoint, Intune, Entra ID, Defender XDR — know them by role." },
      { label: "Plan comparison is the biggest lift", body: "Business Premium vs E3 vs E5 — memorize the feature deltas." },
      { label: "Zero Trust is the security backbone", body: "Verify explicitly, least privilege, assume breach." },
      { label: "Compliance is in Purview", body: "DLP, eDiscovery, Information Protection, Compliance Manager all live there." },
    ];
  }
  return [
    { label: "Pure concepts", body: "No hands-on skills are tested. You don't need an Azure account to pass." },
    { label: "Scenario matching", body: "Most questions describe a need and ask which service fits. Pattern recognition wins." },
    { label: "Shared responsibility", body: "The most-tested single topic. Expect it in multiple variations." },
    { label: "Monitoring trio", body: "Azure Monitor vs Service Health vs Advisor — know which is which cold." },
  ];
}

function DomainCard({
  index,
  topicId,
  name,
  weight,
  summary,
  completedIds,
}: {
  index: number;
  topicId: string;
  name: string;
  weight: number;
  summary: string;
  completedIds: string[];
}) {
  const lessons = getTopicLessons(topicId);
  const done = lessons.filter((l) => completedIds.includes(l.id)).length;
  const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  const total = lessons.reduce((s, l) => s + l.minutes, 0);

  return (
    <Link
      href={`/guide/${topicId}`}
      className="group rounded-2xl border border-border bg-white p-5 hover:border-brand-300 hover:shadow-soft transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center font-semibold tabular-nums text-sm shrink-0">
            {index}
          </div>
          <div>
            <div className="font-semibold text-[15px] leading-tight">
              {name}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {lessons.length} lessons · ~{total} min · weight{" "}
              {Math.round(weight * 100)}%
            </div>
          </div>
        </div>
        {done === lessons.length && lessons.length > 0 && (
          <span className="chip bg-emerald-50 border-emerald-200 text-emerald-700 shrink-0">
            <CheckCircle2 className="h-3 w-3" />
            Done
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
        {summary}
      </p>
      <div className="flex items-center gap-3">
        <ProgressBar
          value={pct}
          tone={pct === 100 ? "emerald" : "brand"}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
          {done}/{lessons.length}
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-700 transition-colors shrink-0" />
      </div>
    </Link>
  );
}

function PathStep({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="h-7 w-7 rounded-lg bg-brand-600 text-white text-xs font-semibold flex items-center justify-center shrink-0 tabular-nums">
        {num}
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-muted-foreground leading-relaxed">{body}</div>
      </div>
    </li>
  );
}

function Fact({ label, body }: { label: string; body: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="h-1.5 w-1.5 rounded-full bg-brand-600 mt-2 shrink-0" />
      <div>
        <div className="font-medium text-foreground">{label}</div>
        <div className="text-muted-foreground leading-relaxed">{body}</div>
      </div>
    </li>
  );
}
