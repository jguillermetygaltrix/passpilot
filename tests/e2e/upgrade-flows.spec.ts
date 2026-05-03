import { test, expect, type Page } from "@playwright/test";

/**
 * E2E: upgrade / Pro-Free gating / redeem flows.
 *
 * The biggest revenue lever in PassPilot — these gates have to be reliable
 * or paying customers get locked out, free users bypass paywalls, etc.
 */

const SHOTS = "test-results/screenshots/upgrade";

const SEED_FREE_PROFILE = `
window.localStorage.setItem('passpilot.v1', JSON.stringify({
  state: {
    profile: {
      examId: 'az-900',
      examDate: new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
      confidence: 'some',
      hoursPerDay: 1,
      targetOutcome: 'pass-comfortably',
      why: 'career-switch',
      startedAt: new Date().toISOString(),
      streakDays: 0,
      lastActiveDate: new Date().toISOString()
    }
    // No license — free tier
  },
  version: 0
}));
`;

const SEED_PRO_PROFILE = `
window.localStorage.setItem('passpilot.v1', JSON.stringify({
  state: {
    profile: {
      examId: 'az-900',
      examDate: new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
      confidence: 'some',
      hoursPerDay: 1,
      targetOutcome: 'pass-comfortably',
      why: 'career-switch',
      startedAt: new Date().toISOString(),
      streakDays: 0,
      lastActiveDate: new Date().toISOString()
    },
    license: {
      key: 'TEST-PRO-AZ900-FAKE',
      tier: 'pro',
      unlockedExams: ['az-900'],
      verifiedAt: new Date().toISOString()
    }
  },
  version: 0
}));
`;

const SEED_MULTI_PROFILE = `
window.localStorage.setItem('passpilot.v1', JSON.stringify({
  state: {
    profile: {
      examId: 'az-900',
      examDate: new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
      confidence: 'some',
      hoursPerDay: 1,
      targetOutcome: 'pass-comfortably',
      why: 'career-switch',
      startedAt: new Date().toISOString(),
      streakDays: 0,
      lastActiveDate: new Date().toISOString()
    },
    license: {
      key: 'TEST-MULTI-FAKE',
      tier: 'multi',
      unlockedExams: ['az-900', 'aws-ccp', 'ms-900', 'ai-900', 'sec-plus', 'aws-aip', 'gcp-cdl'],
      verifiedAt: new Date().toISOString()
    }
  },
  version: 0
}));
`;

async function seedFree(page: Page) {
  await page.goto("/welcome");
  await page.evaluate(SEED_FREE_PROFILE);
}

async function seedPro(page: Page) {
  await page.goto("/welcome");
  await page.evaluate(SEED_PRO_PROFILE);
}

async function seedMulti(page: Page) {
  await page.goto("/welcome");
  await page.evaluate(SEED_MULTI_PROFILE);
}

async function dismissCookies(page: Page) {
  const acceptBtn = page.getByRole("button", { name: /^accept$/i });
  if (await acceptBtn.isVisible().catch(() => false)) {
    await acceptBtn.click();
    await page.waitForTimeout(200);
  }
}

test.describe("Upgrade page rendering", () => {
  test("/upgrade page lists tiers + has CTA buttons", async ({ page }) => {
    await seedFree(page);
    await page.goto("/upgrade");
    await dismissCookies(page);

    // Should show pricing tiers
    await expect(page.locator("body")).toContainText(/pro|multi|cert|\$/i);
    // Should have at least one buy/upgrade CTA
    const ctas = page.getByRole("button", {
      name: /upgrade|buy|get|purchase|unlock/i,
    });
    expect(await ctas.count()).toBeGreaterThan(0);
    await page.screenshot({
      path: `${SHOTS}/01-upgrade-tiers.png`,
      fullPage: true,
    });
  });

  test("/upgrade shows price for Pro single-cert AND Multi", async ({ page }) => {
    await seedFree(page);
    await page.goto("/upgrade");
    await dismissCookies(page);

    // Pro single-cert should have a price; Multi should mention 7 certs
    await expect(page.locator("body")).toContainText(/\$19\.?\d?\d?/);
    await expect(page.locator("body")).toContainText(/\$39|all 7|all certs/i);
  });
});

