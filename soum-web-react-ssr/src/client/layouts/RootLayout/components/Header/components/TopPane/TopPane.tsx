import { Button } from "@components/Button/Button";
import { LanguageSwitcher } from "@components/LanguageSwitcher/LanguageSwitcher";
import { CiSearch } from "react-icons/ci";
import { IoMenu } from "react-icons/io5";
import { JSX } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { useLocale } from "@hooks/useLocale";
import { getPageLink } from "@utils/link/link";
import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";

export const TopPane = (): JSX.Element => {
  const { language } = useLocale();

  return (
    <div className="w-full">
      <div className="flex flex-row gap-5 max-w-screen-xl mx-auto p-5 items-center justify-between">
        <div className="block md:hidden">
          <IoMenu className="text-2xl" />
        </div>
        <div className="flex gap-1">
          <a
            lang={language}
            href={getPageLink(language, "/")}
            className="flex gap-3 items-center"
          >
            <img
              src={getCloudImageUrl("/logo.svg")}
              height={70}
              width={100}
              alt=""
            />
          </a>
        </div>
        <div className="flex-1 hidden md:block">
          <SearchBar />
        </div>
        <div className="gap-5 items-center hidden md:flex">
          {[
            {
              text: "Blog",
              to: "/blog",
            },
            {
              text: "Sell",
              to: "/sell",
            },
          ].map((item, index) => {
            return (
              <a
                lang={language}
                key={index}
                className="text-sm text-gray-600 hover:text-blue-600 hidden lg:block"
                href={getPageLink(language, item.to)}
              >
                {item.text}
              </a>
            );
          })}
          <Button
            link={{
              href: getPageLink(language, "/login"),
              hrefLang: language,
              "aria-label": "",
            }}
          >
            Login
          </Button>
          <LanguageSwitcher />
        </div>
        <div className="block md:hidden">
          <CiSearch className="text-2xl" />
        </div>
      </div>
    </div>
  );
};
