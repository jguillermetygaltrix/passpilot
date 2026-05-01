import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import Link from "next/link";
import { Mail, Database, Server } from "lucide-react";

export const metadata = {
  title: "Subprocessors · PassPilot",
  description:
    "The third parties that touch your data when you use PassPilot — what they do, what they receive, where they live.",
};

interface Sub {
  name: string;
  service: string;
  data: string;
  location: string;
  privacy: string;
  privacyUrl: string;
  notes?: string;
}

const subs: Sub[] = [
  {
    name: "Lemon Squeezy",
    service: "Web payment processing — Merchant of Record. Handles VAT/sales tax, issues invoices, processes refunds + chargebacks.",
    data: "Name, email, billing address, payment method (card last-4 / processor token), transaction amount, IP address.",
    location: "US (with global tax-compliance infrastructure).",
    privacy: "Privacy policy",
    privacyUrl: "https://www.lemonsqueezy.com/privacy",
    notes: "Because Lemon Squeezy is the Merchant of Record, they are a separate controller for tax records they're legally required to retain, and a processor for the rest. Their DPA covers the split.",
  },
  {
    name: "Google Gemini API",
    service: "Generative AI for \"Why is this answer wrong?\" explanations and similar features, when triggered by the user.",
    data: "Question text + selected answer. No identifying information attached — no user ID, email, or IP correlation on PassPilot's side.",
    location: "US (Google Cloud regions).",
    privacy: "Google privacy policy",
    privacyUrl: "https://policies.google.com/privacy",
    notes: "Paid Gemini API tier does not use prompts to train Google's models (per Google's stated policy as of 2026). PassPilot uses paid tier in production.",
  },
  {
    name: "RevenueCat",
    service: "Abstraction layer over Apple App Store / Google Play in-app purchase flows; receipt validation; entitlement state.",
    data: "App Store / Play Store receipt data, anonymous app-install ID, purchased product ID, transaction history.",
    location: "US.",
    privacy: "Privacy policy",
    privacyUrl: "https://www.revenuecat.com/privacy",
    notes: "Engaged only when a user makes an in-app purchase via iOS or Android. Web buyers (Lemon Squeezy) never touch RevenueCat.",
  },
  {
    name: "Hosting / CDN",
    service: "Static site hosting + edge CDN for passpilot.app.",
    data: "Server access logs (IP address, user-agent, requested URL, timestamp).",
    location: "{Azure US East OR Vercel Global edge — hosting target to be confirmed}.",
    privacy: "Vendor privacy policy",
    privacyUrl: "https://privacy.microsoft.com/en-us/privacystatement",
    notes: "EU data flows handled via Standard Contractual Clauses per [EU Commission Decision 2021/914].",
  },
];

