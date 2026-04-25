import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import Link from "next/link";
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Info, Mail } from "lucide-react";

export const metadata = {
  title: "Refund Policy · PassPilot",
  description:
    "PassPilot's refund policy — fair to buyers, protected against abuse. EU/UK/US compliant.",
};

export default function RefundsPage() {
  return (
    <>
      <AppNav />
      <AppShell className="max-w-3xl">
        <div className="space-y-8 py-8">
          <header>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Refund Policy
            </h1>
            <p className="mt-2 text-muted-foreground">
              Short version: legit buyers always get fair treatment. Abusers don't.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Last updated: 2026-04-24 · Version 1.0
            </p>
          </header>

          {/* TL;DR box */}
          <div className="rounded-2xl border bg-gradient-to-br from-emerald-50 to-cyan-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-700 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> TL;DR
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Not accessed yet?</strong> Full refund, no questions asked, 14 days.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Technical issue (can't access, bug)?</strong> Full refund after we confirm the issue.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Used &lt;25% of content?</strong> Refund considered case-by-case.</span>
              </li>
              <li className="flex gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <span><strong>Used &gt;25% of content?</strong> No refund. You got what you paid for.</span>
              </li>
              <li className="flex gap-2">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <span><strong>Chargebacks for consumed content?</strong> Disputed with usage evidence + consent records.</span>
              </li>
            </ul>
          </div>

          {/* Legal basis */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Legal Basis</h2>
            <div className="prose prose-sm max-w-none text-foreground/90">
              <p>
                PassPilot is a <strong>digital product</strong>. Study packs, question banks, and AI-generated
                explanations are delivered immediately and cannot be physically returned.
              </p>
              <p>
                At checkout, every buyer explicitly consents to immediate access and waives their{" "}
                <strong>14-day right of withdrawal</strong> under:
              </p>
              <ul>
                <li><strong>EU:</strong> Consumer Rights Directive (2011/83/EU), Article 16(m)</li>
                <li><strong>UK:</strong> Consumer Contracts Regulations 2013, Regulation 37(1)(b)</li>
                <li><strong>US:</strong> Subject to individual state law; refunds honored per this policy</li>
              </ul>
              <p>
                This consent is logged at purchase time with a timestamp, offer ID, and confirmation of receipt.
                You can request a copy of your consent record at any time via support.
              </p>
            </div>
          </section>

          {/* Usage-based rules */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Usage-Based Refund Rules</h2>
            <p className="text-sm text-muted-foreground">
              We track your usage server-side to evaluate refund claims fairly. Here's exactly what counts:
            </p>
            <div className="rounded-xl border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left p-3">Scenario</th>
                    <th className="text-left p-3">Refund?</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr><td className="p-3">Never logged in after purchase</td><td className="p-3 text-emerald-700 font-medium">Full refund</td></tr>
                  <tr><td className="p-3">Logged in but no drills started</td><td className="p-3 text-emerald-700 font-medium">Full refund</td></tr>
                  <tr><td className="p-3">Completed diagnostic only</td><td className="p-3 text-emerald-700 font-medium">Full refund (&lt; 14 days)</td></tr>
                  <tr><td className="p-3">1-25% content consumed</td><td className="p-3 text-amber-700 font-medium">Case-by-case</td></tr>
                  <tr><td className="p-3">25-50% content consumed</td><td className="p-3 text-red-700 font-medium">No refund</td></tr>
                  <tr><td className="p-3">&gt;50% content consumed</td><td className="p-3 text-red-700 font-medium">No refund. Period.</td></tr>
                  <tr><td className="p-3">Used AI "Why wrong?" 10+ times</td><td className="p-3 text-red-700 font-medium">No refund (AI costs us $)</td></tr>
                  <tr><td className="p-3">Shared content on public forums</td><td className="p-3 text-red-700 font-medium">Refund denied + account banned</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground italic flex gap-2">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>
                "Content consumed" = questions viewed, not questions answered. If you opened a question
                and screenshotted it, that counts as consumption even if you didn't click an answer.
              </span>
            </p>
          </section>

          {/* How to request */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">How to Request a Refund</h2>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="chip text-xs shrink-0">1</span>
                <span>Email <Link href="mailto:refunds@passpilot.app" className="underline">refunds@passpilot.app</Link> with your Lemon Squeezy order ID (or Apple/Google receipt ID).</span>
              </li>
              <li className="flex gap-3">
                <span className="chip text-xs shrink-0">2</span>
                <span>We'll reply within 48 hours with your consent record + usage stats.</span>
              </li>
              <li className="flex gap-3">
                <span className="chip text-xs shrink-0">3</span>
                <span>If eligible, refund processed within 7 business days to the original payment method.</span>
              </li>
            </ol>
          </section>

          {/* Chargebacks */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Chargebacks / Payment Disputes</h2>
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-sm">
              <p className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
                <span>
                  If you file a chargeback instead of emailing us, we respond with:
                  consent record, usage logs, and a copy of this policy. This almost always resolves
                  in our favor and <strong>permanently bans your account from PassPilot</strong>. We'd much
                  rather you just email us.
                </span>
              </p>
            </div>
          </section>

          {/* Apple / Google */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">App Store / Play Store Purchases</h2>
            <p className="text-sm text-foreground/90">
              iOS purchases are handled by Apple's refund policy via{" "}
              <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener" className="underline">
                reportaproblem.apple.com
              </a>. We don't control those — Apple makes the call.
            </p>
            <p className="text-sm text-foreground/90">
              Android purchases are handled via the Play Store refund flow within 48 hours, or by emailing us after.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-2xl border bg-muted/30 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" /> Contact
            </h2>
            <p className="mt-2 text-sm">
              <Link href="mailto:refunds@passpilot.app" className="underline">refunds@passpilot.app</Link>
              {" · "}
              <Link href="/support" className="underline">support page</Link>
            </p>
          </section>
        </div>
      </AppShell>
    </>
  );
}
