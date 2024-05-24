import { Page, expect } from "@playwright/test";
import { test } from "../playwright.config";
import { TFunction } from "i18next";
import {
  getMockProductNames,
  getMockActivityNames,
  getMockIssueNames,
  getMockClientNames,
} from "mock-data";
import dayjs, { Dayjs } from "dayjs";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Landing page", () => {
  test("has title", async ({ page, t }) => {
    await page.goto("/entries/week/20");
    await expect(page).toHaveTitle(/Keijo/);
    await expect(page.locator("html")).toContainText("Hieno tuote");
  });

  test("Should have page elements", async ({ page, t, dayjs }) => {
    await page.goto("/entries/week/20");
    await checkWeekdays(page, 20, t, dayjs());
    await checkAppBar(page, t);
  });

  // TODO: refactor
  test("should have mock entries", async ({ page, dayjs }) => {
    await page.goto("/entries/week/20");
    const date = dayjs().week(20).startOf("week");
    // Monday mock entries
    const mondayDetails = page.locator(".MuiAccordionDetails-root").first();
    await expect(mondayDetails.getByText("5:00")).toBeVisible();
    await expect(mondayDetails.getByText("Toteutus")).toBeVisible();
    await expect(mondayDetails.getByText("Hieno Tuote")).toBeVisible();
    // Tuesday mock entries
    const tuesdayDetails = page
      .locator("div", {
        has: page.getByRole("button", { name: date.add(1, "day").format("dd l") }),
      })
      .last();
    await expect(tuesdayDetails).toBeVisible();
    await expect(tuesdayDetails.getByText("Hieno tuote")).toBeVisible();
    await expect(tuesdayDetails.getByText("Hintava tuote")).toBeVisible();
    await expect(tuesdayDetails.getByText("Toteutus")).toBeVisible();
    await expect(tuesdayDetails.getByText("Suunnittelu")).toBeVisible();
    await expect(tuesdayDetails.getByText("3:30")).toHaveCount(2);
    const thursdayDetails = page
      .locator("div", {
        has: page.getByRole("button", { name: date.add(3, "day").format("dd l") }),
      })
      .last();
    await expect(thursdayDetails.getByText("Hintava tuote")).toBeVisible();
    await expect(thursdayDetails.getByText("Suunnittelu")).toBeVisible();
    await expect(thursdayDetails.getByRole("heading", { name: "3:00" })).toBeVisible();
  });
});

test.describe("Browse week", () => {
  const startingWeek = 21;
  test.beforeEach(async ({ page }) => {
    await page.goto(`/entries/week/${startingWeek}`);
  });

  test("Should browse weeks forward", async ({ page, t }) => {
    const jump = 3;
    for (let i = 0; i < jump; i++)
      await page.getByRole("button", { name: t("controls.aria.nextWeek") }).click();
    await expect(page).toHaveURL(`/entries/week/${startingWeek + jump}`);
  });

  test("Should browse weeks backward", async ({ page, t }) => {
    const jump = 3;
    for (let i = 0; i < jump; i++)
      await page.getByRole("button", { name: t("controls.aria.prevWeek") }).click();
    await expect(page).toHaveURL(`/entries/week/${startingWeek - jump}`);
  });

  test("Should go to current week", async ({ page, t, dayjs }) => {
    const jump = 10;
    const currentWeek = dayjs().week();
    await page.goto(`/entries/week/${currentWeek + jump}`);
    await page.getByRole("button", { name: t("controls.aria.currentWeek") }).click();
    await expect(page).toHaveURL(`/entries/week/${currentWeek}`);
  });

  test("Should go to specific week", async ({ page, t }) => {
    const jump = 4;
    await page.getByRole("combobox", { name: String(startingWeek) }).click();
    await page.getByRole("option", { name: String(startingWeek + jump) }).click();
    await expect(page).toHaveURL(`/entries/week/${startingWeek + jump}`);
  });
});

const checkWeekdays = async (page: Page, week: number, t: TFunction, dayjs: Dayjs) => {
  const date = dayjs.week(week).startOf("week").locale("en-gb");
  // check Weekday dropdowns exist
  await expect(page.getByRole("button", { name: date.format("dd l") })).toBeVisible();
  await expect(page.getByRole("button", { name: date.add(1, "day").format("dd l") })).toBeVisible();
  await expect(page.getByRole("button", { name: date.add(2, "day").format("dd l") })).toBeVisible();
  await expect(page.getByRole("button", { name: date.add(3, "day").format("dd l") })).toBeVisible();
  await expect(page.getByRole("button", { name: date.add(4, "day").format("dd l") })).toBeVisible();
  const saturday = page.getByRole("button", { name: date.add(5, "day").format("dd l") });
  await expect(saturday).toBeVisible();
  await expect(saturday.getByText(t("entryTable.weekend"))).toBeVisible();
  const sunday = page.getByRole("button", { name: date.add(6, "day").format("dd l") });
  await expect(sunday).toBeVisible();
  await expect(sunday.getByText(t("entryTable.weekend"))).toBeVisible();
};

const checkAppBar = async (page: Page, t: TFunction) => {
  await expect(page.getByRole("img", { name: "Keijo logo" })).toBeVisible();
  await expect(page.getByRole("heading", { name: t("titles.workdayBrowser") })).toBeVisible();
  await expect(
    page.getByRole("banner").getByRole("button", { name: t("entryDialog.title") }),
  ).toBeVisible();
  await expect(
    page.getByRole("banner").getByRole("button", { name: t("controls.useDarkMode") }),
  ).toBeVisible();
  await expect(
    page.getByRole("banner").getByRole("button", { name: t("controls.selectLanguage") }),
  ).toBeVisible();
  await expect(
    page.getByRole("banner").getByRole("button", { name: t("controls.settingsMenu") }),
  ).toBeVisible();
};
