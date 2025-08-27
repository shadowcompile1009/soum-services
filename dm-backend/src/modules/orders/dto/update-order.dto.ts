import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { FinanceReasoningForPendingPayout } from '../enums/status.enum';

export class UpdateOrderDto {
  @IsMongoId()
  id: string;

  @IsMongoId()
  @IsOptional()
  statusId: string;

  @IsMongoId()
  @IsOptional()
  dmoNctReasonId: string;

  @IsNumber()
  @IsOptional()
  penalty: number;
}

export class UpdateFinanceReasoningDto {
  @IsMongoId()
  id: string;

  @IsString()
  payoutPendingReason: FinanceReasoningForPendingPayout;
}
