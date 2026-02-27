import { useEffect } from "react";
import i18n from "../i18n";
import { useUIStore } from "../store/uiStore";

export default function AppLanguageSync() {
  const language = useUIStore((state) => state.language);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language]);

  return null;
}
