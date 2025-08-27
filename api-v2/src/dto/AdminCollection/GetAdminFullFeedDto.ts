import { GetFeedDto } from './GetFeedDto';
import { GetAdminFeedItemDto } from './GetAdminFeedItemDto';

export class GetAdminFullFeedDto extends GetFeedDto {
  items: GetAdminFeedItemDto;
}
