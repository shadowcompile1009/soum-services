import { ApiProperty } from '@nestjs/swagger';
import { BaseBidDto } from '@src/modules/bid/dto/base-bid.dto';

export class PaginatedDto<TData> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  items: TData[];
}

export class PaginatedBidDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  items: BaseBidDto[];
}
