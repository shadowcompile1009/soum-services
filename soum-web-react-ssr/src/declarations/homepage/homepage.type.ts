import { Attribute } from "@declarations/attribute/attribute.type";
import { Condition } from "@declarations/condition/condition.type";

export type HomepageDataBanner = {
  id: string;
  position: string;
  bannerName: string;
  bannerImage: string;
  bannerPage: string;
  bannerPosition: string;
  bannerType: string;
  bannerValue: string;
  lang: string;
};

export type HomepageDataMostSoldModel = {
  id: string;
  arName: string;
  enName: string;
  modelIcon: string;
};

export type HomepageDataFeedItem = {
  productId: string;
  originalPrice: number;
  discount?: number;
  sellPrice: number;
  productImage: string;
  modelName: string;
  arModelName: string;
  variantName: string;
  arVariantName: string;
  attributes?: Attribute[];
  condition?: Condition;
  productImages: string[];
  tags: string;
  sellStatus?: string;
  sellDate?: string;
  categoryName?: string;
  product_images?: string[];
};

export type HomepageDataFeed = {
  id: string;
  arName: string;
  enName: string;
  items: HomepageDataFeedItem[];
};

export type FetchHomepageDataResponse = {
  categories: [];
  banners: {
    ar: HomepageDataBanner[];
    en: HomepageDataBanner[];
  };
  feeds: HomepageDataFeed[];
  mostSoldModels: HomepageDataMostSoldModel[];
};
