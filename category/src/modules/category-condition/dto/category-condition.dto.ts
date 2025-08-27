import { ApiProperty } from '@nestjs/swagger';
import { ConditionDto } from '@src/modules/condition/dto/condition.dto';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class PriceNudge {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  min: number;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  max: number;
}

export class PriceQualityDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  TTS: number; // Time till sold
  @ApiProperty()
  @IsNumber()
  position: number;
}
export class CategoryConditionDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => ConditionDto)
  condition: ConditionDto;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => PriceNudge)
  priceNudge: PriceNudge;

  @ApiProperty()
  @ValidateNested({ each: true })
  priceQualityList: PriceQualityDto[];
}

export class CategoryConditionForCSV {
  categoryId: string;
  variantId: string;
  conditionName: string;
  priceNudgeMin: number;
  priceNudgeMax: number;
  priceExcellent: number;
  TTSExcellent: number; // Time till sold
  priceFair: number;
  TTSFair: number; // Time till sold
  priceFairExpensive: number;
  TTSFairExpensive: number; // Time till sold
  priceAbove: number;
  TTSAbove: number; // Time till sold
  priceExpensive: number;
  TTSExpensive: number; // Time till sold
  priceExpensiveUpper: number;
  TTSExpensiveUpper: number; // Time till sold
}
