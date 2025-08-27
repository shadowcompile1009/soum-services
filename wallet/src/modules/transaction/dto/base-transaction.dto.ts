import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { TransactionStatus } from '../enums/transaction.status.enum';
import { TransactionType } from '../enums/transaction.type.enum';
import {
  Metadata,
  TransactionHistoryDocument,
} from '../schemas/transaction.schema';

export class BaseTransactionDto {
  @IsMongoId()
  @IsOptional()
  ownerId: string;

  @IsString()
  @IsOptional()
  walletId: string;

  @IsNumber()
  @Min(1)
  @Max(6000)
  @IsOptional()
  amount: number;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: string;

  @IsEnum(TransactionType)
  @IsOptional()
  type: string;

  @IsArray()
  @IsOptional()
  history: TransactionHistoryDocument[];

  @IsMongoId()
  @IsOptional()
  orderId: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsObject()
  @IsOptional()
  metadata: Metadata;
}
