"use client";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).init({
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
  lng: "en",
});
