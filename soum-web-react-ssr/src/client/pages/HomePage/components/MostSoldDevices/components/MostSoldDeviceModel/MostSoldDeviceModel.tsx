import { useLocale } from "@hooks/useLocale";
import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";
import React from "react";
import { JSX } from "react";

export type MostSoldDeviceModelProps = {
  img: {
    src: string;
    alt: string;
  };
  name: string;
};

export const MostSoldDeviceModel = ({
  img,
  name,
}: MostSoldDeviceModelProps): JSX.Element => {
  const { isRTL } = useLocale();
  return (
    <div
      className={`bg-white flex flex-row gap-2 p-5 items-center ${
        isRTL ? "min-w-80" : "min-w-72"
      }`}
    >
      <img
        src={getCloudImageUrl(img.src)}
        alt={img.alt}
        className="h-[96px]"
        loading="lazy"
      />
      <h3 className="font-bold text-black text-lg ">{name}</h3>
    </div>
  );
};
