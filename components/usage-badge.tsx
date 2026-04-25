"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { computeSummary, type UsageSummary } from "@/lib/usage";

/**
 * UsageBadge — small transparency pill for /upgrade page.
 *
 * Shows the buyer their current consumption % before purchase OR after purchase.
 * Transparency acts as a soft deterrent against refund abuse ("they know we track this")
 * without being confrontational.
 */
export function UsageBadge({ className = "" }: { className?: string }) {
  const [summary, setSummary] = useState<UsageSummary | null>(null);

  useEffect(() => {
    setSummary(computeSummary());
  }, []);

  if (!summary || summary.totalEvents === 0) return null;

  return (
    <Link
      href="/account/usage"
      className={`inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/50 px-3 py-1 text-[11px] font-medium text-brand-700 hover:bg-brand-50 transition-colors ${className}`}
    >
      <BarChart3 className="h-3 w-3" />
      {summary.consumptionPct.toFixed(0)}% of content explored
      {summary.drillsCompleted > 0 && ` · ${summary.drillsCompleted} drill${summary.drillsCompleted === 1 ? "" : "s"}`}
      {summary.aiExplanationsRequested > 0 && ` · ${summary.aiExplanationsRequested} AI`}
      <span className="text-brand-500">→</span>
    </Link>
  );
}
