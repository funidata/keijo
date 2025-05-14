import { Page } from "@playwright/test";
import { TFunction } from "../i18n.fixture";

export class EntryForm {
  constructor(
    private page: Page,
    private t: TFunction,
  ) {}

  getSaveButton() {
    return this.page.getByRole("button", { name: this.t("entryDialog.submit"), exact: true });
  }

  getProductField() {
    return this.page.getByRole("combobox", { name: this.t("entryDialog.product"), exact: true });
  }

  getFunctionField() {
    return this.page.getByRole("combobox", { name: this.t("entryDialog.activity"), exact: true });
  }

  getIssueField() {
    return this.page.getByRole("combobox", { name: this.t("entryDialog.issue"), exact: true });
  }

  getClientField() {
    return this.page.getByRole("combobox", { name: this.t("entryDialog.client"), exact: true });
  }

  getCommentField() {
    return this.page.getByRole("textbox", { name: this.t("entryDialog.description"), exact: true });
  }

  getHoursField() {
    return this.page.getByRole("spinbutton", { name: "Hours" });
  }

  getMinutesField() {
    return this.page.getByRole("spinbutton", { name: "Minutes" });
  }

  getRemainingHoursToggle() {
    return this.page.getByRole("checkbox", {
      name: this.t("entryDialog.setRemainingHours"),
    });
  }

  async selectProduct(name: string) {
    await this.getProductField().click();
    await this.page.getByRole("option", { name, exact: true }).click();
  }

  async selectFunction(name: string) {
    await this.getFunctionField().click();
    await this.page.getByRole("option", { name, exact: true }).click();
  }

  async save() {
    await this.getSaveButton().click();
  }
}
