import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class CheckoutPageCommissionSummaryReq {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '1111' })
  productId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: false })
  applyDefaultPromo: boolean;
}
