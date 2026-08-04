import { Page } from "@playwright/test";
import { TFunction } from "../i18n.fixture";

export class EntryBrowser {
  constructor(
    private page: Page,
    private t: TFunction,
  ) {}

  getAddEntryButton(date: string) {
    return this.page.getByLabel(
      this.t("controls.addEntryWithDate", { date, interpolation: { escapeValue: false } }),
    );
  }

  private escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  getAccordionAddEntryButton() {
    // "Add New Entry on {{date}}" -> match the localized prefix + a date digit
    const withDatePrefix = this.t("controls.addEntryWithDate", { date: "" }).trim();
    return this.page.getByRole("button", {
      name: new RegExp(`^${this.escapeRegex(withDatePrefix)}\\s*\\d`),
    });
  }
}
