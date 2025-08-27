import { JSX } from "react";
import React from "react";
import { Nullable } from "@declarations/nullable/nullable.type";
import { FetchHomepageDataResponse } from "@declarations/homepage/homepage.type";
import { useLocale } from "@hooks/useLocale";
import { ArrowButton } from "@components/ArrowButton/ArrowButton";
import { useHorizontalScroll } from "@hooks/useHorizontalScroll";
import {
  MostSoldDeviceModel,
  MostSoldDeviceModelProps,
} from "./components/MostSoldDeviceModel/MostSoldDeviceModel";

export type MostSoldDevicesProps = {
  homePageData: FetchHomepageDataResponse;
};

export const MostSoldDevices = ({
  homePageData,
}: MostSoldDevicesProps): Nullable<JSX.Element> => {
  const { language, isRTL } = useLocale();

  const { scrollRef, scrollLeft, scrollRight, atStart, atEnd } =
    useHorizontalScroll();

  const mostSoldModels: MostSoldDeviceModelProps[] =
    homePageData.mostSoldModels.map((mostSoldModel) => {
      const name =
        language === "ar" ? mostSoldModel.arName : mostSoldModel.enName;

      return {
        img: {
          src: mostSoldModel.modelIcon,
          alt: name,
        },
        name: name,
      };
    });

  const leftButton = isRTL ? (
    <ArrowButton
      variation="right"
      onClick={scrollRight}
      disabled={atStart}
      className="hidden md:flex"
    />
  ) : (
    <ArrowButton
      variation="left"
      onClick={scrollLeft}
      disabled={atStart}
      className="hidden md:flex"
    />
  );

  const rightButton = isRTL ? (
    <ArrowButton
      variation="left"
      onClick={scrollLeft}
      disabled={atEnd}
      className="hidden md:flex"
    />
  ) : (
    <ArrowButton
      variation="right"
      onClick={scrollRight}
      disabled={atEnd}
      className="hidden md:flex"
    />
  );

  return (
    <div className="flex flex-col gap-10 py-5 bg-gray-50">
      <div className="flex justify-between gap-5 items-center container mx-auto">
        <h3 className="text-xl md:text-4xl text-black font-bold">
          Most Sold Devices
        </h3>
        <div className="gap-5 hidden md:flex">
          {leftButton}
          {rightButton}
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex flex-row gap-5 overflow-x-auto scroll-smooth container mx-auto pb-5 no-scrollbar"
      >
        {mostSoldModels.map((mostSoldModel, index) => (
          <MostSoldDeviceModel {...mostSoldModel} key={index} />
        ))}
      </div>
    </div>
  );
};
