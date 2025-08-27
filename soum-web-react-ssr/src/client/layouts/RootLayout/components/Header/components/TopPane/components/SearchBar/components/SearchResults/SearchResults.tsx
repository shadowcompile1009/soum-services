import { useLocale } from "@hooks/useLocale";
import { getPageLink } from "@utils/link/link";
import React from "react";
import { JSX } from "react";
import { Link } from "react-router-dom";

type Extends = {
  q: string;
};

export type SearchResults<Hit extends Extends> = {
  hits: Hit[];
};

export const SearchResults = <Hit extends Extends>({
  hits,
}: SearchResults<Hit>): JSX.Element => {
  const { language } = useLocale();

  return (
    <div className="absolute top-0 left-0 w-full bg-transparent">
      <div className="drop-shadow-md flex flex-col mt-[55px] bg-white w-full z-10">
        {hits.map((hit, index) => {
          return (
            <a
              href={getPageLink(language, `/search?query=${hit.q}`)}
              key={index}
              className="text-base border-b p-5 hover:bg-blue-600 w-full text-black hover:text-white"
            >
              {hit.q}
            </a>
          );
        })}
      </div>
    </div>
  );
};
