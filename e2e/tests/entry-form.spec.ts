import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

test.describe("Entry form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Requires product and function values", async ({ appBar, page, entryForm }) => {
    await appBar.openEntryForm();
    await entryForm.save();

    await expect(page.getByText("Product is required")).toBeVisible();
    await expect(page.getByText("Function is required")).toBeVisible();
  });

  test('Requires comment if function is "Toteutus" and issue is not reported', async ({
    appBar,
    page,
    entryForm,
  }) => {
    await appBar.openEntryForm();
    await entryForm.selectProduct("Hintava tuote");
    await entryForm.selectFunction("Toteutus");
    await entryForm.save();

    await expect(
      page.getByText("Description is required if there is no relevant issue."),
    ).toBeVisible();
  });

  test('Requires comment if function is "Sisäiset palaverit ja tapahtumat"', async ({
    appBar,
    page,
    entryForm,
  }) => {
    await appBar.openEntryForm();
    await entryForm.selectProduct("Hintava tuote");
    await entryForm.selectFunction("Sisäiset palaverit ja tapahtumat");
    await entryForm.save();

    await expect(page.getByText("Description is required.")).toBeVisible();
  });

  test("Set remaining hours disabled when toggled off", async ({ appBar, entryForm }) => {
    await appBar.openEntryForm();

    await expect(entryForm.getRemainingHoursToggle()).not.toBeChecked();
    await expect(entryForm.getHoursField()).toHaveText("00");
    await expect(entryForm.getMinutesField()).toHaveText("00");
  });

  test("Set remaining hours enabled when toggled on", async ({ appBar, entryForm }) => {
    await appBar.openEntryForm();
    await entryForm.getRemainingHoursToggle().check();

    await expect(entryForm.getHoursField()).toHaveText("07");
    await expect(entryForm.getMinutesField()).toHaveText("30");
  });

  test("Set remaining hours toggle state persists", async ({ appBar, entryForm, page }) => {
    await appBar.openEntryForm();
    await entryForm.getRemainingHoursToggle().check();
    await page.reload();

    await expect(entryForm.getRemainingHoursToggle()).toBeChecked();
  });

  test("Remaining hours are calculated correctly", async ({ page, entryBrowser, entryForm }) => {
    await page.goto("/entries/week/2024-05-13");
    await page.waitForTimeout(1000);
    await entryBrowser.getAddEntryButton("13/05/").click();
    await entryForm.getRemainingHoursToggle().check();

    await expect(entryForm.getHoursField()).toHaveText("02");
    await expect(entryForm.getMinutesField()).toHaveText("30");
  });
});
