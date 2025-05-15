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

    await appBar.clickDarkModeButton();
    await expect(getDarkModeSetting()).resolves.toBe("true");
    await appBar.clickDarkModeButton();
    await expect(getDarkModeSetting()).resolves.toBe("false");
  });
});
