import test from "@playwright/test";
import { createI18nFixture } from "playwright-i18next-fixture";
import en from "translations/en";
import fi from "translations/fi";

export const i18nFixture = test.extend(
  createI18nFixture({
    options: {
      lng: "en",
      resources: {
        en: {
          translation: en,
        },
        fi: {
          translation: fi,
        },
      },
    },
  }),
);
