import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import {
  InspectionStatus,
  InspectionType,
} from '../enum/inspection.status.enum';
import { Type } from 'class-transformer';

export class ProductInspectionListQueryDto {
  @ApiProperty({
    required: false,
    description: 'Search by user name, userId or mobile number',
  })
  @IsOptional()
  @IsString()
  searchKey?: string;

  @ApiProperty({
    required: false,
    enum: InspectionStatus,
    description: 'Filter by inspection status',
  })
  @IsOptional()
  @IsEnum(InspectionStatus)
  status?: InspectionStatus;

  @ApiProperty({
    required: false,
    description: 'Filter by user ID',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by product ID',
  })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ required: false, default: 'desc' })
  @IsOptional()
  @IsString()
  orderBy?: string = 'desc';

  @IsEnum(InspectionType)
  @ApiProperty({
    enum: InspectionType,
    default: InspectionType.FBS,
    description: 'inspectionType filter (defaults to FBS)',
  })
  inspectionType: InspectionType = InspectionType.FBS;
  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  superCategoryId: string;
}
