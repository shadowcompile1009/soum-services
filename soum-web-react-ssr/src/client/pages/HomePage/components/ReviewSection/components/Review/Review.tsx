import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";
import React from "react";
import { JSX } from "react";

export type ReviewProps = {
  name: string;
  rating: number;
  title: string;
  description: string;
};

export const Review = ({
  rating,
  name,
  title,
  description,
}: ReviewProps): JSX.Element => {
  const fullStars = rating;

  const emptyStars = 5 - fullStars;

  return (
    <div className="flex flex-col gap-3 shadow-lg p-10 rounded-lg">
      <div className="flex flex-row gap-5">
        <div className="rounded-full bg-sky-100 size-[48px] flex justify-center items-center">
          {name}
        </div>
        <div className="flex flex-col gap-2">
          <p>{name}</p>
          <div className="flex gap-1">
            {new Array(fullStars).fill(1).map((_, index) => {
              return (
                <img
                  key={index}
                  alt=""
                  src={getCloudImageUrl("/star-full-icon.svg")}
                  loading="lazy"
                />
              );
            })}
            {new Array(emptyStars).fill(1).map((_, index) => {
              return (
                <img
                  key={index}
                  alt=""
                  src={getCloudImageUrl("/star-empty-icon.svg")}
                  loading="lazy"
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-md font-bold text-[#04196c]">{title}</h3>
        <p className="text-sm text-gray-600 font-light text-justify w-[300px]">
          {description}
        </p>
      </div>
    </div>
  );
};
