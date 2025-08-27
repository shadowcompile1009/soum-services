import { Status } from 'src/modules/commission/enum/status.enum';
import { CommissionType } from 'src/modules/commission/enum/commissionType.enum';
import { UserType } from '../enum/userSellerType.enum';
import {
  IsNumber,
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PriceRangeOperator } from '../enum/PriceRangeOperator.enum';
import { Type } from 'class-transformer';

export class PriceQualityChargeDto {
  @ApiProperty()
  @IsNumber()
  fairPercentage: number;
  @ApiProperty()
  @IsNumber()
  excellentPercentage: number;
  @ApiProperty()
  @IsNumber()
  expensivePercentage: number;
}

export class PriceRangeDto {
  @ApiProperty()
  @IsEnum(PriceRangeOperator)
  operator: PriceRangeOperator;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  startValue: number;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  endValue: number;
}
export class CommissionDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsEnum(UserType)
  userType: UserType;

  @ApiProperty()
  @IsBoolean()
  isBuyer: boolean;

  @ApiProperty()
  @IsEnum(CommissionType)
  type: CommissionType;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => PriceQualityChargeDto)
  @IsOptional()
  ranges: PriceQualityChargeDto;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  minimum: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  maximum: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  percentage?: number;

  @ApiProperty()
  @IsEnum(Status)
  status: Status;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  paymentOptionIds: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  modelIds: string[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => PriceRangeDto)
  @IsOptional()
  priceRange: PriceRangeDto;
}
