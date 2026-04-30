import type { ExamId, License } from "./types";
import { EXAMS } from "./data/exams";

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
//
// 2026-04-27 fix (DEC-040 follow-up): Multi-Cert was hardcoded to 3 exams,
// matching the original DEC-031/DEC-032 drift class. Now driven from the
// canonical EXAMS catalog — buying Multi-Cert correctly unlocks all 7
// (and any future cert added to EXAMS).
//
// 2026-04-28: Boss created LS products for the 4 newer per-cert SKUs
// (AI-900, AWS AIP, GCP CDL, Security+). Checkout URLs are wired in
// CHECKOUT_URLS below. Numeric LS product IDs needed here for webhook
// validation routing — placeholder zeros until Boss grabs them from
// each product's URL bar in the LS dashboard. Without the IDs, real
// buyers of these 4 certs will FAIL license validation (the upgrade-wall
// will still show the right buy buttons, but redemption flow won't grant
// entitlement). Tracked in open_loops.
const LS_PRODUCT_MAP: Record<
  string,
  { tier: "pro" | "multi"; exams: ExamId[] }
> = {
  "988342": { tier: "pro", exams: ["az-900"] }, // PassPilot Pro — AZ-900
  "988347": { tier: "pro", exams: ["aws-ccp"] }, // PassPilot Pro — AWS CCP
  "988353": { tier: "pro", exams: ["ms-900"] }, // PassPilot Pro — MS-900
  "988355": {
    tier: "multi",
    exams: EXAMS.map((e) => e.id), // ALL 7 certs (catalog-driven)
  }, // PassPilot Multi-Cert
  // ── BLOCKED: need numeric product IDs from LS dashboard (URL bar) ──
  // "TBD-AI900":  { tier: "pro", exams: ["ai-900"] },   // PassPilot Pro — AI-900
  // "TBD-SECPLUS":{ tier: "pro", exams: ["sec-plus"] }, // PassPilot Pro — Security+
  // "TBD-AWSAIP": { tier: "pro", exams: ["aws-aip"] },  // PassPilot Pro — AWS AIP
  // "TBD-GCPCDL": { tier: "pro", exams: ["gcp-cdl"] },  // PassPilot Pro — GCP CDL
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
        pattern: /^PASSPILOT-PRO-AI900-[A-Z0-9]+$/i,
        tier: "pro",
        exams: ["ai-900"],
      },
      {
        pattern: /^PASSPILOT-PRO-SECPLUS-[A-Z0-9]+$/i,
        tier: "pro",
        exams: ["sec-plus"],
      },
      {
        pattern: /^PASSPILOT-PRO-AWSAIP-[A-Z0-9]+$/i,
        tier: "pro",
        exams: ["aws-aip"],
      },
      {
        pattern: /^PASSPILOT-PRO-GCPCDL-[A-Z0-9]+$/i,
        tier: "pro",
        exams: ["gcp-cdl"],
      },
      {
        pattern: /^PASSPILOT-MULTI-[A-Z0-9]+$/i,
        tier: "multi",
        exams: EXAMS.map((e) => e.id),
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
  if (license.tier === "multi") return `Multi-Cert · all ${EXAMS.length} exams`;
  const examId = license.unlockedExams[0];
  const exam = EXAMS.find((e) => e.id === examId);
  const examName = exam?.name ?? examId ?? "1 exam";
  return `Pro · ${examName}`;
}

/**
 * Demo keys for local testing. These bypass the network.
 *
 * 🛡️  LEGION HARDENING (2026-04-25, follow-up to DEC-017):
 * Gated behind NODE_ENV so production bundles don't leak the literal demo
 * key strings as info disclosure. The exploit was already closed (TEST_KEYS
 * regex array is empty in prod, so even if a user typed a demo key it
 * wouldn't authenticate), but exposing the strings in source-mapped
 * production bundles was a code smell. Now production = empty object.
 */
type CheckoutKey =
  | "proAz900"
  | "proAwsCcp"
  | "proMs900"
  | "proAi900"
  | "proSecPlus"
  | "proAwsAip"
  | "proGcpCdl"
  | "multi";

type DemoKeyMap = Partial<Record<CheckoutKey, string>>;
export const DEMO_KEYS: DemoKeyMap =
  process.env.NODE_ENV !== "production"
    ? {
        proAz900: "PASSPILOT-PRO-AZ900-DEMO",
        proAwsCcp: "PASSPILOT-PRO-AWSCCP-DEMO",
        proMs900: "PASSPILOT-PRO-MS900-DEMO",
        proAi900: "PASSPILOT-PRO-AI900-DEMO",
        proSecPlus: "PASSPILOT-PRO-SECPLUS-DEMO",
        proAwsAip: "PASSPILOT-PRO-AWSAIP-DEMO",
        proGcpCdl: "PASSPILOT-PRO-GCPCDL-DEMO",
        multi: "PASSPILOT-MULTI-DEMO",
      }
    : {};

/**
 * Live Lemon Squeezy checkout URLs.
 * Each product has redirect_url set to /redeem so buyers land on the
 * license entry screen immediately after paying.
 *
 * 2026-04-28: 4 new per-cert SKUs added (AI-900 / Security+ / AWS AIP /
 * GCP CDL) — full 7-cert per-cert catalog now buyable. Multi-Cert remains
 * the better-value upsell for users buying 2+ certs.
 */
export const CHECKOUT_URLS: Record<CheckoutKey, string> = {
  proAz900:
    "https://passpilot.lemonsqueezy.com/checkout/buy/38214c21-6ca7-480c-9aaa-afa8148d5628",
  proAwsCcp:
    "https://passpilot.lemonsqueezy.com/checkout/buy/85be4af1-3b63-493c-91f8-fa0c4161530b",
  proMs900:
    "https://passpilot.lemonsqueezy.com/checkout/buy/3105f792-9e61-4fb9-a791-f16f68095311",
  proAi900:
    "https://passpilot.lemonsqueezy.com/checkout/buy/c9e2e32e-7592-4691-8251-64dec2474487",
  proAwsAip:
    "https://passpilot.lemonsqueezy.com/checkout/buy/1613c8d4-058c-4094-be13-dad74c305423",
  proGcpCdl:
    "https://passpilot.lemonsqueezy.com/checkout/buy/bd7f2a50-033e-462a-879f-957aff6c4982",
  proSecPlus:
    "https://passpilot.lemonsqueezy.com/checkout/buy/8e57a4ee-470e-4ea1-b9e2-45c55140b0e4",
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