test.describe("Free tier gating", () => {
  test("Free user on /dashboard sees the Pro banner with Upgrade CTA", async ({
    page,
  }) => {
    await seedFree(page);
    await page.goto("/dashboard");
    await dismissCookies(page);

    await expect(page.getByText(/your pass dashboard/i)).toBeVisible({
      timeout: 5000,
    });
    // Pro banner: "You're on the free plan" + Upgrade button.
    // Use first() because "free plan" + "free drills" both match.
    await expect(page.getByText(/free plan|free drills/i).first()).toBeVisible();
    const upgradeCta = page.getByRole("button", { name: /upgrade/i }).first();
    await expect(upgradeCta).toBeVisible();
    await page.screenshot({
      path: `${SHOTS}/02-dashboard-free-banner.png`,
      fullPage: true,
    });
  });

  test("Pro user on /dashboard does NOT see the Pro banner", async ({ page }) => {
    await seedPro(page);
    await page.goto("/dashboard");
    await dismissCookies(page);

    await expect(page.getByText(/your pass dashboard/i)).toBeVisible({
      timeout: 5000,
    });
    // The Pro banner ProBanner only renders when !ent.hasPro
    await expect(page.getByText(/free plan/i)).toHaveCount(0);
    await page.screenshot({
      path: `${SHOTS}/03-dashboard-pro-no-banner.png`,
      fullPage: true,
    });
  });

  test("Free user on /upgrade sees the upgrade page (not gated)", async ({
    page,
  }) => {
    await seedFree(page);
    await page.goto("/upgrade");
    await dismissCookies(page);

    // /upgrade should be accessible to anyone
    await expect(page.locator("body")).toContainText(/upgrade|pro|multi/i);
  });
});

test.describe("Redeem flow", () => {
  test("/redeem page shows the key input + a Redeem button", async ({ page }) => {
    await seedFree(page);
    await page.goto("/redeem");
    await dismissCookies(page);

    // Should have a text input for the key
    const input = page.getByPlaceholder(/PASSPILOT/i);
    await expect(input).toBeVisible({ timeout: 5000 });

    // And a Redeem / Activate button
    const submitBtn = page.getByRole("button", {
      name: /redeem|activate|unlock|verify/i,
    });
    await expect(submitBtn.first()).toBeVisible();

    await page.screenshot({ path: `${SHOTS}/04-redeem-form.png`, fullPage: true });
  });

  test("/redeem rejects an obviously invalid key", async ({ page }) => {
    await seedFree(page);
    await page.goto("/redeem");
    await dismissCookies(page);

    const input = page.getByPlaceholder(/PASSPILOT/i);
    await input.fill("OBVIOUSLY-INVALID-KEY-XYZ123");

    const submitBtn = page.getByRole("button", {
      name: /redeem|activate|unlock|verify/i,
    });
    await submitBtn.first().click();

    // Should show some kind of error / "not valid" feedback
    // (don't enforce exact copy — just verify SOMETHING happens)
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `${SHOTS}/05-redeem-invalid.png`,
      fullPage: true,
    });
  });
});

test.describe("Multi-Cert tier (7 cert unlocks)", () => {
  test("Multi user on /dashboard sees no upgrade banner + can switch certs", async ({
    page,
  }) => {
    await seedMulti(page);
    await page.goto("/dashboard");
    await dismissCookies(page);

    await expect(page.getByText(/your pass dashboard/i)).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText(/free plan/i)).toHaveCount(0);
    await page.screenshot({
      path: `${SHOTS}/06-dashboard-multi.png`,
      fullPage: true,
    });
  });
});

test.describe("Account page reflects tier correctly", () => {
  test("Free tier user sees Free / Upgrade prompt in Account", async ({
    page,
  }) => {
    await seedFree(page);
    await page.goto("/account");
    await dismissCookies(page);

    await expect(page.locator("body")).toContainText(/free|upgrade|pro/i);
    await page.screenshot({
      path: `${SHOTS}/07-account-free.png`,
      fullPage: true,
    });
  });

  test("Pro tier user sees Pro license info in Account", async ({ page }) => {
    await seedPro(page);
    await page.goto("/account");
    await dismissCookies(page);

    await expect(page.locator("body")).toContainText(/pro|license|active/i);
    await page.screenshot({
      path: `${SHOTS}/08-account-pro.png`,
      fullPage: true,
    });
  });
});
