import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

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
