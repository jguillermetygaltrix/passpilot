"use client";

/**
 * NextCertCard — surfaces curated next-cert recommendations + Multi-Cert
 * upsell. Drops in on the diagnostic results page and the dashboard.
 *
 * UX: 2-3 cards horizontally, each linking to /onboarding?exam={id} for a
 * fresh setup, OR (for Multi-Cert holders) directly to the dashboard with
 * the cert switched. CTA tier is auto-detected from useEntitlements().
 */

import Link from "next/link";
import { ArrowRight, GraduationCap, Sparkles, TrendingUp } from "lucide-react";
import type { ExamId } from "@/lib/types";
import { getExamMeta } from "@/lib/data/exams";
import { useEntitlements } from "@/lib/entitlements";
import { useApp } from "@/lib/store";
import {
  getRecommendations,
  getMultiCertSavingsCopy,
} from "@/lib/recommend";
import { Button } from "./ui/button";

interface Props {
  currentExamId: ExamId;
  currentReadinessScore?: number;
  /** "results" = diagnostic results full hero block; "dashboard" = compact strip. */
  variant?: "results" | "dashboard";
  className?: string;
}

export function NextCertCard({
  currentExamId,
  currentReadinessScore = 50,
  variant = "results",
  className,
}: Props) {
  const ent = useEntitlements();
  const updateProfile = useApp((s) => s.updateProfile);
  const recs = getRecommendations(currentExamId, currentReadinessScore, 2);

  if (recs.length === 0) return null;

  // Multi-Cert tier: switch cert in place (no checkout). Pro single-cert + Free:
  // route to /onboarding?exam={id} so the upsell can fire naturally.
  const handlePick = (examId: ExamId) => {
    if (ent.hasMulti) {
      updateProfile({ examId });
    }
  };

  if (variant === "dashboard") {
    return (
      <div className={`card-surface p-5 ${className ?? ""}`}>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3 flex items-center gap-1.5">
          <TrendingUp className="h-3 w-3" />
          What to study next
        </div>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {recs.map((r) => (
            <CompactRow key={r.examId} examId={r.examId} estimatedDays={r.estimatedDays} hasMulti={ent.hasMulti} onPick={handlePick} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`card-surface p-6 sm:p-7 bg-gradient-to-br from-violet-50/50 via-white to-cyan-50/30 ${className ?? ""}`}>
      <div className="flex items-start gap-3 mb-5">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-pop">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-violet-700 font-semibold mb-0.5">
            Multi-cert path
          </div>
          <h3 className="text-lg font-semibold leading-snug">
            What to take next
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1">
            Based on what you just studied, these are the highest-leverage adjacent certs.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {recs.map((r, i) => (
          <FullRow
            key={r.examId}
            rec={r}
            isPrimary={i === 0}
            hasMulti={ent.hasMulti}
            onPick={handlePick}
          />
        ))}
      </div>

      {!ent.hasMulti && (
        <div className="mt-5 pt-5 border-t border-violet-200/40">
          <div className="text-xs text-muted-foreground leading-relaxed mb-3">
            <Sparkles className="h-3 w-3 inline -mt-0.5 mr-1 text-violet-600" />
            {getMultiCertSavingsCopy()}
          </div>
          <Link href="/upgrade">
            <Button variant="primary" size="md" className="w-full sm:w-auto">
              <Sparkles className="h-4 w-4" />
              Unlock Multi-Cert
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function CompactRow({
  examId,
  estimatedDays,
  hasMulti,
  onPick,
}: {
  examId: ExamId;
  estimatedDays: number;
  hasMulti: boolean;
  onPick: (id: ExamId) => void;
}) {
  const meta = getExamMeta(examId);
  const href = hasMulti ? "/dashboard" : `/upgrade`;
  return (
    <Link
      href={href}
      onClick={() => hasMulti && onPick(examId)}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50/60 border border-border hover:border-brand-200 hover:bg-brand-50/30 transition-all group"
    >
      <div
        className="h-8 w-8 rounded-lg text-white flex items-center justify-center text-[10px] font-bold shrink-0"
        style={{
          background: `linear-gradient(135deg, ${meta.accentFrom}, ${meta.accentTo})`,
        }}
      >
        {meta.shortCode.split("-")[0].slice(0, 3)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{meta.name}</div>
        <div className="text-[11px] text-muted-foreground tabular-nums">
          ~{estimatedDays}d
        </div>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
    </Link>
  );
}

function FullRow({
  rec,
  isPrimary,
  hasMulti,
  onPick,
}: {
  rec: ReturnType<typeof getRecommendations>[number];
  isPrimary: boolean;
  hasMulti: boolean;
  onPick: (id: ExamId) => void;
}) {
  const meta = getExamMeta(rec.examId);
  const href = hasMulti ? "/dashboard" : `/upgrade`;
  return (
    <Link
      href={href}
      onClick={() => hasMulti && onPick(rec.examId)}
      className={`block rounded-xl border p-4 transition-all group ${
        isPrimary
          ? "border-violet-300 bg-white hover:border-violet-400 hover:shadow-card"
          : "border-border bg-white/60 hover:border-violet-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-xl text-white flex items-center justify-center text-xs font-bold shrink-0"
          style={{
            background: `linear-gradient(135deg, ${meta.accentFrom}, ${meta.accentTo})`,
          }}
        >
          {meta.shortCode.split("-")[0].slice(0, 3)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
            <div className="text-sm font-semibold">{meta.fullTitle}</div>
            {isPrimary && (
              <span className="chip bg-violet-100 border-violet-200 text-violet-800 text-[9px] py-0">
                Top pick
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {rec.rationale}
          </p>
          <div className="text-[11px] text-muted-foreground tabular-nums mt-1.5">
            ~{rec.estimatedDays} days at your current pace
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0 mt-1" />
      </div>
    </Link>
  );
}
