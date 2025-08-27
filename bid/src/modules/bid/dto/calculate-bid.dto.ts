import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CalculateBidDto {
  @IsNumber()
  bidAmount: number;
  @IsNumber()
  @IsOptional()
  shipping: number;
  @IsNumber()
  @IsOptional()
  commission: number;
  @IsNumber()
  @IsOptional()
  total: number;
  @IsBoolean()
  @IsOptional()
  allPayments: boolean;
}
