import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class TradeInRecoDataDTO {
  @IsString()
  variant_id: Types.ObjectId;

  @IsString()
  condition_id: Types.UUID;

  @IsNumber()
  trade_in_reco: number;

  @IsNumber()
  resell_reco: number;
}

export class TradeInRecoDTO {
  @IsString()
  etag: string;

  @IsDate()
  lastUpdateDate: Date;

  @IsArray()
  data: TradeInRecoDataDTO[];
}

export class TradeInRecoGetPriceResponseDTO {
  @IsString()
  @IsOptional()
  trade_in_reco?: number;

  @IsString()
  @IsOptional()
  resell_reco?: number;
}
