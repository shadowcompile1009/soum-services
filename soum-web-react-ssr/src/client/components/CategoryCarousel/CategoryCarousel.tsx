import { useHorizontalScroll } from "@hooks/useHorizontalScroll";
import { ArrowButton } from "@components/ArrowButton/ArrowButton";
import { FetchCategoriesResponse } from "@declarations/category/category.type";
import { JSX } from "react";
import React from "react";
import { useLocale } from "@hooks/useLocale";
import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";
import { getCategoryLink } from "@utils/link/link";

export type CategoryCarouselProps = {
  categories: FetchCategoriesResponse["responseData"];
};

export const CategoryCarousel = ({
  categories,
}: CategoryCarouselProps): JSX.Element => {
  const { isRTL, language } = useLocale();

  const { scrollRef, scrollLeft, scrollRight, atStart, atEnd } =
    useHorizontalScroll();

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
    <div className="flex flex-row items-center gap-5 w-full">
      {leftButton}
      <div
        ref={scrollRef}
        className="flex gap-1 whitespace-nowrap overflow-x-auto scroll-smooth no-scrollbar w-full my-1"
      >
        {categories.map((category, index) => {
          return (
            <a
              lang={language}
              href={getCategoryLink(language, category)}
              key={index}
              className="flex flex-col gap-1 items-center p-5 border md:hover:border-blue-600 border-white rounded"
              aria-label=""
            >
              <img
                src={getCloudImageUrl(category.mini_category_icon)}
                alt=""
                className="h-[20px] w-[30px]"
                loading="lazy"
              />
              <span className="font-medium text-nowrap">
                {category.category_name}
              </span>
            </a>
          );
        })}
      </div>
      {rightButton}
    </div>
  );
};
