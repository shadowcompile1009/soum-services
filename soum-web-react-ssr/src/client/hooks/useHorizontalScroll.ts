import { Nullable } from "@declarations/nullable/nullable.type";
import { RefObject, useEffect, useRef, useState } from "react";

interface HorizontalScrollHook {
  scrollRef: RefObject<HTMLDivElement | null>;
  scrollLeft: () => void;
  scrollRight: () => void;
  atStart: boolean;
  atEnd: boolean;
  pages: number;
  page: number;
}

export const useHorizontalScroll = (): HorizontalScrollHook => {
  const scrollRef = useRef<Nullable<HTMLDivElement>>(null);
  const [atStart, setAtStart] = useState<boolean>(true);
  const [atEnd, setAtEnd] = useState<boolean>(false);
  const [clientWidth, setClientWidth] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);

  const updateScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      console.log(scrollLeft + clientWidth, scrollWidth);

      setAtStart(scrollLeft === 0);
      setAtEnd(scrollLeft + clientWidth >= scrollWidth);
      setClientWidth(clientWidth);
      setPage(Math.ceil(scrollLeft / clientWidth) + 1);
      setPages(Math.ceil(scrollWidth / clientWidth));
    }
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", updateScrollPosition);
      updateScrollPosition();
      return () => ref.removeEventListener("scroll", updateScrollPosition);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -clientWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: clientWidth,
        behavior: "smooth",
      });
    }
  };

  return {
    scrollRef,
    scrollLeft,
    scrollRight,
    atStart,
    atEnd,
    pages,
    page,
  };
};
