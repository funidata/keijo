import { defineConfig, devices } from "@playwright/test";
import { test as base } from "@playwright/test";
import { i18nFixture } from "./i18n-fixture";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en-gb";
import "dayjs/locale/fi";
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 2,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
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
      grepInvert: /mobile/,
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      grepInvert: /mobile/,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      grepInvert: /mobile/,
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
      grep: /mobile/,
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
      grep: /mobile/,
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

type DayjsFixture = {
  dayjs: (
    date?: dayjs.ConfigType,
    format?: dayjs.OptionType,
    locale?: string,
    strict?: boolean,
  ) => dayjs.Dayjs;
};

const test = base.extend(i18nFixture).extend<DayjsFixture>({
  dayjs: async ({ locale }, use) => {
    dayjs.extend(weekOfYear);
    dayjs.extend(localizedFormat);
    dayjs.locale(locale);
    await use(dayjs);
  },
});

export { test };
