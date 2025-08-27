import { SocialLinks } from "@components/SocialLinks/SocialLinks";
import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";
import { JSX } from "react";
import React from "react";

export const FooterPaymentMethodsAndSocialLinks = (): JSX.Element => {
  return (
    <div className="flex flex-col gap-10 font-light text-sm mx-0 md:mx-auto">
      <div className="flex flex-col gap-3">
        <span className="font-medium mb-1 text-base">Payment Methods</span>
        <img
          src={getCloudImageUrl("/payment-methods.svg")}
          alt=""
          height={30}
          width={273.17}
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-medium mb-1 text-base">Follow Us</span>
        <SocialLinks />
      </div>
    </div>
  );
};
