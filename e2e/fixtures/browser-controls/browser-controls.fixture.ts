import test from "@playwright/test";
import { TFunction } from "../i18n.fixture";
import { BrowserControls } from "./browser-controls";

export const browserControlsFixture = test.extend<{
  browserControls: BrowserControls;
  t: TFunction;
}>({
  browserControls: async ({ page, t }, use) => {
    const bc = new BrowserControls(page, t);
    await use(bc);
  },
});
