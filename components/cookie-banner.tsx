"use client";

/**
 * CookieBanner — first-visit cookie consent banner.
 *
 * Behavior:
 *   - Shows on first visit (no localStorage flag set).
 *   - Persists choice to localStorage('passpilot.cookie-consent') with TTL 1 year.
 *   - Three buttons: Accept all / Reject non-essential / Customize.
 *     PassPilot currently has zero non-essential cookies — but the banner keeps
 *     the door open for future analytics. Today both "Accept all" and "Reject"
 *     have the same practical effect (only essential + functional are running).
 *   - Listens for `passpilot:open-cookie-prefs` CustomEvent so the footer
 *     "Cookie preferences" link can re-open the banner.
 *
 * Compliance:
 *   - GDPR Art 6 lawful basis for non-essential cookies = consent → opt-IN required
 *   - ePrivacy Directive Art 5(3) — necessary cookies exempt from consent
 *   - Choice persisted with timestamp for audit trail
 */

import { useEffect, useState } from "react";
import { Cookie, X, Check } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "passpilot.cookie-consent";
const TTL_MS = 365 * 24 * 60 * 60 * 1000; // 1 year

interface ConsentChoice {
  accepted: boolean;
  acceptedCategories: ("necessary" | "functional" | "performance" | "marketing")[];
  recordedAt: string;
  expiresAt: string;
}

function readChoice(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: ConsentChoice = JSON.parse(raw);
    // Expired? Treat as not-set so we re-prompt.
    if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeChoice(accepted: boolean, marketing: boolean): void {
  if (typeof window === "undefined") return;
  const now = new Date();
  const choice: ConsentChoice = {
    accepted,
    acceptedCategories: accepted
      ? marketing
        ? ["necessary", "functional", "performance", "marketing"]
        : ["necessary", "functional", "performance"]
      : ["necessary", "functional"], // strictly necessary always on
    recordedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + TTL_MS).toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
  } catch {
    /* private mode — tolerate */
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // First-paint check
    if (!readChoice()) setVisible(true);
    // Footer link re-opener
    const handler = () => {
      setShowCustomize(true);
      setVisible(true);
    };
    window.addEventListener("passpilot:open-cookie-prefs", handler);
    return () =>
      window.removeEventListener("passpilot:open-cookie-prefs", handler);
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    writeChoice(true, marketing);
    setVisible(false);
  };
  const rejectNonEssential = () => {
    writeChoice(false, false);
    setVisible(false);
  };
  const saveCustom = () => {
    writeChoice(true, marketing);
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 pointer-events-none"
    >
      <div className="mx-auto max-w-3xl pointer-events-auto rounded-2xl border bg-card shadow-card p-5">
        {!showCustomize ? (
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h2 className="font-semibold flex items-center gap-2 text-sm">
                <Cookie className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                We use very few cookies
              </h2>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Strictly-necessary + functional only. No analytics, no advertising. See our{" "}
                <Link href="/cookies" className="underline hover:text-foreground">
                  Cookie Policy
                </Link>{" "}
                for the full list.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => setShowCustomize(true)}
                className="text-xs font-medium px-3 h-9 rounded-full border border-border bg-background hover:bg-muted transition-colors"
              >
                Customize
              </button>
              <button
                onClick={rejectNonEssential}
                className="text-xs font-medium px-3 h-9 rounded-full border border-border bg-background hover:bg-muted transition-colors"
              >
                Essential only
              </button>
              <button
                onClick={acceptAll}
                className="text-xs font-medium px-4 h-9 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                Accept
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <Cookie className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Cookie preferences
              </h2>
              <button
                aria-label="Close"
                onClick={() => setVisible(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ToggleRow
              title="Strictly necessary"
              description="Required for PassPilot to function. Always on. (theme, banner consent)"
              checked
              disabled
              onChange={() => undefined}
            />
            <ToggleRow
              title="Functional"
              description="Remember preferences across visits."
              checked
              disabled
              onChange={() => undefined}
            />
            <ToggleRow
              title="Performance / Analytics"
              description="None active today. Toggle for future use."
              checked={false}
              disabled
              onChange={() => undefined}
              badge="None today"
            />
            <ToggleRow
              title="Marketing"
              description="Advertising and behavior tracking. PassPilot will never enable these."
              checked={marketing}
              disabled
              onChange={setMarketing}
              badge="None ever"
            />
            <div className="flex flex-wrap gap-2 justify-end pt-2 border-t">
              <button
                onClick={rejectNonEssential}
                className="text-xs font-medium px-3 h-9 rounded-full border border-border bg-background hover:bg-muted transition-colors"
              >
                Essential only
              </button>
              <button
                onClick={saveCustom}
                className="text-xs font-medium px-4 h-9 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  disabled,
  onChange,
  badge,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  badge?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-foreground flex items-center gap-2">
          {title}
          {badge && (
            <span className="chip border border-border text-[10px] py-0">{badge}</span>
          )}
        </div>
        <p className="text-muted-foreground mt-0.5">{description}</p>
      </div>
      <label className="shrink-0 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <span
          className={
            "relative inline-block h-5 w-9 rounded-full transition-colors " +
            (checked ? "bg-foreground" : "bg-muted") +
            (disabled ? " opacity-50 cursor-not-allowed" : "")
          }
          aria-hidden
        >
          <span
            className={
              "absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all " +
              (checked ? "left-[18px]" : "left-0.5")
            }
          />
        </span>
      </label>
    </div>
  );
}
