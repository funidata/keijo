import { expect } from "@playwright/test";
import { getMockActivityNames, getMockProductNames } from "mock-data";
import { test } from "../fixtures/fixtures";

const productNames = getMockProductNames();
const activityNames = getMockActivityNames();
const templateName = "Daily standup";
const description = "Team sync";

test.describe("Entry templates", () => {
  test("creates an entry from a template", async ({ page, t }) => {
    await page.goto("/entries/week/2024-05-20");

    await page.getByRole("button", { name: t("titles.templates") }).click();
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

    await page.getByRole("button", { name: t("controls.selectEntryTemplate") }).click();
    await page
      .getByRole("button", { name: t("controls.pasteEntry", { count: 1 }) })
      .first()
      .click();

    await expect(page.getByRole("alert")).toContainText(t("notifications.addEntry.success"));
    await expect(page.getByText(description, { exact: true })).toBeVisible();
  });
});