import React from "react";
import { JSX } from "react";
import { News, NewsProps } from "./components/News/News";
import { useHorizontalScroll } from "@hooks/useHorizontalScroll";
import { ArrowButton } from "@components/ArrowButton/ArrowButton";
import { useLocale } from "@hooks/useLocale";
import { DotCarousel } from "@components/DotCarousel/DotCarousel";

export const NewsSection = (): JSX.Element => {
  const { isRTL } = useLocale();

  const { scrollRef, scrollLeft, scrollRight, atStart, atEnd, pages, page } =
    useHorizontalScroll();

  const news: NewsProps[] = [
    {
      img: {
        src: "https://cdn.soum.sa/homepage-assets/home_page_image_1.png",
        alt: "",
      },
      title:
        "Soum, a Saudi-based online marketplace, successfully raises $18 million in its Series A funding round.",
      description:
        "Soum, a Saudi-based online marketplace for secondhand products, has secured $18 million in a series A funding round led by Jahez, with participation from Isometry Capital and existing investors. Founded in 2021, Soum has seen rapid growth, achieving a 40-fold sales increase and surpassing 4 million app downloads in Saudi Arabia. The funding will support its expansion across the region and diversification into new product categories, aiming to capitalize on a market estimated at $40 billion.",
    },
    {
      img: {
        src: "https://cdn.soum.sa/homepage-assets/home_page_image_2.jpeg",
        alt: "",
      },
      title:
        "The Saudi e-commerce platform, Soum, secures $18 million in Series A funding.",
      description:
        "Soum, a re-commerce platform based in Saudi Arabia, has raised $18 million in Series A funding led by Jahez Group to expand across the MENA region, starting with the UAE. Founded in 2021, Soum aims to broaden its product categories beyond electronics to include automobiles and collectibles, leveraging its streamlined marketplace model to enhance convenience and trust for users. The funding underscores Soum's strategic focus on capturing the growing demand for sustainable and cost-effective shopping solutions in the MENA re-commerce market.",
    },
    {
      img: {
        src: "https://www.arabianbusiness.com/cloud/2023/12/22/SOUM.jpg",
        alt: "",
      },
      title:
        "In a Series A round, Saudi Arabia's online marketplace, Soum, garners $18 million.",
      description:
        "Soum, based in Riyadh, has secured $18 million in Series A funding led by Jahez, with participation from Isometry Capital and existing investors Khwarizmi Ventures, Alrajhi Partners, and Outliers Venture Capital. Founded by Fahad Al Hassan, Bader Almubarak, and Fahad Albassam in 2021, Soum has rapidly grown its marketplace for secondhand products, achieving a 40-fold increase in sales and expanding its presence across Saudi Arabia and the UAE. This funding will support Soum's regional expansion and diversification into new product categories, aiming to tap into a $40 billion market across the MENA region.",
    },
    {
      img: {
        src: "https://cdn.soum.sa/homepage-assets/home_page_image_4.jpeg",
        alt: "",
      },
      title:
        "Soum, a leading Saudi marketplace, has closed its Series A funding round with $18 million raised",
      description:
        "Saudi Arabia-based used-electronics platform Soum has raised $18 million in a Series A funding round, the company announced in a LinkedIn post on Thursday.",
    },
    {
      img: {
        src: "https://cdn.soum.sa/homepage-assets/home_page_image_4.jpeg",
        alt: "",
      },
      title:
        "Soum, a leading Saudi marketplace, has closed its Series A funding round with $18 million raised",
      description:
        "Saudi Arabia-based used-electronics platform Soum has raised $18 million in a Series A funding round, the company announced in a LinkedIn post on Thursday.",
    },
    {
      img: {
        src: "https://cdn.soum.sa/homepage-assets/home_page_image_4.jpeg",
        alt: "",
      },
      title:
        "Soum, a leading Saudi marketplace, has closed its Series A funding round with $18 million raised",
      description:
        "Saudi Arabia-based used-electronics platform Soum has raised $18 million in a Series A funding round, the company announced in a LinkedIn post on Thursday.",
    },
    {
      img: {
        src: "https://cdn.soum.sa/homepage-assets/home_page_image_4.jpeg",
        alt: "",
      },
      title:
        "Soum, a leading Saudi marketplace, has closed its Series A funding round with $18 million raised",
      description:
        "Saudi Arabia-based used-electronics platform Soum has raised $18 million in a Series A funding round, the company announced in a LinkedIn post on Thursday.",
    },
    {
      img: {
        src: "https://cdn.soum.sa/homepage-assets/home_page_image_4.jpeg",
        alt: "",
      },
      title:
        "Soum, a leading Saudi marketplace, has closed its Series A funding round with $18 million raised",
      description:
        "Saudi Arabia-based used-electronics platform Soum has raised $18 million in a Series A funding round, the company announced in a LinkedIn post on Thursday.",
    },
  ];

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
    <div className="flex flex-col gap-10 py-5">
      <div className="flex justify-between gap-5 items-center">
        <h3 className="text-xl md:text-4xl text-black font-bold">News</h3>
        <div className="gap-5 hidden md:flex">
          {leftButton}
          {rightButton}
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex flex-row gap-5 overflow-x-auto scroll-smooth w-full pb-5 no-scrollbar"
      >
        {news.map((item, index) => {
          return <News {...item} key={index} />;
        })}
      </div>
      <DotCarousel total={pages} currentIndex={page - 1} />
    </div>
  );
};
