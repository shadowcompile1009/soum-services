import { FetchBrandsResponse } from "@declarations/brand/brand.type";
import { FetchCategoriesResponse } from "@declarations/category/category.type";
import { FetchHomepageDataResponse } from "@declarations/homepage/homepage.type";
import { FetchRecentlySoldProductsResponse } from "@declarations/order/order.type";
import { FetchSettingsResponse } from "@declarations/settings/settings.type";
import { EitherJSON } from "@utils/either";

export type AppProps = {
  clientSideProps: {
    language: string;
    categories: EitherJSON<FetchCategoriesResponse>;
    settings: EitherJSON<FetchSettingsResponse>;
    brands: EitherJSON<FetchBrandsResponse>;
    homepageData?: EitherJSON<FetchHomepageDataResponse>;
    recentlySoldProductsData?: EitherJSON<FetchRecentlySoldProductsResponse>;
  };
};
