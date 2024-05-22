import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/entries/week/20");
  await expect(page).toHaveTitle(/Keijo/);
  await expect(page.locator("html")).toContainText("Hieno tuote");
});
