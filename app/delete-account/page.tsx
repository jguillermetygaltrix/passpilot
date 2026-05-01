import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import Link from "next/link";
import {
  ShieldCheck,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { DeleteAccountForm } from "./delete-form";

export const metadata = {
  title: "Delete my account · PassPilot",
  description:
    "Delete your PassPilot account + all associated data. 30-day soft-hold, then permanent.",
};

/**
 * /delete-account — public + in-app data deletion request page.
 *
 * Required by:
 *   - Apple App Store Review Guideline 5.1.1(v) — apps must support
 *     account deletion from within the app
 *   - Google Play User Data policy — must provide a deletion URL +
 *     in-app deletion flow
 *   - GDPR Art 17 — Right to Erasure
 *   - COPPA — under-13 accounts purged immediately
 */
export default function DeleteAccountPage() {
  return (
    <>
      <AppNav />
      <AppShell className="max-w-2xl">
        <div className="space-y-8 py-8">
          <header>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight flex items-center gap-3">
              <Trash2 className="h-7 w-7 text-rose-600 dark:text-rose-400" />
              Delete my account
            </h1>
            <p className="mt-2 text-muted-foreground">
              You can leave any time. Here's what gets deleted, what's retained briefly,
              and how long it takes.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Last updated: 2026-04-30 · Version 1.0
            </p>
          </header>

          {/* What gets deleted */}
          <section className="rounded-2xl border bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-500/10 dark:to-cyan-500/10 dark:border-emerald-500/30 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> What gets deleted
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>License key + entitlements (Pro, Multi-Cert, Pass Guarantee)</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>Server-side records (when added — license validation logs, refund consent record)</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>Email correspondence with support (refund threads, license help)</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>AI query logs containing your data</span>
              </li>
            </ul>
          </section>

          {/* What's retained */}
          <section className="rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-500/10 p-5 text-sm space-y-2">
            <h2 className="font-semibold flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" /> What's retained briefly (or anonymized)
            </h2>
            <ul className="space-y-2 text-foreground/90">
              <li>
                <strong>Tax records</strong> — required by US/PR tax law for 7 years.
                Anonymized: no name/email, transaction amount + invoice ID only.
              </li>
              <li>
                <strong>Audit log</strong> — hashed email + deletion timestamp + actions
                taken. Required for [16 CFR §312.7] COPPA-compliance proof. Retained 7 years.
              </li>
              <li>
                <strong>Local-storage on YOUR device</strong> — we can't reach into your
                browser. Clear your browser site data or uninstall the mobile app to
                purge. Until you do, study progress / theme / SR cards live on your machine.
              </li>
            </ul>
          </section>

          {/* Timeline */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Timeline</h2>
            <ol className="space-y-3 text-sm text-foreground/90">
              <li className="flex gap-3">
                <span className="chip text-xs shrink-0 bg-card">Day 0</span>
                <span>You submit the form below. We send a confirmation email with a "cancel deletion" link.</span>
              </li>
              <li className="flex gap-3">
                <span className="chip text-xs shrink-0 bg-card">Day 0–30</span>
                <span>30-day soft-hold. License access frozen. You can cancel via the email link if you change your mind. No questions asked.</span>
              </li>
              <li className="flex gap-3">
                <span className="chip text-xs shrink-0 bg-card">Day 30</span>
                <span>Permanent deletion. All data covered above is purged. Tax records anonymized. Audit log hashed.</span>
              </li>
              <li className="flex gap-3">
                <span className="chip text-xs shrink-0 bg-card">Day 31</span>
                <span>Final email confirmation sent. No further action needed.</span>
              </li>
            </ol>
          </section>

          {/* COPPA fast path */}
          <div className="rounded-xl border bg-card p-4 text-sm space-y-2">
            <p className="font-medium">Parent of a child under 13?</p>
            <p className="text-muted-foreground">
              We close + purge <strong>within 7 days</strong>, full refund regardless of
              usage. Email{" "}
              <a href="mailto:privacy@passpilot.app" className="underline">
                privacy@passpilot.app
              </a>{" "}
              instead of using this form — we need parent verification per [COPPA 16 CFR Part 312].
            </p>
          </div>

          {/* Form (client component) */}
          <DeleteAccountForm />

          {/* Contact fallback */}
          <section className="rounded-2xl border bg-muted/30 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" /> Prefer email?
            </h2>
            <p className="mt-2 text-sm text-foreground/90">
              Email{" "}
              <a href="mailto:privacy@passpilot.app" className="underline">privacy@passpilot.app</a>{" "}
              with subject "Delete my account" and your license key (if you have one).
              We'll process it the same way.
            </p>
          </section>
        </div>
      </AppShell>
    </>
  );
}
