import { MppHighlightSummaryDto } from '../Highlight/MppHighlightSummaryDto';

export class ListAllProductDto {
  productId: string;
  categoryName: string;
  arCategoryName: string;
  currentPrice: number;
  productImage: string;
  grandTotal: number;
  discount: number;
  sellPrice: number;
  originalPrice: number;
  grade: string;
  arGrade: string;
  variantName: string;
  arVariantName: string;
  modelName: string;
  arModelName: string;
  highlights: MppHighlightSummaryDto[];
  liked: boolean;
  sellerId: string;
  categoryId?: string;
  sellerCity?: string;
  attributes?: any;
  isFavorite?: boolean;
  isGreatDeal?: boolean;
}
