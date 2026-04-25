/**
 * Native in-app purchase bridge â€” Apple StoreKit / Google Play Billing.
 *
 * Feature-gated: if RevenueCat (or any other IAP SDK) is not wired up,
 * `isNativeIAPAvailable()` returns false and the UI shows a
 * "Purchase options coming soon â€” use restore if you already own it"
 * placeholder. This keeps the app App Store-compliant even before IAP
 * is fully set up.
 *
 * WHY RevenueCat:
 *   - Handles receipt validation server-side (hard to get right)
 *   - Cross-platform (iOS + Android) via one SDK
 *   - Handles subscription state (active / expired / grace period)
 *   - Handles restore purchases
 *   - Free up to $2.5k MTR, then 1%
 *
 * Alternative: `@capacitor-community/in-app-purchases` (direct StoreKit).
 *   Cheaper but you own receipt validation + subscription-state tracking.
 *
 * Products to create in App Store Connect + Play Console (use these IDs):
 *   - passpilot.weekly      ($4.99, non-renewing subscription)
 *   - passpilot.monthly     ($9.99, auto-renewing subscription, 1 month)
 *   - passpilot.annual      ($49.00, auto-renewing subscription, 1 year)
 *   - passpilot.lifetime    ($99.00, non-consumable one-time purchase)
 */

import type { ExamId } from "../types";

export type NativeProductId =
  | "passpilot.weekly"
  | "passpilot.monthly"
  | "passpilot.annual"
  | "passpilot.lifetime";

export interface NativeProduct {
  id: NativeProductId;
  title: string;
  description: string;
  priceDisplay: string; // "$4.99" â€” filled from StoreKit at runtime
  period?: "weekly" | "monthly" | "annual" | "lifetime";
  features: string[];
}

export interface NativeEntitlement {
  active: boolean;
  productId: NativeProductId | null;
  expiresAt: string | null; // ISO string; null = lifetime
  unlockedExams: ExamId[];
  willRenew: boolean;
}

// Default product catalog (descriptions only â€” prices come from the store)
export const NATIVE_CATALOG: NativeProduct[] = [
  {
    id: "passpilot.weekly",
    title: "Weekly Pass",
    description: "Unlimited drills for 7 days",
    priceDisplay: "$4.99",
    period: "weekly",
    features: [
      "Unlimited practice drills",
      "All lessons for your exam",
      "Rescue mode for the final stretch",
      "Perfect if your exam is next week",
    ],
  },
  {
    id: "passpilot.monthly",
    title: "Monthly",
    description: "Unlimited access, billed monthly",
    priceDisplay: "$9.99",
    period: "monthly",
    features: [
      "Unlimited practice drills",
      "All lessons for your exam",
      "Cancel anytime",
      "Streak freezes included",
    ],
  },
  {
    id: "passpilot.annual",
    title: "Annual",
    description: "All 3 exams, best value",
    priceDisplay: "$49.00",
    period: "annual",
    features: [
      "All 3 certifications unlocked",
      "Switch exams any time",
      "Save 59% vs monthly",
      "First access to new certifications",
    ],
  },
  {
    id: "passpilot.lifetime",
    title: "Lifetime",
    description: "All exams, forever, one payment",
    priceDisplay: "$99.00",
    period: "lifetime",
    features: [
      "All current + future certifications",
      "No subscription, ever",
      "Priority support",
      "Founder tier â€” supports indie dev",
    ],
  },
];

function getRevenueCatKey(): string | null {
  if (typeof window === "undefined") return null;
  const iosKey = process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY;
  const androidKey = process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_KEY;
  return iosKey || androidKey || null;
}

export function isNativeIAPAvailable(): boolean {
  // Check 1: we're on a native platform (Capacitor)
  if (typeof window === "undefined") return false;
  try {
    const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
    if (!cap?.isNativePlatform?.()) return false;
  } catch {
    return false;
  }
  // Check 2: at least one RevenueCat API key is configured
  return !!getRevenueCatKey();
}

/**
 * Initialize RevenueCat on app launch (iOS / Android only).
 * Safe to call on every app launch â€” idempotent.
 *
 * Requires `@revenuecat/purchases-capacitor` installed (optional peer dep).
 * If not installed, silently returns.
 */
