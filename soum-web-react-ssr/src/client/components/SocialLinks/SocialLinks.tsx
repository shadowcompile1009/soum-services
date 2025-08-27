import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";
import React, { JSX } from "react";
import { Link } from "react-router-dom";

export type SocialLinksProps = {
  size?: number;
};

export const SocialLinks = ({ size = 24 }: SocialLinksProps): JSX.Element => {
  return (
    <div className="flex justify-between gap-3">
      {[
        {
          src: "/facebook-icon.svg",
          href: "https://www.facebook.com/share/Fyx7stVSnvDNCkto/?mibextid=qi2Omg",
          "aria-label": "",
        },
        {
          src: "/x-icon.svg",
          href: "https://x.com/Soum_online",
          "aria-label": "",
        },
        {
          src: "/instagram-icon.svg",
          href: "https://www.instagram.com/soum_online/",
          "aria-label": "",
        },
        {
          src: "/tiktok-icon.svg",
          href: "https://www.tiktok.com/@soum_online",
          "aria-label": "",
        },
        {
          src: "/linkedin-icon.svg",
          href: "https://www.linkedin.com/company/soum-sa",
          "aria-label": "",
        },
      ].map((item, index) => {
        return (
          <a key={index} href={item.href} target="_blank">
            <img
              src={getCloudImageUrl(item.src)}
              alt={item["aria-label"]}
              height={size}
              width={size}
              className="scale-100 hover:scale-150 duration-300 delay-50"
              loading="lazy"
            />
          </a>
        );
      })}
    </div>
  );
};
