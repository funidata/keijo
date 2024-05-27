import { Page, expect } from "@playwright/test";
import { test } from "../playwright.config";
import { TFunction } from "i18next";
import { getMockEntries } from "mock-data";
import { Dayjs } from "dayjs";

const mockEntries = getMockEntries();

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
    await checkAppBar(page, t);
    await expect(page.getByText(t("entryTable.totalHoursInWeek"))).toBeVisible();
    await expect(page.getByText(t("entryTable.tabs.browseByWeek"))).toBeVisible();
    await expect(page.getByText(t("entryTable.tabs.browseByDates"))).toBeVisible();
    await checkWeekdays(page, 20, t, dayjs());
  });

  test("Should have correct mock entries", async ({ page, dayjs }) => {
    for (const entry of mockEntries) {
      const date = dayjs(entry.date);
      await page.goto(`/entries/week/${date.week()}`);
      const workdayEntryList = page
        .locator("div", {
          has: page.getByRole("button", { name: date.format("dd l") }),
        })
        .last()
        .getByRole("list");

      const hour = Math.floor(Number(entry.hours));
      const minute = (Number(entry.hours) * 60) % 60;
      let entryRows = workdayEntryList.getByRole("listitem");
      // Filter row by field texts
      for (const field of entry.fields) {
        entryRows = entryRows.filter({ hasText: new RegExp(`${field.DimensionItem}`) });
      }
      entryRows = entryRows.filter({ hasText: new RegExp(`${hour}:${minute}`) });
      await expect(entryRows.first()).toBeVisible();
    }
  });

  test("Should have correct amount of total hours", async ({ page, dayjs }) => {
    for (const entry of mockEntries) {
      const date = dayjs(entry.date);
      await page.goto(`/entries/week/${date.week()}`);
      const totalTime = mockEntries
        .filter((ent) => dayjs(ent.date).week() === date.week())
        .reduce((a, entry) => a + Number(entry.hours), 0);
      const totalHours = Math.floor((totalTime * 60) / 60);
      const totalMinutes = (totalTime * 60) % 60;
      const totalMinutesPadded =
        String(totalMinutes).length === 1 ? `${totalMinutes}0` : String(totalMinutes);
      await expect(
        page
          .locator("div")
          .filter({ hasText: new RegExp(`^${totalHours}:${totalMinutesPadded} h$`) }),
      ).toBeVisible();
    }
  });
});

test.describe("Landing page mobile", () => {
  test("has title", async ({ page, t }) => {
    await page.goto("/entries/week/20");
    await expect(page).toHaveTitle(/Keijo/);
    await expect(page.locator("html")).toContainText("Hieno tuote");
  });

  test("Should have page elements", async ({ page, t, dayjs }) => {
    await page.goto("/entries/week/20");
    await checkWeekdays(page, 20, t, dayjs());
    await expect(page.getByText(t("entryTable.totalHoursInWeek"))).toBeVisible();
    await expect(page.getByText(t("entryTable.tabs.browseByWeek"))).toBeVisible();
    await expect(page.getByText(t("entryTable.tabs.browseByDates"))).toBeVisible();
    await checkAppBarMobile(page, t);
  });

  test("Should have mock entries", async ({ page, dayjs }) => {
    for (const entry of mockEntries) {
      const date = dayjs(entry.date);
      await page.goto(`/entries/week/${date.week()}`);
      const workdayEntryList = page
        .locator("div", {
          has: page.getByRole("button", { name: date.format("dd l") }),
        })
        .last()
        .getByRole("list");
      const hour = Math.floor(Number(entry.hours));
      const minute = (Number(entry.hours) * 60) % 60;
      let entryRows = workdayEntryList.getByRole("listitem");
      // Filter row by field texts
      for (const field of entry.fields) {
        entryRows = entryRows.filter({ hasText: new RegExp(`${field.DimensionItem}`) });
      }
      entryRows = entryRows.filter({ hasText: new RegExp(`${hour}:${minute}`) });
      await expect(entryRows.first()).toBeVisible();
    }
  });

  test("Should have correct amount of total hours", async ({ page, dayjs }) => {
    for (const entry of mockEntries) {
      const date = dayjs(entry.date);
      await page.goto(`/entries/week/${date.week()}`);
      const totalTime = mockEntries
        .filter((ent) => dayjs(ent.date).week() === date.week())
        .reduce((a, entry) => a + Number(entry.hours), 0);
      const totalHours = Math.floor((totalTime * 60) / 60);
      const totalMinutes = (totalTime * 60) % 60;
      const totalMinutesPadded =
        String(totalMinutes).length === 1 ? `${totalMinutes}0` : String(totalMinutes);
      await expect(
        page
          .locator("div")
          .filter({ hasText: new RegExp(`^${totalHours}:${totalMinutesPadded} h$`) }),
      ).toBeVisible();
    }
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

const checkAppBarMobile = async (page: Page, t: TFunction) => {
  await expect(page.getByRole("img", { name: "Keijo logo" })).toBeVisible();
  await expect(page.getByRole("heading", { name: t("titles.workdayBrowser") })).toBeVisible();
  await page.getByRole("banner").getByLabel(t("controls.openMenu")).click();
  await expect(page.getByRole("button", { name: t("entryDialog.title") })).toBeVisible();
  await expect(page.getByRole("heading", { name: t("controls.useDarkMode") })).toBeVisible();
  await expect(page.getByRole("button", { name: "Suomi" })).toBeVisible();
  await expect(page.getByRole("button", { name: "English" })).toBeVisible();
};
