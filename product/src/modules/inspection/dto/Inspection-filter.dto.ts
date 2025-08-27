import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  InspectionStatus
} from '../enum/inspection.status.enum';

export class InspectionFilterDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Filter by userId', required: false })
  userId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Filter by adminId', required: false })
  adminId?: string;

  @IsEnum(InspectionStatus)
  @ApiProperty({
    enum: InspectionStatus,
    default: InspectionStatus.NEW,
    description: 'Status filter (defaults to NEW)',
  })
  status: InspectionStatus = InspectionStatus.NEW;
}
