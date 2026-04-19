"use client";

import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import { Button } from "@/components/ui/button";
import { GradientBorder } from "@/components/ui/gradient-border";
import { Reveal } from "@/components/reveal";
import { useEntitlements } from "@/lib/entitlements";
import { CHECKOUT_URLS } from "@/lib/licensing";
import { useApp } from "@/lib/store";
import { getExamMeta } from "@/lib/data/exams";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  KeyRound,
  LifeBuoy,
  Shield,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

export default function UpgradePage() {
  const { profile } = useApp();
  const ent = useEntitlements();
  const examMeta = profile ? getExamMeta(profile.examId) : null;

  const proCheckoutUrl =
    profile?.examId === "aws-ccp"
      ? CHECKOUT_URLS.proAwsCcp
      : profile?.examId === "ms-900"
        ? CHECKOUT_URLS.proMs900
        : CHECKOUT_URLS.proAz900;

  return (
    <>
      <AppNav />
      <div className="relative">
        <div className="absolute inset-0 -z-10 hero-aurora opacity-70" />
        <AppShell className="max-w-5xl">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12 pt-4">
              {ent.hasPro ? (
                <>
                  <div className="chip bg-emerald-50 border-emerald-200 text-emerald-700 mx-auto mb-3">
                    <CheckCircle2 className="h-3 w-3" />
                    You're on {ent.hasMulti ? "Multi-Cert" : "Pro"}
                  </div>
                  <h1 className="heading-1 text-balance">
                    You're{" "}
                    <span className="gradient-text-static">fully unlocked</span>
                  </h1>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    Nothing to do here. Close this tab and go pass.
                  </p>
                </>
              ) : (
                <>
                  <div className="chip bg-brand-50 border-brand-100 text-brand-700 mx-auto mb-3">
                    <Sparkles className="h-3 w-3" />
                    One-time upgrade · no subscription
                  </div>
                  <h1 className="heading-1 text-balance">
                    Study until you{" "}
                    <span className="gradient-text">actually pass.</span>
                  </h1>
                  <p className="text-muted-foreground mt-4 leading-relaxed text-lg">
                    Pay once, keep lifetime access. Pick the cert you're
                    studying — or grab all three for the cost of a takeout
                    dinner.
                  </p>
                </>
              )}
            </div>
          </Reveal>

          {!ent.hasPro && (
            <Reveal delay={100}>
              <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                <div className="soft-card p-6 md:p-7 flex flex-col h-full">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        Pro
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        One cert · lifetime access
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-semibold tracking-tight tabular-nums">
                        $19.99
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        one-time
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-3 text-sm mb-4">
                    <span className="font-medium text-brand-700">
                      Unlocks:
                    </span>{" "}
                    {examMeta?.fullTitle ?? "Your chosen exam"}
                  </div>
                  <FeatureList
                    features={[
                      "Unlimited practice drills",
                      "All 19 chapter lessons",
                      "Deep review, cram sheets, key facts",
                      "Rescue mode for the final stretch",
                      "Personal mistake sheet",
                      "Streak tracking + readiness trend",
                      "Lifetime updates to this exam",
                    ]}
                  />
                  <a
                    href={proCheckoutUrl}
                    target="_blank"
                    rel="noopener"
                    className="mt-6"
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full group"
                    >
                      Get Pro — $19.99
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </a>
                </div>

                <GradientBorder
                  gradient="linear-gradient(135deg, #3d60ff, #8250f5, #06b6d4)"
                  radius="20px"
                  thickness={1.5}
                  innerClassName="p-6 md:p-7 h-full flex flex-col relative overflow-hidden"
                >
                  <span className="absolute top-5 right-5 chip bg-brand-600 text-white border-transparent shadow-soft">
                    <Trophy className="h-3 w-3" /> Best value
                  </span>
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-brand-700 font-semibold">
                        Multi-Cert
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        All 3 exams · lifetime
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-semibold tracking-tight tabular-nums">
                        $39
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        one-time
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-brand-50 via-violet2-50 to-cyan-50 border border-brand-100 p-3 text-sm mb-4">
                    <span className="font-medium text-brand-700">
                      Unlocks:
                    </span>{" "}
                    AZ-900 · AWS CCP · MS-900
                  </div>
                  <FeatureList
                    features={[
                      "Everything in Pro, times three",
                      "All 3 certifications unlocked",
                      "Switch exams anytime",
                      "First access to new certs",
                      "Cert-stacker-friendly — save $18 vs 3× Pro",
                      "Priority on requested certifications",
                    ]}
                  />
                  <a
                    href={CHECKOUT_URLS.multi}
                    target="_blank"
                    rel="noopener"
                    className="mt-6"
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full group"
                    >
                      Get Multi-Cert — $39
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </a>
                </GradientBorder>
              </div>
            </Reveal>
          )}

          <Reveal delay={200}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                14-day money-back guarantee
              </span>
              <span className="text-border">·</span>
              <span>Card, Apple Pay, Google Pay, PayPal</span>
              <span className="text-border">·</span>
              <span>Tax-inclusive pricing (merchant-of-record)</span>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-12 max-w-2xl mx-auto card-surface p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                <KeyRound className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">
                  Already purchased?
                </div>
                <div className="text-sm text-muted-foreground">
                  Paste your license key to unlock.
                </div>
              </div>
              <Link href="/redeem">
                <Button variant="outline" size="md">
                  Redeem
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="grid md:grid-cols-3 gap-4 mt-14 max-w-4xl mx-auto">
              <Guarantee
                icon={Shield}
                title="Lifetime access"
                body="Pay once, own it forever. No recurring charges, no auto-renewals."
              />
              <Guarantee
                icon={Zap}
                title="Works offline"
                body="All content is bundled. Use it on a plane, on the bus, anywhere."
              />
              <Guarantee
                icon={LifeBuoy}
                title="Refund if it doesn't click"
                body="Two-week no-questions refund. Email us — we'll handle it."
              />
            </div>
          </Reveal>
        </AppShell>
      </div>
    </>
  );
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="space-y-2.5 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm">
          <Check className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}

function Guarantee({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Shield;
  title: string;
  body: string;
}) {
  return (
    <div className="soft-card p-5 text-center">
      <div className="h-10 w-10 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-3">
        <Icon className="h-4 w-4" />
      </div>
      <div className="font-semibold text-sm">{title}</div>
      <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
        {body}
      </div>
    </div>
  );
}
