import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "./resources";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ar",
    preload: ["ar", "en"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["path"],
      lookupFromPathIndex: 0,
    },
  });

export default i18n;
