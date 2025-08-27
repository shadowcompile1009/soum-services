import { FeedItemDto } from './FeedItemDto';

export class FeedDto {
  arName?: string;
  enName?: string;
  items?: FeedItemDto[];
  position?: number;
  feedType?: string;
  feedCategory?: string;
  arTitle?: string;
  enTitle?: string;
  expiryDate?: Date;
  maxBudget?: number;
  imgURL?: string;
}
