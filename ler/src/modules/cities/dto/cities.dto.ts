/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateCitiesDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsOptional()
  @IsNotEmpty()
  arabicName: string;
  @IsInt()
  sellerTier: number;
  @IsInt()
  buyerTier: number;
}
