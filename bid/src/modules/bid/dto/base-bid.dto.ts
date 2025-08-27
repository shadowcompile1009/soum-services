import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class BaseBidDto {
  @IsMongoId()
  @IsOptional()
  userId: string;

  @IsMongoId()
  productId: string;

  @IsMongoId()
  @IsOptional()
  statusId: string;

  @IsMongoId()
  @IsOptional()
  transactionId: string;

  @IsNumber()
  amount: number;
}
