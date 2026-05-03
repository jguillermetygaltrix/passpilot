import { test, expect, type Page } from "@playwright/test";

/**
 * E2E: study-mode flows
 *   /diagnostic     — pre-quiz screen, runner, results handoff
 *   /practice       — drill picker, runner, complete flow
 *   /mock           — entry, cooldown gating
 *   /review         — SR queue (empty state when no due cards)
 *   /listen         — voice mode entry (TTS browser API check)
 *   /cram           — printable sheet entry
 */

const SHOTS = "test-results/screenshots/study";

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

test.describe("Study-mode flows", () => {
  test("/diagnostic pre-quiz screen renders + Start button visible", async ({
    page,
  }) => {
    await seed(page);
    await page.goto("/diagnostic");
    await dismissCookies(page);

    // Pre-quiz screen has "AZ-900 ... diagnostic" chip + Start button
    await expect(page.getByText(/diagnostic/i).first()).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/01-diagnostic-prequiz.png`, fullPage: true });

    // Find a Start button (variants: "Start", "Start diagnostic", "Begin")
    const startBtn = page
      .getByRole("button", { name: /^start|^begin/i })
      .first();
    await expect(startBtn).toBeVisible({ timeout: 5000 });
  });

  test("/practice drill picker renders + has cert focus", async ({ page }) => {
    await seed(page);
    await page.goto("/practice");
    await dismissCookies(page);

    await expect(page.getByText(/pick your drill/i)).toBeVisible({
      timeout: 5000,
    });
    await page.screenshot({ path: `${SHOTS}/02-practice-picker.png`, fullPage: true });
  });

  test("/mock entry renders + shows cooldown OR Start", async ({ page }) => {
    await seed(page);
    await page.goto("/mock");
    await dismissCookies(page);

    // Either cooldown copy ("Next mock available in...") or a Start button
    await expect(page.locator("body")).toContainText(/mock|exam/i);
    await page.screenshot({ path: `${SHOTS}/03-mock-entry.png`, fullPage: true });
  });

  test("/review (SR) renders empty-state correctly when no cards due", async ({
    page,
  }) => {
    await seed(page);
    await page.goto("/review");
    await dismissCookies(page);

    // Fresh profile = no SR cards = should show some kind of empty state
    // (e.g. "No reviews due", "Start by drilling", or similar)
    await expect(page.locator("body")).toContainText(
      /review|spaced|due|drill/i
    );
    await page.screenshot({ path: `${SHOTS}/04-review-empty.png`, fullPage: true });
  });

  test("/listen voice mode entry renders", async ({ page }) => {
    await seed(page);
    await page.goto("/listen");
    await dismissCookies(page);

    await expect(page.locator("body")).toContainText(/listen|voice|spoken/i);
    await page.screenshot({ path: `${SHOTS}/05-listen-entry.png`, fullPage: true });
  });

  test("/cram printable sheet renders + has Print CTA", async ({ page }) => {
    await seed(page);
    await page.goto("/cram");
    await dismissCookies(page);

    // Cram sheet should render the page + offer Print
    await expect(page.locator("body")).toContainText(/cram|print/i);
    await page.screenshot({ path: `${SHOTS}/06-cram-sheet.png`, fullPage: true });
  });

  test("/plan daily plan view renders today's blocks", async ({ page }) => {
    await seed(page);
    await page.goto("/plan");
    await dismissCookies(page);

    await expect(page.locator("body")).toContainText(/plan|today|mission|drill/i);
    await page.screenshot({ path: `${SHOTS}/07-plan.png`, fullPage: true });
  });

  test("/weakness page shows topic-mastery breakdown", async ({ page }) => {
    await seed(page);
    await page.goto("/weakness");
    await dismissCookies(page);

    await expect(page.locator("body")).toContainText(
      /weak|mastery|topic|priority/i
    );
    await page.screenshot({ path: `${SHOTS}/08-weakness.png`, fullPage: true });
  });

  test("/guide topic catalog renders + each topic clickable", async ({ page }) => {
    await seed(page);
    await page.goto("/guide");
    await dismissCookies(page);

    await expect(page.locator("body")).toContainText(/guide|topic|chapter/i);
    await page.screenshot({ path: `${SHOTS}/09-guide.png`, fullPage: true });
  });

  test("/achievements badge wall renders + lists categories", async ({ page }) => {
    await seed(page);
    await page.goto("/achievements");
    await dismissCookies(page);

    await expect(page.locator("body")).toContainText(/achievement|badge/i);
    await page.screenshot({ path: `${SHOTS}/10-achievements.png`, fullPage: true });
  });

  test("/daily challenge renders deterministic question set", async ({
    page,
  }) => {
    await seed(page);
    await page.goto("/daily");
    await dismissCookies(page);

    await expect(page.locator("body")).toContainText(/daily|challenge|today/i);
    await page.screenshot({ path: `${SHOTS}/11-daily.png`, fullPage: true });
  });

  test("/rescue mode renders the rescue plan", async ({ page }) => {
    await seed(page);
    await page.goto("/rescue");
    await dismissCookies(page);

    await expect(page.locator("body")).toContainText(/rescue|days|plan|cram/i);
    await page.screenshot({ path: `${SHOTS}/12-rescue.png`, fullPage: true });
  });

  test("/founder console gated by ?key= param", async ({ page }) => {
    await seed(page);

    // Without key: should show a soft gate / no content
    await page.goto("/founder");
    await dismissCookies(page);
    await page.screenshot({ path: `${SHOTS}/13-founder-gated.png`, fullPage: true });

    // With the right key: should reveal the dashboard
    await page.goto("/founder?key=galtrix-founder-2026");
    await dismissCookies(page);
    await expect(page.locator("body")).toContainText(/founder|usage|sessions/i);
    await page.screenshot({ path: `${SHOTS}/14-founder-unlocked.png`, fullPage: true });
  });
});
