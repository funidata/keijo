import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

test.describe("App bar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

  test("Opens entry dialog", async ({ page, t, appBar }) => {
    await appBar.openEntryForm();
    await expect(page.getByRole("heading", { name: t("entryDialog.title.edit") })).toBeVisible();
  });
});
