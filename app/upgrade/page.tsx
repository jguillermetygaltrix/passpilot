"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import { Button } from "@/components/ui/button";
import { GradientBorder } from "@/components/ui/gradient-border";
import { Reveal } from "@/components/reveal";
import { RefundConsent } from "@/components/refund-consent";
import { UsageBadge } from "@/components/usage-badge";
import { useEntitlements } from "@/lib/entitlements";
import { CHECKOUT_URLS } from "@/lib/licensing";
import { useApp } from "@/lib/store";
import { getExamMeta, EXAMS } from "@/lib/data/exams";
import type { ExamId } from "@/lib/types";
import { getPlatform, isIOS, allowExternalCheckout } from "@/lib/platform";
import {
  isNativeIAPAvailable,
  getNativeProducts,
  purchaseNative,
  restoreNativePurchases,
  type NativeProduct,
  type NativeProductId,
} from "@/lib/payment/native";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  KeyRound,
  LifeBuoy,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Router: delegates to the right paywall component for this platform.
// ─────────────────────────────────────────────────────────────

export default function UpgradePage() {
  const [platform, setPlatform] = useState<"web" | "ios" | "android">("web");

  useEffect(() => {
    setPlatform(getPlatform());
  }, []);

  return (
    <>
      <AppNav />
      <div className="relative">
        <div className="absolute inset-0 -z-10 hero-aurora opacity-70" />
        <AppShell className="max-w-5xl">
          {platform === "ios" || platform === "android" ? (
            <NativePaywall platform={platform} />
          ) : (
            <WebPaywall />
          )}
        </AppShell>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// NATIVE PAYWALL — iOS / Android
// Apple-safe: no external payment links, no external prices mentioned.
// All purchases go through StoreKit / Play Billing via RevenueCat.
// ─────────────────────────────────────────────────────────────

function NativePaywall({ platform }: { platform: "ios" | "android" }) {
  const ent = useEntitlements();
  const iapAvailable = isNativeIAPAvailable();
  const [products, setProducts] = useState<NativeProduct[] | null>(null);
  const [busy, setBusy] = useState<NativeProductId | "restore" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!iapAvailable) return;
    let cancelled = false;
    getNativeProducts().then((p) => {
      if (!cancelled) setProducts(p);
    });
    return () => {
      cancelled = true;
    };
  }, [iapAvailable]);

  if (ent.hasPro) {
    return <AlreadyUnlocked tier={ent.hasMulti ? "multi" : "pro"} />;
  }

  // IAP not yet wired up — show Apple-safe placeholder.
  // Tells the user what's coming, offers restore, no external links.
  if (!iapAvailable) {
    return (
      <Reveal>
        <div className="text-center max-w-xl mx-auto pt-8">
          <div className="chip bg-brand-50 dark:bg-brand-500/15 border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 mx-auto mb-3">
            <Sparkles className="h-3 w-3" />
            PassPilot Pro
          </div>
          <h1 className="heading-1">
            Unlock unlimited study time.
          </h1>
          <p className="text-muted-foreground mt-4 leading-relaxed text-lg">
            Upgrade options are coming to the {platform === "ios" ? "App Store" : "Play Store"} soon.
            If you already bought PassPilot on another device, restore your purchase below.
          </p>

          <FeatureGrid />

          <RestoreBlock
            busy={busy === "restore"}
            onClick={async () => {
              setBusy("restore");
              setMessage(null);
              const result = await restoreNativePurchases();
              setBusy(null);
              if (result?.active) {
                setMessage("Purchase restored. Refresh to apply.");
                setTimeout(() => window.location.reload(), 1200);
              } else {
                setMessage("No previous purchase found on this account.");
              }
            }}
            message={message}
          />
        </div>
      </Reveal>
    );
  }

  // IAP IS available — show native purchase tiers
  return (
    <Reveal>
      <div className="text-center max-w-2xl mx-auto pt-4 mb-10">
        <div className="chip bg-brand-50 dark:bg-brand-500/15 border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 mx-auto mb-3">
          <Sparkles className="h-3 w-3" />
          Choose your plan
        </div>
        <h1 className="heading-1">
          Pick the plan that{" "}
          <span className="gradient-text">fits your exam timeline</span>
        </h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          Cancel anytime. Managed by{" "}
          {platform === "ios" ? "Apple" : "Google Play"}.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {(products ?? []).map((product) => {
          const isFeatured = product.id === "passpilot.annual";
          return (
            <NativeProductCard
              key={product.id}
              product={product}
              featured={isFeatured}
              busy={busy === product.id}
              onPurchase={async () => {
                setBusy(product.id);
                setMessage(null);
                const result = await purchaseNative(product.id);
                setBusy(null);
                if (result?.active) {
                  setMessage("Unlocked. Refreshing…");
                  setTimeout(() => window.location.reload(), 800);
                } else {
                  setMessage("Purchase cancelled or failed. Try again.");
                }
              }}
            />
          );
        })}
      </div>

      {message && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {message}
        </div>
      )}

      <RestoreBlock
        busy={busy === "restore"}
        onClick={async () => {
          setBusy("restore");
          setMessage(null);
          const result = await restoreNativePurchases();
          setBusy(null);
          if (result?.active) {
            setMessage("Purchase restored. Refreshing…");
            setTimeout(() => window.location.reload(), 800);
          } else {
            setMessage("No previous purchase found on this account.");
          }
        }}
        message={null}
      />

      <Reveal delay={300}>
        <div className="mt-10 text-center text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
          Subscriptions auto-renew unless cancelled at least 24h before the
          current period ends. Manage or cancel in your{" "}
          {platform === "ios" ? "Apple ID" : "Google Play"} settings.{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms
          </Link>
        </div>
      </Reveal>
    </Reveal>
  );
}

