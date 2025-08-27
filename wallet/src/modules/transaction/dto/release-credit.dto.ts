import { IsNotEmpty, IsMongoId, IsNumber } from 'class-validator';

export class ReleaseCreditDto {
  @IsMongoId()
  @IsNotEmpty()
  walletId: string;

  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  @IsNumber()
  releaseAmount: number;
}
