import { Page, expect } from "@playwright/test";
import { test } from "../playwright.config";
import { TFunction } from "i18next";
import {
  getMockProductNames,
  getMockActivityNames,
  getMockIssueNames,
  getMockClientNames,
} from "mock-data";

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
  // TODO: Some way to check added entries?
  test("Should add entry from app bar", async ({ page, t }) => {
    // Open entry dialog
    await page
      .getByRole("banner")
      .getByRole("button", { name: t("entryDialog.title") })
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
      .getByRole("button", { name: t("entryDialog.title") })
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
    await page.goto("/entries/week/20");
  });

  test("Should edit entry", async ({ page, t }) => {
    await page
      .getByRole("button", { name: t("controls.editEntry") })
      .first()
      .click();
    await expect(page).toHaveURL(/.*\/edit$/);
    await fillEntryForm(page, t, { ...entries[0] });
    await page.getByRole("button", { name: t("entryDialog.submit") }).click();
    await expect(page.getByText(t("notifications.editEntry.success"))).toBeAttached();
  });
});

test.describe("Delete entry", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/entries/week/20");
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

test.describe("Add entry mobile", () => {
  // TODO: Some way to check added entries?
  test("Should add entry from app bar", async ({ page, t }) => {
    // Open entry dialog
    await page.getByRole("banner").getByLabel(t("controls.openMenu")).click();
    await page.getByRole("button", { name: t("entryDialog.title") }).click();
    await expect(page).toHaveURL(/.*\/create$/);
    // Fill entry fields
    await fillEntryFormMobile(page, t, entries[0]);
    // Submit
    await page.getByRole("button", { name: t("entryDialog.submit") }).click();
    await expect(page.getByText(t("notifications.addEntry.success"))).toBeAttached();
  });

  test("Should add entry from entry row", async ({ page, t }) => {
    await page
      .getByRole("button")
      .getByRole("button", { name: t("entryDialog.title") })
      .first()
      .click();
    await expect(page).toHaveURL(/.*\/create$/);
    await fillEntryFormMobile(page, t, entries[0]);
    await page.getByRole("button", { name: t("entryDialog.submit") }).click();
    await expect(page.getByText(t("notifications.addEntry.success"))).toBeAttached();
  });
});

test.describe("Edit entry mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/entries/week/20");
  });

  test("Should edit entry", async ({ page, t }) => {
    await page
      .getByRole("button", { name: t("controls.editEntry") })
      .first()
      .click();
    await expect(page).toHaveURL(/.*\/edit$/);
    await fillEntryFormMobile(page, t, { ...entries[0] });
    await page.getByRole("button", { name: t("entryDialog.submit") }).click();
    await expect(page.getByText(t("notifications.editEntry.success"))).toBeAttached();
  });
});

test.describe("Delete entry mobile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/entries/week/20");
  });

  test("Should delete entry", async ({ page, t }) => {
    await page
      .getByRole("button", { name: t("controls.editEntry") })
      .first()
      .click();
    await page.getByRole("button", { name: t("entryDialog.delete") }).click();
    await page.getByRole("button", { name: t("controls.deleteEntry") }).click();
    await expect(page.getByText(t("notifications.deleteEntry.success"))).toBeAttached();
  });
});

const fillEntryFormMobile = async (page: Page, t: TFunction, entry: TestEntry) => {
  await page.getByLabel(t("entryDialog.product")).fill(entry.product);
  await page.getByLabel(t("entryDialog.activity")).fill(entry.activity);
  await page.getByLabel(t("entryDialog.description")).fill(entry.description);
  await page.getByLabel(t("entryDialog.duration")).pressSequentially(entry.duration);
  await page.getByRole("textbox", { name: "date" }).click();
  await page.getByRole("gridcell", { name: entry.date.split(".")[0] }).click();
  await page.getByRole("button", { name: "OK" }).click();
};

const fillEntryForm = async (page: Page, t: TFunction, entry: TestEntry) => {
  await page.getByLabel(t("entryDialog.product")).fill(entry.product);
  await page.getByLabel(t("entryDialog.activity")).fill(entry.activity);
  await page.getByLabel(t("entryDialog.description")).fill(entry.description);
  await page.getByLabel(t("entryDialog.duration")).pressSequentially(entry.duration);
  await page.getByRole("button", { name: /.*\d\d.*/ }).click();
  await page.getByRole("gridcell", { name: entry.date.split(".")[0] }).click();
};
