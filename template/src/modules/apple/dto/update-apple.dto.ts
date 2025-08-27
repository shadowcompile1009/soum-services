import { PartialType } from '@nestjs/swagger';
import { BaseAppleDto } from './base-apple.dto';

export class UpdateAppleDto extends PartialType(BaseAppleDto) {
  updatedAt: Date;
}
