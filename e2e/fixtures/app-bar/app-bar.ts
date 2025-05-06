import { Page } from "@playwright/test";

export class AppBar {
  constructor(public readonly page: Page) {}

  getAddEntryButton() {
    return (
      this.page
        .getByRole("banner")
        // FIXME: t
        // .getByRole("button", { name: t("entryDialog.title.create") })
        .getByRole("button", { name: "Add New Entry" })
    );
  }

  async openEntryForm() {
    return this.getAddEntryButton().click();
  }
}
