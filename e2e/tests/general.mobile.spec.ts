import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

test.describe("App bar (mobile)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

  test("Switches language", async ({ page }) => {
    // UI texts hardcoded because `playwright-i18next-fixture` won't update on the fly.
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("button", { name: "Suomi" }).click();
    await page.keyboard.press("Escape");

    await expect(
      page.getByRole("heading", { name: "Työaikakirjaukset", exact: true }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Avaa valikko" }).click();
    await page.getByRole("button", { name: "English" }).click();
    await page.keyboard.press("Escape");

    await expect(page.getByRole("heading", { name: "Entries", exact: true })).toBeVisible();
  });
});
