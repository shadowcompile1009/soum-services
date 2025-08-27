import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";
import React from "react";
import { JSX } from "react";

export type FeatureProps = {
  img: {
    src: string;
    alt: string;
  };
  title: string;
  text: string;
};

export const Feature = ({ img, title, text }: FeatureProps): JSX.Element => {
  return (
    <div className="flex gap-3 bg-gray-50 px-0 md:px-2 py-5 md:py-0 border rounded-lg md:rounded-none md:border-0 border-[#04196c]">
      <img
        alt={img.alt}
        src={getCloudImageUrl(img.src)}
        className="mx-2 size-[40px] mt-2"
        loading="lazy"
      />
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-[#04196c]">{title}</h3>
        <p className="text-xs md:text-base text-gray-600 font-light">{text}</p>
      </div>
    </div>
  );
};
