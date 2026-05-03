import { test, expect, type Page } from "@playwright/test";

/**
 * E2E: welcome → onboarding (6 steps) → diagnostic kickoff → dashboard
 *
 * Drives the most common new-user path. Captures screenshots of every
 * state so we can visually diff against the iOS Capacitor build.
 *
 * Native iOS routes / → /welcome via app/page.tsx isNative() check.
 * On web, we navigate to /welcome directly to mimic the native UX.
 */

const SHOTS = "test-results/screenshots";

/**
 * Dismiss the cookie banner if present. Real users do this first;
 * skipping it makes E2E hit z-index conflicts that don't represent
 * actual user UX. We accept (vs reject) so the rest of the app
 * behaves as if a normal user is browsing.
 */
async function acceptCookies(page: Page) {
  const acceptBtn = page.getByRole("button", { name: /^accept$/i });
  if (await acceptBtn.isVisible().catch(() => false)) {
    await acceptBtn.click();
    await page.waitForTimeout(200);
  }
}

test.describe("Welcome → Onboarding → Diagnostic → Dashboard", () => {
  test("happy path: pick AZ-900, run through all 6 onboarding steps", async ({
    page,
  }) => {
    // ─── /welcome ──────────────────────────────────────────────
    await page.goto("/welcome");
    await acceptCookies(page);
    await expect(page.getByRole("heading", { name: "PassPilot" })).toBeVisible();
    await expect(page.getByText(/fastest path from/i)).toBeVisible();
    await expect(page.getByText("7 certs, ready to study")).toBeVisible();
    await expect(page.getByText("10-minute daily drills")).toBeVisible();
    await expect(page.getByText("Works offline, no account")).toBeVisible();
    const lestGo = page.getByRole("button", { name: /let's go/i });
    await expect(lestGo).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/01-welcome.png`, fullPage: false });
    await lestGo.click();

    // ─── /onboarding step 1: cert picker ───────────────────────
    await expect(page).toHaveURL(/\/onboarding/);
    await expect(
      page.getByRole("heading", { name: /which certification/i })
    ).toBeVisible();
    await expect(page.getByText("Step 1 of 6")).toBeVisible();
    // Sticky footer Continue should be visible regardless of scroll
    await expect(page.getByRole("button", { name: /continue/i })).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/02-onboarding-cert.png` });

    // Tap AZ-900 — should auto-advance after 500ms (DEC-049 polish)
    await page.getByText("AZ-900 · Azure Fundamentals").click();
    await page.waitForTimeout(700); // give auto-advance time to fire

    // ─── step 2: exam date ─────────────────────────────────────
    await expect(page.getByText("Step 2 of 6")).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/03-onboarding-date.png` });
    // DateStep is free-input, no auto-advance — manually click Continue
    await page.getByRole("button", { name: /continue/i }).click();

    // ─── step 3: confidence ────────────────────────────────────
    await expect(page.getByText("Step 3 of 6")).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/04-onboarding-confidence.png` });
    await page.getByText("Some exposure").click();
    await page.waitForTimeout(700);

    // ─── step 4: hours per day ─────────────────────────────────
    await expect(page.getByText("Step 4 of 6")).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/05-onboarding-hours.png` });
    // HoursStep is slider/input, manual continue
    await page.getByRole("button", { name: /continue/i }).click();

    // ─── step 5: target outcome ────────────────────────────────
    await expect(page.getByText("Step 5 of 6")).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/06-onboarding-outcome.png` });
    await page.getByText("Pass comfortably").click();
    await page.waitForTimeout(700);

    // ─── step 6: why ───────────────────────────────────────────
    await expect(page.getByText("Step 6 of 6")).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/07-onboarding-why.png` });
    await page.getByText("Breaking into tech").click();
    await page.waitForTimeout(700);

    // After last step, Continue → "Start diagnostic" → /diagnostic
    const startDx = page.getByRole("button", { name: /start diagnostic/i });
    if (await startDx.isVisible()) {
      await startDx.click();
    }

    // ─── /diagnostic ───────────────────────────────────────────
    await expect(page).toHaveURL(/\/diagnostic/, { timeout: 5000 });
    await page.screenshot({ path: `${SHOTS}/08-diagnostic.png` });
  });

  test("each cert in the picker auto-advances", async ({ page }) => {
    const certs = [
      "AZ-900 · Azure Fundamentals",
      "CLF-C02 · AWS Cloud Practitioner",
      "MS-900 · Microsoft 365 Fundamentals",
      "AI-900 · Azure AI Fundamentals",
      "Security+",
      "AIF-C01",
      "Cloud Digital Leader",
    ];
    for (const cert of certs) {
      await page.goto("/onboarding");
      await acceptCookies(page);
      await expect(page.getByText("Step 1 of 6")).toBeVisible();
      await page.getByText(cert).first().click();
      await page.waitForTimeout(700);
      await expect(page.getByText("Step 2 of 6")).toBeVisible({
        timeout: 2000,
      });
    }
  });
});
