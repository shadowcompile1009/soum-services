import { FeedStatus } from '../../enums/FeedStatus';

export class FeedItemDto {
  productId: string;
  feedId?: string;
  position?: number;
  status?: FeedStatus;
  categoryId: string;
  brandId: string;
  modelId: string;
}
