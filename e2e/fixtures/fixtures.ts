import { mergeTests } from "@playwright/test";
import { appBarFixture } from "./app-bar/app-bar.fixture";
import { dayjsFixture } from "./dayjs.fixture";
import { i18nFixture } from "./i18n.fixture";

export const test = mergeTests(dayjsFixture, i18nFixture, appBarFixture);
