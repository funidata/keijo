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
});
