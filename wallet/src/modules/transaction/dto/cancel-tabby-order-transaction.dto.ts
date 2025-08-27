import { IsNotEmpty, IsMongoId, IsNumber } from 'class-validator';

export class CancelTabbyOrderTransactionDto {
  @IsMongoId()
  @IsNotEmpty()
  walletId: string;

  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @IsMongoId()
  @IsNotEmpty()
  ownerId: string;
}
