import type { ExamId, License } from "./types";

/**
 * MVP licensing layer.
 *
 * For launch, we use a hardcoded test-key allowlist so Galtrix can hand-deliver
 * license keys to early customers (Stripe Payment Link → email → send key).
 *
 * When ready to automate, swap `verifyLicense` for a Lemon Squeezy license
 * validation API call. The rest of the app doesn't need to change.
 *
 * Lemon Squeezy sample (plug in later):
 *
 *   POST https://api.lemonsqueezy.com/v1/licenses/validate
 *   body: license_key=XXXX
 *   → returns { valid, meta: { product_id, customer_email, ... } }
 */

type TestKey = {
  pattern: RegExp;
  tier: "pro" | "multi";
  exams: ExamId[];
  label: string;
};

const TEST_KEYS: TestKey[] = [
  {
    pattern: /^PASSPILOT-PRO-AZ900-[A-Z0-9]+$/i,
    tier: "pro",
    exams: ["az-900"],
    label: "Pro · AZ-900",
  },
  {
    pattern: /^PASSPILOT-PRO-AWSCCP-[A-Z0-9]+$/i,
    tier: "pro",
    exams: ["aws-ccp"],
    label: "Pro · AWS Cloud Practitioner",
  },
  {
    pattern: /^PASSPILOT-PRO-MS900-[A-Z0-9]+$/i,
    tier: "pro",
    exams: ["ms-900"],
    label: "Pro · MS-900",
  },
  {
    pattern: /^PASSPILOT-MULTI-[A-Z0-9]+$/i,
    tier: "multi",
    exams: ["az-900", "aws-ccp", "ms-900"],
    label: "Multi-Cert · all 3 exams",
  },
];

/**
 * Validate and return a License record, or null if the key is invalid.
 * Async to future-proof for real API calls.
 */
export async function verifyLicense(key: string): Promise<License | null> {
  const normalized = key.trim().toUpperCase();
  if (!normalized) return null;

  for (const t of TEST_KEYS) {
    if (t.pattern.test(normalized)) {
      return {
        key: normalized,
        tier: t.tier,
        unlockedExams: t.exams,
        verifiedAt: new Date().toISOString(),
      };
    }
  }

  return null;
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
 * Sample keys to share with testers / for demos.
 */
export const DEMO_KEYS = {
  proAz900: "PASSPILOT-PRO-AZ900-DEMO",
  proAwsCcp: "PASSPILOT-PRO-AWSCCP-DEMO",
  proMs900: "PASSPILOT-PRO-MS900-DEMO",
  multi: "PASSPILOT-MULTI-DEMO",
};

/**
 * Lemon Squeezy checkout URLs. Populate these after creating products in LS.
 * Each product sets `redirect_url` back to /redeem so customers land on the
 * license entry page with their key pre-filled via query params.
 */
export const CHECKOUT_URLS: Record<
  "proAz900" | "proAwsCcp" | "proMs900" | "multi",
  string
> = {
  proAz900: "https://store.lemonsqueezy.com/buy/TODO_AZ900",
  proAwsCcp: "https://store.lemonsqueezy.com/buy/TODO_AWSCCP",
  proMs900: "https://store.lemonsqueezy.com/buy/TODO_MS900",
  multi: "https://store.lemonsqueezy.com/buy/TODO_MULTI",
};
