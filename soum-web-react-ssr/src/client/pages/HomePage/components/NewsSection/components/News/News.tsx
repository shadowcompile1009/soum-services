import { Button } from "@components/Button/Button";
import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";
import React from "react";
import { JSX } from "react";

export type NewsProps = {
  img: {
    src: string;
    alt: string;
  };

  title: string;
  description: string;
};

export const News = ({ img, title, description }: NewsProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-lg border-gray-200 border">
      <img
        alt={img.alt}
        src={getCloudImageUrl(img.src)}
        className="h-[250px] py-3"
        loading="lazy"
      />
      <div className="flex flex-col gap-3 flex-1">
        <h3 className="text-sm font-bold text-[#04196c] pb-2 break-all text-justify">
          {title}
        </h3>
        <p className="text-sm text-gray-600 font-light text-justify h-full truncate text-wrap line-clamp-4 grow w-[300px]">
          {description}
        </p>
      </div>
      <Button className="my-5">Read More</Button>
    </div>
  );
};
