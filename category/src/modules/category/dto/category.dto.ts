import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CategoryStatus } from '../enums/category-status.enum';
import { CategoryTypes } from '../enums/category-types.enums';
import { Type } from 'class-transformer';

// Image DTO to define an image structure
export class Image {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  source: string;
}
export class CategoryAttribute {
  @ApiProperty()
  @IsString()
  featureId: string;

  @ApiProperty()
  @IsString()
  attributeId: string;
}

export class webNavigationReqDto {
  @ApiProperty({ example: 'Sample Category' })
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty({ example: 'Category' })
  @IsEnum(CategoryTypes, {
    message: `Type must be one of the following: ${Object.values(CategoryTypes).join(', ')}`,
  })
  type: CategoryTypes;
}

// Base DTO for common category fields
export class CategoryDto {
  @ApiProperty({ example: '6063f95f929f926b67347b0d' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Sample Category' })
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty({ example: 'عينة الفئة' })
  @IsString()
  @IsNotEmpty({ message: 'Arabic name cannot be empty' })
  nameAr: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0, { message: 'Position must be a positive integer' })
  position: number;

  @ApiProperty({ example: 'Category' })
  @IsEnum(CategoryTypes, {
    message: `Type must be one of the following: ${Object.values(CategoryTypes).join(', ')}`,
  })
  type: CategoryTypes;

  @ApiProperty({
    example: [
      {
        url: 'https://example.com/icon1.png',
        type: 'image',
        source: 'external',
      },
      {
        url: 'https://example.com/icon2.png',
        type: 'image',
        source: 'external',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images?: Image[];

  @ApiProperty({ example: CategoryStatus.ACTIVE })
  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus;

  @IsOptional()
  @IsString()
  parentId?: string;
}

// Admin-specific DTO extending the base DTO for category creation and updates
export class AdminCategoryDto extends CategoryDto {
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'maxPercentage must be a positive integer' })
  maxPercentage?: number;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'currentPrice must be a positive integer' })
  currentPrice?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryAttribute)
  categoryAttributes?: CategoryAttribute[];
}

// DTO for category creation
export class CreateCategoryDto extends CategoryDto {
  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'maxPercentage must be a positive integer' })
  maxPercentage?: number;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'currentPrice must be a positive integer' })
  currentPrice?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryAttribute)
  categoryAttributes?: CategoryAttribute[];
}

// DTO for category update
export class UpdateCategoryDto extends CategoryDto {
  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'maxPercentage must be a positive integer' })
  maxPercentage?: number;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'currentPrice must be a positive integer' })
  currentPrice?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryAttribute)
  categoryAttributes?: CategoryAttribute[];
}

// DTO for listing categories with minimal information (used in app or front-end)
export class AppCategoryDto extends CategoryDto {}

// DTO for categories in app listings with minimal properties
export class AppListingCategoryDto {
  @ApiProperty({ example: '6063f95f929f926b67347b0d' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Sample Category' })
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty({ example: 'عينة الفئة' })
  @IsString()
  @IsNotEmpty({ message: 'Arabic name cannot be empty' })
  nameAr: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0, { message: 'Position must be a positive integer' })
  position: number;

  @ApiProperty({ example: 'Category' })
  @IsEnum(CategoryTypes, {
    message: `Type must be one of the following: ${Object.values(CategoryTypes).join(', ')}`,
  })
  type: CategoryTypes;

  @ApiProperty({
    example: [
      {
        url: 'https://example.com/icon1.png',
        type: 'image',
        source: 'external',
      },
      {
        url: 'https://example.com/icon2.png',
        type: 'image',
        source: 'external',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images?: Image[];
}

export class WebPagesCategoryDto {
  @ApiProperty({ example: '6063f95f929f926b67347b0d' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Sample Category' })
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty({ example: 'عينة الفئة' })
  @IsString()
  @IsNotEmpty({ message: 'Arabic name cannot be empty' })
  nameAr: string;

  @ApiProperty({ example: 'Category' })
  @IsEnum(CategoryTypes, {
    message: `Type must be one of the following: ${Object.values(CategoryTypes).join(', ')}`,
  })
  type: CategoryTypes;
}

// DTO to update the position of a category
export class UpdateCategoryPositionDto {
  @ApiProperty({ example: '6063f95f929f926b67347b0d' })
  @IsString()
  id: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  position: number;
}
