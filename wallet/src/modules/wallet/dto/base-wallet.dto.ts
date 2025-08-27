import { Metadata } from '@src/modules/transaction/schemas/transaction.schema';
import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { WalletStatus } from '../enums/wallet.status.enum';

export class BaseWalletDto {
  @IsMongoId()
  ownerId: string;

  @IsString()
  @IsOptional()
  tag: string;

  @IsNumber()
  @Min(0)
  @Max(6000)
  balance: number;

  @IsEnum(WalletStatus)
  @IsOptional()
  status: string;

  @IsOptional()
  userName: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  pendingTransactions: number;

  @IsOptional()
  onholdBalance: number;

  @IsOptional()
  availableBalance: number;

  @IsOptional()
  totalBalance: number;

  @IsOptional()
  metadata: Metadata;
}
