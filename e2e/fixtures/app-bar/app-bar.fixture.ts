import test from "@playwright/test";
import { TFunction } from "../i18n.fixture";
import { AppBar } from "./app-bar";

export const appBarFixture = test.extend<{ appBar: AppBar; t: TFunction }>({
  appBar: async ({ page, t }, use) => {
    const appBar = new AppBar(page, t);
    await use(appBar);
  },
});
