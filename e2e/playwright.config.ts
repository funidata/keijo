import { defineConfig, devices } from "@playwright/test";

const ci = process.env.CI === "true";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 2 : 0,
  workers: undefined,
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: "http://localhost:4000",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    locale: "en-gb",
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      grepInvert: /\.mobile\.spec\./,
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      grepInvert: /\.mobile\.spec\./,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      grepInvert: /\.mobile\.spec\./,
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
      grepInvert: /\.desktop\.spec\./,
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
      grepInvert: /\.desktop\.spec\./,
    },
  ],
});
