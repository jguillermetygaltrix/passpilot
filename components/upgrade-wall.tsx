"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { GradientBorder } from "./ui/gradient-border";
import { useApp } from "@/lib/store";
import { verifyLicense, CHECKOUT_URLS } from "@/lib/licensing";
import { getExamMeta, EXAMS } from "@/lib/data/exams";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Infinity as InfinityIcon,
  KeyRound,
  LifeBuoy,
  Loader2,
  Lock,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

interface UpgradeWallProps {
  open: boolean;
  onClose: () => void;
  reason?: string;
  headline?: string;
  sub?: string;
}

export function UpgradeWall({
  open,
  onClose,
  reason,
  headline,
  sub,
}: UpgradeWallProps) {
  const [tab, setTab] = useState<"upgrade" | "redeem">("upgrade");
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-8 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-md" />
      <div
        className="relative w-full max-w-2xl animate-scale-in my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <GradientBorder
          gradient="linear-gradient(135deg, rgba(61, 96, 255, 0.8), rgba(130, 80, 245, 0.8), rgba(6, 182, 212, 0.8))"
          radius="24px"
          thickness={1.5}
          innerClassName="bg-white overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-white/80 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white transition-colors backdrop-blur"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-6 md:p-8 bg-gradient-to-br from-brand-50/60 to-white">
            {reason && (
              <div className="chip bg-rose-50 border-rose-200 text-rose-700 mb-3">
                <Lock className="h-3 w-3" />
                {reason}
              </div>
            )}
            <h2 className="heading-2 text-balance">
              {headline ?? "Unlock the full pass plan"}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md leading-relaxed">
              {sub ??
                "Upgrade once. Study until you pass. Lifetime access — no subscription."}
            </p>
          </div>

          <div className="px-6 md:px-8">
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-full w-fit mb-5">
              <TabBtn
                active={tab === "upgrade"}
                onClick={() => setTab("upgrade")}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Upgrade
              </TabBtn>
              <TabBtn
                active={tab === "redeem"}
                onClick={() => setTab("redeem")}
              >
                <KeyRound className="h-3.5 w-3.5" />
                I have a key
              </TabBtn>
            </div>
          </div>

          <div className="px-6 md:px-8 pb-7">
            {tab === "upgrade" ? (
              <UpgradeTab />
            ) : (
              <RedeemTab onSuccess={onClose} />
            )}
          </div>
        </GradientBorder>
      </div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-semibold transition-all",
        active
          ? "bg-white text-foreground shadow-soft"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function UpgradeTab() {
  const { profile } = useApp();
  const examMeta = profile ? getExamMeta(profile.examId) : null;

  // Per-cert Pro checkout URLs. Lemon Squeezy products only exist for the
  // first 3 certs right now — AI-900 / Security+ / AWS AIP / GCP CDL get
  // a fallback URL + visual nudge toward Multi-Cert (which is the better
  // value for those certs anyway). Pro card always shows so the $19.99
  // anchor is visible. TODO: Boss to add Lemon Squeezy products for the
  // 4 newer certs and wire URL entries in lib/licensing.ts.
  const PRO_URL_BY_EXAM: Partial<Record<string, string>> = {
    "az-900": CHECKOUT_URLS.proAz900,
    "aws-ccp": CHECKOUT_URLS.proAwsCcp,
    "ms-900": CHECKOUT_URLS.proMs900,
  };
  const proCheckoutUrl =
    (profile?.examId && PRO_URL_BY_EXAM[profile.examId]) ||
    CHECKOUT_URLS.proAz900; // safe fallback — license-server still grants Pro tier
  const proSkuMatchesExam = !!(profile?.examId && PRO_URL_BY_EXAM[profile.examId]);

  const proFeatures = [
    "Unlimited practice drills",
    "All 19 lessons in your exam's chapters",
    "Deep review, cram sheets, key facts",
    "Rescue mode when the exam is near",
    "Personal mistake sheet",
    "Lifetime updates",
  ];

  // Build the multi-cert feature list dynamically from EXAMS so future cert
  // additions auto-update the upsell copy (same DEC-031/DEC-032 drift fix
  // pattern as the homepage and lib/payment/native.ts).
  const certShortList = EXAMS.map((e) => e.name).join(", ");
  const multiFeatures = [
    "Everything in Pro",
    `All ${EXAMS.length} certs unlocked (${certShortList})`,
    "Switch between exams anytime",
    "First access to new certifications",
    "Best value for cert stackers",
  ];

  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div className="relative rounded-2xl border-2 border-brand-500 bg-gradient-to-br from-brand-50/50 to-white p-5 flex flex-col">
        <span className="absolute -top-3 left-4 chip bg-brand-600 text-white border-transparent shadow-soft">
          <Sparkles className="h-3 w-3" /> Best for this exam
        </span>
        <div className="flex items-baseline justify-between mb-2 mt-1">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-brand-700 font-semibold">
              Pro
            </div>
            <div className="text-xs text-muted-foreground">
              {examMeta?.name ?? "1 exam"} · lifetime
            </div>
          </div>
          <div className="text-3xl font-semibold tracking-tight tabular-nums">
            $19.99
          </div>
        </div>
        <ul className="space-y-2 mt-3 flex-1">
          {proFeatures.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        {!proSkuMatchesExam && (
          <p className="mt-3 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1.5 leading-relaxed">
            Pro for <b>{examMeta?.name ?? "this cert"}</b> launches soon. Multi-Cert
            on the right unlocks it today + 6 more for $20 more.
          </p>
        )}
        <a href={proCheckoutUrl} target="_blank" rel="noopener" className="mt-5">
          <Button variant="primary" size="md" className="w-full group">
            Get Pro — $19.99
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </a>
      </div>

      <div className="rounded-2xl border border-border bg-white p-5 flex flex-col">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Multi-Cert
            </div>
            <div className="text-xs text-muted-foreground">
              All {EXAMS.length} exams · lifetime
            </div>
          </div>
          <div className="text-3xl font-semibold tracking-tight tabular-nums">
            $39
          </div>
        </div>
        <ul className="space-y-2 mt-3 flex-1">
          {multiFeatures.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <a
          href={CHECKOUT_URLS.multi}
          target="_blank"
          rel="noopener"
          className="mt-5"
        >
          <Button variant="outline" size="md" className="w-full group">
            Get Multi-Cert — $39
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </a>
      </div>

      <div className="md:col-span-2 mt-2 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        14-day money-back guarantee · pay via card, Apple Pay, Google Pay, PayPal
      </div>
    </div>
  );
}

function RedeemTab({ onSuccess }: { onSuccess: () => void }) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const setLicense = useApp((s) => s.setLicense);
  const router = useRouter();

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const license = await verifyLicense(key);
      if (!license) {
        setError(
          "That key doesn't look right. Double-check the spelling or grab it from your purchase email."
        );
        setLoading(false);
        return;
      }
      setLicense(license);
      setSuccess(
        license.tier === "multi"
          ? `Activated — all ${EXAMS.length} exams unlocked.`
          : "Activated — your Pro exam is unlocked."
      );
      setTimeout(() => {
        onSuccess();
        router.refresh();
      }, 1200);
    } catch (err) {
      setError("Something went wrong. Try again in a moment.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRedeem}>
      <label className="block">
        <span className="text-sm font-medium mb-2 flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-brand-600" />
          License key
        </span>
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="PASSPILOT-XXXX-XXXX-XXXX"
          disabled={loading || !!success}
          className="w-full h-12 rounded-xl border border-border px-4 font-mono text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 bg-white uppercase disabled:opacity-60"
        />
      </label>
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
        Your key was emailed to you after purchase. Paste it here to unlock
        your tier.
      </p>

      {error && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm p-3 animate-fade-in">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm p-3 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4" /> {success}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-5"
        disabled={loading || !key.trim() || !!success}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
          </>
        ) : success ? (
          <>
            <CheckCircle2 className="h-4 w-4" /> Unlocked
          </>
        ) : (
          <>
            Redeem key
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <div className="text-center text-xs text-muted-foreground mt-4">
        No key yet?{" "}
        <Link href="/upgrade" className="text-brand-700 font-medium hover:underline">
          See pricing →
        </Link>
      </div>
    </form>
  );
}

/**
 * Inline lock card — smaller variant for in-page gating (not modal).
 * Used on the Rescue page, lesson player, etc. when users hit a hard gate.
 */
export function LockCard({
  icon: Icon = Lock,
  title,
  body,
  ctaLabel = "Upgrade to unlock",
  onUpgrade,
  reason,
}: {
  icon?: typeof Lock;
  title: string;
  body: string;
  ctaLabel?: string;
  onUpgrade: () => void;
  reason?: string;
}) {
  return (
    <div className="card-surface p-8 text-center max-w-md mx-auto animate-fade-in">
      <div className="relative inline-flex items-center justify-center mb-4">
        <div className="absolute inset-0 rounded-full bg-brand-400/30 blur-2xl" />
        <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet2-600 text-white flex items-center justify-center shadow-pop">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {reason && (
        <div className="chip bg-rose-50 border-rose-200 text-rose-700 mx-auto mb-3">
          <Lock className="h-3 w-3" />
          {reason}
        </div>
      )}
      <h3 className="heading-3 text-[20px] text-balance">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        {body}
      </p>
      <Button
        variant="primary"
        size="lg"
        className="mt-5 group"
        onClick={onUpgrade}
      >
        <Sparkles className="h-4 w-4" />
        {ctaLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Button>
      <div className="text-[11px] text-muted-foreground mt-3">
        Lifetime access · 14-day refund
      </div>
    </div>
  );
}
