import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductActionsEnum } from '../enum/productActions.enum';
import { Type } from 'class-transformer';
import { ProductImageSectionDto } from './productImages.dto';
import { ProductStatus } from '../enum/productStatus.enum';

export class AdminUpdateProductDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '1111' })
  id?: string;
  @IsEnum(ProductActionsEnum)
  @ApiProperty({ example: ProductActionsEnum.ADMIN_VERIFY_UPDATE })
  productAction: ProductActionsEnum;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Product was broken' })
  rejectReason?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Product was broken' })
  deleteReason?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://test.com' })
  regaUrl?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ProductImageSectionDto)
  productImageSections?: ProductImageSectionDto[];
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 3500 })
  sellPrice?: number;
  @IsString()
  @IsOptional()
  @Length(0, 255)
  @ApiProperty({ example: 'This is good product' })
  description?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://test.com' })
  guaranteesUrl?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'A11' })
  BIN?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'A11' })
  storageNumber?: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '1111111' })
  orderNumber?: string;
  // plz don't use this one this is just for temp for v2 update status
  @IsOptional()
  @IsEnum(ProductStatus)
  @IsOptional()
  @ApiProperty({
    example: ProductStatus.ACTIVE,
    enum: ProductStatus,
  })
  status?: ProductStatus;
}
