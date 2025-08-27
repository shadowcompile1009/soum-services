import React from "react";
import { JSX } from "react";
import { BiError } from "react-icons/bi";

export type AlertProps = {
  type?: "error" | "info";
  children?: React.ReactNode[];
  showIcon?: boolean;
};

export const Alert = ({
  type = "error",
  children,
  showIcon = true,
}: AlertProps): JSX.Element => {
  return (
    <div
      className={`w-full flex gap-5 rounded-lg p-5 text-sm ${
        type === "info" ? "text-blue-600 bg-sky-50" : "text-red-600 bg-rose-50"
      }`}
    >
      {showIcon && (
        <div>
          <BiError className="text-base" />
        </div>
      )}
      <div className="flex flex-col flex-1">
        {children?.map((child, index) => {
          return (
            <div className="w-full" key={index}>
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
};
