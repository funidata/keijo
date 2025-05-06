import test from "@playwright/test";
import { AppBar } from "./app-bar";

export const appBarFixture = test.extend<{ appBar: AppBar }>({
  appBar: async ({ page }, use) => {
    const appBar = new AppBar(page);
    await use(appBar);
  },
});
