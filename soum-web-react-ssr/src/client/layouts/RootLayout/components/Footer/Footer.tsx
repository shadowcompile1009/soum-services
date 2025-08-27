import { FooterHeader } from "./components/FooterHeader/FooterHeader";
import { FooterInfo } from "./components/FooterInfo/FooterInfo";
import { FooterTopCategory } from "./components/FooterTopCategory/FooterTopCategory";
import { FooterQuckActions } from "./components/FooterQuckActions/FooterQuckActions";
import { FooterDownloadApp } from "./components/FooterDownloadApp/FooterDownloadApp";
import { FooterPaymentMethodsAndSocialLinks } from "./components/FooterPaymentMethodsAndSocialLinks/FooterPaymentMethodsAndSocialLinks";
import { FooterCopyright } from "./components/FooterCopyright/FooterCopyright";
import React, { JSX } from "react";

export const Footer = (): JSX.Element => {
  return (
    <div className="flex flex-col">
      <div className="w-full bg-blue-50">{<FooterHeader />}</div>
      <div className="bg-[#04196c] w-full text-white flex flex-col">
        <div className="max-w-screen-xl grid grid-cols-1 md:grid-cols-5 grid-flow-row m-auto gap-10 md:gap-5 py-20 px-10 md:px-5">
          <FooterInfo />
          <FooterTopCategory />
          <FooterQuckActions />
          <FooterDownloadApp />
          <FooterPaymentMethodsAndSocialLinks />
        </div>
        <div className="w-full border-t border-neutral-700 flex justify-center">
          <FooterCopyright />
        </div>
      </div>
    </div>
  );
};
