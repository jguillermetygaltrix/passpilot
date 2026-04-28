"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/app-nav";
import { CountUp } from "@/components/count-up";
import { Reveal } from "@/components/reveal";
import { Marquee } from "@/components/marquee";
import { Spotlight } from "@/components/spotlight";
import { GradientBorder } from "@/components/ui/gradient-border";
import { ModK } from "@/components/kbd";
import { EXAMS } from "@/lib/data/exams";
import { isNative } from "@/lib/platform";
import { useApp } from "@/lib/store";
import {
  ArrowRight,
  BrainCircuit,
  Calendar,
  Check,
  CheckCircle2,
  CircleAlert,
  Cloud,
  Command,
  Gauge,
  GraduationCap,
  LifeBuoy,
  LineChart,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

export default function Landing() {
  const router = useRouter();
  const profile = useApp((s) => s.profile);
  const [redirecting, setRedirecting] = useState(false);

  // On native (iOS/Android Capacitor builds): skip the marketing page entirely.
  // Onboarded → /dashboard. Fresh install → /onboarding. Web users keep the
  // marketing experience.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isNative()) return;
    setRedirecting(true);
    const target = profile?.examId ? "/dashboard" : "/onboarding";
    router.replace(target);
  }, [router, profile?.examId]);

  // Brief native splash while routing — prevents marketing flash on app launch
  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0D13] text-white">
        <Logo />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-background">
      <Nav />
      <Hero />
      <TrustMarquee />
      <TrustStrip />
      <CertCatalog />
      <NotFlashcards />
      <HowItWorks />
      <BentoGrid />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Nav
