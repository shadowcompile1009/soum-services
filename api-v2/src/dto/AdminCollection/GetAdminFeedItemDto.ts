import { FeedStatus } from '../../enums/FeedStatus';

export class GetAdminFeedItemDto {
  position?: number;
  productId: string;
  categoryId: string;
  brandId: string;
  modelId: string;
  modelName: string;
  sellPrice: number;
  sellStatus: string;
  expiryDate: Date;
  feedId?: string;
  status?: FeedStatus;
}
