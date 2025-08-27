import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { PriceQualityDto } from './category-condition.dto';

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
export class UpdateCategoryConditionDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  conditionId: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => PriceNudge)
  @IsNotEmpty()
  priceNudge: PriceNudge;

  @ApiProperty()
  @ValidateNested({ each: true })
  @ApiProperty({ type: PriceQualityDto })
  @Type(() => PriceQualityDto)
  priceQualityList: PriceQualityDto[];
}
