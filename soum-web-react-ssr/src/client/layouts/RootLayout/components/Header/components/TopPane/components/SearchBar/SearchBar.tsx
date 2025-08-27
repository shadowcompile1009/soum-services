import { ChangeEvent, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import React from "react";
import { useLocation } from "react-router-dom";
import { useLocale } from "@hooks/useLocale";
import qs from "query-string";

export const SearchBar = () => {
  const { isRTL } = useLocale();

  const location = useLocation();

  const [focused, setFocused] = useState<boolean>(false);

  const { query: searchQuery } = qs.parse(location.search ?? "?") as {
    query?: string;
  };

  const [query, setQuery] = useState<string>(searchQuery ?? "");

  const onReset = (): void => {};

  const onSearch = (event: ChangeEvent<HTMLInputElement>): void => {};

  useEffect(() => {
    if (query) {
      return;
    }
  }, [query]);

  return (
    <div
      className={`w-full h-[48px] flex px-10 ${
        isRTL ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="relative h-full flex-1">
        {!(focused || !!query) && (
          <div
            className={`absolute top-0 h-full opacity-95 pointer-events-none ${
              isRTL ? "right-5" : "left-5"
            }`}
          >
            <div className="flex flex-col justify-center h-full ml-5">
              <span className="text-sm font-medium">
                Search by product name
              </span>
              <span className="text-xs">
                Search within 14000+ products on Soum
              </span>
            </div>
          </div>
        )}
        {/* {!!hits.length && focused && <SearchResults hits={hits} />} */}
        <input
          className="flex gap-0 bg-gray-100 h-full rounded-l-lg px-5 w-full"
          onFocus={setFocused.bind(null, true)}
          onBlur={setFocused.bind(null, false)}
          value={query}
          onChange={onSearch}
          placeholder={focused && !query ? "Search by product name" : ""}
          aria-label="Search by product name"
        />
      </div>
      <div className="bg-[#04196c] text-white w-[64px] h-full text-4xl rounded-r-lg flex items-center">
        <CiSearch className="m-auto" />
      </div>
    </div>
  );
};
