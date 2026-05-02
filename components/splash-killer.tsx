"use client";

import { useEffect } from "react";

/**
 * <SplashKiller /> — hides the native Capacitor splash the moment the React
 * tree mounts, so users get a smooth handoff from launch image → welcome
 * (or any first route) instead of the black "WebView bootstrapping" gap.
 *
 * Pairs with `launchAutoHide: false` in capacitor.config.ts so the splash
 * stays visible until React tells it to fade.
 *
 * Belt-and-suspenders safety net: even if the dynamic import fails (e.g.
 * the @capacitor/splash-screen plugin isn't bundled on web), the page
 * still renders normally — splash hide is a best-effort native concern.
 *
 * Hard 6-second floor: if React mounts but something downstream crashes
 * before the welcome paints, the timeout still hides the splash so the
 * user isn't stuck on the logo forever. Fires .catch silent.
 */
export function SplashKiller() {
  useEffect(() => {
    let cancelled = false;

    // Tiny delay so the welcome's first paint has a chance to land BEFORE
    // we tell the splash to fade — avoids a black flash between the two.
    const t = setTimeout(async () => {
      if (cancelled) return;
      try {
        const { SplashScreen } = await import("@capacitor/splash-screen");
        await SplashScreen.hide({ fadeOutDuration: 300 });
      } catch {
        // No-op — plugin not available (web build) or hide failed.
      }
    }, 80);

    // Hard floor: if mount happens but nothing else hides the splash, kill
    // it after 6s so we never strand the user on the logo.
    const fallback = setTimeout(async () => {
      if (cancelled) return;
      try {
        const { SplashScreen } = await import("@capacitor/splash-screen");
        await SplashScreen.hide({ fadeOutDuration: 200 });
      } catch {
        /* same as above */
      }
    }, 6000);

    return () => {
      cancelled = true;
      clearTimeout(t);
      clearTimeout(fallback);
    };
  }, []);

  return null;
}