export async function initNativeIAP(): Promise<void> {
  if (!isNativeIAPAvailable()) return;
  try {
    // @revenuecat/purchases-capacitor is now a direct dep (installed 2026-04-25);
    // dynamic import preserved so web bundles tree-shake the native code paths.
    const mod = await import("@revenuecat/purchases-capacitor");
    const Purchases = mod.Purchases ?? mod.default;
    const iosKey = process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY;
    const androidKey = process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_KEY;

    const apiKey =
      typeof window !== "undefined" &&
      (window as unknown as { Capacitor?: { getPlatform?: () => string } }).Capacitor?.getPlatform?.() === "ios"
        ? iosKey
        : androidKey;

    if (!apiKey) return;
    await Purchases.configure({ apiKey });
  } catch {
    // SDK not installed or config error â€” app still works, just without IAP
  }
}

/**
 * Fetch current offerings from RevenueCat (with live prices from the stores).
 * Returns the static catalog if unavailable.
 */
export async function getNativeProducts(): Promise<NativeProduct[]> {
  if (!isNativeIAPAvailable()) return NATIVE_CATALOG;
  try {
    const mod = await import("@revenuecat/purchases-capacitor");
    const Purchases = mod.Purchases ?? mod.default;
    const offerings = await Purchases.getOfferings();
    const current = offerings?.current;
    if (!current?.availablePackages?.length) return NATIVE_CATALOG;

    // Map RevenueCat packages to our catalog, filling in live prices
    return NATIVE_CATALOG.map((fallback) => {
      const pkg = current.availablePackages.find(
        (p: { product?: { identifier?: string } }) =>
          p.product?.identifier === fallback.id
      );
      if (!pkg?.product) return fallback;
      return {
        ...fallback,
        priceDisplay: pkg.product.priceString ?? fallback.priceDisplay,
      };
    });
  } catch {
    return NATIVE_CATALOG;
  }
}

/**
 * Trigger a native purchase flow (StoreKit sheet on iOS, Play on Android).
 * Returns the updated entitlement on success.
 */
export async function purchaseNative(
  productId: NativeProductId
): Promise<NativeEntitlement | null> {
  if (!isNativeIAPAvailable()) return null;
  try {
    const mod = await import("@revenuecat/purchases-capacitor");
    const Purchases = mod.Purchases ?? mod.default;
    const offerings = await Purchases.getOfferings();
    const pkg = offerings?.current?.availablePackages?.find(
      (p: { product?: { identifier?: string } }) =>
        p.product?.identifier === productId
    );
    if (!pkg) return null;

    const result = await Purchases.purchasePackage({ aPackage: pkg });
    return parseCustomerInfo(result?.customerInfo);
  } catch (err) {
    // User cancelled or error â€” return null, caller shows toast
    return null;
  }
}

/**
 * Restore purchases on a new device. Also useful on app launch.
 * Safe to call anytime â€” idempotent.
 */
export async function restoreNativePurchases(): Promise<NativeEntitlement | null> {
  if (!isNativeIAPAvailable()) return null;
  try {
    const mod = await import("@revenuecat/purchases-capacitor");
    const Purchases = mod.Purchases ?? mod.default;
    const result = await Purchases.restorePurchases();
    return parseCustomerInfo(result?.customerInfo);
  } catch {
    return null;
  }
}

/**
 * Map RevenueCat customerInfo â†’ our NativeEntitlement shape.
 *
 * Expects the RevenueCat entitlement identifier to be "pro" (or "multi" for
 * the lifetime/annual tier â€” configure this in the RC dashboard).
 */
function parseCustomerInfo(info: unknown): NativeEntitlement | null {
  if (!info) return null;
  try {
    const i = info as {
      entitlements?: {
        active?: Record<
          string,
          {
            productIdentifier?: string;
            expirationDate?: string | null;
            willRenew?: boolean;
          }
        >;
      };
    };
    const active = i.entitlements?.active ?? {};
    const entitlementKeys = Object.keys(active);
    if (entitlementKeys.length === 0) {
      return {
        active: false,
        productId: null,
        expiresAt: null,
        unlockedExams: [],
        willRenew: false,
      };
    }

    // Prefer "multi" entitlement over "pro"
    const key = entitlementKeys.includes("multi") ? "multi" : entitlementKeys[0];
    const ent = active[key];
    const productId = (ent.productIdentifier ?? null) as NativeProductId | null;

    // Everything unlocks all 3 exams in our new pricing model
    const unlockedExams: ExamId[] = ["az-900", "aws-ccp", "ms-900"];

    return {
      active: true,
      productId,
      expiresAt: ent.expirationDate ?? null,
      unlockedExams,
      willRenew: !!ent.willRenew,
    };
  } catch {
    return null;
  }
}
