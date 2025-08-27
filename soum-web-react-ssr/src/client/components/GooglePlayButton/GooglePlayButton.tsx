import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";
import React, { JSX } from "react";

export const GooglePlayButton = (): JSX.Element => {
  return (
    <a
      href="https://play.google.com/store/apps/details?id=com.soum.sa"
      target="_blank"
      className="flex p-5 gap-1 justify-between text-white border border-white rounded w-[176px] h-[69px] items-center"
    >
      <img
        src={getCloudImageUrl("/google-play-icon.svg")}
        alt=""
        width={32}
        height={32}
        loading="lazy"
      />
      <div className="flex flex-col gap-1 w-[88px]">
        <span className="text-xs font-normal">Get it now</span>
        <span className="text-sm font-medium">Google Play</span>
      </div>
    </a>
  );
};
