import { PartialType } from '@nestjs/swagger';
import { BaseStatusDto } from './base-status.dto';

export class UpdateStatusDto extends PartialType(BaseStatusDto) {
  updatedAt: Date;
}
