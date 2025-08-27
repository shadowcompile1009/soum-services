import { FeedType } from '../../enums/FeedType';
import { Condition } from '../../grpc/proto/category.pb';
import { FilteredProductsDto } from '../product/ProductFilterDto';

export class ProductSortScoreData {
  brand_position: number;
  model_position: number;
  category_position: number;
}
export class SyncDataDto extends FilteredProductsDto {
  id?: any;
  objectID?: string;
  productId: any;
  keywords_en?: string[];
  keywords_ar?: string[];
  model_position?: number;
  brand_position?: number;
  category_position?: number;
  price_range?: string | { [key: string]: any };
  completion_rate?: number;
  start_bid?: number;
  highest_bid?: number;
  activate_bidding?: boolean;
  model_image: string;
  listingQuantity?: number;
  isMerchant?: boolean;
  sellerRating?: number;
  isUAE_listing?: boolean;
  reviewerRating?: number;
  grade: string;
  arGrade: string;
  modelId: any;
  categoryId: any;
  brandId: any;
  brandName?: string;
  arBrandName?: string;
  variantId?: any;
  modelName: string;
  condition?: Condition;
  arModelName: string;
  variantName: string;
  arVariantName: string;
  originalPrice: number;
  sellPrice: number;
  sort_score?: number;
  battery_capacity?: number;
  product_images?: string[];
  liked?: any;
  sellerId: any;
  sellerMobile?: string;
  sellerName?: string;
  sellerCityEn?: string;
  sellerCityAr?: string;
  expectedDeliveryTime?: any;
  createdDate: any;
  tags: any;
  highlights?: any[];
  attributes: any[];
  isGreatDeal?: boolean;
  text_questions_ans?: string;
  productImage?: string;
  isUpranked?: boolean;
  sortScoreV2?: number;
  sortScoreV2DG?: number;
  sortScoreV3?: number;
  hasWarranty?: boolean;
  has10DayGuarantee?: boolean;
  filtersEn?: string[];
  filtersAr?: string[];
  fastFilters?: string[];
  priceRange?: string;
  showSecurityBadge?: boolean;
  discount?: number;
  productFeed?: ProductFeed;
  categoryName?: string;
  arCategoryName?: string;
  fourPlusStarSeller?: boolean;
  expressDeliveryBadge?: boolean;
  collectionAr?: string[];
  collectionEn?: string[];
  collections?: ProductFeed[];
  collectionIds?: string[];
  trendingBadge?: boolean;
  extraFees?: number;
  deliveryFee?: number;
  grandTotal?: number;
  isConsignment?: boolean;
  createdAt?: number;
}
export class SeachKeywords {
  keywordsAr: string[];
  keywordsEn: string[];
  modelPosition: number;
  brandPosition: number;
  categoryPosition: number;
}

export class ProductFeed {
  id?: string;
  feedType?: FeedType;
  position?: number;
  arName?: string;
  enName?: string;
  arTitle?: string;
  enTitle?: string;
  expiryDate?: string;
  promoCode?: string;
}
