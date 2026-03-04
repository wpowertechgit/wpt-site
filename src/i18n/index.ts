import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en.json";
import roTranslations from "./locales/ro.json";

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: enTranslations },
        ro: { translation: roTranslations }
    },
    lng: "en",
    showSupportNotice: false,
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
