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
  bundledWebRuntime: false,

  // Dark splash to match the app's aesthetic
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
      launchShowDuration: 600,
      backgroundColor: "#0B0D13",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    // RevenueCat plugin auto-picks up config from @revenuecat/purchases-capacitor
  },
};

export default config;
