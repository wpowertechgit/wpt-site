import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en.json";
import roTranslations from "./locales/ro.json";
import huTranslations from "./locales/hu.json";

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: enTranslations },
        ro: { translation: roTranslations },
        hu: { translation: huTranslations }

    },
    lng: "en",
    showSupportNotice: false,
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
