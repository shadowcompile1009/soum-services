import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";
import React, { JSX } from "react";

export const AppStoreButton = (): JSX.Element => {
  return (
    <a
      href="https://apps.apple.com/sa/app/soum-%D8%B3%D9%80%D9%88%D9%85/id1580930409"
      target="_blank"
      className="flex p-5 gap-1 justify-between text-white border border-white rounded w-[176px] h-[69px] items-center"
    >
      <img
        loading="lazy"
        src={getCloudImageUrl("/app-store-icon.svg")}
        alt=""
        width={32}
        height={32}
      />
      <div className="flex flex-col gap-1 w-[88px]">
        <span className="text-xs font-normal">Get it now</span>
        <span className="text-sm font-medium">App Store</span>
      </div>
    </a>
  );
};
