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

/**
 * Dummy `t` function type.
 *
 * `playwright-i18next-fixture` does not export the `TFunction` type definition.
 * This is not the full type, rather just a crude approximation of the only
 * way we use it.
 */
export type TFunction = (
  key: string,
  options?: Record<string, any> & { interpolation?: { escapeValue?: boolean } },
) => string;
