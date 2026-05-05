import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration for PassPilot iOS + Android builds.
 *
 * Setup (one-time, on a Mac for iOS):
 *   npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
 *   npm run build
 *   npx cap add android
 *   npx cap add ios      # macOS only
 *   npx cap sync
 *
 * Then:
 *   npx cap open ios     # opens Xcode
 *   npx cap open android # opens Android Studio
 *
 * After any web change:
 *   npm run build && npx cap sync
 */
const config: CapacitorConfig = {
  appId: "com.galtrix.passpilot",
  appName: "PassPilot",
  // Next.js static export writes to `out/`
  webDir: "out",
  // (bundledWebRuntime removed — deprecated in Capacitor 5+, default behavior is now correct)

  // WebView root background — the iOS UIView layer behind html/body. ANY
  // pixel not covered by web content (notch, home-indicator, safe-area
  // zones) falls back to this color.
  //
  // DEC-059 (2026-05-05) — was "#FFFFFF" which leaked through as a white
  // strip in the iPhone status-bar zone in BOTH light and dark themes
  // (Boss reported on v1.0(2) → v1.0(3)). Setting html { @apply
  // bg-background } in DEC-058 didn't fix it because that only paints the
  // html content box, NOT the underlying WebView UIView.
  //
  // Switched to "#0B0D13" matches:
  //   - the SplashScreen.backgroundColor below — no transition flash
  //     between launch image / splash / first paint
  //   - the dashboard's dark-mode background (--background = 230 25% 8%
  //     → ~#0B0D13)
  //   - the Info.plist UILaunchStoryboardName / UIStatusBarStyle dark
  //     variants
  //
  // Light-mode users see a brief dark frame on cold launch before React
  // hydrates and the page paints the light theme — same trade-off Apple
  // makes with their own apps that ship dark splash screens (Music,
  // Podcasts, etc.).
  backgroundColor: "#0B0D13",

  ios: {
    contentInset: "automatic",
    // Allow the web view to run local content; payment is via StoreKit, not web
    limitsNavigationsToAppBoundDomains: false,
    // Scheme for deep-links (future: referral links, license redeem)
    scheme: "PassPilot",
  },

  android: {
    // Keystore + signing set up in Android Studio
    allowMixedContent: false,
  },

  plugins: {
    SplashScreen: {
      // Instagram-style: brand logo on dark navy bg, hides the moment React
      // mounts (via <SplashKiller /> in app/layout.tsx). Native iOS launch
      // screen + this Capacitor splash use the SAME image (generated via
      // `npm run brand:assets`), so launch-image → splash → welcome is one
      // continuous fade with no black gap from WebView bootstrap.
      //
      // launchAutoHide: false means JS controls the hide timing — paired
      // with a 6s hard floor inside <SplashKiller /> so we never strand
      // the user on the logo if React fails to mount.
      launchShowDuration: 3000, // ignored when autoHide is false; safety
      launchAutoHide: false,
      launchFadeOutDuration: 300,
      backgroundColor: "#0B0D13",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    // RevenueCat plugin auto-picks up config from @revenuecat/purchases-capacitor
  },
};

export default config;
