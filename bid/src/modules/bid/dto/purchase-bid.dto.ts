import { BaseBidDto } from './base-bid.dto';

export class ProductStatus {
  deleted: boolean;
  expired: boolean;
  sold: boolean;
}

export class PurchaseBidDto extends BaseBidDto {
  bidId: string;
  productName: string;
  productNameAr: string;
  productImg: string;
  status: string;
  productStatuses: ProductStatus;
}
