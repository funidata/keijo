import test from "@playwright/test";
import { TFunction } from "../i18n.fixture";
import { EntryBrowser } from "./entry-browser";

export const entryBrowserFixture = test.extend<{ entryBrowser: EntryBrowser; t: TFunction }>({
  entryBrowser: async ({ page, t }, use) => {
    const ebOnSiististiCool = new EntryBrowser(page, t);
    await use(ebOnSiististiCool);
  },
});
