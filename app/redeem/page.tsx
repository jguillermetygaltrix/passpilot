"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import { Button } from "@/components/ui/button";
import { GradientBorder } from "@/components/ui/gradient-border";
import { useApp } from "@/lib/store";
import { verifyLicense, describeLicense, DEMO_KEYS } from "@/lib/licensing";
import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function RedeemPage() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const router = useRouter();
  const params = useSearchParams();
  const setLicense = useApp((s) => s.setLicense);
  const existingLicense = useApp((s) => s.license);

  const [key, setKey] = useState(params.get("key") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const autoKey = params.get("key");
    if (autoKey) {
      setKey(autoKey);
    }
  }, [params]);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const license = await verifyLicense(key);
    if (!license) {
      setError(
        "That key doesn't look right. Double-check the spelling or grab it from your purchase email."
      );
      setLoading(false);
      return;
    }
    setLicense(license);
    setSuccess(describeLicense(license));
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  return (
    <>
      <AppNav />
      <div className="relative min-h-[70vh] flex items-start justify-center">
        <div className="absolute inset-0 -z-10 hero-aurora opacity-60" />
        <AppShell className="max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet2-600 text-white shadow-pop mb-4">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="heading-2 text-balance">Redeem your license</h1>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              Paste the key we emailed you after purchase. Unlocks in one tap.
            </p>
          </div>

          {existingLicense && !success && (
            <div className="card-surface p-5 mb-5 border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">
                    You're already on {describeLicense(existingLicense)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Entering a new key replaces this one.
                  </div>
                </div>
              </div>
            </div>
          )}

          <GradientBorder
            gradient="linear-gradient(135deg, rgba(61, 96, 255, 0.4), rgba(130, 80, 245, 0.4), rgba(6, 182, 212, 0.4))"
            radius="20px"
            thickness={1.5}
            innerClassName="p-6 md:p-7"
          >
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
                  autoFocus
                />
              </label>

              {error && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm p-3 animate-fade-in">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm p-4 flex items-start gap-3 animate-fade-in">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Activated — {success}</div>
                    <div className="text-xs mt-0.5">
                      Taking you to your dashboard…
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-5 group"
                disabled={loading || !key.trim() || !!success}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying…
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Unlocked
                  </>
                ) : (
                  <>
                    Redeem and unlock
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>
          </GradientBorder>

          <div className="text-center mt-6 text-sm">
            <span className="text-muted-foreground">No key yet? </span>
            <Link
              href="/upgrade"
              className="text-brand-700 font-medium hover:underline"
            >
              See pricing →
            </Link>
          </div>

          {/* 🛡️ LEGION HARDENING (DEC-020 follow-up): demo-keys panel is dev-only.
              Defense in depth — DEMO_KEYS const is also NODE_ENV-gated in lib/licensing.ts
              so even if this UI gate fails, the values would be undefined.
              Webpack tree-shakes the entire branch in production builds. */}
          {process.env.NODE_ENV !== "production" && (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-slate-50/60 p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                Demo keys (for testing)
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                <DemoKey label="Pro · AZ-900" value={DEMO_KEYS.proAz900 ?? ""} onUse={setKey} />
                <DemoKey label="Pro · AWS CCP" value={DEMO_KEYS.proAwsCcp ?? ""} onUse={setKey} />
                <DemoKey label="Pro · MS-900" value={DEMO_KEYS.proMs900 ?? ""} onUse={setKey} />
                <DemoKey label="Multi-Cert" value={DEMO_KEYS.multi ?? ""} onUse={setKey} />
              </div>
            </div>
          )}
        </AppShell>
      </div>
    </>
  );
}

function DemoKey({
  label,
  value,
  onUse,
}: {
  label: string;
  value: string;
  onUse: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground font-sans text-[11px]">
        {label}
      </span>
      <button
        onClick={() => onUse(value)}
        className="font-mono text-brand-700 hover:text-brand-800 hover:underline"
      >
        {value}
      </button>
    </div>
  );
}
