import React from "react";
import { JSX } from "react";

export const FooterQuckActions = (): JSX.Element => {
  return (
    <div className="flex flex-col gap-3 font-light text-sm mx-0 md:mx-auto">
      <span className="font-medium mb-1 text-base">Quick Actions</span>
      {[
        "Sell",
        "Shipping",
        "Process Sales",
        "Blog",
        "Contact us",
        "Privacy Policy",
      ].map((item, index) => {
        return (
          <span key={index} className="font-medium text-neutral-400">
            {item}
          </span>
        );
      })}
    </div>
  );
};
