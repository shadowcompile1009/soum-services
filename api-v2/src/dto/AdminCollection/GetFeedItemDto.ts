import { UserLegacyDocument } from '../../models/LegacyUser';
import { Condition } from '../../grpc/proto/category/Condition';

export class GetFeedItemDto {
  productId: string;
  sellPrice: number;
  grandTotal?: number;
  productImage: string;
  grade: string;
  arGrade: string;
  modelName: string;
  arModelName: string;
  variantName: string;
  arVariantName: string;
  originalPrice: number;
  discount: number;
  attributes: any[];
  product_images?: string[];
  start_bid?: number;
  highest_bid?: number;
  activate_bidding?: boolean;
  condition?: Condition;
  productImages?: string[];
  seller?: UserLegacyDocument;
  showSecurityBadge?: boolean;
}
