import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

test.describe("App bar (desktop)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

  test("Switches language", async ({ page }) => {
    // UI texts hardcoded because `playwright-i18next-fixture` won't update on the fly.
    await page.getByRole("banner").getByRole("button", { name: "Select language" }).click();
    await page.getByRole("menuitem", { name: "Suomi" }).click();

    await expect(
      page.getByRole("heading", { name: "Työaikakirjaukset", exact: true }),
    ).toBeVisible();

    await page.getByRole("banner").getByRole("button", { name: "Valitse kieli" }).click();
    await page.getByRole("menuitem", { name: "English" }).click();

    await expect(page.getByRole("heading", { name: "Entries", exact: true })).toBeVisible();
  });

  test("Opens three-dot menu", async ({ appBar, page, t }) => {
    await appBar.openDesktopMenuOptional();
    await expect(page.getByRole("menuitem", { name: t("controls.defaultsView") })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: t("controls.jiraConnect") })).toBeVisible();
  });
});
