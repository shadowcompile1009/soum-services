import { Condition } from '../../grpc/proto/category.pb';
import { ProductOrderStatus } from '../../enums/ProductStatus.Enum';
import { Brand } from '../../grpc/proto/v2/Brand';
import { Category } from '../../grpc/proto/v2.pb';

export class ListFavoritesDto {
  productId: string;
  categoryName: string;
  arCategoryName: string;
  condition?: Condition;
  modelName: string;
  arModelName: string;
  currentPrice: number;
  productImage: string;
  sellStatus?: ProductOrderStatus;
  sellDate?: string;
  sellPrice: number;
  grandTotal: number;
  deliveryFee: number;
  extraFees: number;
  originalPrice: number;
  grade: string;
  arGrade: string;
  variantName: string;
  arVariantName: string;
  sellerId: string;
  categoryId?: string;
  sellerCity?: string;
  attributes?: any;
  isAvailable?: any;
  isGreatDeal?: boolean;
  start_bid?: number;
  highest_bid?: number;
  activate_bidding?: boolean;
  showSecurityBadge?: boolean;
  brand: Brand;
  category: Category;
}
