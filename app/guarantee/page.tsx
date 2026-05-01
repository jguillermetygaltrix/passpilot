import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  CreditCard,
  Star,
  RefreshCw,
} from "lucide-react";

export const metadata = {
  title: "Pass Guarantee · PassPilot",
  description:
    "Use the daily plan 30 days. If you don't pass within 60 days of unlocking, full refund. No hoops, no support gauntlet, no score report required.",
  openGraph: {
    title: "Pass Guarantee — PassPilot",
    description:
      "We backed our daily plan with cash. If we're wrong about you, you don't pay.",
  },
};

/**
 * /guarantee — the marketing-tier explanation of the Pass Guarantee.
 * /refunds is the binding policy doc; this page is the consumer-facing
 * pitch + FAQ. Today's landing footer + ToS §3 both link here.
 *
 * Copy sourced from agents/quill/drafts/2026-04-28-passpilot-pass-
 * guarantee-copy.md (approved 2026-04-30 via DEC-046 audit fix loop).
 */
export default function GuaranteePage() {
  return (
    <>
      <AppNav />
      <AppShell className="max-w-3xl">
        <div className="space-y-12 py-10 md:py-14">
          {/* ─── Hero ────────────────────────────────────────────── */}
          <section className="space-y-6">
            <div className="chip bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 mx-auto">
              <ShieldCheck className="h-3 w-3" />
              Pass Guarantee
            </div>
            <h1 className="heading-1 text-balance text-center">
              We backed our daily plan with{" "}
              <span className="gradient-text-static">cash.</span>
            </h1>

            <div className="space-y-5 text-[15px] md:text-base leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              <p>
                Most cert apps want you to gamble — pay $99, hope it works, eat
                the loss if it doesn&apos;t. We don&apos;t think that&apos;s a fair deal.
              </p>
              <p>Here&apos;s our deal instead.</p>
              <p className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-500/10 p-5 text-foreground font-medium">
                Use the PassPilot daily plan for at least 30 days. If you don&apos;t
                pass your exam within 60 days of unlocking, we refund you in full.
              </p>
              <p>
                No score report required. No support-ticket gauntlet. No
                &quot;send us a 500-word essay explaining what went wrong.&quot; Open
                the app, tap Settings, hit Refund. Done.
              </p>
              <p>
                We can offer this because the system works. The diagnostic
                finds your gaps. The daily plan closes them. The readiness
                score tells you when you&apos;re ready to book. By the time it
                crosses 80%, the test is the easy part.
              </p>
              <p className="text-foreground font-medium">
                If we&apos;re wrong about you, you don&apos;t pay. That&apos;s the deal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/onboarding">
                <button className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity">
                  Start the diagnostic — free
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/upgrade">
                <button className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-border bg-card hover:bg-muted transition-colors font-semibold">
                  See pricing
                </button>
              </Link>
            </div>
          </section>

          {/* ─── 3 trust marks ────────────────────────────────────── */}
          <section className="grid sm:grid-cols-3 gap-4">
            <TrustCard
              icon={<RefreshCw className="h-5 w-5" />}
              title="No score report"
              body="We trust you. If you say you didn't pass, you didn't pass."
            />
            <TrustCard
              icon={<Clock className="h-5 w-5" />}
              title="60-day window"
              body="From the moment you unlock the cert. Plenty of room to study, take, retake."
            />
            <TrustCard
              icon={<CreditCard className="h-5 w-5" />}
              title="Full refund"
              body="100% of what you paid — Lifetime, Annual, Monthly, or Weekly."
            />
          </section>

          {/* ─── FAQ ──────────────────────────────────────────────── */}
          <section className="space-y-2">
            <h2 className="heading-2 text-balance pb-2">
              How the Pass Guarantee works
            </h2>
            <div className="divide-y-soft border-y border-border">
              <FaqItem
                q="What's actually covered?"
                a="The full price you paid for PassPilot, refunded in full. Lifetime $99, Annual $49, Monthly $9.99, Weekly $4.99 — whichever tier you're on, the refund is 100% of what you paid."
              />
              <FaqItem
                q="What's the timeline?"
                a="You have 60 days from the moment you unlock the cert to pass it. Inside that window, if you didn't pass, you can claim. The refund itself processes in 5-10 business days through whichever store you bought from (Apple, Google Play, or our web checkout)."
              />
              <FaqItem
                q="Do I have to actually use the app?"
                a="Yes — at least 30 days of the daily plan. The Guarantee covers people who studied and still didn't pass, not people who paid and never opened the app. We track plan completion automatically; you don't have to send screenshots."
              />
              <FaqItem
                q="Do I have to send my score report?"
                a="No. We trust you. If you say you didn't pass, you didn't pass. We'd rather refund a few dishonest people than make honest people jump through hoops."
              />
              <FaqItem
                q="What if I bought a Weekly or Monthly subscription?"
                a="Same Guarantee. Use the daily plan 30 days, don't pass within 60 days of first unlock, full refund. The 30-day usage requirement means a 1-week subscriber needs to extend (we'll cover the gap if you started the plan and want to keep going) — just hit Refund and we'll work it out."
              />
              <FaqItem
                q="What if I pass — do I owe you anything extra?"
                a="No. PassPilot is one price, paid up front. The Guarantee is a one-way safety net for you, not a commission for us. Keep your cert, post the badge, tell a friend."
              />
            </div>
          </section>

          {/* ─── Binding-policy + counsel disclaimer ───────────────── */}
          <section className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              The binding terms live at /refunds
            </p>
            <p>
              This page is the offer in plain English. The formal policy —
              eligibility thresholds, EU Article 16(m) consent waiver, claim
              process, abuse-prevention rules — lives at{" "}
              <Link
                href="/refunds"
                className="text-foreground font-medium underline-offset-2 hover:underline"
              >
                passpilot.app/refunds
              </Link>
              . If anything below conflicts with /refunds, /refunds wins —
              that&apos;s the document our payment processors and (if it ever
              comes to it) any small-claims judge will read.
            </p>
            <p className="text-xs">
              Refunds are routed through whichever store you bought from
              (Apple, Google Play, or Stripe via Lemon Squeezy on the web).
              Apple-bought subscriptions refund through Apple, not us.
            </p>
          </section>

          {/* ─── Bottom CTA ────────────────────────────────────────── */}
          <section className="text-center space-y-4 pt-4">
            <div className="chip bg-brand-50 dark:bg-brand-500/15 border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 mx-auto">
              <Sparkles className="h-3 w-3" />
              Ready to start?
            </div>
            <h3 className="heading-3 text-balance">
              Five minutes. No card required. Real readiness score.
            </h3>
            <Link href="/onboarding">
              <button className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity mt-2">
                Start the diagnostic
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </section>
        </div>
      </AppShell>
    </>
  );
}

function TrustCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-colors">
      <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
        {icon}
      </div>
      <div className="font-semibold text-[15px] mb-1">{title}</div>
      <div className="text-sm text-muted-foreground leading-relaxed">{body}</div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-5">
      <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
        <span className="font-semibold text-foreground">{q}</span>
        <span className="text-muted-foreground text-2xl leading-none transition-transform group-open:rotate-45 shrink-0">
          +
        </span>
      </summary>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{a}</p>
    </details>
  );
}
