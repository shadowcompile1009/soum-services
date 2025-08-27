import { PartialType } from '@nestjs/swagger';
import { BaseBidDto } from './base-bid.dto';

export class UpdateBidDto extends PartialType(BaseBidDto) {
  updatedAt: Date;
}
