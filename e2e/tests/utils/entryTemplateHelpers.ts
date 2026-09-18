import { expect, Page } from "@playwright/test";
import { getMockActivityNames, getMockProductNames } from "mock-data";
import { TFunction } from "../../fixtures/i18n.fixture";

export const templateName = "Daily standup";
export const description = "Team sync";

const productNames = getMockProductNames();
const activityNames = getMockActivityNames();

export const openEntryTemplates = async (page: Page, t: TFunction) => {
  await page.goto("/entries/week/2024-05-20");
  await page.getByRole("button", { name: t("titles.templates") }).click();
};

export const createEntryTemplate = async (page: Page, t: TFunction) => {
  await page.getByRole("button", { name: t("controls.addTemplate") }).click();
  await page.getByRole("textbox", { name: t("entryDialog.templateName") }).fill(templateName);
  await page.getByRole("combobox", { name: t("entryDialog.product") }).click();
  await page.getByRole("option", { name: productNames[0], exact: true }).click();
  await page.getByRole("combobox", { name: t("entryDialog.activity") }).click();
  await page.getByRole("option", { name: activityNames[0], exact: true }).click();
  await page.getByRole("textbox", { name: t("entryDialog.description") }).fill(description);
  await page.getByRole("spinbutton", { name: "Hours" }).fill("1");
  await page.getByRole("button", { name: t("entryDialog.submit"), exact: true }).click();

  await expect(page.getByRole("alert")).toContainText(t("notifications.addTemplate.success"));
  await expect(page.getByText(templateName, { exact: true })).toBeVisible();
};
