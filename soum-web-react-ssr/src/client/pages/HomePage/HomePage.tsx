import { JSX } from "react";
import React from "react";
import { useClientSideProps } from "../../context/ClientSideProps";
import { Nullable } from "@declarations/nullable/nullable.type";
import { fromEitherJSON } from "@utils/either";
import { TopBannersSection } from "./components/TopBannersSection/TopBannersSection";
import { MiddleBannersSection } from "./components/MiddleBannersSection/MiddleBannersSection";
import { FeaturesSection } from "./components/FeaturesSection/FeaturesSection";
import { ReviewSection } from "./components/ReviewSection/ReviewSection";
import { NewsSection } from "./components/NewsSection/NewsSection";
import { MostSoldDevices } from "./components/MostSoldDevices/MostSoldDevices";
import { FeedsSection } from "./components/FeedsSection/FeedsSection";
import { ErrorView } from "@components/ErrorView/ErrorView";

export const HomePage = (): Nullable<JSX.Element> => {
  const { clientSideProps } = useClientSideProps();

  const homepageDataResult = clientSideProps?.homepageData
    ? fromEitherJSON(clientSideProps.homepageData)
    : undefined;

  const recentlySoldProductsDataResult =
    clientSideProps?.recentlySoldProductsData
      ? fromEitherJSON(clientSideProps?.recentlySoldProductsData)
      : undefined;

  if (!homepageDataResult || !recentlySoldProductsDataResult) {
    return <ErrorView showUnexpectedError />;
  }

  if (homepageDataResult.isLeft()) {
    return <ErrorView errors={[homepageDataResult.value]} />;
  }

  if (recentlySoldProductsDataResult.isLeft()) {
    return <ErrorView errors={[recentlySoldProductsDataResult.value]} />;
  }

  const homePageData = homepageDataResult.value;

  return (
    <div className="flex flex-col gap-5 md:gap-10 w-11/12 md:w-full mx-auto">
      <div className="flex flex-col gap-5 md:gap-10 container mx-auto">
        <TopBannersSection homePageData={homePageData} />
        <FeaturesSection />
      </div>
      <MostSoldDevices homePageData={homePageData} />
      <div className="flex flex-col gap-5 md:gap-10 container mx-auto">
        <MiddleBannersSection homePageData={homePageData} />
        <FeedsSection
          homePageData={homePageData}
          recentlySoldProductsData={recentlySoldProductsDataResult.value}
        />
        <ReviewSection />
        <NewsSection />
      </div>
    </div>
  );
};
