import React from "react";
import { useLocale } from "@hooks/useLocale";
import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";

export const LanguageSwitcher = () => {
  const { language, onSwitchLanguage } = useLocale();

  return (
    <button
      className="ml-5 flex gap-1 text-base font-normal text-[#04196c] hover:text-blue-600"
      onClick={onSwitchLanguage}
    >
      {language === "en" ? "عربي" : "English"}
      <img
        src={getCloudImageUrl("/language.svg")}
        alt=""
        height={20}
        loading="lazy"
      />
    </button>
  );
};
