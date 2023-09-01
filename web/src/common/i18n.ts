"use client";
import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18next
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          asd: "Hello, world!",
        },
      },
      fi: {
        translation: {
          asd: "Moikka, maailma!",
        },
      },
    },
    fallbackLng: "en",
  });