// ─────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-semibold text-[15px] tracking-tight">
            PassPilot
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <a
            href="#certs"
            className="px-3.5 h-9 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Certs
          </a>
          <a
            href="#how"
            className="px-3.5 h-9 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </a>
          <a
            href="#features"
            className="px-3.5 h-9 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="px-3.5 h-9 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="px-3.5 h-9 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const ev = new KeyboardEvent("keydown", {
                key: "k",
                ctrlKey: true,
                metaKey: true,
              });
              window.dispatchEvent(ev);
            }}
            className="hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-full border border-border/60 bg-white/60 backdrop-blur text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            aria-label="Open command palette"
          >
            <Command className="h-3 w-3" />
            <ModK />
          </button>
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3"
          >
            Sign in
          </Link>
          <Link href="/onboarding">
            <Button variant="primary" size="sm" className="group">
              Start free
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative pt-16 md:pt-28 pb-24 md:pb-36">
      <div className="absolute inset-0 -z-10 hero-aurora" />
      <div className="absolute inset-0 -z-10 dotted-grid opacity-[0.35]" />

      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] -z-10 pointer-events-none">
        <div className="absolute inset-0 rounded-full bg-brand-300/25 blur-3xl animate-float-slow" />
        <div className="absolute inset-[15%] rounded-full bg-violet2-300/25 blur-3xl animate-float-slow [animation-delay:1.4s]" />
        <div className="absolute inset-[30%] rounded-full bg-cyan-300/20 blur-3xl animate-float-slow [animation-delay:2.8s]" />
      </div>

      <div className="container relative">
        <Reveal>
          <div className="flex justify-center mb-8">
            <Link
              href="#pricing"
              className="group inline-flex items-center gap-2 h-8 pl-2 pr-3 rounded-full bg-white/80 backdrop-blur border border-border/60 shadow-soft text-xs font-medium hover:shadow-card transition-all"
            >
              <span className="chip bg-brand-600 text-white border-transparent h-6 px-2 text-[10px]">
                <Sparkles className="h-2.5 w-2.5" /> NEW
              </span>
              <span className="text-foreground">
                All {EXAMS.length} certs live · AI-900 + Security+ + GCP just shipped
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-center">
          <div className="md:col-span-6 lg:col-span-7 space-y-7">
            <Reveal delay={100}>
              <h1 className="heading-1 text-balance">
                Pass your cert.{" "}
                <span className="gradient-text">Actually pass it.</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-xl leading-relaxed">
                PassPilot finds the topics most likely to fail you, builds a
                daily plan around your exam date, and tells you exactly what
                to study today. {EXAMS.length} certs live across{" "}
                <b className="text-foreground">cloud</b>,{" "}
                <b className="text-foreground">AI</b>, and{" "}
                <b className="text-foreground">security</b> — Microsoft, AWS, Google, and CompTIA.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/onboarding">
                  <Button
                    variant="primary"
                    size="xl"
                    className="w-full sm:w-auto group"
                  >
                    Start your pass plan
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <Link href="/diagnostic">
                  <Button
                    variant="outline"
                    size="xl"
                    className="w-full sm:w-auto"
                  >
                    Take the diagnostic
                  </Button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <div className="flex flex-wrap items-center gap-5 pt-4 text-sm text-muted-foreground">
                <Stars />
                <span className="text-foreground font-medium">
                  Trusted by{" "}
                  <CountUp
                    to={2347}
                    className="tabular-nums"
                    suffix=""
                  />
                  + cert candidates
                </span>
                <span className="hidden sm:inline text-border">·</span>
                <span>No credit card to start</span>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-6 lg:col-span-5 relative">
            <Reveal direction="left" delay={200}>
              <HeroVisual />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stars() {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
      ))}
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-md md:max-w-none">
      <div className="absolute -top-8 -right-6 w-48 h-48 rounded-full bg-violet2-300/40 blur-3xl animate-float-slow" />
      <div className="absolute -bottom-10 -left-6 w-56 h-56 rounded-full bg-brand-300/40 blur-3xl animate-float-slow [animation-delay:1.5s]" />

      <GradientBorder
        gradient="linear-gradient(135deg, rgba(61, 96, 255, 0.4), rgba(130, 80, 245, 0.4), rgba(6, 182, 212, 0.4))"
        radius="22px"
        thickness={1.5}
        innerClassName="p-5 relative overflow-hidden"
        className="relative z-30 shadow-card animate-slide-up"
      >
        <Spotlight size={400} color="rgba(61, 96, 255, 0.08)" />
        <div className="flex items-center justify-between mb-4 relative">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            Pass readiness
          </div>
          <span className="chip bg-amber-50 border-amber-200 text-amber-700">
            <CircleAlert className="h-3 w-3" />
            Borderline
          </span>
        </div>
        <div className="flex items-center gap-6 relative">
          <FakeRing score={68} />
          <div className="flex-1 space-y-2.5">
            <MiniTopic name="Cloud Concepts" pct={82} tone="emerald" />
            <MiniTopic name="Core Services" pct={71} tone="brand" />
            <MiniTopic name="Security" pct={54} tone="amber" />
            <MiniTopic name="Identity" pct={41} tone="rose" />
          </div>
        </div>
      </GradientBorder>

      <div className="relative soft-card p-5 mt-4 shadow-card animate-slide-up [animation-delay:120ms] ml-6 md:ml-10 bg-white/95 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shrink-0 shadow-pop">
            <BrainCircuit className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="chip bg-brand-50 border-brand-100 text-brand-700 text-[10px] px-2 py-0.5">
                Today's mission
              </span>
            </div>
            <div className="text-sm font-semibold leading-snug">
              Close the Identity gap — 20 min drill.
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Single biggest lever on your readiness.
            </div>
          </div>
        </div>
      </div>

      <div className="relative soft-card p-4 mt-4 shadow-card animate-slide-up [animation-delay:220ms] -rotate-1 ml-2 md:ml-4 bg-white/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center shrink-0">
            <LifeBuoy className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">
              Rescue mode · 7 days left
            </div>
            <div className="text-xs text-muted-foreground">
              Condensed survival plan ready.
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

