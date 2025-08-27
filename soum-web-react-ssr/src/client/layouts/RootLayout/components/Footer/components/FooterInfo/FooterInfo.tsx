import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";
import React from "react";
import { JSX } from "react";

export const FooterInfo = (): JSX.Element => {
  return (
    <div className="flex flex-col gap-5 md:gap-7 font-light text-sm mx-0 md:mx-auto ">
      <div className="flex flex-col gap-5">
        <div className="flex gap-3 items-center">
          <img
            src={getCloudImageUrl("/logo.svg")}
            height={105}
            width={150}
            alt=""
            loading="lazy"
          />
        </div>
        <span className="text-base text-justify">
          Soum ensures your right to buy and sell used devices, with trust &
          security
        </span>
      </div>
      <div className="flex gap-2 flex-col">
        <span className="font-medium">Tax Number</span>
        <div className="flex gap-3 items-center">
          <img
            src={getCloudImageUrl("/vat.svg")}
            alt=""
            width={12}
            height={16}
          />
          <span>310985751500003</span>
        </div>
      </div>
      <div className="flex gap-2 flex-col">
        <span className="font-medium">Registered by Ministry of Commerce</span>
        <span>Maroof No: 221919</span>
      </div>
    </div>
  );
};
