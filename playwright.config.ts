import { defineConfig, devices } from "@playwright/test";

/**
 * PassPilot E2E test config.
 *
 * Boots `npm run dev` automatically (port 3002), runs Chromium-headed
 * by default so screenshots match what the user sees on iOS WebView,
 * with the iPhone 17 Pro viewport (393×852) so layout bugs reproduce.
 *
 * Run all tests:
 *   npx playwright test
 *
 * Run a single spec headed (with UI window):
 *   npx playwright test tests/e2e/onboarding.spec.ts --headed
 *
 * Open last HTML report:
 *   npx playwright show-report
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // single browser, one flow at a time
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  outputDir: "test-results",

  use: {
    baseURL: "http://localhost:3002",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3002",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: "ignore",
    stderr: "pipe",
  },

  projects: [
    {
      // Chromium with iPhone 17 Pro viewport — close enough to WKWebView for
      // layout/UX bug-hunting without needing the full webkit binary install.
      // If we ever want true WebKit fidelity for Safari-specific quirks,
      // run `npx playwright install webkit` and switch `chromium` → `webkit`.
      name: "iPhone 17 Pro (chromium)",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 393, height: 852 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 26_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22E254a",
      },
    },
  ],
});
