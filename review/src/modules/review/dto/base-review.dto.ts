import {
  IsMongoId,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsDate,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class BaseReviewDto {
  @IsMongoId()
  @IsOptional()
  reviewerId: string;

  @IsMongoId()
  revieweeId: string;

  @IsMongoId()
  productId: string;

  @IsMongoId()
  orderId: string;

  @IsBoolean()
  @IsOptional()
  confirmed?: boolean;

  @IsBoolean()
  @IsOptional()
  anonymous?: boolean;

  @IsNumber()
  @Min(1)
  @Max(5)
  rate: number;

  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsString()
  @IsOptional()
  reviewerName: string;
}
