export class ProductUpdateDto {
  isUpranked?: boolean;
  imagesQualityScore?: number;
  regaUrl?: number;
  description?: string;
  guaranteesUrl?: number;
  isApproved?: boolean;
  status?: string;
  consignment?: Consignment;
  conditionId?: string;
  sellPrice?: number;
}
export interface Consignment {
  orderNumber: string;
  payoutAmount: number;
  payoutStatus: string;
}
export class ProductUpdateBulkListingDto {
  sellerId?: string;
  sellPrice?: number;
  listingGroupId?: string;
  productImages?: string[];
}
