import { expect } from "@playwright/test";
import { test } from "../playwright.config";

const dateFormat = "YYYY-MM-DD";

test.describe("Week browser", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/entries/week/2023-02-13");
  });

  test("Should browse weeks forward", async ({ page, t }) => {
    const jump = 3;
    for (let i = 0; i < jump; i++) {
      await page.getByRole("button", { name: t("controls.aria.nextWeek") }).click();
    }
    await expect(page).toHaveURL("/entries/week/2023-03-06");
  });

  test("Should browse weeks backward", async ({ page, t }) => {
    const jump = 3;
    for (let i = 0; i < jump; i++) {
      await page.getByRole("button", { name: t("controls.aria.prevWeek") }).click();
    }
    await expect(page).toHaveURL("/entries/week/2023-01-23");
  });

  test("Should go to current week", async ({ page, t, dayjs }) => {
    await page.getByRole("button", { name: t("controls.aria.currentWeek") }).click();
    await expect(page).toHaveURL(`/entries/week/${dayjs().weekday(0).format(dateFormat)}`);
  });

  test.skip("Should go to specific week", async ({ page, dayjs }) => {
    // FIXME: Fix and enable this test once week select drop-down is fixed.
    const jump = 4;
    const startingWeek = dayjs().week();
    await page.goto(`/entries/week/${startingWeek}`);
    await page.getByRole("combobox", { name: String(startingWeek) }).click();
    await page.getByRole("option", { name: String(startingWeek + jump) }).click();
    await expect(page).toHaveURL(`/entries/week/${startingWeek + jump}`);
  });

  test("Handles browsing over new year correctly (forwards)", async ({ page, t }) => {
    await page.goto("/entries/week/2024-12-30");
    await page.getByRole("button", { name: t("controls.aria.nextWeek") }).click();
    await expect(page).toHaveURL("/entries/week/2025-01-06");
  });

  test("Handles browsing over new year correctly (backwards)", async ({ page, t }) => {
    await page.goto("/entries/week/2025-01-06");
    await page.getByRole("button", { name: t("controls.aria.prevWeek") }).click();
    await expect(page).toHaveURL("/entries/week/2024-12-30");
  });
});

test.describe("Date browser", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/entries/range/2025-04-21/2025-04-23");
  });

  test("Date browser is shown", async ({ page, t }) => {
    // This test is here to make sure E2E fails if MUI X Pro license has expired.
    const datePicker = page.getByRole("group", { name: t("controls.dateRange") });
    await expect(datePicker).toBeVisible();
    await expect(datePicker).toBeEnabled();
  });

  test("Correct date range is shown", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Mo 21/4/2025" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Tu 22/4/2025" })).toBeVisible();
    await expect(page.getByRole("button", { name: "We 23/4/2025" })).toBeVisible();
  });
});

test.describe("Connect Jira", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/entries/week/`);
  });

  test("Connect to Jira", async ({ page, t, browserName }) => {
    test.skip(
      browserName === "webkit",
      "Navigation does not work with headless Webkit for some reason.",
    );

    await page.getByLabel(t("controls.settingsMenu")).click();
    await page.getByRole("menuitem", { name: t("controls.jiraConnect") }).click();
    await page.getByRole("button", { name: t("controls.jiraConnect") }).click();
    await expect(page).toHaveURL(/.*id\.atlassian\.com\/login.*/);
  });

  test("Disconnect from Jira", async ({ page, t, context }) => {
    await page.route("**/access-token", (route) =>
      route.fulfill({
        status: 200,
        body: "{'access_token': 'test_token','cloud_id': 'test_cloud_id' }",
      }),
    );
    let sessionRemoveRequested = false;
    context.on("request", (request) => {
      if (request.url().includes("/remove-session")) {
        sessionRemoveRequested = true;
      }
    });
    await page.getByLabel(t("controls.settingsMenu")).click();
    await page.getByRole("menuitem", { name: t("controls.jiraDisconnect") }).click();
    expect(sessionRemoveRequested).toBe(true);
  });
});
