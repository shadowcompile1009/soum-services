import { GetUserResponse } from '@src/modules/grpc/proto/v2.pb';
import { TransactionDocument } from '@src/modules/transaction/schemas/transaction.schema';
import { IsBoolean, IsDate, IsObject, IsString } from 'class-validator';

export class CreateHyperpayTransationDTO {
  @IsObject()
  user: GetUserResponse;
  @IsObject()
  transaction: TransactionDocument;
}

interface Beneficiary {
  name: string;
  accountId: string;
  debitCurrency: string;
  transferAmount: any;
  transferCurrency: string;
  payoutBeneficiaryAddress1: string;
  payoutBeneficiaryAddress2: string;
  payoutBeneficiaryAddress3: string;
}

export class CreateHyperpayTransationResponseDTO {
  @IsString()
  configId: string;
  @IsString()
  merchantTransactionId: string;
  @IsObject()
  beneficiary: Beneficiary[];
  @IsString()
  uniqueId: string;
  @IsString()
  message: string;
  @IsObject()
  errors: any;
}

export class GetSpecificOrderRequestDTO {
  @IsString()
  accountId: string;
  @IsString()
  uniqueId: string;
}

export class GetSpecificOrderResponseDTO {
  @IsString()
  batchId: string;
}

export class GetSpecificPayoutRequestDTO {
  @IsString()
  batchId: string;
}

export class GetSpecificPayoutResponseDTO {
  @IsBoolean()
  status: string;
  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;
}
