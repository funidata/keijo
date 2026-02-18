import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

test.describe("Jira connection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/entries/week/`);
  });

  test("Connect to Jira", async ({ page, t, browserName, appBar }) => {
    test.skip(
      browserName === "webkit",
      "Navigation does not work with headless Webkit for some reason.",
    );

    await appBar.clickJiraConnectButton();
    await page.getByRole("button", { name: t("controls.jiraConnect") }).click();
    await expect(page).toHaveURL(/.*id\.atlassian\.com\/login.*/);
  });

  test("Disconnect from Jira", async ({ page, context, appBar }) => {
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
    await appBar.clickJiraDisonnectButton();
    expect(sessionRemoveRequested).toBe(true);
  });
});
