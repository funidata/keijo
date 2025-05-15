import test from "@playwright/test";
import { TFunction } from "../i18n.fixture";
import { EntryForm } from "./entry-form";

export const entryFormFixture = test.extend<{ entryForm: EntryForm; t: TFunction }>({
  entryForm: async ({ page, t }, use) => {
    const ef = new EntryForm(page, t);
    await use(ef);
  },
});
