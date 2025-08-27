import React from "react";
import { JSX } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

export type ArrowButtonProps = {
  variation: "left" | "right";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export const ArrowButton = ({
  variation,
  onClick,
  disabled,
  className,
}: ArrowButtonProps): JSX.Element => {
  return (
    <button
      className={`text-base p-5 rounded-full ${
        disabled
          ? "text-black bg-gray-50"
          : "bg-[#04196c] text-white hover:bg-blue-700"
      } ${className}`}
      onClick={onClick}
    >
      {variation === "right" ? <FaArrowRight /> : <FaArrowLeft />}
    </button>
  );
};
