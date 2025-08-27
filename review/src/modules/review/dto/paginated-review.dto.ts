import { ApiProperty } from '@nestjs/swagger';
import { BaseReviewDto } from '@src/modules/review/dto/base-review.dto';

export class PaginatedDto<TData> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  hasNextPage: boolean;

  items: TData[];
  stars?: number;
}

export class PaginatedReviewDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  items: BaseReviewDto[];
}
