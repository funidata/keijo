import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

const dateFormat = "YYYY-MM-DD";

test.describe("Week browser", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/entries/week/2023-02-13");
  });

  test("Should browse weeks forward", async ({ page, browserControls }) => {
    const jump = 3;
    for (let i = 0; i < jump; i++) {
      await browserControls.getNextWeekButton().click();
    }
    await expect(page).toHaveURL("/entries/week/2023-03-06");
  });

  test("Should browse weeks backward", async ({ page, browserControls }) => {
    const jump = 3;
    for (let i = 0; i < jump; i++) {
      await browserControls.getPreviousWeekButton().click();
    }
    await expect(page).toHaveURL("/entries/week/2023-01-23");
  });

  test("Should go to current week", async ({ page, browserControls, dayjs }) => {
    await browserControls.getCurrentWeekButton().click();
    await expect(page).toHaveURL(`/entries/week/${dayjs().weekday(0).format(dateFormat)}`);
  });

  test.skip("Should go to specific week", async ({ page, dayjs }) => {
    // FIXME: Fix and enable this test once week select drop-down is fixed.
    const jump = 4;
    const startingWeek = dayjs().week();
    await page.goto(`/entries/week/${startingWeek}`);
    await page.getByRole("combobox", { name: String(startingWeek) }).click();
    await page.getByRole("option", { name: String(startingWeek + jump) }).click();
    await expect(page).toHaveURL(`/entries/week/${startingWeek + jump}`);
  });

  test("Handles browsing over new year correctly (forwards)", async ({ page, browserControls }) => {
    await page.goto("/entries/week/2024-12-30");
    await browserControls.getNextWeekButton().click();
    await expect(page).toHaveURL("/entries/week/2025-01-06");
  });

  test("Handles browsing over new year correctly (backwards)", async ({
    page,
    browserControls,
  }) => {
    await page.goto("/entries/week/2025-01-06");
    await browserControls.getPreviousWeekButton().click();
    await expect(page).toHaveURL("/entries/week/2024-12-30");
  });
});

test.describe("Date browser", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/entries/range/2025-04-21/2025-04-23");
  });

  test("Date browser is shown", async ({ page, t }) => {
    // This test is here to make sure E2E fails if MUI X Pro license has expired.
    const datePicker = page.getByRole("group", { name: t("controls.dateRange") });
    await expect(datePicker).toBeVisible();
    await expect(datePicker).toBeEnabled();
  });

  test("Correct date range is shown", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Mo 21/4/2025" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Tu 22/4/2025" })).toBeVisible();
    await expect(page.getByRole("button", { name: "We 23/4/2025" })).toBeVisible();
  });
});
