"use client";

import { useEffect } from "react";
import { isNative } from "@/lib/platform";
import {
  initNativeIAP,
  isNativeIAPAvailable,
  restoreNativePurchases,
} from "@/lib/payment/native";
import { useApp } from "@/lib/store";

/**
 * Runs once on app mount for native platforms (iOS / Android).
 *
 *   1. Initialize the native IAP SDK (RevenueCat) if configured
 *   2. Silently attempt to restore purchases — this re-unlocks users
 *      after re-install or device migration without any user action
 *   3. If a purchase is restored, synthesize a local license so the
 *      rest of the app (which already checks `useApp().license`)
 *      treats them as Pro without any refactor
 *
 * Web platform: no-op, returns immediately.
 */
export function NativeBootstrap() {
  const setLicense = useApp((s) => s.setLicense);

  useEffect(() => {
    if (!isNative()) return;

    let cancelled = false;
    (async () => {
      await initNativeIAP();
      if (!isNativeIAPAvailable()) return;

      try {
        const ent = await restoreNativePurchases();
        if (cancelled || !ent?.active) return;

        // Synthesize a local license so the existing entitlement layer
        // (`useEntitlements`) transparently treats this as Pro/Multi.
        // This lets us skip refactoring every component to also check
        // native-entitlement state.
        setLicense({
          key: `native:${ent.productId ?? "unknown"}`,
          tier: ent.unlockedExams.length >= 2 ? "multi" : "pro",
          unlockedExams: ent.unlockedExams,
          verifiedAt: new Date().toISOString(),
        });
      } catch {
        // Silent fail — restore can fail on first launch, not an error
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setLicense]);

  return null;
}
