import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Status } from '../enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BannerSource } from '../enums/banner-source.enum';
import { BannerLang } from '../enums/lang.enum';

export class Banner {
  @ApiProperty()
  @IsString()
  @IsEnum(BannerLang)
  lang: BannerLang;
  @ApiProperty()
  @IsString()
  url: string;
  @ApiProperty()
  @IsEnum(BannerSource)
  @IsString()
  source: BannerSource;
}
export class ScoreRange {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  min: number;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(101)
  @IsNotEmpty()
  max: number;
}
export class ConditionDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  labelColor: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  textColor?: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => ScoreRange)
  @IsNotEmpty()
  scoreRange: ScoreRange;

  @ApiProperty()
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @Type(() => Banner)
  @IsNotEmpty()
  banners: Banner[];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @ApiProperty()
  @IsOptional()
  positionAr?: number;

  @ApiProperty()
  @IsOptional()
  positionEn?: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isPreset: boolean;
}

export class ConditionForCsv {
  id: string;
  name: string;
  nameAr: string;
  categoryId: string;
  labelColor: string;
  textColor?: string;
  scoreRangeMin: number;
  scoreRangeMax: number;
  bannerSPPAr: string;
  bannerSPPEn: string;
  bannerListingAr: string;
  bannerListingEn: string;
}
