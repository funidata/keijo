import { Page, expect } from "@playwright/test";
import { TFunction } from "i18next";
import {
  getMockActivityNames,
  getMockClientNames,
  getMockIssueNames,
  getMockProductNames,
} from "mock-data";
import { test } from "../playwright.config";

type TestEntry = {
  product: string;
  activity: string;
  description: string;
  duration: string;
  issue: string;
  date: string;
  client: string;
};

const productNames = getMockProductNames();
const activityNames = getMockActivityNames();
const issueNames = getMockIssueNames();
const clientNames = getMockClientNames();
const mockEntryWeekUrl = "/entries/week/20";
const emptyWeekUrl = "/entries/week/21";

const entries: Array<TestEntry> = [
  {
    product: productNames[0],
    activity: activityNames[0],
    issue: issueNames[0],
    client: clientNames[0],
    description: "no comment",
    duration: "3.00",
    date: "21.5.2024",
  },
];

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Add entry", () => {
  test("Should add entry from app bar", async ({ page, t }) => {
    // Open entry dialog
    await page
      .getByRole("banner")
      .getByRole("button", { name: t("entryDialog.title.create") })
      .click();
    await expect(page).toHaveURL(/.*\/create$/);
    // Fill entry fields
    await fillEntryForm(page, t, entries[0]);
    // Submit
    await page.getByRole("button", { name: t("entryDialog.submit") }).click();
    await expect(page.getByText(t("notifications.addEntry.success"))).toBeAttached();
  });

  test("Should add entry from entry row", async ({ page, t }) => {
    await page
      .getByRole("button")
      .getByRole("button", { name: t("entryDialog.title.create") })
      .first()
      .click();
    await expect(page).toHaveURL(/.*\/create$/);
    await fillEntryForm(page, t, entries[0]);
    await page.getByRole("button", { name: t("entryDialog.submit") }).click();
    await expect(page.getByText(t("notifications.addEntry.success"))).toBeAttached();
  });
});

test.describe("Edit entry", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(mockEntryWeekUrl);
  });

  test("Should edit entry", async ({ page, t }) => {
    await page
      .getByRole("button", { name: t("controls.editEntry") })
      .first()
      .click();
    await expect(page).toHaveURL(/.*\/edit$/);
    await fillEntryForm(page, t, entries[0]);
    await page.getByRole("button", { name: t("entryDialog.submit") }).click();
    await expect(page.getByText(t("notifications.editEntry.success"))).toBeAttached();
  });
});

test.describe("Delete entry", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(mockEntryWeekUrl);
  });

  test("Should delete entry", async ({ page, t }) => {
    await page
      .getByRole("button", { name: t("controls.deleteEntry") })
      .first()
      .click();
    await page.getByRole("menuitem", { name: t("controls.confirmDelete") }).click();
    await expect(page.getByText(t("notifications.deleteEntry.success"))).toBeAttached();
  });
});

test.describe("Entry defaults", () => {
  test("Should set remaining hours when enabled", async ({ page, t }) => {
    await page.goto(emptyWeekUrl);
    await page
      .getByRole("button")
      .getByRole("button", { name: t("entryDialog.title.create") })
      .first()
      .click();
    await expect(page.getByRole("textbox", { name: "Duration" })).toHaveValue("00:00");
    await page.getByRole("checkbox", { name: t("entryDialog.setRemainingHours") }).click();
    await expect(page.getByRole("textbox", { name: "Duration" })).toHaveValue("07:30");
  });

  test("Should use set default values", async ({ page, t }) => {
    await page.goto(emptyWeekUrl + "/create");
    await expect(page.getByRole("combobox", { name: t("entryDialog.product") })).toHaveValue("");
    await page.goto(emptyWeekUrl);

    await page.getByLabel(t("controls.settingsMenu")).click();
    await page.getByRole("menuitem", { name: t("controls.defaultsView") }).click();

    await page.getByRole("combobox", { name: t("entryDialog.product") }).click();
    await page.getByRole("option", { name: entries[0].product }).click();
    await page.getByRole("combobox", { name: t("entryDialog.activity") }).click();
    await page.getByRole("option", { name: entries[0].activity }).click();

    await page.goto(emptyWeekUrl + "/create");
    await expect(page.getByRole("combobox", { name: t("entryDialog.product") })).toHaveValue(
      entries[0].product,
    );
    await expect(page.getByRole("combobox", { name: t("entryDialog.activity") })).toHaveValue(
      entries[0].activity,
    );
  });
});

const fillEntryForm = async (page: Page, t: TFunction, entry: TestEntry) => {
  await page.getByLabel(t("entryDialog.product")).fill(entry.product);
  await page.getByLabel(t("entryDialog.activity")).fill(entry.activity);
  await page.getByLabel(t("entryDialog.description")).fill(entry.description);
  await page.getByLabel(t("entryDialog.duration")).pressSequentially(entry.duration);
  await page.getByRole("button", { name: /.*\d\d.*/ }).click();
  await page
    .getByRole("gridcell", { name: entry.date.split(".")[0] })
    .first()
    .click();
};
