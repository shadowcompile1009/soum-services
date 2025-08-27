import { ApiProperty } from '@nestjs/swagger';
import { BidStatus } from '@src/modules/status/enums/status.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateOffer {
  @ApiProperty()
  @IsOptional()
  id: string;

  @IsEnum(BidStatus)
  @ApiProperty()
  @IsOptional()
  status: BidStatus;

  @ApiProperty()
  @IsOptional()
  message: string;
}
