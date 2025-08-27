import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { OptionStatus } from '../enums/option-status.enum';

export class OptionDTO {
  @ApiProperty({ example: '6063f95f929f926b67347b0d' })
  @IsOptional()
  @IsString()
  id: string;

  @ApiProperty({ example: 'Sample Option' })
  @IsNotEmpty()
  @IsString()
  nameEn: string;

  @ApiProperty({ example: 'عينة الفئة' })
  @IsNotEmpty()
  @IsString()
  nameAr: string;

  @ApiProperty({ example: OptionStatus.ACTIVE })
  @IsNotEmpty()
  @IsString()
  status: OptionStatus;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  positionEn: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  positionAr: number;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  scanned?: boolean;
}

export class GetOptionsDto {
  @IsNumber()
  size: number;
  @IsNumber()
  page: number;
  @IsString()
  attributeId: string;
  @IsString()
  @IsOptional()
  search: string;
}

export class GetOptionDto {
  @IsString()
  optionId: string;
}

export class CreateOptionDto extends OptionDTO {
  @IsString()
  @ApiProperty()
  attributeId: string;
}

export class UpdateOptionDto extends OptionDTO {
  @IsString()
  @ApiProperty()
  @IsOptional()
  attributeId?: string;
}

export class DeleteOptionDto {
  @IsString()
  optionId: string;
}
