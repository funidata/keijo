import { Page } from "@playwright/test";

export class AppBar {
  constructor(
    public readonly page: Page,
    public readonly t: any,
  ) {}

  getAddEntryButton() {
    return this.page
      .getByRole("banner")
      .getByRole("button", { name: this.t("entryDialog.title.create") });
  }

  async openEntryForm() {
    return this.getAddEntryButton().click();
  }
}
