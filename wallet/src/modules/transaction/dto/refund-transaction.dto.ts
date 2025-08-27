import { IsNotEmpty, IsMongoId, IsNumber } from 'class-validator';

export class RefundTransactionDto {
  @IsMongoId()
  @IsNotEmpty()
  walletId: string;

  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  @IsNumber()
  refundAmount: number;
}
