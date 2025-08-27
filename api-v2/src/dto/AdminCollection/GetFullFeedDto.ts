import { GetFeedDto } from './GetFeedDto';
import { GetFeedItemDto } from './GetFeedItemDto';

export class GetFullFeedDto extends GetFeedDto {
  items: GetFeedItemDto[];
}
