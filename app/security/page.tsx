import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import Link from "next/link";
import { ShieldCheck, Mail, Bug, Trophy, Clock, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Security · PassPilot",
  description:
    "Found a bug? Tell us before you tell the world. We respond in 72 hours, won't sue good-faith research, credit you publicly.",
};

export default function SecurityPage() {
  return (
    <>
      <AppNav />
      <AppShell className="max-w-3xl">
        <div className="space-y-8 py-8">
          <header>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Security &amp; Vulnerability Disclosure
            </h1>
            <p className="mt-2 text-muted-foreground">
              Found a bug? Tell us before you tell the world. Researchers are allies, not threats.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Last updated: 2026-04-30 · Version 1.0
            </p>
          </header>

          {/* Short version */}
          <div className="rounded-2xl border bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-500/10 dark:to-cyan-500/10 dark:border-emerald-500/30 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Short version
            </h2>
            <p className="mt-3 text-sm text-foreground/90">
              We respond within 72 hours, fix critical issues within 30 days, and won't
              sue you for honest research. No bounty cash today — but we credit you
              publicly on this page if you want it.
            </p>
          </div>

          {/* Reporting */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bug className="h-5 w-5" /> How to report
            </h2>
            <p className="text-sm text-foreground/90">
              Email{" "}
              <a href="mailto:security@passpilot.app" className="underline font-medium">
                security@passpilot.app
              </a>{" "}
              with:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-foreground/90">
              <li><strong>Vulnerability type</strong> — XSS, IDOR, auth bypass, license-key reuse, etc.</li>
              <li><strong>Affected component</strong> — URL, endpoint, mobile app version, or file path.</li>
              <li><strong>Steps to reproduce</strong> — minimum sequence to reproduce the bug.</li>
              <li><strong>Impact assessment</strong> — what an attacker could do.</li>
              <li><strong>Suggested mitigation</strong> (optional but appreciated).</li>
            </ol>
            <p className="text-sm text-muted-foreground">
              We accept reports in English or Spanish. Optional PGP encryption: see{" "}
              <a href="/security/pgp.txt" className="underline">/security/pgp.txt</a> (placeholder until generated).
            </p>
          </section>

          {/* Scope */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Scope</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-500/10 p-4 text-sm">
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                  ✓ In-scope
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-foreground/90">
                  <li><code>passpilot.app</code> + all subdomains we operate</li>
                  <li>iOS + Android builds (Capacitor wrappers + native bridges)</li>
                  <li>License-key infrastructure</li>
                  <li>Lemon Squeezy webhook handler</li>
                  <li>Authentication flows (when added)</li>
                  <li>Data exposure beyond local-storage posture</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50/60 dark:bg-rose-500/10 p-4 text-sm">
                <h3 className="font-semibold text-rose-700 dark:text-rose-300 mb-2">
                  ✗ Out-of-scope
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-foreground/90">
                  <li>Third-party vendors (Lemon Squeezy, Gemini, RevenueCat, hosting)</li>
                  <li>Social engineering of staff / users</li>
                  <li>Physical attacks on infrastructure</li>
                  <li>DDoS / volumetric attacks</li>
                  <li>Vulnerabilities requiring physical access to unlocked device</li>
                  <li>Outdated browser / OS reports</li>
                  <li>"Best practice" notes without exploit</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Safe harbor */}
          <section className="rounded-xl border bg-card p-5 space-y-2 text-sm">
            <h2 className="font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Safe harbor
            </h2>
            <p className="text-foreground/90">
              If you make a good-faith effort to comply with this policy,{" "}
              <strong>PassPilot will not pursue legal action</strong> for these research activities:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-foreground/90">
              <li>Testing against accounts and license keys you own (or are explicitly authorized to test)</li>
              <li>Accessing only the minimum data necessary to demonstrate a vulnerability</li>
              <li>Stopping testing immediately upon encountering user data, and reporting promptly</li>
              <li>Not publicly disclosing before our fix window expires (90-day default)</li>
              <li>Not using the vulnerability for personal gain (license-key forgery, payment fraud)</li>
            </ul>
            <p className="text-foreground/90 mt-2">
              Informed by norms around [Computer Fraud and Abuse Act 18 USC §1030] and
              the DOJ's 2022 policy of declining to prosecute good-faith security research.
              We're not a court — we can't grant immunity. But we commit not to{" "}
              <em>initiate</em> legal action against researchers acting in good faith under this policy.
            </p>
          </section>

          {/* Response times */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" /> Response time commitments
            </h2>
            <div className="rounded-xl border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left p-3">Stage</th>
                    <th className="text-left p-3">Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr><td className="p-3">Acknowledge receipt</td><td className="p-3 font-medium">72 hours</td></tr>
                  <tr><td className="p-3">Initial triage + severity</td><td className="p-3 font-medium">7 days</td></tr>
                  <tr><td className="p-3">Fix critical (CVSS 9.0+)</td><td className="p-3 font-medium">30 days</td></tr>
                  <tr><td className="p-3">Fix high (CVSS 7.0–8.9)</td><td className="p-3 font-medium">60 days</td></tr>
                  <tr><td className="p-3">Fix medium (CVSS 4.0–6.9)</td><td className="p-3 font-medium">90 days</td></tr>
                  <tr><td className="p-3">Public disclosure (default)</td><td className="p-3 font-medium">90 days from report</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Critical vulns affecting payment flow, license-key forgery, or user data
              exposure get pulled forward and patched ASAP — often within days. If we need
              more time, we'll tell you why and propose a new timeline. We won't ghost you.
            </p>
          </section>

          {/* Bug bounty */}
          <section className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-500/10 p-5 space-y-2 text-sm">
            <h2 className="font-semibold flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" /> Bug bounty status
            </h2>
            <p className="text-foreground/90">
              <strong>No bounty cash program currently.</strong> PassPilot is a young
              product and we can't yet sustain a paid bounty.
            </p>
            <p className="text-foreground/90">
              <strong>Recognition:</strong> if you want it, we credit you on the Hall of
              Fame below — your name (or handle), bug class, report date, and a link to
              your writeup if you publish one. Anonymous researchers stay anonymous. We'll
              revisit a paid program once revenue justifies it.
            </p>
          </section>

          {/* Hall of Fame */}
          <section id="hall-of-fame" className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5" /> Hall of Fame
            </h2>
            <div className="rounded-xl border bg-card p-5 text-center text-sm text-muted-foreground italic">
              <em>(empty — be the first)</em>
            </div>
            <p className="text-xs text-muted-foreground">
              Researchers who responsibly disclosed vulnerabilities to PassPilot.
            </p>
          </section>

          {/* What this doesn't cover */}
          <section className="space-y-2 text-sm text-foreground/90">
            <h2 className="text-xl font-semibold">What this policy doesn't cover</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Privacy questions — <a href="mailto:privacy@passpilot.app" className="underline">privacy@passpilot.app</a></li>
              <li>DMCA / copyright — see <Link href="/dmca" className="underline">DMCA Policy</Link></li>
              <li>Refund disputes — <a href="mailto:refunds@passpilot.app" className="underline">refunds@passpilot.app</a></li>
              <li>General support — <a href="mailto:hello@passpilot.app" className="underline">hello@passpilot.app</a></li>
            </ul>
          </section>

          {/* Machine-readable */}
          <section className="rounded-xl border bg-muted/30 p-5 space-y-2 text-sm">
            <h2 className="font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4" /> Machine-readable disclosure
            </h2>
            <p className="text-foreground/90">
              Per [RFC 9116], the canonical{" "}
              <code>security.txt</code> file lives at{" "}
              <a
                href="/.well-known/security.txt"
                className="underline font-medium"
                target="_blank"
                rel="noopener"
              >
                /.well-known/security.txt
              </a>
              .
            </p>
          </section>
        </div>
      </AppShell>
    </>
  );
}
