import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import vi from "./locales/vi";
import en from "./locales/en";
import { Resource, ResourceLanguage } from "i18next";

const resources: Resource = {
    vi: vi as unknown as ResourceLanguage,
    en: en as unknown as ResourceLanguage,
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "vi",
        detection: {
            order: ["localStorage", "navigator"], // Ưu tiên localStorage
            caches: ["localStorage"], // Lưu ngôn ngữ vào localStorage
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;