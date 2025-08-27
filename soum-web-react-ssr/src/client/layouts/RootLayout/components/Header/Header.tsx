import { CategoryPane } from "./components/CategoryPane/CategoryPane";
import { NavigationAndDownloadLinksPane } from "./components/NavigationAndDownloadLinksPane/NavigationAndDownloadLinksPane";
import { TopPane } from "./components/TopPane/TopPane";
import { JSX } from "react";
import React from "react";

export const Header = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full shadow-lg">
      <TopPane />
      <NavigationAndDownloadLinksPane />
      <CategoryPane />
    </div>
  );
};
