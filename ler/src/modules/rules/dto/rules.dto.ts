/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { UserType } from '../../../modules/usertypes/entities/userType.entity';
import { Vendor } from '../../../modules/vendor/entities/vendor.entity';

export class CreateRulesDto {
  @IsString()
  @IsNotEmpty()
  userType: UserType;
  @IsString()
  @IsNotEmpty()
  vendor: Vendor;
  @IsInt()
  sellerTier: number;
  @IsInt()
  buyerTier: number;
}
