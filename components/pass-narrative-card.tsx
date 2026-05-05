"use client";

/**
 * <PassNarrativeCard /> — DEC-053 dashboard transformation.
 *
 * Replaces the bare "67/100 readiness · short insight paragraph" treatment
 * with a structured narrative that reads like a coach standing over your
 * shoulder. Three layers:
 *
 *   1. Headline — pass probability framed as a percentage (real-world
 *      framing the user actually wants to know)
 *   2. Lever — your single weakest seam + a counterfactual ("bring this
 *      to 80% → readiness jumps to N")
 *   3. Action — one specific, time-quantified next move
 *   4. Context line — streak/days-left framing for emotional grounding
 *
 * Pure presentation; all math + copy comes from lib/pass-narrative.ts so
 * the same narrative could be spoken by Listen mode or shown in a notification.
 */

import Link from "next/link";
import { ArrowRight, Sparkles, Target, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { GradientBorder } from "./ui/gradient-border";
import type { PassNarrative } from "@/lib/pass-narrative";

interface Props {
  narrative: PassNarrative;
  /** Hex/rgb gradient colors for the border + glow. Falls back to brand. */
  accentFrom?: string;
  accentTo?: string;
  /** Where the primary CTA should link. Defaults to /plan. */
  ctaHref?: string;
  /** Primary CTA label. Defaults to context-aware string. */
  ctaLabel?: string;
}

/**
 * Tone the headline + probability number based on the band so a 30%
 * passing reads as warning, 90% reads as celebration. The toning happens
 * here in the UI layer; the lib only emits the number + copy.
 */
function toneForProbability(p: number): {
  headlineText: string;
  ringText: string;
  ringBg: string;
} {
  if (p >= 85) {
    return {
      headlineText: "text-emerald-700 dark:text-emerald-300",
      ringText: "text-emerald-600 dark:text-emerald-300",
      ringBg: "bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30",
    };
  }
  if (p >= 65) {
    return {
      headlineText: "text-brand-700 dark:text-brand-300",
      ringText: "text-brand-600 dark:text-brand-300",
      ringBg: "bg-brand-50 dark:bg-brand-500/15 border-brand-200 dark:border-brand-500/30",
    };
  }
  if (p >= 40) {
    return {
      headlineText: "text-amber-700 dark:text-amber-300",
      ringText: "text-amber-600 dark:text-amber-300",
      ringBg: "bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30",
    };
  }
  return {
    headlineText: "text-rose-700 dark:text-rose-300",
    ringText: "text-rose-600 dark:text-rose-300",
    ringBg: "bg-rose-50 dark:bg-rose-500/15 border-rose-200 dark:border-rose-500/30",
  };
}

export function PassNarrativeCard({
  narrative,
  accentFrom = "#7c3aed",
  accentTo = "#06b6d4",
  ctaHref = "/plan",
  ctaLabel,
}: Props) {
  const tone = toneForProbability(narrative.passProbabilityPct);
  const finalCtaLabel =
    ctaLabel ??
    (narrative.passProbabilityPct >= 85
      ? "Maintain — open today's plan"
      : "Open today's plan");

  return (
    <GradientBorder
      gradient={`linear-gradient(135deg, ${accentFrom}40, ${accentTo}40, #ec489940)`}
      radius="20px"
      thickness={1.5}
      innerClassName="p-6 md:p-7 relative overflow-hidden"
    >
      {/* Atmospheric glow */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ background: accentFrom }}
        aria-hidden
      />

      <div className="relative">
        {/* Top row — pass-probability ring + headline */}
        <div className="flex items-start gap-4 mb-5">
          <div
            className={`shrink-0 h-20 w-20 rounded-2xl border ${tone.ringBg} flex flex-col items-center justify-center shadow-pop`}
            aria-label={`${narrative.passProbabilityPct}% pass probability`}
          >
            <div
              className={`text-2xl font-bold tabular-nums leading-none ${tone.ringText}`}
            >
              {narrative.passProbabilityPct}%
            </div>
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">
              pass-prob
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="chip bg-white dark:bg-card border-border text-foreground">
                <Sparkles className="h-3 w-3 text-brand-600" />
                Cirrus read
              </span>
            </div>
            <h2
              className={`text-[17px] sm:text-lg font-semibold leading-snug text-balance ${tone.headlineText}`}
            >
              {narrative.headline}
            </h2>
          </div>
        </div>

        {/* Lever block — the "one thing that moves the needle" */}
        <div className="rounded-xl border border-border bg-white/70 dark:bg-card/70 backdrop-blur-sm p-4 mb-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-500/30 flex items-center justify-center shrink-0">
              <Target className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                Your biggest lever
              </div>
              <div className="text-sm font-semibold leading-snug">
                {narrative.leverHeadline}
              </div>
              {narrative.leverDetail && (
                <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">
                  {narrative.leverDetail}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Micro-action block */}
        <div className="rounded-xl border border-border bg-white/70 dark:bg-card/70 backdrop-blur-sm p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-500/30 flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                Next move
              </div>
              <div className="text-sm leading-relaxed text-foreground">
                {narrative.microAction}
              </div>
            </div>
          </div>
        </div>

        {/* Context line — streak / days-left framing */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 italic">
          {narrative.contextLine}
        </p>

        <Link href={ctaHref}>
          <Button variant="primary" size="md" className="w-full sm:w-auto group">
            {finalCtaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </div>
    </GradientBorder>
  );
}
