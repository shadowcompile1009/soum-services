import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CategoryType } from '../enum/categoryType.enum';
import { ListingSource } from '../enum/listingSource.enum';
import { ProductSellType } from '../enum/productSellType.enum';
import { ProductImageSectionDto } from './productImages.dto';
export class Category {
  @ApiProperty({ example: CategoryType.CATEGORY })
  @IsEnum(CategoryType)
  categoryType: CategoryType;
  @IsString()
  @ApiProperty()
  categoryId: string;
}

export class ListingAddress {
  @IsString()
  @IsOptional()
  @ApiProperty()
  address: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  latitude: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  longitude: string;
}

export class CreateProductDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '66bde8a6c3fea800565de708' })
  id?: string;

  @ApiProperty({
    example: [
      {
        categoryType: 'category',
        categoryId: '60661c60fdc090d1ce2d4914',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(4)
  @ArrayMaxSize(5)
  @Type(() => Category)
  categories: Category[];

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1900 })
  sellPrice: number;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  @ApiProperty({ example: 'This is a good product' })
  description: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({ example: 98 })
  score: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 7 })
  expiryInDays: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '11111' })
  sellerPromoCodeId: string;

  @ApiProperty({ example: ProductSellType.GENERAL_SALES })
  @IsNotEmpty()
  @IsEnum(ProductSellType)
  productSellType: ProductSellType;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '11111' })
  listingGroupId: string;

  @ApiProperty({ example: ListingSource.CONSUMER })
  @IsOptional()
  @IsEnum(ListingSource)
  listingSource: ListingSource;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ProductImageSectionDto)
  productImageSections?: ProductImageSectionDto[];

  @IsObject()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ListingAddress)
  listingAddress;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  recommendedPrice: number;
}
