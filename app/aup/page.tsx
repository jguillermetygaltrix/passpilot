import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  Mail,
  Ban,
  Bot,
  KeyRound,
  Coins,
  UserX,
  Megaphone,
  XCircle,
} from "lucide-react";

export const metadata = {
  title: "Acceptable Use Policy · PassPilot",
  description:
    "What you can and can't do with PassPilot. Plain-language rules. We try to be fair, then we enforce.",
};

export default function AupPage() {
  return (
    <>
      <AppNav />
      <AppShell className="max-w-3xl">
        <div className="space-y-8 py-8">
          <header>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Acceptable Use Policy
            </h1>
            <p className="mt-2 text-muted-foreground">
              The rules for using PassPilot. We assume good faith. We enforce when others don't.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Last updated: 2026-04-30 · Version 1.0
            </p>
          </header>

          {/* Intro */}
          <section className="space-y-4 text-sm text-foreground/90 leading-relaxed">
            <p>
              PassPilot is a study tool for IT certification exams. This Acceptable Use
              Policy (AUP) sets the rules. Breaking these rules can mean a warning, license
              revocation, account ban, or denied refund — depending on severity. We try to
              be fair. We try to assume good faith. But we ship to the people who follow
              the rules, and that means enforcing them when others don't.
            </p>
            <p>
              By using PassPilot you agree to this AUP. It works alongside our{" "}
              <Link href="/terms" className="underline">Terms of Service</Link> and{" "}
              <Link href="/privacy" className="underline">Privacy Policy</Link>.
            </p>
          </section>

          {/* What it's for */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">What PassPilot is for</h2>
            <p className="text-sm text-foreground/90 leading-relaxed">
              PassPilot is built for <strong>individual cert candidates</strong> preparing
              for their own exams. Use it to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/90">
              <li>Run diagnostics, drills, and mock exams against your real exam blueprint</li>
              <li>Track your readiness over days and weeks</li>
              <li>Get AI explanations on questions you missed</li>
              <li>
                Earn the <Link href="/guarantee" className="underline">Pass Guarantee</Link>{" "}
                refund if the plan didn't work
              </li>
            </ul>
            <p className="text-sm text-foreground/90">
              That's the deal. One person, one license, one exam pass at a time.
            </p>
          </section>

          {/* Age */}
          <section
            id="age-requirement"
            className="rounded-xl border bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 p-5 text-sm space-y-2"
          >
            <h2 className="font-semibold flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <UserX className="h-4 w-4" />
              Age requirement
            </h2>
            <p className="text-foreground/90">
              PassPilot is intended for users <strong>13 and older</strong>. We do not
              knowingly collect data from children under 13. If we find out an account
              belongs to a child under 13, we close it and purge the data. See our{" "}
              <Link href="/privacy" className="underline">Privacy Policy</Link> for the full
              COPPA-compliant flow.
            </p>
          </section>

          {/* Prohibited uses */}
          <section className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold">Prohibited uses</h2>
              <p className="text-sm text-muted-foreground mt-1">
                These will get your license revoked, your account banned, and any refund
                claim denied. Repeat or egregious violations may also be reported to
                authorities or pursued under applicable law.
              </p>
            </div>

            <Rule
              icon={<Ban className="h-4 w-4" />}
              title="1. Don't dump the question bank"
              body={
                <>
                  <p>
                    You may not reproduce, redistribute, sell, share, or publish PassPilot
                    questions, answers, or AI explanations — in whole or in part — anywhere
                    outside PassPilot. This includes:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Posting questions on public forums (Reddit, Discord, Telegram, exam-dump sites)</li>
                    <li>Selling question sets to other study services</li>
                    <li>Sharing screenshots in group chats</li>
                    <li>Compiling questions into PDFs, GitHub repos, Anki decks, or external study material</li>
                    <li>Running automated scrapers, browser extensions, or bots to harvest content</li>
                  </ul>
                  <p className="mt-3">
                    PassPilot's question bank, explanations, and scoring methodology are{" "}
                    <strong>original works owned by Galtrix</strong>. Distributing them is a
                    copyright violation [17 USC §501] and a contract breach. We monitor
                    public dump sites. We will pursue takedowns. Repeat infringers face
                    permanent bans and possible legal action.
                  </p>
                </>
              }
            />

            <Rule
              icon={<KeyRound className="h-4 w-4" />}
              title="2. Don't share licenses"
              body={
                <>
                  <p>
                    Each PassPilot license is for <strong>one person</strong>. The Multi-Cert
                    plan gives you access to multiple exams under your account; it does not
                    give you the right to share access with others.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Don't give your login or license key to anyone else</li>
                    <li>Don't sell or resell your license</li>
                    <li>Don't use a single license across more devices than your plan allows (devices are tracked)</li>
                    <li>Don't use multiple email addresses to extend a single-cert plan</li>
                  </ul>
                  <p className="mt-3">
                    If we detect license sharing — through device-registry signals, IP-pattern
                    anomalies, or shared usage patterns — we revoke the license without refund.
                  </p>
                </>
              }
            />

            <Rule
              icon={<Bot className="h-4 w-4" />}
              title="3. Don't automate"
              body={
                <p>
                  PassPilot is a study tool, not an API. Don't run scripts, bots, or
                  headless browsers against PassPilot endpoints. Don't use automated tools
                  to answer drills or mock exams. Don't build third-party tools or
                  integrations consuming PassPilot data. Don't reverse-engineer the scoring
                  engine or diagnostic algorithm. Automated traffic is rate-limited and may
                  be blocked.
                </p>
              }
            />

            <Rule
              icon={<KeyRound className="h-4 w-4" />}
              title="4. Don't break license validation"
              body={
                <>
                  <p>You may not:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Modify, patch, or repackage the PassPilot app</li>
                    <li>Distribute cracked or modified versions</li>
                    <li>Tamper with on-device license storage to extend access</li>
                    <li>Use leaked, demo, or test license keys to access paid content</li>
                    <li>Exploit promo codes in ways the offer wasn't designed for</li>
                  </ul>
                  <p className="mt-3">
                    These are circumvention violations under [DMCA §1201]. They will be
                    taken seriously.
                  </p>
                </>
              }
            />

            <Rule
              icon={<Coins className="h-4 w-4" />}
              title="5. Don't abuse the Pass Guarantee"
              body={
                <>
                  <p>
                    The{" "}
                    <Link href="/guarantee" className="underline">Pass Guarantee</Link> is a
                    real refund for real candidates who genuinely tried PassPilot's plan
                    and didn't pass. It is not a "free 30 days then claim back" gambit.
                    Abuse looks like:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Filing multiple claims across different accounts/emails for the same exam</li>
                    <li>Claiming guarantee with no record of using the plan (zero drills, zero diagnostics, zero study sessions)</li>
                    <li>Falsifying exam results (claiming a fail when you didn't sit the exam)</li>
                    <li>Filing chargebacks for consumed content while also claiming Pass Guarantee</li>
                  </ul>
                  <p className="mt-3">
                    Legitimate claims with usage thresholds met and authentic exam evidence
                    are honored — that's the whole point. Abusive claims are denied and the
                    account banned. See{" "}
                    <Link href="/refunds" className="underline">Refund Policy</Link> for binding terms.
                  </p>
                </>
              }
            />

            <Rule
              icon={<Megaphone className="h-4 w-4" />}
              title="6. Don't misrepresent who you are"
              body={
                <ul className="list-disc pl-5 space-y-1">
                  <li>Don't sign up under fake names tied to fraudulent payment methods</li>
                  <li>Don't impersonate Galtrix, PassPilot, or our staff to other users</li>
                  <li>Don't post fake reviews or testimonials about PassPilot anywhere [FTC §5 deceptive practices applies to users too]</li>
                </ul>
              }
            />

            <Rule
              icon={<XCircle className="h-4 w-4" />}
              title="7. Don't harass or abuse"
              body={
                <ul className="list-disc pl-5 space-y-1">
                  <li>Don't send abusive messages to PassPilot support, founders, or staff</li>
                  <li>Don't use AI features to generate hate content, threats, or illegal material</li>
                  <li>Don't use PassPilot infrastructure to attempt unauthorized access to other accounts</li>
                </ul>
              }
            />
          </section>

          {/* Reporting */}
          <section className="rounded-xl border bg-card p-5 space-y-2 text-sm">
            <h2 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Reporting abuse
            </h2>
            <p className="text-foreground/90">
              See someone selling PassPilot questions on Reddit? Spot a cracked APK on a dump
              site? Got a tip on coordinated license sharing? Tell us.
            </p>
            <p>
              <strong>Report to:</strong>{" "}
              <a href="mailto:abuse@passpilot.app" className="underline">
                abuse@passpilot.app
              </a>
            </p>
            <p className="text-muted-foreground">
              We act on credible reports within 5 business days. Reporter info stays confidential.
            </p>
          </section>

          {/* Enforcement */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Enforcement
            </h2>
            <p className="text-sm text-foreground/90 leading-relaxed">
              Galtrix reserves the right to issue warnings, temporarily suspend accounts
              during investigation, permanently terminate accounts for confirmed
              violations, revoke licenses without refund for serious violations, and
              pursue legal action where appropriate (especially for content theft and
              license circumvention). Where notice would compromise an investigation, we
              act first and notify after.
            </p>
            <p className="text-sm text-foreground/90">
              Termination decisions can be appealed by emailing{" "}
              <a href="mailto:legal@passpilot.app" className="underline">legal@passpilot.app</a>{" "}
              within 30 days of action. Appeals are reviewed by a human (often the
              founder). We don't promise to reverse — we promise to actually look at it.
            </p>
          </section>

          {/* Changes + governing law */}
          <section className="space-y-3 text-sm text-foreground/90">
            <h2 className="text-xl font-semibold">Changes to this AUP</h2>
            <p>
              We may update this AUP. Material changes are announced in-app and via email
              if we have your address. Continued use after a change means you accept the
              updated AUP.
            </p>
            <h2 className="text-xl font-semibold pt-2">Governing law</h2>
            <p>
              This AUP is governed by the laws of the Commonwealth of Puerto Rico and
              applicable US federal law. Disputes are handled per the Terms of Service.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-2xl border bg-muted/30 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" /> Contact
            </h2>
            <div className="mt-2 text-sm space-y-1 text-foreground/90">
              <p>General: <a href="mailto:hello@passpilot.app" className="underline">hello@passpilot.app</a></p>
              <p>Abuse reports: <a href="mailto:abuse@passpilot.app" className="underline">abuse@passpilot.app</a></p>
              <p>Legal notices: <a href="mailto:legal@passpilot.app" className="underline">legal@passpilot.app</a></p>
              <p>Privacy/data: <a href="mailto:privacy@passpilot.app" className="underline">privacy@passpilot.app</a></p>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Galtrix LLC · {`{Address Line 1}`} · San Juan, PR 00xxx
            </p>
          </section>
        </div>
      </AppShell>
    </>
  );
}

function Rule({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-2">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <span className="h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 flex items-center justify-center">
          {icon}
        </span>
        {title}
      </h3>
      <div className="text-sm text-foreground/90 leading-relaxed pl-9">{body}</div>
    </div>
  );
}
