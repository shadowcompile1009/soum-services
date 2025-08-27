import { JSX } from "react";
import React from "react";
import { Nullable } from "@declarations/nullable/nullable.type";
import { FetchHomepageDataResponse } from "@declarations/homepage/homepage.type";
import {
  ImageCarousel,
  ImageCarouselProps,
} from "@components/ImageCarousel/ImageCarousel";
import { useLocale } from "@hooks/useLocale";
import { getBannerLink } from "@utils/link/link";

export type TopBannersSectionProps = {
  homePageData: FetchHomepageDataResponse;
};

export const TopBannersSection = ({
  homePageData,
}: TopBannersSectionProps): Nullable<JSX.Element> => {
  const { language } = useLocale();

  const slides: ImageCarouselProps["slides"] = (
    (language == "ar" ? homePageData.banners?.ar : homePageData.banners?.en) ??
    []
  )
    .filter(
      (banner) =>
        banner.bannerPage === "seo" &&
        banner.bannerPosition === "upper" &&
        banner.bannerName.includes("$$$")
    )
    .map((banner) => {
      return {
        src: banner.bannerImage,
        alt: banner.bannerName,
        link: {
          href: getBannerLink(language, banner),
          hrefLang: language,
          "aria-label": banner.bannerName,
        },
      };
    });

  return (
    <div className="flex flex-col">
      <ImageCarousel slides={slides} />
    </div>
  );
};
