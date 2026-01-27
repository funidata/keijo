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
}
