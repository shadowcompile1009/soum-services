import React, { AnchorHTMLAttributes } from "react";
import { JSX } from "react";

export type ButtonProps = {
  children?: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  link?: Pick<
    AnchorHTMLAttributes<unknown>,
    "href" | "hrefLang" | "target" | "aria-label"
  >;
};

export const Button = ({
  children,
  onClick,
  disabled,
  className,
  link,
}: ButtonProps): JSX.Element => {
  if (link) {
    return (
      <a
        className={`text-base py-3 px-10 rounded-xl ${
          disabled
            ? "text-black bg-gray-50"
            : "bg-[#04196c] text-white hover:bg-blue-700"
        } ${className}`}
        onClick={onClick}
        {...link}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={`text-base py-3 px-10 rounded-xl ${
        disabled
          ? "text-black bg-gray-50"
          : "bg-[#04196c] text-white hover:bg-blue-700"
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
