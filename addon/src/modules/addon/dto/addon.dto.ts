import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddonType } from '../enum/addonType.enum';
import { PriceType } from '../enum/priceType.enum';
import { ValidityType } from '../enum/validityType.enum';
import { AddonItem } from '@src/modules/grpc/proto/addon.pb';

export class AddonDto {
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  image: any;

  @ApiProperty()
  @IsEnum(AddonType)
  @IsNotEmpty()
  type: AddonType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nameEn: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nameAr: string;

  @ApiProperty()
  @IsOptional()
  taglineEn: string;

  @ApiProperty()
  @IsOptional()
  taglineAr: string;

  @ApiProperty()
  @IsOptional()
  descriptionEn: string;

  @ApiProperty()
  @IsOptional()
  descriptionAr: string;

  @ApiProperty()
  @IsEnum(PriceType)
  @IsNotEmpty()
  priceType?: PriceType;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsEnum(ValidityType)
  @IsOptional()
  validityType?: ValidityType;

  @ApiProperty()
  @IsOptional()
  validity: number;

  @ApiProperty()
  @IsOptional()
  sellerIds: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  modelIds: string[];
}
export class AddonSummaryReqDto {
  @ApiProperty()
  @IsNotEmpty()
  productPrice: number;
  @ApiProperty()
  @IsNotEmpty()
  addOnIds: string[];
}
export class AddonSummaryResDto {
  addOns?: AddonItem[];
  addOnsTotal: number;
  addOnsGrandTotal: number;
  addOnsVat: number;
}
export class CreateAddonDto {
  id: string;
  image: any;
  type: AddonType;
  nameEn: string;
  nameAr: string;
  taglineEn: string[];
  taglineAr: string[];
  descriptionEn: string;
  descriptionAr: string;
  priceType?: PriceType;
  price: number;
  validityType?: ValidityType;
  validity: number;
  modelIds: string[];
  sellerIds: string[];
}
export class AddonListDto {
  id: string;
  image: any;
  type: AddonType;
  nameEn: string;
  nameAr: string;
  taglineEn: string[];
  taglineAr: string[];
  descriptionEn: string;
  descriptionAr: string;
  priceType?: PriceType;
  price: number;
  validityType?: ValidityType;
  validity: number;
  modelId: string;
}

export class UpdateAddonDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(AddonType, { message: 'type must be either warranty or accessory' })
  type: AddonType;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  image: any;

  @ApiProperty()
  @IsOptional()
  nameEn: string;

  @ApiProperty()
  @IsOptional()
  nameAr: string;

  @ApiProperty()
  @IsOptional()
  taglineEn: string[];

  @ApiProperty()
  @IsOptional()
  taglineAr: string[];

  @ApiProperty()
  @IsOptional()
  descriptionEn: string;

  @ApiProperty()
  @IsOptional()
  descriptionAr: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(PriceType, { message: 'type must be either fixed or percentage' })
  priceType?: PriceType;

  @ApiProperty()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ValidityType, { message: 'type must be either day or month or year' })
  validityType?: ValidityType;

  @ApiProperty()
  @IsOptional()
  validity: number;

  @ApiProperty()
  @IsOptional()
  sellerIds: string[];

  @ApiProperty()
  @IsOptional()
  modelIds: string[];
}
