import { expect } from "@playwright/test";
import { test } from "../playwright.config";

test.describe("Browse week", () => {
  const startingWeek = 21;
  test.beforeEach(async ({ page }) => {
    await page.goto(`/entries/week/${startingWeek}`);
  });

  test("Should browse weeks forward", async ({ page, t }) => {
    const jump = 3;
    for (let i = 0; i < jump; i++) {
      await page.getByRole("button", { name: t("controls.aria.nextWeek") }).click();
    }
    await expect(page).toHaveURL(`/entries/week/${startingWeek + jump}`);
  });

  test("Should browse weeks backward", async ({ page, t }) => {
    const jump = 3;
    for (let i = 0; i < jump; i++) {
      await page.getByRole("button", { name: t("controls.aria.prevWeek") }).click();
    }
    await expect(page).toHaveURL(`/entries/week/${startingWeek - jump}`);
  });

  test("Should go to current week", async ({ page, t, dayjs }) => {
    const currentWeek = dayjs().week();
    // Test is noop if current week happens to be the same as initial week.
    const initialWeek = currentWeek === 10 ? 11 : 10;
    await page.goto(`/entries/week/${initialWeek}`);
    await page.getByRole("button", { name: t("controls.aria.currentWeek") }).click();
    await expect(page).toHaveURL(`/entries/week/${currentWeek}`);
  });

  test("Should go to specific week", async ({ page }) => {
    const jump = 4;
    const startingWeek = 10;
    await page.goto(`/entries/week/${startingWeek}`);
    await page.getByRole("combobox", { name: String(startingWeek) }).click();
    await page.getByRole("option", { name: String(startingWeek + jump) }).click();
    await expect(page).toHaveURL(`/entries/week/${startingWeek + jump}`);
  });
});

test.describe("Connect Jira", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/entries/week/`);
  });

  test("Connect to Jira", async ({ page, t }) => {
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
