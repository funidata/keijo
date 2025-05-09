import { Page } from "@playwright/test";
import { TFunction } from "../i18n.fixture";

export class BrowserControls {
  constructor(
    public readonly page: Page,
    public readonly t: TFunction,
  ) {}

  getPreviousWeekButton() {
    return this.page.getByRole("button", { name: this.t("controls.aria.prevWeek") });
  }

  getNextWeekButton() {
    return this.page.getByRole("button", { name: this.t("controls.aria.nextWeek") });
  }

  getCurrentWeekButton() {
    return this.page.getByRole("button", { name: this.t("controls.aria.currentWeek") });
  }
}
