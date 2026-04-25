import type { ExamId, License } from "./types";

/**
 * Licensing layer — Lemon Squeezy (live) + demo keys (testing).
 *
 * Flow:
 *   1. User buys via LS checkout URL → LS emails them a license key
 *      and redirects them to /redeem with the key in the URL.
 *   2. Our app POSTs the key to LS's public validation endpoint.
 *   3. Response carries the product_id, which we map to tier + exams.
 *
 * Demo keys are still accepted for offline testing and screenshots.
 */

// ── Lemon Squeezy products (store: passpilot.lemonsqueezy.com) ──────
const LS_PRODUCT_MAP: Record<
  string,
  { tier: "pro" | "multi"; exams: ExamId[] }
> = {
  "988342": { tier: "pro", exams: ["az-900"] }, // PassPilot Pro — AZ-900
  "988347": { tier: "pro", exams: ["aws-ccp"] }, // PassPilot Pro — AWS Cloud Practitioner
  "988353": { tier: "pro", exams: ["ms-900"] }, // PassPilot Pro — MS-900
  "988355": {
    tier: "multi",
    exams: ["az-900", "aws-ccp", "ms-900"],
  }, // PassPilot Multi-Cert
};

// ── Demo keys (no network call) ─────────────────────────────────────
// 🛡️  LEGION HARDENING (2026-04-24, CRITICAL):
// Demo keys are now gated to non-production builds only. Previously,
// shipping these in production source meant anyone reading the public
// repo got free Pro tier — a buy-pass exploit with zero attacker cost.
// In Next.js, `process.env.NODE_ENV` is replaced at build time, so
// production bundles will carry an empty array regardless of source.
type TestKey = {
  pattern: RegExp;
  tier: "pro" | "multi";
  exams: ExamId[];
};

const TEST_KEYS: TestKey[] = process.env.NODE_ENV !== "production"
  ? [
      {
        pattern: /^PASSPILOT-PRO-AZ900-[A-Z0-9]+$/i,
        tier: "pro",
        exams: ["az-900"],
      },
      {
        pattern: /^PASSPILOT-PRO-AWSCCP-[A-Z0-9]+$/i,
        tier: "pro",
        exams: ["aws-ccp"],
      },
      {
        pattern: /^PASSPILOT-PRO-MS900-[A-Z0-9]+$/i,
        tier: "pro",
        exams: ["ms-900"],
      },
      {
        pattern: /^PASSPILOT-MULTI-[A-Z0-9]+$/i,
        tier: "multi",
        exams: ["az-900", "aws-ccp", "ms-900"],
      },
    ]
  : [];

/**
 * Validate a license key. Tries demo patterns first (instant), then falls
 * back to Lemon Squeezy's public validation endpoint.
 *
 * LS endpoint is CORS-enabled for client-side validation.
 */
export async function verifyLicense(key: string): Promise<License | null> {
  const trimmed = key.trim();
  if (!trimmed) return null;

  // 1. Demo keys for testing
  const upper = trimmed.toUpperCase();
  for (const t of TEST_KEYS) {
    if (t.pattern.test(upper)) {
      return {
        key: upper,
        tier: t.tier,
        unlockedExams: t.exams,
        verifiedAt: new Date().toISOString(),
      };
    }
  }

  // 2. Real Lemon Squeezy key
  try {
    const res = await fetch(
      "https://api.lemonsqueezy.com/v1/licenses/validate",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `license_key=${encodeURIComponent(trimmed)}`,
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.valid) return null;

    const productId = String(data?.meta?.product_id ?? "");
    const mapping = LS_PRODUCT_MAP[productId];
    if (!mapping) return null;

    return {
      key: trimmed,
      tier: mapping.tier,
      unlockedExams: mapping.exams,
      verifiedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function describeLicense(license: License): string {
  if (license.tier === "multi") return "Multi-Cert · all 3 exams";
  const examName =
    license.unlockedExams[0] === "az-900"
      ? "AZ-900"
      : license.unlockedExams[0] === "aws-ccp"
        ? "AWS Cloud Practitioner"
        : "MS-900";
  return `Pro · ${examName}`;
}

/**
 * Demo keys for local testing. These bypass the network.
 */
export const DEMO_KEYS = {
  proAz900: "PASSPILOT-PRO-AZ900-DEMO",
  proAwsCcp: "PASSPILOT-PRO-AWSCCP-DEMO",
  proMs900: "PASSPILOT-PRO-MS900-DEMO",
  multi: "PASSPILOT-MULTI-DEMO",
};

/**
 * Live Lemon Squeezy checkout URLs.
 * Each product has redirect_url set to /redeem so buyers land on the
 * license entry screen immediately after paying.
 */
export const CHECKOUT_URLS: Record<
  "proAz900" | "proAwsCcp" | "proMs900" | "multi",
  string
> = {
  proAz900:
    "https://passpilot.lemonsqueezy.com/checkout/buy/38214c21-6ca7-480c-9aaa-afa8148d5628",
  proAwsCcp:
    "https://passpilot.lemonsqueezy.com/checkout/buy/85be4af1-3b63-493c-91f8-fa0c4161530b",
  proMs900:
    "https://passpilot.lemonsqueezy.com/checkout/buy/3105f792-9e61-4fb9-a791-f16f68095311",
  multi:
    "https://passpilot.lemonsqueezy.com/checkout/buy/a3d33fab-ad28-47f5-83fe-8039a1f2e6d1",
};

/**
 * Human-readable prices for UI display. Match Lemon Squeezy listing.
 */
export const PRICES = {
  pro: "$19.99",
  multi: "$39.00",
} as const;
