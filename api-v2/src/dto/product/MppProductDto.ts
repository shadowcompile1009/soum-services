import { ExploreProductDto } from './ExploreProductDto';

export class MppProductDto extends ExploreProductDto {
  originalPrice: number;
  sellPrice: number;
  grade: string;
  arGrade: string;
  variantName: string;
  arVariantName: string;
  sellerId: string;
  sellerCity?: string;
  attributes?: any;
  isFavorite?: boolean;
  tags?: string;
  isGreatDeal?: boolean;
}
