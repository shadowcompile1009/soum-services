import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class BasePenaltyDto {
  @IsMongoId()
  @IsOptional()
  userId: string;

  @IsMongoId()
  dmoId: string;

  @IsOptional()
  @IsMongoId()
  nextDmoId: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsNumber()
  amount: number;
}

export class PenaltyDto {
  @IsMongoId()
  @IsOptional()
  userId: string;
  @IsNumber()
  amount: number;
}
