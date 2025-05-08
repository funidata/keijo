import { mergeTests } from "@playwright/test";
import { appBarFixture } from "./app-bar/app-bar.fixture";
import { browserControlsFixture } from "./browser-controls/browser-controls.fixture";
import { dayjsFixture } from "./dayjs.fixture";
import { i18nFixture } from "./i18n.fixture";
import { setupFixture } from "./setup.fixture";

export const test = mergeTests(
  setupFixture,
  dayjsFixture,
  i18nFixture,
  appBarFixture,
  browserControlsFixture,
);
