"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BarChart3, Download, Flag, AlertTriangle, CheckCircle2, XCircle,
  Clock, Sparkles, FileDown, Mail, Info,
} from "lucide-react";
import { computeSummary, exportUsageReport, getEvents, type UsageSummary } from "@/lib/usage";

/**
 * /account/usage — user-facing usage dashboard.
 * Transparency = deterrent. Buyers see exactly what they've consumed,
 * which discourages frivolous refund requests.
 */
export default function UsagePage() {
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [events, setEvents] = useState<ReturnType<typeof getEvents>>([]);

  useEffect(() => {
    setSummary(computeSummary());
    setEvents(getEvents());
  }, []);

  const handleExport = () => {
    const report = exportUsageReport();
    const blob = new Blob([report], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `passpilot-usage-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportUsageReport());
  };

  if (!summary) {
    return (
      <>
        <AppNav />
        <AppShell><div className="py-20 text-center text-muted-foreground">Loading…</div></AppShell>
      </>
    );
  }

  const eligibilityStyles = {
    eligible:     { color: "emerald", icon: CheckCircle2, label: "Refund eligible" },
    "case-by-case": { color: "amber",   icon: AlertTriangle, label: "Case-by-case review" },
    ineligible:   { color: "red",     icon: XCircle,     label: "Refund ineligible" },
  } as const;

  const e = eligibilityStyles[summary.refundEligibility];
  const EIcon = e.icon;

  return (
    <>
      <AppNav />
      <AppShell className="max-w-3xl">
        <div className="space-y-8 py-8">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
              <BarChart3 className="h-7 w-7 text-brand-600" /> Your Usage
            </h1>
            <p className="mt-2 text-muted-foreground">
              Everything PassPilot has recorded about your activity. Your data, your call.
            </p>
          </header>

          {/* Refund eligibility pill */}
          <div className={`rounded-2xl border bg-${e.color}-50 border-${e.color}-200 p-5`}>
            <div className="flex items-start gap-3">
              <EIcon className={`h-6 w-6 text-${e.color}-600 shrink-0 mt-0.5`} />
              <div className="flex-1">
                <div className={`text-sm font-semibold uppercase tracking-wider text-${e.color}-700`}>
                  {e.label}
                </div>
                <p className="mt-1 text-sm text-foreground/80 leading-relaxed">
                  {summary.refundEligibility === "eligible" && (
                    <>You haven't consumed content yet. A refund request would be honored in full. See <Link href="/refunds" className="underline">/refunds</Link>.</>
                  )}
                  {summary.refundEligibility === "case-by-case" && (
                    <>You've consumed {summary.consumptionPct.toFixed(1)}% of content. Refund requests below 25% are reviewed individually. See <Link href="/refunds" className="underline">/refunds</Link>.</>
                  )}
                  {summary.refundEligibility === "ineligible" && (
                    <>You've consumed {summary.consumptionPct.toFixed(1)}% of content{summary.aiExplanationsRequested > 10 && `, and requested ${summary.aiExplanationsRequested} AI explanations`}. Refund requests are not eligible per our <Link href="/refunds" className="underline">policy</Link>.</>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Key stats grid */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Activity
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Content consumed" value={`${summary.consumptionPct.toFixed(1)}%`} accent="brand" />
              <StatCard label="Questions answered" value={String(summary.questionsAnswered)} accent="emerald" />
              <StatCard label="Drills completed" value={String(summary.drillsCompleted)} accent="cyan" />
              <StatCard label="AI explanations" value={String(summary.aiExplanationsRequested)} accent={summary.aiExplanationsRequested > 10 ? "red" : "gray"} />
              <StatCard label="Diagnostics done" value={String(summary.diagnosticsCompleted)} accent="gray" />
              <StatCard label="Study time (min)" value={String(summary.studyMinutes)} accent="gray" />
              <StatCard label="Correct answers" value={String(summary.questionsAnsweredCorrectly)} accent="gray" />
              <StatCard label="Total events" value={String(summary.totalEvents)} accent="gray" />
            </div>
          </section>

          {/* Timeline snippet */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Activity window
            </h2>
            <div className="rounded-xl border bg-card p-4 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {summary.firstEventAt ? (
                  <span>
                    <strong>First event:</strong> {new Date(summary.firstEventAt).toLocaleString()}
                    {" · "}
                    <strong>Last event:</strong> {new Date(summary.lastEventAt!).toLocaleString()}
                  </span>
                ) : (
                  <span className="text-muted-foreground">No activity recorded yet.</span>
                )}
              </div>
            </div>
          </section>

          {/* Export */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Export your data
            </h2>
            <div className="rounded-xl border bg-muted/20 p-5 space-y-4">
              <p className="text-sm text-foreground/90">
                If you need to contact support for any reason (refund, dispute, bug report),
                include this export. It contains your full activity log — nothing hidden, nothing fabricated.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" onClick={handleExport} className="gap-2">
                  <FileDown className="h-4 w-4" />
                  Download JSON
                </Button>
                <Button variant="secondary" onClick={handleCopy} className="gap-2">
                  <Download className="h-4 w-4" />
                  Copy to clipboard
                </Button>
                <Link href="mailto:refunds@passpilot.app" className="inline-block">
                  <Button variant="ghost" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Email support
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Recent events */}
          {events.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Recent events <span className="text-xs text-muted-foreground">(latest 15)</span>
              </h2>
              <div className="rounded-xl border bg-card overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/30 uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="text-left p-3">When</th>
                      <th className="text-left p-3">Event</th>
                      <th className="text-left p-3">Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {events.slice(-15).reverse().map((ev) => (
                      <tr key={ev.id}>
                        <td className="p-3 text-muted-foreground whitespace-nowrap">
                          {new Date(ev.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3 font-mono text-[11px]">{ev.type}</td>
                        <td className="p-3 text-muted-foreground">
                          {ev.questionId && <span className="font-mono text-[10px]">{ev.questionId.slice(0, 20)}</span>}
                          {(ev.meta as { correct?: boolean })?.correct === true && " ✓"}
                          {(ev.meta as { correct?: boolean })?.correct === false && " ✗"}
                          {(ev.meta as { kind?: string })?.kind && ` · ${(ev.meta as { kind?: string }).kind}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Footer / explainer */}
          <section className="rounded-2xl border bg-muted/10 p-5 text-sm">
            <p className="flex gap-2 text-foreground/80 leading-relaxed">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
              <span>
                Your usage data lives in your browser's localStorage. We use it to deliver
                accurate progress + to evaluate refund requests fairly. You can export or clear it any time
                via browser DevTools (Application → Local Storage → passpilot.usage-log).
              </span>
            </p>
          </section>
        </div>
      </AppShell>
    </>
  );
}

function StatCard({ label, value, accent = "gray" }: { label: string; value: string; accent?: "gray" | "brand" | "emerald" | "cyan" | "red" | "amber" }) {
  const accents: Record<string, string> = {
    gray:    "border-gray-200 text-foreground",
    brand:   "border-brand-200 bg-brand-50/30 text-brand-700",
    emerald: "border-emerald-200 bg-emerald-50/30 text-emerald-700",
    cyan:    "border-cyan-200 bg-cyan-50/30 text-cyan-700",
    red:     "border-red-200 bg-red-50/30 text-red-700",
    amber:   "border-amber-200 bg-amber-50/30 text-amber-700",
  };
  return (
    <div className={`rounded-xl border p-3 ${accents[accent] ?? accents.gray}`}>
      <div className="text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
