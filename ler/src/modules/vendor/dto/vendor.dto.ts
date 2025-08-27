import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  arabicName: string;
  @IsNotEmpty()
  sellerTiers: string;
  @IsNotEmpty()
  buyerTiers: string;
  @IsNotEmpty()
  services: string;
}
