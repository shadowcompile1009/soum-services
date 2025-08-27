import { TransactionDocument } from '@src/modules/transaction/schemas/transaction.schema';
import { IsNumber, IsObject, IsString } from 'class-validator';

export class HyperPayQueueJobDto {
  @IsString()
  accountId: string;

  @IsString()
  uniqueId: string;

  @IsString()
  agentId: string;

  @IsString()
  agentName: string;

  @IsObject()
  transaction: TransactionDocument;

  @IsNumber()
  amount: number;

  @IsString()
  userPhoneNumber: string;
}
