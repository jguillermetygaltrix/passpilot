"use client";

/**
 * RefundConsent — EU-compliant waiver checkbox for digital goods.
 *
 * Why this exists:
 *   EU Consumer Rights Directive Article 16(m) states that the 14-day
 *   right of withdrawal does NOT apply to digital content if the consumer:
 *     1. Explicitly consented to immediate performance
 *     2. Explicitly acknowledged loss of the withdrawal right
 *
 *   Without this consent, EU buyers can demand full refunds within 14 days
 *   even after consuming the content ("buy → screenshot → refund" abuse).
 *
 *   With this consent logged at purchase time (with timestamp + context),
 *   we have a durable legal basis to deny refund claims for consumed content.
 *
 * Usage:
 *   <RefundConsent
 *     offerId="pro-az900"
 *     priceCents={1999}
 *     currency="USD"
 *     onConsent={(accepted) => setConsented(accepted)}
 *   />
 *
 * Storage:
 *   Consent records persist in localStorage under `passpilot.refund-consent-log`
 *   as an append-only array. The server should ideally receive a copy via
 *   the checkout webhook (planned for Phase 2).
 */

import { useState, useEffect } from "react";
import { ShieldCheck, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "passpilot.refund-consent-log";

export type ConsentRecord = {
  id: string;
  offerId: string;
  priceCents: number;
  currency: string;
  timestamp: string;     // ISO
  userAgent: string;
  version: "1.0";
};

export function recordConsent(record: Omit<ConsentRecord, "id" | "timestamp" | "userAgent" | "version">): ConsentRecord {
  const full: ConsentRecord = {
    ...record,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
    version: "1.0",
  };
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      existing.push(full);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch {}
  }
  return full;
}

export function getConsentLog(): ConsentRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

type Props = {
  offerId: string;
  priceCents: number;
  currency?: string;
  onConsent: (accepted: boolean) => void;
  className?: string;
};

export function RefundConsent({ offerId, priceCents, currency = "USD", onConsent, className = "" }: Props) {
  const [checked, setChecked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    onConsent(checked);
  }, [checked, onConsent]);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    setChecked(next);
    if (next) {
      // Log the consent event immediately when checked
      recordConsent({ offerId, priceCents, currency });
    }
  };

  return (
    <div className={`rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-sm ${className}`}>
      <label className="flex gap-3 items-start cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheck}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-amber-400 text-brand-600 focus:ring-brand-500"
          aria-describedby={`refund-consent-${offerId}`}
        />
        <span id={`refund-consent-${offerId}`} className="leading-relaxed text-amber-900">
          <strong className="font-semibold">I understand PassPilot is a digital product.</strong>{" "}
          I consent to <strong>immediate access</strong> to all content upon purchase, and I acknowledge that by accessing the content I{" "}
          <strong>waive my 14-day right of withdrawal</strong> under EU Consumer Rights Directive Article 16(m).
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setShowDetails(v => !v); }}
            className="ml-1 underline text-amber-700 hover:text-amber-900"
          >
            {showDetails ? "hide details" : "what does this mean?"}
          </button>
        </span>
      </label>

      {showDetails && (
        <div className="mt-3 pl-7 text-xs text-amber-900/80 space-y-2 leading-relaxed">
          <p className="flex gap-2">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>
              Digital content can be copied instantly. Without this consent,
              buyers could purchase, screenshot everything, then request a full refund —
              draining builders who make real study material.
            </span>
          </p>
          <p className="flex gap-2">
            <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>
              If you request a refund <strong>before</strong> accessing any content (no drills started,
              no questions answered), we honor it in full.
            </span>
          </p>
          <p className="flex gap-2">
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>
              Once you start practicing, refund requests are evaluated against your usage.
              Completion &gt;25% generally voids refund eligibility. Full policy:{" "}
              <Link href="/refunds" className="underline hover:no-underline">/refunds</Link>.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