export default function SubprocessorsPage() {
  return (
    <>
      <AppNav />
      <AppShell className="max-w-3xl">
        <div className="space-y-8 py-8">
          <header>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Subprocessors
            </h1>
            <p className="mt-2 text-muted-foreground">
              Third parties that touch your data when you use PassPilot. Per [GDPR Art 28].
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Last updated: 2026-04-30 · Version 1.0
            </p>
          </header>

          {/* Short version */}
          <div className="rounded-2xl border bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-500/10 dark:to-cyan-500/10 dark:border-emerald-500/30 p-5">
            <p className="text-sm text-foreground/90">
              PassPilot stores your study progress on your <strong>device</strong>. We don't
              run accounts on a server. But a few third parties touch the data when payments,
              mobile purchases, or optional AI features are used. They're listed below.
            </p>
            <p className="mt-3 text-sm text-foreground/90">
              Per [GDPR Art 28(2)], you have the right to know who they are. You also have
              the right to object to new ones — and the right to terminate if we add a
              subprocessor you can't accept.
            </p>
          </div>

          {/* Why this exists */}
          <section className="space-y-3 text-sm text-foreground/90">
            <h2 className="text-xl font-semibold">Why this page exists</h2>
            <p>
              Under [GDPR Art 28], any company processing personal data of EU/EEA
              residents must disclose its subprocessors. [UK GDPR Art 28] mirrors this.
              [California CCPA §1798.140] requires similar disclosure for "service providers."
            </p>
            <p>
              PassPilot's privacy posture is unusual: most user data stays on the device
              and never reaches our servers. So this list is short. It includes only
              services that touch personal data when triggered by specific user actions
              (payment, AI query, mobile IAP).
            </p>
          </section>

          {/* Subs */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Database className="h-5 w-5" /> Current subprocessors
            </h2>
            <div className="space-y-3">
              {subs.map((s) => (
                <div key={s.name} className="rounded-xl border bg-card p-5 text-sm space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="h-7 w-7 rounded-lg bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-500/30 flex items-center justify-center">
                      <Server className="h-3.5 w-3.5" />
                    </span>
                    {s.name}
                  </h3>
                  <Field label="Service" value={s.service} />
                  <Field label="Data processed" value={s.data} />
                  <Field label="Data location" value={s.location} />
                  <p className="text-xs">
                    <a href={s.privacyUrl} target="_blank" rel="noopener" className="underline">
                      {s.privacy} →
                    </a>
                  </p>
                  {s.notes && (
                    <p className="text-xs text-muted-foreground italic border-t pt-2 mt-2">
                      {s.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Mobile platforms */}
          <section className="space-y-3 text-sm text-foreground/90">
            <h2 className="text-xl font-semibold">Mobile platforms</h2>
            <p>
              When users buy through iOS or Android,{" "}
              <strong>Apple Inc.</strong> (App Store) or{" "}
              <strong>Google LLC</strong> (Play Store) processes the payment as the
              merchant of record. They are <em>separate controllers</em>, not subprocessors
              — their privacy policies govern that transaction.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                Apple App Store:{" "}
                <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener" className="underline">
                  apple.com/legal/privacy
                </a>
              </li>
              <li>
                Google Play Store:{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="underline">
                  policies.google.com/privacy
                </a>
              </li>
            </ul>
          </section>

          {/* Analytics */}
          <section className="space-y-2 text-sm text-foreground/90">
            <h2 className="text-xl font-semibold">Analytics</h2>
            <p>
              <strong>None.</strong> Per the{" "}
              <Link href="/privacy" className="underline">Privacy Policy</Link>, PassPilot
              uses no analytics trackers, no advertising IDs, no behavior tracking, and no
              third-party sign-ins.
            </p>
            <p>If we ever add analytics, we will:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Update this list at least 30 days before the analytics provider goes live</li>
              <li>Notify users in-app</li>
              <li>Update the Privacy Policy</li>
            </ol>
          </section>

          {/* Change-management */}
          <section className="space-y-3 text-sm text-foreground/90">
            <h2 className="text-xl font-semibold">Subprocessor change-management</h2>
            <p>Per [GDPR Art 28(2)], we commit to:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>30-day advance notice</strong> before adding a new subprocessor or
                removing an existing one. Notification posted on this page + (if you've
                contacted us) sent via email.
              </li>
              <li>
                <strong>Customer right to object</strong> — if you object to a new
                subprocessor, you may terminate your PassPilot license and receive a
                pro-rated refund per the{" "}
                <Link href="/refunds" className="underline">Refund Policy</Link>, up to the
                unused portion of your subscription term.
              </li>
              <li>
                <strong>Emergency replacement exception</strong> — if a subprocessor goes
                down or breaches contract and we must replace urgently, we may onboard a
                replacement before the 30-day notice completes. We will notify within 7
                days and document why the emergency exception was triggered.
              </li>
            </ol>
          </section>

          {/* Sub-subprocessors */}
          <section className="space-y-2 text-sm text-foreground/90">
            <h2 className="text-xl font-semibold">Sub-subprocessors</h2>
            <p>
              Most of the subprocessors above use their own subprocessors (e.g. AWS for
              hosting, Stripe inside Lemon Squeezy, Cloudflare for DDoS protection). These
              are disclosed in each vendor's own DPA — we don't duplicate the chain here.
              For a full sub-subprocessor map for compliance review, email{" "}
              <a href="mailto:privacy@passpilot.app" className="underline">privacy@passpilot.app</a>.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-2xl border bg-muted/30 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" /> Privacy contact
            </h2>
            <p className="mt-2 text-sm text-foreground/90">
              <a href="mailto:privacy@passpilot.app" className="underline">privacy@passpilot.app</a>
            </p>
          </section>
        </div>
      </AppShell>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </span>
      <p className="text-sm text-foreground/90">{value}</p>
    </div>
  );
}
