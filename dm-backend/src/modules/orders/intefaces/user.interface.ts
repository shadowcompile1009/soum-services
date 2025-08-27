import {
  UserBusinessModel,
  UserOperatingModel,
  UserSellerCategory,
  UserSellerType,
} from '../enums/user.enum';

export interface UserData {
  operatingModel: UserOperatingModel;
  businessModel: UserBusinessModel;
  buyerBusinessModel: UserBusinessModel;
  sellerType?: UserSellerType;
  sellerCategory?: UserSellerCategory;
  sellerCRNumber?: string;
}
