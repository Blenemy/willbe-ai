import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { i18n as i18nConfig } from "../next-i18next.config";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
  });

export default i18n;