function NativeProductCard({
  product,
  featured,
  busy,
  onPurchase,
}: {
  product: NativeProduct;
  featured: boolean;
  busy: boolean;
  onPurchase: () => void;
}) {
  const periodSuffix =
    product.period === "monthly"
      ? "/month"
      : product.period === "annual"
        ? "/year"
        : product.period === "weekly"
          ? " for 7 days"
          : " once";

  const card = (
    <div
      className={`p-6 md:p-7 flex flex-col h-full ${
        featured ? "" : "soft-card"
      }`}
    >
      {featured && (
        <span className="absolute top-5 right-5 chip bg-brand-600 text-white border-transparent shadow-soft">
          <Trophy className="h-3 w-3" /> Best value
        </span>
      )}
      <div className="mb-3">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          {product.title}
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">
          {product.description}
        </div>
      </div>
      <div className="mb-5">
        <span className="text-4xl font-semibold tracking-tight tabular-nums">
          {product.priceDisplay}
        </span>
        <span className="text-sm text-muted-foreground ml-1">
          {periodSuffix}
        </span>
      </div>
      <ul className="space-y-2.5 flex-1">
        {product.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <Check className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        variant="primary"
        size="lg"
        className="w-full mt-6 group"
        onClick={onPurchase}
        disabled={busy}
      >
        {busy ? "Opening purchase…" : `Get ${product.title}`}
        {!busy && (
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        )}
      </Button>
    </div>
  );

  if (featured) {
    return (
      <GradientBorder
        gradient="linear-gradient(135deg, #3d60ff, #8250f5, #06b6d4)"
        radius="20px"
        thickness={1.5}
        innerClassName="h-full relative overflow-hidden"
      >
        {card}
      </GradientBorder>
    );
  }
  return card;
}

function RestoreBlock({
  busy,
  onClick,
  message,
}: {
  busy: boolean;
  onClick: () => void;
  message: string | null;
}) {
  return (
    <Reveal delay={200}>
      <div className="mt-10 max-w-lg mx-auto text-center">
        <Button
          variant="outline"
          size="md"
          onClick={onClick}
          disabled={busy}
          className="mx-auto"
        >
          <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
          {busy ? "Restoring…" : "Restore purchases"}
        </Button>
        {message && (
          <div className="mt-3 text-xs text-muted-foreground">{message}</div>
        )}
      </div>
    </Reveal>
  );
}

// ─────────────────────────────────────────────────────────────
// WEB PAYWALL — Lemon Squeezy (unchanged flow, current SKUs)
// ─────────────────────────────────────────────────────────────

function WebPaywall() {
  const { profile } = useApp();
  const ent = useEntitlements();
  const [proConsented, setProConsented] = useState(false);
  const [multiConsented, setMultiConsented] = useState(false);

  // Cert switcher on the Pro card — lets visitors buy ANY of the 7 certs at
  // $19.99 without leaving this page (was a UX gap: page-load locked Pro to
  // their profile's cert, so switching meant going back to onboarding).
  // Defaults to the user's profile cert; falls back to EXAMS[0] for fresh visitors.
  const [selectedProExamId, setSelectedProExamId] = useState<string>(
    profile?.examId ?? EXAMS[0].id,
  );
  const proExamMeta = getExamMeta(selectedProExamId as ExamId);

  // Per-cert checkout map — covers all 7 certs (DEC-045 follow-up; previously
  // only routed AZ-900/AWS-CCP/MS-900 and the 4 newer certs fell through to
  // the AZ-900 SKU, meaning AI-900 buyers landed on the wrong checkout page).
  const PRO_URL_BY_EXAM: Partial<Record<string, string>> = {
    "az-900": CHECKOUT_URLS.proAz900,
    "aws-ccp": CHECKOUT_URLS.proAwsCcp,
    "ms-900": CHECKOUT_URLS.proMs900,
    "ai-900": CHECKOUT_URLS.proAi900,
    "sec-plus": CHECKOUT_URLS.proSecPlus,
    "aws-aip": CHECKOUT_URLS.proAwsAip,
    "gcp-cdl": CHECKOUT_URLS.proGcpCdl,
  };
  const PRO_OFFER_BY_EXAM: Partial<Record<string, string>> = {
    "az-900": "pro-az900",
    "aws-ccp": "pro-aws-ccp",
    "ms-900": "pro-ms900",
    "ai-900": "pro-ai900",
    "sec-plus": "pro-sec-plus",
    "aws-aip": "pro-aws-aip",
    "gcp-cdl": "pro-gcp-cdl",
  };
  const proCheckoutUrl =
    PRO_URL_BY_EXAM[selectedProExamId] || CHECKOUT_URLS.proAz900;
  const proOfferId =
    PRO_OFFER_BY_EXAM[selectedProExamId] || "pro-az900";

  // Switching cert mid-flow invalidates the prior consent (legally cleanest
  // since each cert is a distinct product variant; user must re-acknowledge).
  const handleProExamChange = (newId: string) => {
    setSelectedProExamId(newId);
    setProConsented(false);
  };

  if (ent.hasPro) {
    return <AlreadyUnlocked tier={ent.hasMulti ? "multi" : "pro"} />;
  }

  return (
    <>
      <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-12 pt-4">
          <div className="chip bg-brand-50 dark:bg-brand-500/15 border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 mx-auto mb-3">
            <Sparkles className="h-3 w-3" />
            One-time upgrade · no subscription
          </div>
          <h1 className="heading-1 text-balance">
            Study until you <span className="gradient-text">actually pass.</span>
          </h1>
          <p className="text-muted-foreground mt-4 leading-relaxed text-lg">
            Pay once, keep lifetime access. Pick the cert you&apos;re studying — or
            grab all {EXAMS.length} for the cost of a takeout dinner.
          </p>
          <div className="mt-4">
            <UsageBadge />
          </div>
        </div>
      </Reveal>

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
                <div className="text-[11px] text-muted-foreground">one-time</div>
              </div>
            </div>
            <label className="rounded-xl border border-brand-100 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-500/15/40 p-3 text-sm mb-4 flex items-center gap-2 cursor-pointer hover:border-brand-200 dark:border-brand-500/40 transition-colors">
              <span className="font-medium text-brand-700 dark:text-brand-300 shrink-0">Unlocks:</span>
              <select
                value={selectedProExamId}
                onChange={(e) => handleProExamChange(e.target.value)}
                className="flex-1 bg-transparent border-0 outline-none font-medium text-foreground cursor-pointer focus:ring-0 -my-0.5"
                aria-label="Pick which certification to unlock with Pro"
              >
                {EXAMS.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullTitle}
                  </option>
                ))}
              </select>
              <svg
                className="h-3.5 w-3.5 text-brand-700 dark:text-brand-300 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </label>
            <FeatureList
              features={[
                "Unlimited practice drills",
                "All chapter lessons",
                "Deep review, cram sheets, key facts",
                "Rescue mode for the final stretch",
                "Personal mistake sheet",
                "Streak tracking + readiness trend",
                "Lifetime updates to this exam",
              ]}
            />
            <div className="mt-5">
              <RefundConsent
                offerId={proOfferId}
                priceCents={1999}
                currency="USD"
                onConsent={setProConsented}
              />
            </div>
            {proConsented ? (
              <a href={proCheckoutUrl} target="_blank" rel="noopener" className="mt-4">
                <Button variant="primary" size="lg" className="w-full group">
                  Get {proExamMeta.shortCode} Pro — $19.99
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </a>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full mt-4 opacity-50 cursor-not-allowed"
                disabled
                title="Check the consent box above to continue"
              >
                Get {proExamMeta.shortCode} Pro — $19.99
              </Button>
            )}
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
                <div className="text-xs uppercase tracking-wider text-brand-700 dark:text-brand-300 font-semibold">
                  Multi-Cert
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  All {EXAMS.length} exams · lifetime
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-semibold tracking-tight tabular-nums">
                  $39
                </div>
                <div className="text-[11px] text-muted-foreground">one-time</div>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-brand-50 via-violet2-50 to-cyan-50 border border-brand-100 dark:border-brand-500/30 p-3 text-sm mb-4">
              <span className="font-medium text-brand-700 dark:text-brand-300">Unlocks:</span>{" "}
              {EXAMS.map((e) => e.name).join(" · ")}
            </div>
            <FeatureList
              features={[
                `Everything in Pro, times ${EXAMS.length}`,
                `All ${EXAMS.length} certifications unlocked`,
                "Switch exams anytime",
                "First access to new certs",
                `Cert-stacker-friendly — save vs ${EXAMS.length}× Pro`,
                "Priority on requested certifications",
              ]}
            />
            <div className="mt-5">
              <RefundConsent
                offerId="multi-cert"
                priceCents={3900}
                currency="USD"
                onConsent={setMultiConsented}
              />
            </div>
            {multiConsented ? (
              <a href={CHECKOUT_URLS.multi} target="_blank" rel="noopener" className="mt-4">
                <Button variant="primary" size="lg" className="w-full group">
                  Get Multi-Cert — $39
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </a>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full mt-4 opacity-50 cursor-not-allowed"
                disabled
                title="Check the consent box above to continue"
              >
                Get Multi-Cert — $39
              </Button>
            )}
          </GradientBorder>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            14-day money-back guarantee
          </span>
          <span className="text-border">·</span>
          <span>Card, Apple Pay, Google Pay, PayPal</span>
          <span className="text-border">·</span>
          <span>Tax-inclusive pricing</span>
        </div>
      </Reveal>

      <Reveal delay={300}>
        <div className="mt-12 max-w-2xl mx-auto card-surface p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-brand-50 dark:bg-brand-500/15 border border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0">
            <KeyRound className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">Already purchased?</div>
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
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared fragments
// ─────────────────────────────────────────────────────────────

