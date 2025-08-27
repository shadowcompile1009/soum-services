import { IsOptional, IsString } from 'class-validator';
import { BaseBidDto } from './base-bid.dto';

export class CreateBidDto extends BaseBidDto {
  @IsString()
  @IsOptional()
  paymentOptionId: string;

  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  @IsOptional()
  lang: string;
}
