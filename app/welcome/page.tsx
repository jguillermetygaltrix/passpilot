"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/app-nav";
import { useApp } from "@/lib/store";
import { ArrowRight, Target, Zap, ShieldCheck } from "lucide-react";

/**
 * /welcome — first-launch welcome screen for native (iOS/Android) PassPilot.
 *
 * Shipped 2026-05-02 (DEC-047 follow-up). Users on native skip the marketing
 * landing page (`/`) and used to land directly on the cert picker (Step 1 of 6
 * in /onboarding) which felt cold. This screen sits between the splash and
 * the onboarding flow as a brand-introduction + value-prop hook.
 *
 * Flow:
 *   native splash → / (which redirects natives) → /welcome → /onboarding
 *
 * Returning users (anyone with profile.examId set) skip /welcome and go
 * straight to /dashboard — that branch is handled in app/page.tsx.
 */
export default function WelcomePage() {
  const router = useRouter();
  const profile = useApp((s) => s.profile);

  // If a profile already exists (returning user), skip welcome and head
  // straight to the dashboard. Belt-and-suspenders — the redirect in
  // app/page.tsx already does this, but a deep-link straight to /welcome
  // would otherwise bypass it.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (profile?.examId) router.replace("/dashboard");
  }, [router, profile?.examId]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute inset-0 -z-10 mesh-bg" />

      <main className="container flex-1 flex flex-col items-center justify-center py-6 max-w-md w-full text-center">
        {/* Brand block */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <Logo className="h-14 w-14 rounded-2xl" />
          <h1 className="text-3xl font-bold tracking-tight">PassPilot</h1>
          <p className="text-sm text-muted-foreground">
            Pass your IT cert — fast.
          </p>
        </div>

        {/* Hook */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold leading-tight mb-2">
            The fastest path from{" "}
            <span className="text-brand-600">
              &ldquo;exam in 30 days&rdquo;
            </span>{" "}
            to{" "}
            <span className="text-brand-600">&ldquo;passed.&rdquo;</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Pick your cert, take a 5-minute diagnostic, then daily drills until
            exam day.
          </p>
        </div>

        {/* Value bullets */}
        <ul className="w-full text-left space-y-2.5 mb-7">
          <li className="flex items-start gap-3">
            <div className="mt-0.5 h-9 w-9 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center shrink-0">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium leading-tight">
                7 certs, ready to study
              </div>
              <div className="text-xs text-muted-foreground">
                Azure, AWS, Google Cloud, Microsoft 365, Security+
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-0.5 h-9 w-9 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium leading-tight">
                10-minute daily drills
              </div>
              <div className="text-xs text-muted-foreground">
                Spaced repetition keeps weak spots from coming back
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-0.5 h-9 w-9 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium leading-tight">
                Works offline, no account
              </div>
              <div className="text-xs text-muted-foreground">
                Your progress lives on this device, encrypted
              </div>
            </div>
          </li>
        </ul>

        {/* CTA */}
        <div className="w-full flex flex-col items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push("/onboarding")}
            className="w-full max-w-xs"
          >
            Let&apos;s go
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Link
            href="/redeem"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Have a license key?
          </Link>
        </div>

        {/* Footer microcopy */}
        <p className="mt-5 text-xs text-muted-foreground">
          7 certs live · scrypt-encrypted progress · works offline
        </p>
      </main>
    </div>
  );
}
