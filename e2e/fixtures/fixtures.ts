import { mergeTests } from "@playwright/test";
import { appBarFixture } from "./app-bar/app-bar.fixture";
import { authFixture } from "./auth.fixture";
import { browserControlsFixture } from "./browser-controls/browser-controls.fixture";
import { dayjsFixture } from "./dayjs.fixture";
import { entryFormFixture } from "./entry-form/entry-form.fixture";
import { i18nFixture } from "./i18n.fixture";

export const test = mergeTests(
  authFixture,
  dayjsFixture,
  i18nFixture,
  appBarFixture,
  browserControlsFixture,
  entryFormFixture,
);
