import { test, expect, type Page } from "@playwright/test";

/**
 * Visual regression — pixel-level baseline snapshots of brand-defining
 * pages. Catches accidental UI drift (e.g. a CSS change that bleeds into
 * an unrelated screen, a typo in copy, a missing icon).
 *
 * Baselines live in tests/e2e/visual-regression.spec.ts-snapshots/.
 * To regenerate after a deliberate UI change:
 *   npx playwright test visual-regression --update-snapshots
 *
 * Tolerance: maxDiffPixels=300 absorbs small antialiasing variance
 * across OS rendering engines (macOS ↔ Ubuntu CI). Tighten if a real
 * regression slips through.
 */

const SEED_PROFILE = `
window.localStorage.setItem('passpilot.v1', JSON.stringify({
  state: {
    profile: {
      examId: 'az-900',
      examDate: '2026-12-31',
      confidence: 'some',
      hoursPerDay: 1,
      targetOutcome: 'pass-comfortably',
      why: 'career-switch',
      startedAt: '2026-05-02T00:00:00.000Z',
      streakDays: 0,
      lastActiveDate: '2026-05-02T00:00:00.000Z'
    }
  },
  version: 0
}));
`;

async function seed(page: Page) {
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

// Snapshots are sensitive — wait for animation/network settle before capturing
async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(400);
}

// Visual regression baselines are platform-specific — macOS chromium renders
// fonts differently than Linux chromium (CI runner). Skip in CI to avoid
// false-positive diffs. Run locally to catch real UI regressions.
test.skip(
  !!process.env.CI,
  "Visual regression baselines are macOS-local; CI uses Ubuntu chromium with different font rendering"
);

test.describe("Visual regression — brand-critical pages", () => {
  test("welcome screen", async ({ page }) => {
    await page.goto("/welcome");
    await dismissCookies(page);
    await settle(page);
    await expect(page).toHaveScreenshot("welcome.png", {
      maxDiffPixels: 300,
      fullPage: false,
    });
  });

  test("onboarding cert picker (step 1)", async ({ page }) => {
    await page.goto("/onboarding");
    await dismissCookies(page);
    await settle(page);
    await expect(page).toHaveScreenshot("onboarding-cert-picker.png", {
      maxDiffPixels: 300,
      fullPage: false,
    });
  });

  test("account page (full legal-link list)", async ({ page }) => {
    await seed(page);
    await page.goto("/account");
    await dismissCookies(page);
    await settle(page);
    await expect(page).toHaveScreenshot("account.png", {
      maxDiffPixels: 500,
      fullPage: true,
    });
  });

  test("upgrade page (Pro + Multi pricing)", async ({ page }) => {
    await seed(page);
    await page.goto("/upgrade");
    await dismissCookies(page);
    await settle(page);
    await expect(page).toHaveScreenshot("upgrade.png", {
      maxDiffPixels: 500,
      fullPage: true,
    });
  });

  test("delete-account confirmation page", async ({ page }) => {
    await seed(page);
    await page.goto("/delete-account");
    await dismissCookies(page);
    await settle(page);
    await expect(page).toHaveScreenshot("delete-account.png", {
      maxDiffPixels: 500,
      fullPage: true,
    });
  });
});
