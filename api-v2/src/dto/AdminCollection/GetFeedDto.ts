import { FeedType } from '../../enums/FeedType';
import { FeedStatus } from '../../enums/FeedStatus';

export class GetFeedDto {
  id: string;
  arName: string;
  enName: string;
  arTitle?: string;
  enTitle?: string;
  expiryDate?: Date;
  maxBudget?: number;
  imgURL?: string;
  totalProducts: number;
  totalActiveProducts: number;
  collectionStatus: FeedStatus;
  feedType: FeedType;
  position?: number;
}
