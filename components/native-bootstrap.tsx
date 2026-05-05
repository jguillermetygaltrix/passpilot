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

    // Status bar — DYNAMIC theme matching (DEC-058 — was hardcoded Light
    // in DEC-049, which broke the dark-mode user's status bar visibility:
    // light-mode users got dark icons on light bg ✓, but dark-mode users
    // ALSO got dark icons on a dark app body, making the time/battery
    // unreadable.
    //
    // Capacitor status-bar plugin Style semantics (counter-intuitive):
    //   Style.Light = LIGHT content (white icons) — for use on DARK bg
    //   Style.Dark  = DARK content (black icons) — for use on LIGHT bg
    //
    // Strategy: detect the theme that just got applied by no-flash script
    // in app/layout.tsx (adds .dark to html), and re-evaluate when the
    // user toggles theme inside the app (MutationObserver on
    // <html>.classList).
    (async () => {
      try {
        const { StatusBar, Style } = await import("@capacitor/status-bar");

        const applyForTheme = async () => {
          const isDark = document.documentElement.classList.contains("dark");
          await StatusBar.setStyle({
            style: isDark ? Style.Light : Style.Dark,
          });
        };

        await applyForTheme();

        // Re-apply if user toggles theme via Settings → Appearance.
        const observer = new MutationObserver(() => {
          void applyForTheme();
        });
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class"],
        });

        // Note: observer leaks on unmount — single-mount component, OK.
      } catch {
        // Plugin unavailable on web or pre-pod-install — silent fail.
      }
    })();

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
