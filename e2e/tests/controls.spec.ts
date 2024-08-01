import { expect } from "@playwright/test";
import { test } from "../playwright.config";

test.describe("Browse week", () => {
  const startingWeek = 21;
  test.beforeEach(async ({ page }) => {
    await page.goto(`/entries/week/${startingWeek}`);
  });

  test("Should browse weeks forward", async ({ page, t }) => {
    const jump = 3;
    for (let i = 0; i < jump; i++) {
      await page.getByRole("button", { name: t("controls.aria.nextWeek") }).click();
    }
    await expect(page).toHaveURL(`/entries/week/${startingWeek + jump}`);
  });

  test("Should browse weeks backward", async ({ page, t }) => {
    const jump = 3;
    for (let i = 0; i < jump; i++) {
      await page.getByRole("button", { name: t("controls.aria.prevWeek") }).click();
    }
    await expect(page).toHaveURL(`/entries/week/${startingWeek - jump}`);
  });

  test("Should go to current week", async ({ page, t, dayjs }) => {
    const jump = 10;
    const currentWeek = dayjs().week();
    await page.goto(`/entries/week/${currentWeek + jump}`);
    await page.getByRole("button", { name: t("controls.aria.currentWeek") }).click();
    await expect(page).toHaveURL(`/entries/week/${currentWeek}`);
  });

  test("Should go to specific week", async ({ page, dayjs }) => {
    const jump = 4;
    const startingWeek = dayjs().week();
    await page.goto(`/entries/week/${startingWeek}`);
    await page.getByRole("combobox", { name: String(startingWeek) }).click();
    await page.getByRole("option", { name: String(startingWeek + jump) }).click();
    await expect(page).toHaveURL(`/entries/week/${startingWeek + jump}`);
  });
});
