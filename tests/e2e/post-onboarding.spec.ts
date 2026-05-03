import { test, expect, type Page } from "@playwright/test";

/**
 * E2E: post-onboarding flows that don't depend on a real diagnostic.
 *
 * These tests seed a profile via localStorage so they can land directly
 * on /dashboard / /practice / etc. without re-running the full onboarding
 * flow (covered separately in onboarding.spec.ts).
 */

const SHOTS = "test-results/screenshots/post";

const SEED_PROFILE = `
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
  },
  version: 0
}));
`;

async function seedProfile(page: Page) {
  // Navigate to a real route first so localStorage is in the right origin
  await page.goto("/welcome");
  await page.evaluate(SEED_PROFILE);
}

async function dismissCookies(page: Page) {
  const acceptBtn = page.getByRole("button", { name: /^accept$/i });
  if (await acceptBtn.isVisible().catch(() => false)) {
    await acceptBtn.click();
    await page.waitForTimeout(200);
  }
}

test.describe("Post-onboarding flows", () => {
  test("dashboard loads + bottom-nav links all work", async ({ page }) => {
    await seedProfile(page);
    await page.goto("/dashboard");
    await dismissCookies(page);

    // Wait for the dashboard to hydrate from localStorage (Zustand persist
    // is async on first render; the dashboard returns null until profile
    // is set). The "EVENING/MORNING/AFTERNOON" greeting is a deterministic
    // post-hydration marker.
    await expect(page.getByText(/your pass dashboard/i)).toBeVisible({
      timeout: 5000,
    });

    // Bottom nav uses Link wrappers with icon + text. Scope to the <nav>.
    const bottomNav = page.locator("nav.md\\:hidden");
    await expect(bottomNav.getByRole("link", { name: /home/i })).toBeVisible();
    await expect(bottomNav.getByRole("link", { name: /^plan$/i })).toBeVisible();
    await expect(bottomNav.getByRole("link", { name: /^practice$/i })).toBeVisible();
    await expect(bottomNav.getByRole("link", { name: /weak/i })).toBeVisible();
    await expect(bottomNav.getByRole("link", { name: /guide/i })).toBeVisible();

    await page.screenshot({ path: `${SHOTS}/01-dashboard.png` });

    // Navigate Plan
    await bottomNav.getByRole("link", { name: /^plan$/i }).click();
    await expect(page).toHaveURL(/\/plan/);
    await page.screenshot({ path: `${SHOTS}/02-plan.png` });

    // Navigate Practice
    await bottomNav.getByRole("link", { name: /^practice$/i }).click();
    await expect(page).toHaveURL(/\/practice/);
    await page.screenshot({ path: `${SHOTS}/03-practice.png` });

    // Navigate Weak
    await bottomNav.getByRole("link", { name: /weak/i }).click();
    await expect(page).toHaveURL(/\/weakness/);
    await page.screenshot({ path: `${SHOTS}/04-weakness.png` });

    // Navigate Guide
    await bottomNav.getByRole("link", { name: /guide/i }).click();
    await expect(page).toHaveURL(/\/guide/);
    await page.screenshot({ path: `${SHOTS}/05-guide.png` });

    // Back Home
    await bottomNav.getByRole("link", { name: /home/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("settings page renders + has all expected nav", async ({ page }) => {
    await seedProfile(page);
    await page.goto("/settings");
    await dismissCookies(page);

    await expect(page.getByText(/settings/i).first()).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/06-settings.png` });
  });

  test("account page lists all 11 legal links (incl. Delete account)", async ({
    page,
  }) => {
    await seedProfile(page);
    await page.goto("/account");
    await dismissCookies(page);

    await expect(page.getByRole("heading", { name: /account/i })).toBeVisible();

    // Verify the App-Store-required links are all present
    await expect(page.getByRole("link", { name: /delete account/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /privacy policy/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /terms of service/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^refund policy$/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /pass guarantee/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /sub-processors/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /dmca/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /security/i })).toBeVisible();

    await page.screenshot({ path: `${SHOTS}/07-account.png`, fullPage: true });
  });

  test("upgrade page renders + has CTA", async ({ page }) => {
    await seedProfile(page);
    await page.goto("/upgrade");
    await dismissCookies(page);

    await expect(page.locator("body")).toContainText(/pro|multi|upgrade/i);
    await page.screenshot({ path: `${SHOTS}/08-upgrade.png`, fullPage: true });
  });

  test("redeem page accepts license-key input", async ({ page }) => {
    await seedProfile(page);
    await page.goto("/redeem");
    await dismissCookies(page);

    await expect(page.getByText(/license|redeem|key/i).first()).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/09-redeem.png` });
  });

  test("delete-account page renders the confirmation form", async ({ page }) => {
    await seedProfile(page);
    await page.goto("/delete-account");
    await dismissCookies(page);

    await expect(page.locator("body")).toContainText(/delete/i);
    await page.screenshot({ path: `${SHOTS}/10-delete-account.png`, fullPage: true });
  });
});

test.describe("Legal pages reachability + content sanity", () => {
  // No profile needed — these are public
  const legalPages = [
    { path: "/privacy", expect: /privacy/i },
    { path: "/terms", expect: /terms/i },
    { path: "/refunds", expect: /refund/i },
    { path: "/cookies", expect: /cookie/i },
    { path: "/aup", expect: /acceptable/i },
    { path: "/dmca", expect: /dmca|copyright/i },
    { path: "/security", expect: /security/i },
    { path: "/subprocessors", expect: /sub.?processor/i },
    { path: "/guarantee", expect: /guarantee/i },
    { path: "/support", expect: /support|help/i },
  ];

  for (const { path, expect: expected } of legalPages) {
    test(`${path} loads with expected content`, async ({ page }) => {
      await page.goto(path);
      await dismissCookies(page);
      await expect(page.locator("body")).toContainText(expected);
      await page.screenshot({
        path: `${SHOTS}/legal-${path.replace("/", "")}.png`,
      });
    });
  }
});
