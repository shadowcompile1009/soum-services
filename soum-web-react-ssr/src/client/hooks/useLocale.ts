import i18n from "@i18n";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface LocaleHook {
  language: string;
  onSwitchLanguage: () => void;
  isRTL: boolean;
  isLTR: boolean;
}

export const useLocale = (): LocaleHook => {
  const [language, setLanguage] = useState(i18n.language);

  const location = useLocation();

  const isRTL = language == "ar";

  const isLTR = language == "en";

  const onSwitchLanguage = (): void => {
    const url =
      language == "ar"
        ? `/en${location.pathname == "/" ? "" : location.pathname}`
        : location.pathname.replace("/en", "/");

    window.location.replace(url);
  };

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguage(lng);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  return {
    language,
    onSwitchLanguage,
    isRTL,
    isLTR,
  };
};