function AlreadyUnlocked({ tier }: { tier: "pro" | "multi" }) {
  return (
    <Reveal>
      <div className="text-center max-w-2xl mx-auto mb-12 pt-4">
        <div className="chip bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 mx-auto mb-3">
          <CheckCircle2 className="h-3 w-3" />
          You&apos;re on {tier === "multi" ? "Multi-Cert" : "Pro"}
        </div>
        <h1 className="heading-1 text-balance">
          You&apos;re <span className="gradient-text-static">fully unlocked</span>
        </h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          Nothing to do here. Close this tab and go pass.
        </p>
      </div>
    </Reveal>
  );
}

function FeatureGrid() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 max-w-md mx-auto text-left">
      {[
        "Unlimited drills",
        "All lessons unlocked",
        "Rescue mode",
        "Mistake sheet",
        "Streak tracking",
        "Readiness trend",
      ].map((f) => (
        <div
          key={f}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Check className="h-4 w-4 text-brand-600 shrink-0" />
          {f}
        </div>
      ))}
    </div>
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
      <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-brand-500/15 border border-brand-100 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 flex items-center justify-center mx-auto mb-3">
        <Icon className="h-4 w-4" />
      </div>
      <div className="font-semibold text-sm">{title}</div>
      <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
        {body}
      </div>
    </div>
  );
}
