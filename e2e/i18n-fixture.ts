import { createI18nFixture } from "playwright-i18next-fixture";
import en from "translations/en";
import fi from "translations/fi";

export const i18nFixture = createI18nFixture({
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
