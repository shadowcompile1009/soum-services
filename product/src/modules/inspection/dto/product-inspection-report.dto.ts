import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '@src/modules/product/enum/questionType.enum';
import { InspectionStatus } from '../enum/inspection.status.enum';

export class SpecificationReportData {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nameAr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  value?: string;
}

export class SpecificationReport {
  @ApiProperty()
  @IsString()
  nameEn: string;

  @ApiProperty()
  @IsString()
  nameAr: string;

  @ApiProperty()
  @IsBoolean()
  status: boolean;

  @ApiPropertyOptional({ enum: QuestionType })
  @IsOptional()
  @IsEnum(QuestionType)
  questionType?: QuestionType;

  @ApiPropertyOptional({ type: [SpecificationReportData] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecificationReportData)
  data?: SpecificationReportData[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  placeHolder?: string;
}

export class InspectionReportImage {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class InspectionReportData {
  @ApiProperty()
  @IsString()
  nameEn: string;

  @ApiProperty()
  @IsString()
  nameAr: string;

  @ApiProperty()
  @IsBoolean()
  status: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  showInSPP?: boolean;

  @ApiPropertyOptional({ type: [InspectionReportImage] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InspectionReportImage)
  images?: InspectionReportImage[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty()
  @IsOptional()
  completed: boolean;
}

export class InspectionReport {
  @ApiProperty()
  @IsString()
  nameEn: string;

  @ApiProperty()
  @IsString()
  nameAr: string;

  @ApiProperty({ type: [InspectionReportData] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InspectionReportData)
  checks: InspectionReportData[];

  @ApiProperty()
  @IsOptional()
  allPassed: boolean;
}

export class ProductInspectionReport {
  @ApiPropertyOptional({
    example: '66bde8a6c3fea800565de708',
    description: 'The ID of the product',
  })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiProperty({
    type: [SpecificationReport],
    description: 'List of specification reports',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecificationReport)
  @IsOptional()
  specificationReport: SpecificationReport[];

  @ApiProperty({
    type: [InspectionReport],
    description: 'List of inspection reports',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InspectionReport)
  @IsOptional()
  inspectionReport: InspectionReport[];

  @ApiProperty({
    enum: InspectionStatus,
    description: 'The status of the inspection',
  })
  @IsEnum(InspectionStatus)
  @IsOptional()
  status: InspectionStatus;

  @ApiProperty({
    description: 'A message about the inspection report',
    example: 'Inspection completed successfully',
  })
  @IsString()
  @IsOptional()
  message: string;

  @ApiProperty({
    description: 'Detailed description of the inspection',
    example: 'All specifications meet the required standards.',
  })
  @IsString()
  @IsOptional()
  description: string;
}
