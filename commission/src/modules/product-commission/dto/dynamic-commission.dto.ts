import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

export class DynamicCommissionDataDTO {
  @IsString()
  variant_id: string;

  @IsString()
  condition_id: string;

  @IsNumber()
  final_commission_rate: number;
}

export class DynamicCommissionDTO {
  @IsString()
  etag: string;

  @IsDate()
  lastUpdateDate: Date;

  @IsArray()
  data: DynamicCommissionDataDTO[];
}

export class CheckEligibilityRequestDTO {
  variantId: string;
  conditionId: string;
}
