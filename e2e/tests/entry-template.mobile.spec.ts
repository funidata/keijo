import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import {
  createEntryTemplate,
  description,
  openEntryTemplates,
  templateName,
} from "./utils/entryTemplateHelpers";

test.describe("Entry templates", () => {
  test("creates an entry from a template", async ({ page, t }) => {
    await openEntryTemplates(page, t);
    await createEntryTemplate(page, t);

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
    await openEntryTemplates(page, t);
    await createEntryTemplate(page, t);

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
    await openEntryTemplates(page, t);
    await createEntryTemplate(page, t);

    await page.getByRole("button", { name: templateName, exact: true }).click();
    await page.getByRole("button", { name: t("controls.deleteEntryTemplate") }).click();
    await page.getByRole("menuitem", { name: t("controls.confirmDelete") }).click();

    await expect(page.getByRole("alert")).toContainText(t("notifications.deleteTemplate.success"));
    await expect(page.getByText(templateName, { exact: true })).not.toBeAttached();
  });
});
