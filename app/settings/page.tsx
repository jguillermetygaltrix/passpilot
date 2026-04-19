"use client";

import { useRouter } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { HydrationGate } from "@/components/hydration-gate";
import { AppShell } from "@/components/container";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { useEntitlements } from "@/lib/entitlements";
import { UpgradeWall } from "@/components/upgrade-wall";
import { describeLicense } from "@/lib/licensing";
import { EXAMS } from "@/lib/data/exams";
import type { ExamId } from "@/lib/types";
import { Logo } from "@/components/app-nav";
import Link from "next/link";
import {
  Calendar,
  Clock,
  GraduationCap,
  Heart,
  KeyRound,
  Lock,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <HydrationGate>
      <Inner />
    </HydrationGate>
  );
}

function Inner() {
  const router = useRouter();
  const { profile, license, updateProfile, resetAll, setLicense } = useApp();
  const ent = useEntitlements();
  const [wallOpen, setWallOpen] = useState(false);
  if (!profile) return null;

  return (
    <>
      <AppNav />
      <AppShell className="max-w-xl">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Settings
          </div>
          <h1 className="heading-2 mt-1">Your plan</h1>
        </div>

        <div className="card-surface p-6 mb-4">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <GraduationCap className="h-4 w-4 text-brand-600" />
            Active certification
          </div>
          <div className="space-y-2">
            {EXAMS.map((e) => {
              const isActive = e.id === profile.examId;
              const isLocked = !isActive && !ent.canSwitchExams;
              return (
                <button
                  key={e.id}
                  onClick={() => {
                    if (isLocked) {
                      setWallOpen(true);
                      return;
                    }
                    updateProfile({ examId: e.id as ExamId });
                  }}
                  className={`w-full text-left rounded-xl border p-3.5 transition-all flex items-center gap-3 ${
                    isActive
                      ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                      : isLocked
                        ? "border-border bg-slate-50/60 hover:bg-slate-50 opacity-80"
                        : "border-border bg-white hover:border-brand-200"
                  }`}
                >
                  <div
                    className="h-9 w-9 rounded-lg text-white flex items-center justify-center font-semibold text-[11px] shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${e.accentFrom}, ${e.accentTo})`,
                    }}
                  >
                    {e.id === "aws-ccp"
                      ? "AWS"
                      : e.id === "ms-900"
                        ? "MS"
                        : "AZ"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{e.fullTitle}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.vendor} · {e.totalDomains} domains
                    </div>
                  </div>
                  {isActive && (
                    <span className="chip bg-brand-600 text-white border-transparent shrink-0">
                      Active
                    </span>
                  )}
                  {isLocked && (
                    <span className="chip bg-rose-50 border-rose-200 text-rose-700 shrink-0">
                      <Lock className="h-3 w-3" />
                      Multi-Cert
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {ent.canSwitchExams
              ? "Switching certifications keeps your data — progress tracks per exam separately."
              : "Free and Pro tiers are locked to one exam. Multi-Cert unlocks all three."}
          </p>
        </div>

        <UpgradeWall
          open={wallOpen}
          onClose={() => setWallOpen(false)}
          reason="Multi-Cert unlocks all exams"
          headline="Switch between 3 certifications"
          sub="Multi-Cert unlocks AZ-900, AWS Cloud Practitioner, and MS-900 with one purchase. Track progress across all three."
        />

        <div className="card-surface p-6 mb-4">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <KeyRound className="h-4 w-4 text-brand-600" />
            Subscription
          </div>
          {license ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-semibold">
                  Active · {describeLicense(license)}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                  {license.key}
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm("Remove your license from this device?")) {
                    setLicense(null);
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-4">
              <div className="flex-1">
                <div className="text-sm font-semibold">Free plan</div>
                <div className="text-xs text-muted-foreground">
                  3 drills/day · first lesson per chapter
                </div>
              </div>
              <Link href="/redeem">
                <Button variant="outline" size="sm">
                  I have a key
                </Button>
              </Link>
              <Link href="/upgrade">
                <Button variant="primary" size="sm">
                  Upgrade
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="card-surface p-6 mb-4">
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-medium mb-2">
              <Calendar className="h-4 w-4 text-brand-600" />
              Exam date
            </span>
            <input
              type="date"
              value={profile.examDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => updateProfile({ examDate: e.target.value })}
              className="w-full h-11 rounded-xl border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 bg-white"
            />
          </label>
        </div>

        <div className="card-surface p-6 mb-4">
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-medium mb-2">
              <Clock className="h-4 w-4 text-brand-600" />
              Minutes per day
              <span className="ml-auto text-sm font-semibold tabular-nums">
                {Math.round(profile.hoursPerDay * 60)}m
              </span>
            </span>
            <input
              type="range"
              min="0.25"
              max="4"
              step="0.25"
              value={profile.hoursPerDay}
              onChange={(e) =>
                updateProfile({ hoursPerDay: parseFloat(e.target.value) })
              }
              className="w-full accent-brand-600"
            />
          </label>
        </div>

        <div className="card-surface p-6 mb-4">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <Trophy className="h-4 w-4 text-brand-600" />
            Target outcome
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "pass", label: "Just pass" },
              { v: "pass-comfortably", label: "Comfortable" },
              { v: "top-10", label: "Top tier" },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() =>
                  updateProfile({ targetOutcome: o.v as any })
                }
                className={`rounded-full h-10 text-sm font-medium border transition-colors ${
                  profile.targetOutcome === o.v
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-border bg-white text-muted-foreground hover:border-brand-200"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card-surface p-6 border-rose-200 bg-rose-50/30 mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-rose-700 mb-1">
            <RotateCcw className="h-4 w-4" />
            Start fresh
          </div>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Wipe all local data — profile, attempts, and progress. Useful if you
            want to re-run the diagnostic from scratch.
          </p>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              if (
                confirm(
                  "Reset everything? Your profile, quiz history, and plan progress will be erased."
                )
              ) {
                resetAll();
                router.push("/");
              }
            }}
          >
            Reset all data
          </Button>
        </div>

        <div className="relative overflow-hidden rounded-[var(--radius)] p-[1.5px] bg-gradient-to-br from-brand-500/40 via-violet2-500/40 to-cyan-500/40">
          <div className="rounded-[calc(var(--radius)-1.5px)] bg-white p-6 relative">
            <div className="flex items-start gap-4">
              <Logo className="h-10 w-10 rounded-2xl" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[15px]">PassPilot</span>
                  <span className="chip bg-brand-50 border-brand-100 text-brand-700 text-[10px] px-1.5 py-0.5">
                    v1.0
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The pass-readiness app for certification prep.
                </p>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Crafted with</span>
                    <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                    <span className="text-muted-foreground">by</span>
                    <a
                      href="#"
                      className="font-semibold bg-gradient-to-r from-brand-600 to-violet2-600 bg-clip-text text-transparent"
                    >
                      Galtrix
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-brand-600" />
                    <span className="tabular-nums">© 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </>
  );
}
