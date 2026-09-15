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

    const selectTemplateButton = page.getByRole("button", {
      name: t("controls.selectEntryTemplate"),
    });
    await selectTemplateButton.click();
    await expect(selectTemplateButton).toHaveAttribute("aria-pressed", "true");

    const addEntryRequest = page.waitForRequest((request) => {
      const postData = request.postData() ?? "";
      return (
        request.url().endsWith("/graphql") &&
        postData.includes("AddWorkdayEntry") &&
        postData.includes(description)
      );
    });
    await page
      .getByRole("button", { name: t("controls.pasteEntry", { count: 1 }) })
      .first()
      .click();

    await addEntryRequest;
    await expect(page.getByRole("alert")).toContainText(t("notifications.addEntry.success"));
  });

  test("edits an entry template", async ({ page, t }) => {
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

    await page.getByRole("button", { name: templateName, exact: true }).click();
    await page.getByRole("button", { name: t("controls.editEntryTemplate") }).click();
    await expect(page).toHaveURL(/.*\/edit-template$/);
    await expect(page.getByRole("textbox", { name: t("entryDialog.templateName") })).toHaveValue(
      templateName,
    );

    const updatedTemplateName = "Updated standup";
    const updatedDescription = "Updated team sync";
    await page
      .getByRole("textbox", { name: t("entryDialog.templateName") })
      .fill(updatedTemplateName);
    await page
      .getByRole("textbox", { name: t("entryDialog.description") })
      .fill(updatedDescription);
    await page.getByRole("button", { name: t("entryDialog.submit"), exact: true }).click();

    await expect(page.getByRole("alert")).toContainText(t("notifications.editTemplate.success"));
    await expect(page.getByText(updatedTemplateName, { exact: true })).toBeVisible();
    await expect(page.getByText(templateName, { exact: true })).not.toBeAttached();
    await expect(page.getByText(updatedDescription, { exact: true })).not.toBeAttached();
  });

  test("deletes an entry template", async ({ page, t }) => {
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

    await page.getByRole("button", { name: templateName, exact: true }).click();
    await page.getByRole("button", { name: t("controls.deleteEntryTemplate") }).click();
    await page.getByRole("menuitem", { name: t("controls.confirmDelete") }).click();

    await expect(page.getByRole("alert")).toContainText(t("notifications.deleteTemplate.success"));
    await expect(page.getByText(templateName, { exact: true })).not.toBeAttached();
  });
});
