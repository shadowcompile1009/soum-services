import {
  IsMongoId,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsDate,
} from 'class-validator';

export class BaseRateDto {
  @IsMongoId()
  revieweeId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rate: number;

  @IsNumber()
  @IsOptional()
  count: number;

  @IsDate()
  @IsOptional()
  createdAt: Date;
}
