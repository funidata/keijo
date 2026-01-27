import { Page } from "@playwright/test";
import { TFunction } from "../i18n.fixture";

export class AppBar {
  constructor(
    public readonly page: Page,
    public readonly t: TFunction,
    public readonly isMobile: boolean,
  ) {}

  getAddEntryButton() {
    if (this.isMobile) {
      return this.page
        .getByRole("list")
        .getByRole("button", { name: this.t("entryDialog.title.create") });
    }
    return this.page
      .getByRole("banner")
      .getByRole("button", { name: this.t("entryDialog.title.create") });
  }

  getDarkModeButton() {
    if (this.isMobile) {
      return this.page.getByRole("listitem").filter({ hasText: this.t("controls.useDarkMode") });
    }
    return this.page
      .getByRole("banner")
      .getByRole("button", { name: this.t("controls.useDarkMode") });
  }

  getJiraConnectButton() {
    if (this.isMobile) {
      return this.page.getByRole("button", { name: this.t("controls.jiraConnect") });
    }
    return this.page.getByRole("menuitem", { name: this.t("controls.jiraConnect") });
  }

  getJiraDisonnectButton() {
    if (this.isMobile) {
      return this.page.getByRole("button", { name: this.t("controls.jiraDisconnect") });
    }
    return this.page.getByRole("menuitem", { name: this.t("controls.jiraDisconnect") });
  }

  getMenuButton() {
    return this.page
      .getByRole("banner")
      .getByRole("button", { name: this.t("controls.settingsMenu") });
  }

  async openMobileMenuOptional() {
    const menuOpen = await this.getAddEntryButton().isVisible();

    if (this.isMobile && !menuOpen) {
      await this.page.getByRole("button", { name: this.t("controls.openMenu") }).click();
    }
  }

  async openEntryForm() {
    await this.openMobileMenuOptional();
    return this.getAddEntryButton().click();
  }

  async clickDarkModeButton() {
    this.openMobileMenuOptional();
    await this.getDarkModeButton().click();
  }

  async openDesktopMenuOptional() {
    if (!this.isMobile) {
      return this.getMenuButton().click();
    }
  }

  async clickJiraConnectButton() {
    this.openMobileMenuOptional();
    this.openDesktopMenuOptional();
    await this.getJiraConnectButton().click();
  }

  async clickJiraDisonnectButton() {
    this.openMobileMenuOptional();
    this.openDesktopMenuOptional();
    await this.getJiraDisonnectButton().click();
  }
}
