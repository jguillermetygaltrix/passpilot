/**
 * Platform detection — works with or without Capacitor installed.
 *
 * SSR-safe: returns 'web' during server render, actual platform on client.
 */

export type Platform = "web" | "ios" | "android";

export function getPlatform(): Platform {
  if (typeof window === "undefined") return "web";

  // Runtime Capacitor detection (works whether or not the package is installed)
  try {
    const cap = (
      window as unknown as {
        Capacitor?: {
          isNativePlatform?: () => boolean;
          getPlatform?: () => string;
        };
      }
    ).Capacitor;
    if (cap?.isNativePlatform?.()) {
      const p = cap.getPlatform?.();
      if (p === "ios" || p === "android") return p;
    }
  } catch {
    /* ignore */
  }
  return "web";
}

export function isNative(): boolean {
  const p = getPlatform();
  return p === "ios" || p === "android";
}

export function isIOS(): boolean {
  return getPlatform() === "ios";
}

export function isAndroid(): boolean {
  return getPlatform() === "android";
}

export function isWeb(): boolean {
  return getPlatform() === "web";
}

/**
 * Apple-compliance rules baked in:
 *   - On iOS, NEVER show external-payment CTAs or price mentions
 *     tied to external checkout
 *   - Use native IAP only
 */
export function allowExternalCheckout(): boolean {
  // Anti-steering guard: iOS must not link to external payment methods
  if (isIOS()) return false;
  return true;
}
