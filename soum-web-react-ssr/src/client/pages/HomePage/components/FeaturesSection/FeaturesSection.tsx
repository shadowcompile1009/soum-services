import React from "react";
import { JSX } from "react";
import { Feature, FeatureProps } from "./component/Feature/Feature";

export const FeaturesSection = (): JSX.Element => {
  const features: FeatureProps[] = [
    {
      img: {
        src: "/box-add-icon.svg",
        alt: "",
      },
      title: "Deliver Anywhere",
      text: "Delivery to all regions and villages in Saudi Arabia",
    },
    {
      img: {
        src: "/shield-tick-icon.svg",
        alt: "",
      },
      title: "Soum Guarantee",
      text: "100% money-back guarantee for any reason",
    },
    {
      img: {
        src: "/wallet-check-icon.svg",
        alt: "",
      },
      title: "Safe Payment Methods",
      text: "Buy now with Apple Pay, Visa, Mada, or pay in installments",
    },
    {
      img: {
        src: "/messages-icon.svg",
        alt: "",
      },
      title: "Support 24/7",
      text: "If you need any help, feel free to reach out to us",
    },
  ];
  return (
    <div
      dir="ltr"
      className="grid grid-cols-2 md:grid-cols-4 bg-transparent md:bg-gray-50 px-2 py-6 mx-auto gap-5 md:divide-x"
    >
      {features.map((feature, index) => {
        return <Feature {...feature} key={index} />;
      })}
    </div>
  );
};
