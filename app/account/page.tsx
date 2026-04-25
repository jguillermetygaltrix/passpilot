"use client";

import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { AppShell } from "@/components/container";
import { useApp } from "@/lib/store";
import { useEntitlements } from "@/lib/entitlements";
import {
  User, BarChart3, Shield, Settings, LifeBuoy, FileText, RotateCcw,
  ChevronRight, Sparkles, CheckCircle2,
} from "lucide-react";

/**
 * /account — the account hub. Links to the 4 sub-surfaces:
 *   - /account/usage   (Layer 2 — usage tracking)
 *   - /account/devices (Layer 5 — device binding)
 *   - /settings        (existing settings page)
 *   - /redeem          (license key entry)
 *
 * Also shows quick status: tier, email (if any), verified date.
 */
export default function AccountPage() {
  const { license, profile } = useApp();
  const ent = useEntitlements();

  return (
    <>
      <AppNav />
      <AppShell className="max-w-2xl">
        <div className="space-y-8 py-8">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
              <User className="h-7 w-7 text-brand-600" /> Account
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage your license, devices, data, and settings.
            </p>
          </header>

          {/* Status card */}
          <div className={`rounded-2xl border p-5 ${ent.hasPro ? "border-brand-200 bg-brand-50/30" : "bg-muted/20"}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  License
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold">
                    {ent.hasMulti ? "Multi-Cert" : ent.hasPro ? "Pro" : "Free"}
                  </span>
                  {ent.hasPro && (
                    <span className="chip bg-emerald-50 border-emerald-100 text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </span>
                  )}
                </div>
                {license?.email && (
                  <div className="mt-1 text-sm text-muted-foreground">{license.email}</div>
                )}
                {license?.verifiedAt && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Verified {new Date(license.verifiedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
              {!ent.hasPro && (
                <Link href="/upgrade">
                  <div className="chip bg-brand-50 border-brand-100 text-brand-700 cursor-pointer hover:bg-brand-100 transition-colors">
                    <Sparkles className="h-3 w-3" /> Upgrade
                  </div>
                </Link>
              )}
            </div>

            {ent.hasMulti && profile && (
              <div className="mt-4 pt-4 border-t border-brand-100 text-xs text-muted-foreground">
                Studying: <span className="font-medium text-foreground">{profile.examId}</span>
                {" · "}
                <Link href="/settings" className="underline hover:text-foreground">change</Link>
              </div>
            )}
          </div>

          {/* Sub-sections grid */}
          <section className="grid gap-3 sm:grid-cols-2">
            <LinkCard
              href="/account/usage"
              icon={BarChart3}
              title="Usage"
              body="Your activity stats, refund eligibility, data export."
              accent="brand"
            />
            <LinkCard
              href="/account/devices"
              icon={Shield}
              title="Devices"
              body="Manage active devices (max 2 per license)."
              accent="cyan"
            />
            <LinkCard
              href="/settings"
              icon={Settings}
              title="Settings"
              body="Exam pick, display preferences, notifications."
              accent="gray"
            />
            <LinkCard
              href="/redeem"
              icon={RotateCcw}
              title="Redeem"
              body="Enter a license key or restore a purchase."
              accent="gray"
            />
          </section>

          {/* Support + policy links */}
          <section className="border-t pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Policies & support
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <PolicyLink href="/refunds"  icon={FileText} label="Refund policy" />
              <PolicyLink href="/privacy"  icon={FileText} label="Privacy policy" />
              <PolicyLink href="/terms"    icon={FileText} label="Terms of service" />
              <PolicyLink href="/support"  icon={LifeBuoy} label="Get support" />
            </div>
          </section>
        </div>
      </AppShell>
    </>
  );
}

function LinkCard({ href, icon: Icon, title, body, accent = "gray" }: {
  href: string;
  icon: React.ElementType;
  title: string;
  body: string;
  accent?: "brand" | "cyan" | "gray";
}) {
  const accents: Record<string, string> = {
    brand: "hover:border-brand-200 hover:bg-brand-50/30",
    cyan:  "hover:border-cyan-200 hover:bg-cyan-50/30",
    gray:  "hover:border-gray-300 hover:bg-muted/30",
  };
  return (
    <Link
      href={href as never}
      className={`group rounded-xl border bg-card p-4 transition-colors ${accents[accent]}`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-lg bg-muted p-2 group-hover:bg-background transition-colors">
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{title}</h3>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{body}</p>
        </div>
      </div>
    </Link>
  );
}

function PolicyLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link
      href={href as never}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}
