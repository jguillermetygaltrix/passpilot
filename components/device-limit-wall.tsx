"use client";

import Link from "next/link";
import { ShieldAlert, Laptop, ArrowRight } from "lucide-react";
import { AppShell } from "./container";
import { AppNav } from "./app-nav";
import { Button } from "./ui/button";
import { MAX_DEVICES } from "@/lib/device-binding";

/**
 * DeviceLimitWall — shown when a user tries to use PassPilot Pro on a
 * 3rd device after already using it on MAX_DEVICES. They can either:
 *   1. Revoke an older device via /account/devices
 *   2. Contact support
 */
export function DeviceLimitWall() {
  return (
    <>
      <AppNav />
      <AppShell className="max-w-xl">
        <div className="py-12">
          <div className="rounded-2xl border bg-card p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Device limit reached
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Your PassPilot Pro license is already active on {MAX_DEVICES} devices.
              To use it here, revoke one of your other devices first.
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-lg bg-muted/30 p-3 text-left text-sm">
              <Laptop className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-muted-foreground">
                One license = up to <strong>{MAX_DEVICES}</strong> devices. A 24-hour cooldown applies between device removals (anti-abuse).
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/account/devices">
                <Button variant="primary" size="lg" className="gap-2 w-full sm:w-auto">
                  Manage devices
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/support">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Contact support
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              This limit helps keep PassPilot affordable. Thanks for respecting it.
            </p>
          </div>
        </div>
      </AppShell>
    </>
  );
}
