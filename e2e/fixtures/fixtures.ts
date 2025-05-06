import { mergeTests } from "@playwright/test";
import { i18nFixture } from "../i18n-fixture";
import { dayjsFixture } from "./dayjs.fixture";

export const test = mergeTests(dayjsFixture, i18nFixture);
