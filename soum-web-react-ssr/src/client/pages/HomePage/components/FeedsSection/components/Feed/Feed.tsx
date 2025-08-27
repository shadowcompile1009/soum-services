import React from "react";
import { JSX } from "react";
import { useHorizontalScroll } from "@hooks/useHorizontalScroll";
import { ArrowButton } from "@components/ArrowButton/ArrowButton";
import { useLocale } from "@hooks/useLocale";
import { Link } from "react-router-dom";
import { HomepageDataFeed } from "@declarations/homepage/homepage.type";
import { Product } from "@components/Product/Product";
import { Nullable } from "@declarations/nullable/nullable.type";

export type FeedProps = {
  feed: HomepageDataFeed;
};

export const Feed = ({ feed }: FeedProps): Nullable<JSX.Element> => {
  const { isRTL, language } = useLocale();

  const title = language == "ar" ? feed.arName : feed.enName;

  const { scrollRef, scrollLeft, scrollRight, atStart, atEnd, pages, page } =
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

  if (!feed.items.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10 py-5">
      <div className="flex justify-between gap-5 items-center">
        <h3 className="text-xl md:text-4xl text-black font-bold">{title}</h3>
        <div className="gap-5 hidden md:flex">
          <a href="" className="text-lg font-bold text-blue-600">
            View More
          </a>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex flex-row gap-5 overflow-x-auto scroll-smooth w-full pb-5 no-scrollbar"
      >
        {feed.items.map((item, index) => {
          const images = item.productImages;

          return (
            <Product
              usage="homepage"
              key={index}
              attributes={item.attributes}
              productImages={images}
              originalPrice={item.originalPrice}
              modelName={item.modelName}
              arModelName={item.arModelName}
              productId={item.productId}
              sellPrice={item.sellPrice}
              productImage={item.productImage}
              tags={item.tags}
            />
          );
        })}
      </div>
    </div>
  );
};
