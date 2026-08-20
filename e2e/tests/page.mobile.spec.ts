import { Page, expect } from "@playwright/test";
import { Dayjs } from "dayjs";
import { TFunction } from "i18next";
import { getMockEntries } from "mock-data";
import { test } from "../fixtures/fixtures";
import { escapeRegex, formatHours } from "./utils/mockEntryHelpers";

const mockEntries = getMockEntries();
const testDate = "2024-05-13";
const mockEntryWeekUrl = `/entries/week/${testDate}`;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Landing page mobile", () => {
  test("has title", async ({ page }) => {
    await page.goto(mockEntryWeekUrl);
    await expect(page).toHaveTitle(/Keijo/);
    await expect(page.locator("html")).toContainText("Hieno tuote");
  });

  test("Should have page elements", async ({ page, t, dayjs }) => {
    await page.goto(mockEntryWeekUrl);
    await checkWeekdays(page, 20, t, dayjs(testDate));
    await expect(page.getByText(t("entryTable.totalHoursInWeek"))).toBeVisible();
    await expect(page.getByText(t("entryTable.tabs.browseByWeek"))).toBeVisible();
    await expect(page.getByText(t("entryTable.tabs.browseByDates"))).toBeVisible();
    await checkAppBarMobile(page, t);
  });

  test("Should have mock entries", async ({ page, dayjs }) => {
    await page.goto(mockEntryWeekUrl);

    // Expand all days that are expected to have entries.
    const dayLabels = [...new Set(mockEntries.map((e) => dayjs(e.date).format("dd l")))];
    for (const dayLabel of dayLabels) {
      const dayButton = page.getByRole("button", {
        name: new RegExp(`^${escapeRegex(dayLabel)}\\b`),
      });
      if ((await dayButton.getAttribute("aria-expanded")) !== "true") {
        await dayButton.click();
      }
    }

    // Read visible row texts once, then assert each mock entry exists.
    const rowTexts = await page.getByRole("listitem").allTextContents();

    for (const entry of mockEntries) {
      const expectedTime = formatHours(entry.hours);
      const dimensions = entry.fields.map((f) => f.DimensionItem);

      const matchFound = rowTexts.some((text) => {
        if (!text.includes(expectedTime)) return false;
        return dimensions.every((d) => text.includes(d));
      });

      expect(matchFound).toBeTruthy();
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
  await page.getByRole("button", { name: t("controls.hideWeekend") }).click();
};

const checkAppBarMobile = async (page: Page, t: TFunction) => {
  await expect(page.getByRole("img", { name: "Keijo logo" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: t("titles.workdayBrowser"), exact: true }),
  ).toBeVisible();
  await page.getByRole("banner").getByLabel(t("controls.openMenu")).click();
  await expect(page.getByRole("button", { name: t("entryDialog.title.create") })).toBeVisible();
  await expect(page.getByRole("button", { name: t("controls.defaultsView") })).toBeVisible();
  await expect(page.getByRole("heading", { name: t("controls.useDarkMode") })).toBeVisible();
  await expect(page.getByRole("button", { name: "Suomi" })).toBeVisible();
  await expect(page.getByRole("button", { name: "English" })).toBeVisible();
};
