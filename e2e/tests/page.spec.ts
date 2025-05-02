import { Page, expect } from "@playwright/test";
import { Dayjs } from "dayjs";
import { TFunction } from "i18next";
import { getMockEntries } from "mock-data";
import { test } from "../playwright.config";

const mockEntries = getMockEntries();
const testDate = "2024-05-13";
const mockEntryWeekUrl = `/entries/week/${testDate}`;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Landing page", () => {
  test("has title", async ({ page }) => {
    await page.goto(mockEntryWeekUrl);
    await expect(page).toHaveTitle(/Keijo/);
    await expect(page.locator("html")).toContainText("Hieno tuote");
  });

  test("Should have page elements", async ({ page, t, dayjs }) => {
    await page.goto(mockEntryWeekUrl);
    await checkAppBar(page, t);
    await expect(page.getByText(t("entryTable.totalHoursInWeek"))).toBeVisible();
    await expect(page.getByText(t("entryTable.tabs.browseByWeek"))).toBeVisible();
    await expect(page.getByText(t("entryTable.tabs.browseByDates"))).toBeVisible();
    await checkWeekdays(page, 20, t, dayjs(testDate));
  });

  test("Should have correct mock entries", async ({ page, dayjs }) => {
    for (const entry of mockEntries) {
      const date = dayjs(entry.date);
      await page.goto(mockEntryWeekUrl);
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
      await page.goto(mockEntryWeekUrl);
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

const checkWeekdays = async (page: Page, week: number, t: TFunction, testDate: Dayjs) => {
  const date = testDate.week(week).startOf("week").locale("en-gb");
  // check Weekday dropdowns exist
  await expect(page.getByRole("button", { name: date.format("dd l") })).toBeVisible();
  await expect(page.getByRole("button", { name: date.add(1, "day").format("dd l") })).toBeVisible();
  await expect(page.getByRole("button", { name: date.add(2, "day").format("dd l") })).toBeVisible();
  await expect(page.getByRole("button", { name: date.add(3, "day").format("dd l") })).toBeVisible();
  await expect(page.getByRole("button", { name: date.add(4, "day").format("dd l") })).toBeVisible();

  await page.getByRole("button", { name: t("controls.showWeekend") }).click();
  const saturday = page.getByRole("button", { name: date.add(5, "day").format("dd l") });
  await expect(saturday).toBeVisible();
  await expect(saturday.getByText(t("entryTable.weekend"))).toBeVisible();
  const sunday = page.getByRole("button", { name: date.add(6, "day").format("dd l") });
  await expect(sunday).toBeVisible();
  await expect(sunday.getByText(t("entryTable.weekend"))).toBeVisible();
};

const checkAppBar = async (page: Page, t: TFunction) => {
  await expect(page.getByRole("img", { name: "Keijo logo" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: t("titles.workdayBrowser"), exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("banner").getByRole("button", { name: t("entryDialog.title.create") }),
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
