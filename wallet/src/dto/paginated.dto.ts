import { ApiProperty } from '@nestjs/swagger';
import { BaseWalletDto } from '@src/modules/wallet/dto/base-wallet.dto';

export class PaginatedDto<TData> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  items: TData[];
}

export class PaginatedWalletDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  items: BaseWalletDto[];
}