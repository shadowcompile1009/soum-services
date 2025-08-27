import { PartialType } from '@nestjs/swagger';
import { BaseAppleDto } from './base-apple.dto';
import { IsOptional, IsString } from 'class-validator';

export class CreateAppleDto extends PartialType(BaseAppleDto) {
  @IsString()
  @IsOptional()
  userId: string;
}
