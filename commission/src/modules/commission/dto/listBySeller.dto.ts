import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { UserType } from '../enum/userSellerType.enum';

export class ListBySellerDto {
  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @IsEnum([UserType.KEY_SELLER, UserType.MERCHANT_SELLER, UserType.INDIVIDUAL_SELLER, UserType.UAE_SELLER])
  @IsOptional()
  sellerType: string;
}
