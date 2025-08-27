import { AppStoreButton } from "@components/AppStoreButton/AppStoreButton";
import { GooglePlayButton } from "@components/GooglePlayButton/GooglePlayButton";
import React from "react";
import { JSX } from "react";

export const FooterDownloadApp = (): JSX.Element => {
  return (
    <div className="flex flex-col gap-3 font-light text-sm mx-0 md:mx-auto">
      <span className="font-medium mb-1 text-base">Download App</span>
      <GooglePlayButton />
      <AppStoreButton />
    </div>
  );
};
