"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import { HydrationGate } from "@/components/hydration-gate";
import { Button } from "@/components/ui/button";
import { useApp, useMasteryAndReadiness } from "@/lib/store";
import { useEntitlements } from "@/lib/entitlements";
import { getExamMeta } from "@/lib/data/exams";
import { getTopicsForExam, TOPIC_MAP } from "@/lib/data/topics";
import { track } from "@/lib/usage";
import {
  FileDown,
  Printer,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Zap,
  Calendar,
} from "lucide-react";
import { UpgradeWall } from "@/components/upgrade-wall";
import { cn } from "@/lib/utils";

const MAX_TOPICS = 6; // keeps the printout to 1-2 pages

export default function CramPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const { profile } = useApp();
  const ent = useEntitlements();
  const mr = useMasteryAndReadiness();
  const [selectedIds, setSelectedIds] = useState<string[] | null>(null); // null = auto
  const [wallOpen, setWallOpen] = useState(false);

  if (!profile || !mr) return null;

  const exam = getExamMeta(profile.examId);
  const allTopics = getTopicsForExam(profile.examId);
  const { mastery, readiness } = mr;

  // Auto-select: top weakest by priority (uses existing scoring engine).
  // Falls back to highest-weight topics if user has no mastery data yet.
  const autoSelected = useMemo(() => {
    const withMastery = mastery.length
      ? [...mastery]
          .sort((a, b) => b.priority - a.priority)
          .slice(0, MAX_TOPICS)
          .map((m) => m.topicId)
      : [...allTopics]
          .sort((a, b) => b.weight - a.weight)
          .slice(0, MAX_TOPICS)
          .map((t) => t.id);
    return withMastery;
  }, [mastery, allTopics]);

  const effectiveIds = selectedIds ?? autoSelected;
  const selectedTopics = effectiveIds
    .map((id) => TOPIC_MAP[id])
    .filter(Boolean);

  const daysLeft = profile.examDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(profile.examDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;

  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handlePrint = () => {
    if (!ent.canAccessCramAndKeyFacts) {
      setWallOpen(true);
      return;
    }
    track.contentExported("cram-sheet");
    // Tiny tick so React paints the print-clean state before the dialog
    setTimeout(() => window.print(), 50);
  };

  const toggleTopic = (id: string) => {
    setSelectedIds((prev) => {
      const base = prev ?? autoSelected;
      if (base.includes(id)) {
        return base.filter((x) => x !== id);
      }
      if (base.length >= MAX_TOPICS) return base; // cap
      return [...base, id];
    });
  };

  return (
    <>
      <UpgradeWall
        open={wallOpen}
        onClose={() => setWallOpen(false)}
        reason="Cram Sheet · Pro feature"
        headline="Take your one-page cram sheet anywhere"
        sub="Auto-built from your weakest topics + the highest-yield facts on the exam blueprint."
      />

      {/* Screen-only chrome: nav + controls */}
      <div className="print:hidden">
        <AppNav />
      </div>

      <AppShell>
        {/* Screen-only intro + controls */}
        <div className="print:hidden mb-6 max-w-3xl mx-auto space-y-5">
          <div className="text-center space-y-3">
            <div className="chip bg-amber-50 border-amber-100 text-amber-700 mx-auto">
              <FileDown className="h-3 w-3" />
              Cram Sheet
            </div>
            <h1 className="heading-2 text-balance">
              Your night-before printable.
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Auto-built from your weakest topics + the highest-yield facts on the
              {" "}
              {exam.name} blueprint. Pick up to {MAX_TOPICS} topics — the layout fits
              on 1-2 printed pages.
            </p>
          </div>

          {!ent.canAccessCramAndKeyFacts && (
            <div className="card-surface p-5 border-amber-200 bg-amber-50/40 flex items-start gap-3">
              <Lock className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1">
                  Cram Sheet is a Pro feature
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Free tier sees the preview but can't export. Upgrade once and own
                  your cram sheet for life.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setWallOpen(true)}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Unlock cram sheet
                </Button>
              </div>
            </div>
          )}

          {/* Topic picker */}
          <div className="card-surface p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Topics in your sheet
              </div>
              <button
                onClick={() => setSelectedIds(null)}
                className="text-xs text-brand-700 hover:underline"
              >
                Auto-pick weakest
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {allTopics.map((t) => {
                const checked = effectiveIds.includes(t.id);
                const m = mastery.find((mm) => mm.topicId === t.id);
                const accuracyPct = m && m.attempts > 0
                  ? Math.round(m.accuracy * 100)
                  : null;
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTopic(t.id)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
                      checked
                        ? "border-amber-400 bg-amber-50/60 ring-2 ring-amber-200"
                        : "border-border hover:border-amber-200 hover:bg-amber-50/30"
                    )}
                  >
                    <span
                      className={cn(
                        "h-5 w-5 rounded border flex items-center justify-center shrink-0 mt-0.5",
                        checked
                          ? "border-amber-600 bg-amber-600 text-white"
                          : "border-border bg-white"
                      )}
                    >
                      {checked && <CheckCircle2 className="h-3 w-3" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">
                        {t.name}
                      </div>
                      <div className="text-xs text-muted-foreground tabular-nums mt-0.5">
                        Weight {Math.round(t.weight * 100)}%
                        {accuracyPct !== null && ` · You: ${accuracyPct}%`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="text-[11px] text-muted-foreground mt-3 text-center">
              {effectiveIds.length} of {MAX_TOPICS} selected
            </div>
          </div>

          {/* Print CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="xl"
              className="flex-1 group"
              onClick={handlePrint}
              disabled={selectedTopics.length === 0}
            >
              <Printer className="h-4 w-4" />
              Print or save as PDF
            </Button>
            <Link href="/dashboard" className="sm:flex-shrink-0">
              <Button variant="outline" size="xl" className="w-full">
                Back to dashboard
              </Button>
            </Link>
          </div>
          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            Your browser's print dialog has a "Save as PDF" option. On phone, share to Files.
          </p>
        </div>

        {/* THE PRINTABLE SHEET — visible on screen as a preview, scaled for print */}
        <article className="cram-sheet bg-white text-[#0B0D13] mx-auto max-w-[820px] border border-border rounded-2xl shadow-card print:shadow-none print:border-0 print:rounded-none print:max-w-none p-6 sm:p-8 print:p-6">
          {/* Header */}
          <header className="border-b-2 border-[#0B0D13] pb-3 mb-4 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#0B0D13]/70 font-bold mb-1">
                PassPilot · Cram Sheet
              </div>
              <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                {exam.shortCode} · {exam.fullTitle}
              </h2>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#0B0D13]/70 font-bold">
                Generated
              </div>
              <div className="text-sm font-semibold tabular-nums">{today}</div>
            </div>
          </header>

          {/* Status strip */}
          <div className="grid grid-cols-3 gap-3 mb-5 text-center">
            <div className="border border-[#0B0D13]/15 rounded-md p-2">
              <div className="text-[9px] uppercase tracking-wider text-[#0B0D13]/60 font-bold">
                Pass score
              </div>
              <div className="text-base font-bold tabular-nums">
                {exam.passScore}%
              </div>
            </div>
            <div className="border border-[#0B0D13]/15 rounded-md p-2">
              <div className="text-[9px] uppercase tracking-wider text-[#0B0D13]/60 font-bold">
                Your readiness
              </div>
              <div className="text-base font-bold tabular-nums">
                {readiness.score}%
              </div>
            </div>
            <div className="border border-[#0B0D13]/15 rounded-md p-2">
              <div className="text-[9px] uppercase tracking-wider text-[#0B0D13]/60 font-bold">
                Days to exam
              </div>
              <div className="text-base font-bold tabular-nums">
                {daysLeft ?? "—"}
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="space-y-4">
            {selectedTopics.length === 0 && (
              <div className="text-center py-12 text-sm text-[#0B0D13]/60 italic">
                Select a topic to add it to your cram sheet.
              </div>
            )}
            {selectedTopics.map((t) => (
              <section
                key={t.id}
                className="break-inside-avoid border-l-4 border-[#0B0D13] pl-3"
              >
                <h3 className="text-[15px] font-bold leading-tight mb-1.5 flex items-baseline gap-2">
                  <span className="truncate">{t.name}</span>
                  <span className="text-[10px] font-normal text-[#0B0D13]/60 shrink-0 tabular-nums">
                    · weight {Math.round(t.weight * 100)}%
                  </span>
                </h3>

                {t.cramSheet?.length > 0 && (
                  <div className="mb-2">
                    <div className="text-[9px] uppercase tracking-wider text-[#0B0D13]/60 font-bold mb-0.5">
                      Cram lines
                    </div>
                    <ul className="text-[12.5px] leading-snug list-disc pl-4 space-y-0.5">
                      {t.cramSheet.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {t.keyFacts?.length > 0 && (
                  <div className="mb-2">
                    <div className="text-[9px] uppercase tracking-wider text-[#0B0D13]/60 font-bold mb-0.5">
                      Key facts
                    </div>
                    <ul className="text-[12.5px] leading-snug list-disc pl-4 space-y-0.5">
                      {t.keyFacts.slice(0, 5).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {t.review?.gotchas?.length > 0 && (
                  <div className="mb-1">
                    <div className="text-[9px] uppercase tracking-wider text-[#0B0D13]/60 font-bold mb-0.5">
                      Easy mix-ups
                    </div>
                    <ul className="text-[12px] leading-snug space-y-0.5">
                      {t.review.gotchas.slice(0, 2).map((g, i) => (
                        <li key={i}>
                          <b>{g.confusion}</b> — {g.explanation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Exam-day tips (universal) */}
          {selectedTopics.length > 0 && (
            <section className="mt-5 pt-3 border-t border-[#0B0D13]/20 break-inside-avoid">
              <h3 className="text-[13px] font-bold mb-1 flex items-center gap-1.5">
                <Zap className="h-3 w-3" />
                Exam-day micro-rules
              </h3>
              <ul className="text-[12px] leading-snug list-disc pl-4 grid sm:grid-cols-2 gap-x-4 gap-y-0.5">
                <li>Read the question twice — answer the question asked, not the topic.</li>
                <li>If two answers seem right, the more specific one usually wins.</li>
                <li>Eliminate the obviously wrong choice first to halve guess odds.</li>
                <li>Flag-and-skip anything &gt;90 sec; come back fresh at the end.</li>
                <li>"Always / never" absolutes are usually red herrings.</li>
                <li>Vendor-specific terms beat generic ones for vendor exams.</li>
              </ul>
            </section>
          )}

          {/* Footer */}
          <footer className="mt-5 pt-3 border-t-2 border-[#0B0D13] flex items-center justify-between text-[10px] text-[#0B0D13]/60">
            <span>
              Made with PassPilot · passpilot.app
            </span>
            <span className="tabular-nums">
              {selectedTopics.length} topic{selectedTopics.length === 1 ? "" : "s"} ·
              {" "}{exam.shortCode}
            </span>
          </footer>
        </article>

        {/* Screen-only print preview hint */}
        <div className="print:hidden mt-6 max-w-[820px] mx-auto text-center text-[11px] text-muted-foreground leading-relaxed">
          <Calendar className="h-3 w-3 inline-block mr-1 -mt-0.5" />
          The night before the exam, print this. Read it on the way in. Don't
          study anything new.
        </div>
      </AppShell>
    </>
  );
}
