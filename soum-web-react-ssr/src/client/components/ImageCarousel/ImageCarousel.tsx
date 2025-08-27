import { DotCarousel } from "@components/DotCarousel/DotCarousel";
import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";
import React, { JSX, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export type ImageCarouselProps = {
  slides: Array<{
    src: string;
    alt: string;
    link?: {
      href: string;
      "aria-label": string;
      hrefLang: string;
    };
  }>;
  autoScrollInterval?: number;
};

export const ImageCarousel = ({
  slides,
  autoScrollInterval = 4500,
}: ImageCarouselProps): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index: number): void => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
      }, autoScrollInterval);

      return () => clearInterval(timer);
    }
  }, [slides.length, autoScrollInterval]);

  return (
    <div className="relative w-full mx-auto">
      <div className="overflow-hidden rounded-lg max-h-2/3">
        <div
          dir="ltr"
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const isFirst = index === 0;

            if (slide.link) {
              return (
                <a
                  hrefLang={slide.link.hrefLang}
                  aria-label={slide.link["aria-label"]}
                  href={slide.link.href}
                  key={index}
                  className="w-full flex-shrink-0"
                >
                  <img
                    src={getCloudImageUrl(slide.src, {
                      quality: 75,
                    })}
                    alt={slide.alt}
                    loading={isFirst ? "eager" : "lazy"}
                    width={"100%"}
                  />
                </a>
              );
            }

            return (
              <img
                key={index}
                src={getCloudImageUrl(slide.src, {
                  quality: 75,
                })}
                alt={slide.alt}
                className="w-full flex-shrink-0"
                loading={isFirst ? "eager" : "lazy"}
              />
            );
          })}
        </div>
      </div>
      <DotCarousel
        total={slides.length}
        currentIndex={currentIndex}
        OnClick={goToSlide}
      />
    </div>
  );
};
