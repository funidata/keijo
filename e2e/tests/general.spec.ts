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

  test("Switches between light and dark mode", async ({ appBar, page }) => {
    const getDarkModeSetting = async () => {
      const storage = await page.context().storageState();
      const darkModeSetting = storage.origins[0].localStorage.find(
        (item) => item.name === "use-dark-mode",
      );
      return darkModeSetting?.value;
    };

    await appBar.getDarkModeButton().click();
    await expect(getDarkModeSetting()).resolves.toBe("true");
    await appBar.getDarkModeButton().click();
    await expect(getDarkModeSetting()).resolves.toBe("false");
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
    await appBar.openMenu();
    await expect(page.getByRole("menuitem", { name: t("controls.defaultsView") })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: t("controls.jiraConnect") })).toBeVisible();
  });
});
