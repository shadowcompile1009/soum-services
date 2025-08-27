import { Nullable } from "@declarations/nullable/nullable.type";
import React from "react";
import { JSX } from "react";

export type DotCarouselProps = {
  total: number;
  currentIndex: number;
  OnClick?: (page: number) => void;
};

export const DotCarousel = ({
  total,
  currentIndex,
  OnClick,
}: DotCarouselProps): Nullable<JSX.Element> => {
  if (total <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-4">
      {new Array(total).fill(1).map((_, index) => (
        <button
          key={index}
          onClick={OnClick?.bind(null, index)}
          className={`size-3 rounded-full mx-1 ${
            index === currentIndex ? "bg-[#04196c]" : "bg-gray-400"
          }`}
        ></button>
      ))}
    </div>
  );
};
