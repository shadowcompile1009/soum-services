import { Attribute } from "@declarations/attribute/attribute.type";
import { Condition } from "@declarations/condition/condition.type";

export type RecentlySoldProductItem = {
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

export type FetchRecentlySoldProductsResponse = {
  status: string;
  data: {
    limit: number;
    offset: number;
    total: number;
    items: RecentlySoldProductItem[];
  };
  code: number;
};
