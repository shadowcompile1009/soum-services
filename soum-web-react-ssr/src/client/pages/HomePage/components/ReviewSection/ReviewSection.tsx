import React from "react";
import { JSX } from "react";
import { Review, ReviewProps } from "./components/Review/Review";
import { useHorizontalScroll } from "@hooks/useHorizontalScroll";
import { ArrowButton } from "@components/ArrowButton/ArrowButton";
import { useLocale } from "@hooks/useLocale";
import { DotCarousel } from "@components/DotCarousel/DotCarousel";

export const ReviewSection = (): JSX.Element => {
  const { isRTL } = useLocale();

  const { scrollRef, scrollLeft, scrollRight, atStart, atEnd, pages, page } =
    useHorizontalScroll();

  const reviews: ReviewProps[] = [
    {
      rating: 5,
      name: "مها",
      title: "كل التوفيق لجهودكم والى الأمام.",
      description:
        "الله يسعدكم خدمتكم كافيه ووافيه وأفضل واسرع من مواقع عديده تعاملت معها 💜 كل التوفيق لجهودكم والى الأمام.",
    },
    {
      rating: 5,
      name: "شهد",
      title: "عجبني سرعة الانجاز وسرعة التجاوب",
      description:
        "اللي عجبني سرعة الانجاز وسرعة التجاوب  توحسن التعامل كل شي في امان وثقة واشكر فريق العمل وكل القائمين وبصراحة هاذي فكرة سوم ممتازه من زمان كنت اتمنى يكون مثل هاذي المنصه الناجحة سوم شكرالك سوم",
    },
    {
      rating: 5,
      name: "منيرة",
      title: "الخدمة ممتازة جداً والتعامل راقي",
      description:
        "الخدمة ممتازة جداً والتعامل راقي ، اشكركم جزيل الشكر واتمنى ان اكون جزء من سوم وخدمة العملاء لحبي تجاوب مع الناس وافادتهم ورضاهم وخبرتي السابقة بذلك",
    },
    {
      rating: 5,
      name: "منيرة",
      title: "الخدمة ممتازة جداً والتعامل راقي",
      description:
        "الخدمة ممتازة جداً والتعامل راقي ، اشكركم جزيل الشكر واتمنى ان اكون جزء من سوم وخدمة العملاء لحبي تجاوب مع الناس وافادتهم ورضاهم وخبرتي السابقة بذلك",
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
        <h3 className="text-xl md:text-4xl text-black font-bold">
          Soum Costumer Reviews
        </h3>
        <div className="gap-5 hidden md:flex">
          {leftButton}
          {rightButton}
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex flex-row gap-5 overflow-x-auto scroll-smooth w-full pb-5 no-scrollbar"
      >
        {reviews.map((review, index) => {
          return <Review {...review} key={index} />;
        })}
      </div>
      <DotCarousel total={pages} currentIndex={page - 1} />
    </div>
  );
};