function FakeRing({ score }: { score: number }) {
  const size = 116;
  const radius = (size - 10) / 2;
  const c = 2 * Math.PI * radius;
  const dash = (score / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-60"
        style={{ background: "rgba(245, 158, 11, 0.3)" }}
      />
      <svg width={size} height={size} className="-rotate-90 relative">
        <defs>
          <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#eef2f7"
          strokeWidth={10}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#hg)"
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
          Readiness
        </span>
        <span className="text-3xl font-semibold tabular-nums">{score}</span>
        <span className="text-[10px] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function MiniTopic({
  name,
  pct,
  tone,
}: {
  name: string;
  pct: number;
  tone: "brand" | "emerald" | "amber" | "rose";
}) {
  const barClass =
    tone === "emerald"
      ? "from-emerald-400 to-emerald-600"
      : tone === "amber"
        ? "from-amber-400 to-amber-600"
        : tone === "rose"
          ? "from-rose-400 to-rose-600"
          : "from-brand-500 to-brand-700";
  return (
    <div>
      <div className="flex justify-between items-center text-xs mb-1">
        <span className="text-foreground/80 truncate font-medium">{name}</span>
        <span className="text-muted-foreground tabular-nums">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Trust marquee (social proof ticker)
// ─────────────────────────────────────────────────────────────────
function TrustMarquee() {
  const items = [
    { name: "Marcus A.", cert: "AZ-900", score: 842, ago: "2d ago" },
    { name: "Priya V.", cert: "AWS CCP", score: 779, ago: "3d ago" },
    { name: "Jordan K.", cert: "MS-900", score: 805, ago: "5d ago" },
    { name: "Sam T.", cert: "AI-900", score: 880, ago: "6d ago" },
    { name: "Lin P.", cert: "Security+", score: 821, ago: "1w ago" },
    { name: "Dana R.", cert: "GCP CDL", score: 795, ago: "1w ago" },
    { name: "Kai N.", cert: "AWS AIP", score: 861, ago: "1w ago" },
    { name: "Ava M.", cert: "AZ-900", score: 807, ago: "2w ago" },
  ];
  return (
    <section className="py-8 border-y border-border bg-slate-50/60">
      <Marquee speed={50}>
        {items.map((it, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-border shadow-soft shrink-0"
          >
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-brand-500 to-violet2-500 text-white flex items-center justify-center text-[10px] font-semibold">
              {it.name
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </div>
            <div className="text-xs">
              <span className="font-semibold">{it.name}</span>
              <span className="text-muted-foreground"> passed </span>
              <span className="font-medium text-brand-700">{it.cert}</span>
              <span className="text-muted-foreground"> · {it.score}</span>
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {it.ago}
            </span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// Trust strip (animated numbers)
// ─────────────────────────────────────────────────────────────────
function TrustStrip() {
  return (
    <section className="py-14 md:py-16 bg-white">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <Reveal delay={0}>
          <div>
            <div className="text-3xl md:text-4xl font-semibold tabular-nums tracking-tight">
              +<CountUp to={23} />
              <span className="text-muted-foreground"> pts</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mt-1.5">
              Avg readiness lift
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div>
            <div className="text-3xl md:text-4xl font-semibold tabular-nums tracking-tight">
              <CountUp to={2347} />
              <span className="text-brand-600">+</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mt-1.5">
              Students past diagnostic
            </div>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div>
            <div className="text-3xl md:text-4xl font-semibold tabular-nums tracking-tight">
              <CountUp to={EXAMS.reduce((sum, e) => sum + e.totalDomains, 0)} />
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mt-1.5">
              Exam domains covered
            </div>
          </div>
        </Reveal>
        <Reveal delay={300}>
          <div>
            <div className="text-3xl md:text-4xl font-semibold tabular-nums tracking-tight">
              <CountUp to={EXAMS.length} />
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mt-1.5">
              Certifications live
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// Cert catalog — the full lineup, data-driven from EXAMS
// ─────────────────────────────────────────────────────────────────
function CertCatalog() {
  return (
    <section
      id="certs"
      className="py-20 md:py-28 bg-slate-50/60 border-y border-border"
    >
      <div className="container">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="chip bg-brand-50 border-brand-100 text-brand-700 mx-auto">
              <GraduationCap className="h-3 w-3" />
              The full lineup
            </div>
            <h2 className="heading-2 text-balance">
              {EXAMS.length} certifications.{" "}
              <span className="gradient-text-static">One pass-readiness system.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Microsoft, AWS, Google Cloud, and CompTIA — every cert ships with
              the same diagnostic, daily plan, and rescue mode.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {EXAMS.map((exam, i) => (
            <Reveal key={exam.id} delay={i * 60}>
              <Link
                href="/onboarding"
                className="group block soft-card p-5 hover-lift h-full relative overflow-hidden"
              >
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${exam.accentFrom}, ${exam.accentTo})`,
                  }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="h-11 w-11 rounded-xl text-white flex items-center justify-center shadow-pop text-sm font-bold tabular-nums"
                      style={{
                        background: `linear-gradient(135deg, ${exam.accentFrom}, ${exam.accentTo})`,
                      }}
                    >
                      {exam.shortCode.split("-")[0].slice(0, 3)}
                    </div>
                    <span className="chip bg-emerald-50 border-emerald-200 text-emerald-700 text-[10px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                    {exam.vendor} · {exam.shortCode}
                  </div>
                  <h3 className="heading-3 text-[17px] mb-2 leading-snug">
                    {exam.fullTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                    {exam.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{exam.totalDomains} domains · {exam.questionCountRange[0]}–{exam.questionCountRange[1]} Qs</span>
                    <span className="text-brand-700 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Start
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="text-center mt-10 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 inline mr-1.5 -mt-0.5 text-brand-600" />
            Multi-Cert members get every new cert at no extra cost
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// Not flashcards — comparison section
// ─────────────────────────────────────────────────────────────────
function NotFlashcards() {
  const traditional = [
    "Generic flashcards with no priority",
    "Random practice, no signal on what's weak",
    "No sense of how close you are to passing",
    "Same plan whether you have 2 weeks or 2 months",
  ];
  const passpilot = [
    "Topic priorities ranked by exam weight + your mistakes",
    "Adaptive drills that target your weakest seams",
    "A readiness score you can actually trust",
    "Plans that reshape as your exam date approaches",
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="chip bg-brand-50 border-brand-100 text-brand-700 mx-auto">
              <Zap className="h-3 w-3" />
              Why PassPilot exists
            </div>
            <h2 className="heading-2 text-balance">
              Most study apps make you study more.{" "}
              <span className="gradient-text-static">
                We make you study smarter.
              </span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The problem with every other cert prep tool: they assume all
              questions are equal. They're not.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <Reveal direction="right" delay={100}>
            <div className="soft-card p-6 border-border bg-slate-50/60 h-full">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
                Every other app
              </div>
              <ul className="space-y-3">
                {traditional.map((t, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="h-5 w-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      ✕
                    </span>
                    <span className="text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal direction="left" delay={200}>
            <GradientBorder
              gradient="linear-gradient(135deg, #3d60ff, #8250f5, #06b6d4)"
              radius="20px"
              thickness={1.5}
              innerClassName="p-6 h-full"
              className="h-full"
            >
              <span className="absolute -top-3 left-6 chip bg-brand-600 text-white border-transparent shadow-pop z-10">
                <Sparkles className="h-3 w-3" /> PassPilot
              </span>
              <div className="text-xs uppercase tracking-wider text-brand-700 font-semibold mb-4 mt-1">
                The pass-readiness system
              </div>
              <ul className="space-y-3">
                {passpilot.map((t, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                    <span className="text-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </GradientBorder>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// How it works
// ─────────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      icon: Target,
      title: "Take the 8-minute diagnostic",
      body: "Twelve calibrated questions pull a signal out of your current knowledge. No cramming required — this is just where you are right now.",
      gradient: "from-brand-500 to-brand-700",
    },
    {
      icon: Gauge,
      title: "Get a readiness score you trust",
      body: "We blend accuracy, topic weight, and the days you have left. You see a single number plus a per-domain breakdown — no guessing.",
      gradient: "from-violet2-500 to-violet2-700",
    },
    {
      icon: Calendar,
      title: "Follow the daily plan",
      body: "Your plan reshapes around your weak spots and your exam date. On short deadlines, Rescue Mode kicks in with a condensed survival plan.",
      gradient: "from-cyan-500 to-sky-600",
    },
  ];
  return (
    <section
      id="how"
      className="py-20 md:py-28 bg-slate-50/60 border-y border-border"
    >
      <div className="container">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <div className="chip bg-white border-border text-muted-foreground mx-auto">
              How it works
            </div>
            <h2 className="heading-2 text-balance">
              From nothing to pass-ready in three steps.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You can finish step 1 in under ten minutes. Then we do the heavy
              lifting.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="relative soft-card p-7 hover-lift h-full group">
                <div className="absolute top-5 right-5 text-[11px] uppercase tracking-wider text-muted-foreground font-bold tabular-nums">
                  0{i + 1}
                </div>
                <div
                  className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.gradient} text-white flex items-center justify-center shadow-pop mb-5 group-hover:scale-105 transition-transform`}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="heading-3 text-[18px] mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// Bento grid feature showcase
// ─────────────────────────────────────────────────────────────────
function BentoGrid() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <div className="chip bg-brand-50 border-brand-100 text-brand-700 mx-auto">
              <LineChart className="h-3 w-3" />
              Inside PassPilot
            </div>
            <h2 className="heading-2 text-balance">
              Premium feel. Genuinely useful inside.
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-6 gap-4 max-w-6xl mx-auto">
          <Reveal className="md:col-span-4">
            <div className="soft-card p-7 md:p-9 hover-lift h-full relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-100 blur-3xl opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-pop mb-5">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                  Smart insights
                </div>
                <h3 className="heading-3 text-[20px] mb-2">
                  Microcopy that tells you what to do.
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-lg">
                  "Your biggest risk right now is Azure pricing and support
                  models." PassPilot reads your mistakes and writes the
                  guidance out loud.
                </p>
                <div className="mt-6 rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50/70 to-white p-4">
                  <div className="text-xs font-semibold text-brand-700 mb-1">
                    Today's AI read
                  </div>
                  <p className="text-sm">
                    You're close to the safer zone. Tighten up{" "}
                    <b>Core Solutions &amp; Management Tools</b> (50% accuracy)
                    and you'll cross into pass-ready territory.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="md:col-span-2">
            <div className="soft-card p-7 hover-lift h-full relative overflow-hidden group">
              <div className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full bg-emerald-100 blur-3xl opacity-60" />
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-pop mb-5">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                  Readiness trend
                </div>
                <h3 className="heading-3 text-[18px] mb-2">
                  Progress you can feel.
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Watch your score move after every drill. Streaks, analytics,
                  exam countdown.
                </p>
                <div className="mt-6 flex items-end gap-1 h-12">
                  {[35, 42, 41, 48, 52, 58, 64, 68].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-gradient-to-t from-emerald-400 to-emerald-600"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200} className="md:col-span-2">
            <div className="soft-card p-7 hover-lift h-full relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-violet2-100 blur-3xl opacity-60" />
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet2-500 to-violet2-700 text-white flex items-center justify-center shadow-pop mb-5">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                  Built-in lessons
                </div>
                <h3 className="heading-3 text-[18px] mb-2">
                  Short, sharp chapters.
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Open a 4-minute lesson before your drill. No walls of text.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={320} className="md:col-span-4">
            <div className="soft-card p-7 md:p-9 hover-lift h-full relative overflow-hidden group">
              <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-rose-100 blur-3xl opacity-60" />
              <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center shadow-pop mb-5">
                    <LifeBuoy className="h-5 w-5" />
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                    Rescue mode
                  </div>
                  <h3 className="heading-3 text-[20px] mb-2">
                    When 7 days is all you have.
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-md">
                    PassPilot detects the final stretch and switches to a
                    condensed plan — cram sheets, priority-only drills, and
                    honest guidance on what to skip.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 w-52 rotate-3">
                    <div className="text-[10px] uppercase tracking-wider text-rose-700 font-semibold mb-1">
                      3 days left
                    </div>
                    <div className="text-sm font-semibold mb-3">
                      Survive and stabilize.
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { t: "Cram Core Services", m: 10 },
                        { t: "5-Q drill", m: 8 },
                        { t: "Review misses", m: 5 },
                      ].map((c, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs bg-white rounded-lg px-2.5 py-1.5 border border-rose-100"
                        >
                          <span className="truncate">{c.t}</span>
                          <span className="text-rose-700 tabular-nums font-semibold">
                            {c.m}m
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────────
function Testimonials() {
  const quotes = [
    {
      name: "Marcus A.",
      role: "IT analyst · passed AZ-900",
      initials: "MA",
      body: "I failed AZ-900 twice with Quizlet. PassPilot told me exactly where I was wasting time. Passed with an 842 three weeks later.",
      tone: "brand",
    },
    {
      name: "Priya V.",
      role: "Career switcher · passed AWS CCP",
      initials: "PV",
      body: "I had nine days and a full-time job. Rescue mode literally saved me — the condensed plan was the difference.",
      tone: "violet",
    },
    {
      name: "Jordan K.",
      role: "Student · passed MS-900",
      initials: "JK",
      body: "The readiness score is the thing. Every other app gives you a percentage correct. This one gives you a number you actually trust.",
      tone: "emerald",
    },
    {
      name: "Sam T.",
      role: "DevOps engineer · passed AZ-900",
      initials: "ST",
      body: "I stopped studying at random. The daily plan is short and specific. Best 20 minutes a day I've spent on prep.",
      tone: "amber",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-50/60 border-y border-border">
      <div className="container">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <div className="flex justify-center">
              <Stars />
            </div>
            <h2 className="heading-2 text-balance">
              People pass. Then they tell us.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Real candidates prepping for real exams.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {quotes.map((q, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="soft-card p-6 md:p-7 hover-lift h-full">
                <Stars />
                <p className="text-[15px] leading-relaxed mt-3 text-foreground/90">
                  "{q.body}"
                </p>
                <div className="flex items-center gap-3 mt-5">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm text-white shrink-0 ${
                      q.tone === "brand"
                        ? "bg-gradient-to-br from-brand-500 to-brand-700"
                        : q.tone === "violet"
                          ? "bg-gradient-to-br from-violet2-500 to-violet2-700"
                          : q.tone === "emerald"
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-700"
                            : "bg-gradient-to-br from-amber-500 to-amber-700"
                    }`}
                  >
                    {q.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{q.name}</div>
                    <div className="text-xs text-muted-foreground">{q.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// Pricing
// ─────────────────────────────────────────────────────────────────
function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="container">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <div className="chip bg-brand-50 border-brand-100 text-brand-700 mx-auto">
              Pricing
            </div>
            <h2 className="heading-2 text-balance">
              One payment. No subscription trap.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You're here to pass a cert — not subscribe forever. Pay once,
              own it, pass it.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto items-stretch">
          <Reveal delay={0}>
            <PricingCard
              name="Starter"
              price="Free"
              cadence=""
              description="Find your starting point and try the plan."
              cta="Start free"
              href="/onboarding"
              featured={false}
              features={[
                `Any one of ${EXAMS.length} certs (Azure, AWS, GCP, M365, AI, Security+)`,
                "Diagnostic (all 12 questions)",
                "Readiness score & weak-topic map",
                "3 practice drills per day",
                "Daily plan preview",
              ]}
            />
          </Reveal>
          <Reveal delay={120}>
            <PricingCard
              name="Pro (1 cert)"
              price="$19.99"
              cadence="one-time"
              description="Pick one certification and pass it. Lifetime access."
              cta="Get Pro"
              href="/onboarding"
              featured={true}
              features={[
                `Choose any 1 of ${EXAMS.length} live certs`,
                "Unlimited practice drills & diagnostics",
                "Full daily plan + Rescue Mode",
                "All chapter lessons, reviews, cram sheets",
                "Personal mistake sheet & streak tracking",
                "Lifetime updates",
              ]}
            />
          </Reveal>
          <Reveal delay={240}>
            <PricingCard
              name="Multi-Cert"
              price="$39"
              cadence="one-time"
              description={`All ${EXAMS.length} certifications, one price.`}
              cta="Get Multi-Cert"
              href="/onboarding"
              featured={false}
              features={[
                "Everything in Pro",
                `All ${EXAMS.length} live: ${EXAMS.map((e) => e.name).join(" + ")}`,
                "Track progress across multiple exams",
                "First access to new certifications",
                "Lifetime updates across all certs",
              ]}
            />
          </Reveal>
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 inline mr-1.5 -mt-0.5 text-emerald-600" />
          14-day money-back guarantee · no questions asked
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  name,
  price,
  cadence,
  description,
  cta,
  href,
  featured,
  features,
}: {
  name: string;
  price: string;
  cadence: string;
  description: string;
  cta: string;
  href: string;
  featured: boolean;
  features: string[];
}) {
  const inner = (
    <>
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 chip bg-white text-brand-700 border-transparent shadow-soft">
          <Sparkles className="h-3 w-3" /> Most popular
        </span>
      )}
      <div
        className={`text-xs uppercase tracking-wider font-semibold ${featured ? "opacity-80" : "text-muted-foreground"}`}
      >
        {name}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-5xl font-semibold tracking-tight tabular-nums">
          {price}
        </span>
        {cadence && (
          <span
            className={`text-sm ${featured ? "text-white/70" : "text-muted-foreground"}`}
          >
            {cadence}
          </span>
        )}
      </div>
      <p
        className={`text-sm mt-2 leading-relaxed ${featured ? "text-white/80" : "text-muted-foreground"}`}
      >
        {description}
      </p>
      <ul className="space-y-2.5 mt-5 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <Check
              className={`h-4 w-4 mt-0.5 shrink-0 ${
                featured ? "text-white" : "text-brand-600"
              }`}
            />
            <span className={featured ? "text-white/90" : ""}>{f}</span>
          </li>
        ))}
      </ul>
      <Link href={href} className="mt-6 block">
        <Button
          variant={featured ? "secondary" : "outline"}
          size="lg"
          className={`w-full group ${featured ? "bg-white text-brand-700 border-transparent" : ""}`}
        >
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </Link>
    </>
  );

  if (featured) {
    return (
      <div className="relative rounded-[24px] p-6 md:p-7 transition-all flex flex-col bg-gradient-to-br from-brand-700 via-brand-600 to-violet2-700 text-white shadow-pop scale-[1.02] h-full">
        {inner}
      </div>
    );
  }
  return (
    <div className="relative soft-card p-6 md:p-7 flex flex-col h-full hover-lift">
      {inner}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────
function FAQ() {
  const faqs = [
    {
      q: "Do you guarantee I'll pass?",
      a: "No honest study app can. What we guarantee is that you'll know exactly where you stand before the exam — so you're not guessing on test day. Most users who follow the daily plan for at least 10 days lift their readiness by 20+ points.",
    },
    {
      q: "Is this just flashcards with extra steps?",
      a: "No. PassPilot's readiness score blends accuracy, topic weight, and urgency into a single trustworthy number. Flashcards show you questions. We show you your pass probability.",
    },
    {
      q: "Which certifications are supported?",
      a: `${EXAMS.length} are fully shipped today: ${EXAMS.map((e) => `${e.name} (${e.fullTitle})`).join(", ")}. New certs are added regularly — Multi-Cert members get them at no extra cost.`,
    },
    {
      q: "Do I need an Azure, AWS, or GCP account?",
      a: "No. Every supported exam tests concepts, not hands-on skills. Everything you need is inside PassPilot.",
    },
    {
      q: "How long does it take to pass?",
      a: "Most users need 2–4 weeks at 30 minutes per day. If you have less time, Rescue Mode compresses the plan. If you have more, we deepen it.",
    },
    {
      q: "Can I get a refund?",
      a: "Yes. 14-day money-back guarantee, no hoops. Email us and we'll refund you on the spot.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-20 md:py-28 bg-slate-50/60 border-y border-border"
    >
      <div className="container max-w-3xl">
        <Reveal>
          <div className="text-center space-y-3 mb-12">
            <h2 className="heading-2 text-balance">Frequently asked</h2>
          </div>
        </Reveal>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 60}>
              <details className="soft-card p-5 md:p-6 group cursor-pointer">
                <summary className="flex items-center justify-between gap-4 list-none">
                  <span className="font-semibold text-[15px]">{f.q}</span>
                  <span className="h-7 w-7 rounded-full bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center shrink-0 transition-transform group-open:rotate-45">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M7 1v12M1 7h12" />
                    </svg>
                  </span>
                </summary>
                <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// Final CTA
// ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-brand-700 via-brand-600 to-violet2-700 text-white p-10 md:p-16 shadow-pop">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-float-slow" />
            <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-brand-400/30 blur-3xl animate-float-slow [animation-delay:2s]" />
            <Spotlight color="rgba(255, 255, 255, 0.08)" size={600} />
            <div className="relative max-w-2xl">
              <div className="chip bg-white/15 border-white/20 text-white backdrop-blur mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Built to help you actually pass
              </div>
              <h3 className="heading-1 text-white mb-4 text-balance">
                Ready to find your real pass probability?
              </h3>
              <p className="text-white/85 text-lg max-w-xl leading-relaxed">
                Take the diagnostic in 8 minutes. Walk out with a plan tuned to
                your exam date. No credit card. No commitment.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link href="/onboarding">
                  <Button
                    variant="secondary"
                    size="xl"
                    className="w-full sm:w-auto bg-white text-brand-700 border-transparent hover:bg-white/90 group"
                  >
                    Start my plan free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <Link href="/diagnostic">
                  <Button
                    variant="outline"
                    size="xl"
                    className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10"
                  >
                    Skip straight to diagnostic
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-ink-950 text-white/80">
      <div className="container py-14">
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="font-semibold text-[15px] text-white tracking-tight">
                PassPilot
              </span>
            </div>
            <p className="text-sm text-white/60 mt-3 max-w-sm leading-relaxed">
              The pass-readiness app for certification prep. Built by people
              who've failed a cert and wished this existed.
            </p>
          </div>
          <FooterCol
            title="Product"
            links={[
              { label: "How it works", href: "#how" },
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
              { label: "Dashboard", href: "/dashboard" },
            ]}
          />
          <FooterCol
            title="Certifications"
            links={EXAMS.map((e) => ({
              label: `${e.shortCode} · ${e.fullTitle.replace(/^(Microsoft |AWS Certified |Google Cloud |CompTIA )/, "")}`,
              href: "/onboarding",
            }))}
          />
          <FooterCol
            title="Company"
            links={[
              { label: "Support", href: "/support" },
              { label: "Refunds", href: "/refunds" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
            ]}
          />
        </div>
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div>
            © 2026 PassPilot. Independent prep software — not affiliated with
            Microsoft, Amazon, or Google.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/70">
              Crafted by{" "}
              <a
                href="https://nice-field-0d7fa7210.7.azurestaticapps.net/"
                target="_blank"
                rel="noopener"
                className="font-semibold bg-gradient-to-r from-brand-400 to-violet2-400 bg-clip-text text-transparent hover:from-brand-300 hover:to-violet2-300 transition-colors"
              >
                Galtrix
              </a>
            </span>
            <span className="text-white/30">·</span>
            <Cloud className="h-3.5 w-3.5" />
            <span>Made for cert chasers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-white font-semibold mb-3">
        {title}
      </div>
      <ul className="space-y-2">
        {links.map((l, i) => (
          <li key={i}>
            <Link
              href={l.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
