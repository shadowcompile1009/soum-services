import React from "react";
import { JSX } from "react";
import { FetchHomepageDataResponse } from "@declarations/homepage/homepage.type";
import { Feed, FeedProps } from "./components/Feed/Feed";
import { FetchRecentlySoldProductsResponse } from "@declarations/order/order.type";

export type FeedsSectionProps = {
  homePageData: FetchHomepageDataResponse;
  recentlySoldProductsData: FetchRecentlySoldProductsResponse;
};

export const FeedsSection = ({
  homePageData,
  recentlySoldProductsData,
}: FeedsSectionProps): JSX.Element => {
  const recentlSoldFeed: FeedProps["feed"] = {
    id: "adcdfe6b597d6bb2dfe0f76b",
    arName: "ما قمت بمشاهدته مؤخرًا",
    enName: "Recently Sold Products",
    items: recentlySoldProductsData.data.items,
  };

  const feeds = [...homePageData.feeds, recentlSoldFeed];

  return (
    <div>
      {feeds.map((feed, index) => {
        return <Feed feed={feed} key={index} />;
      })}
    </div>
  );
};
