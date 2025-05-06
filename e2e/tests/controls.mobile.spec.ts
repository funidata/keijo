import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

const dateFormat = "YYYY-MM-DD";

test.describe("Browse week mobile", () => {
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
});

test.describe("Connect Jira Mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/entries/week/`);
  });

  test("Connect to Jira", async ({ page, t, browserName }) => {
    test.skip(
      browserName === "webkit",
      "Navigation does not work with headless Webkit for some reason.",
    );

    await page.getByRole("banner").getByLabel(t("controls.openMenu")).click();
    await page.getByRole("button", { name: t("controls.jiraConnect") }).click();
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
    await page.getByRole("banner").getByLabel(t("controls.openMenu")).click();
    await page.getByRole("button", { name: t("controls.jiraDisconnect") }).click();
    expect(sessionRemoveRequested).toBe(true);
  });
});
