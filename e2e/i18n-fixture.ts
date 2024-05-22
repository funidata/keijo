import { test as base } from "@playwright/test";
import { createI18nFixture, getI18nInstance } from "playwright-i18next-fixture";
import en from "../web/src/i18n/en";
import fi from "../web/src/i18n/fi";

const i18nFixture = createI18nFixture({
  // i18n configuration options
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
  // Fetch translations in every test or fetch once
  // Default: true
  cache: true,
  // Run as auto fixture to be available through all tests by getI18nInstance()
  // Default: true
  auto: true,
});

export const test = base.extend(i18nFixture);
