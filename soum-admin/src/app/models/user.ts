import { UserStatusDef } from './../constants/user';
import { Product } from './product';

export interface User {
  secretKey: string;
  status: UserStatusDef;
  _id: string;
  mobileNumber: string;
  countryCode: string;
  address?: {
    address_id: string;
    address: string;
    city: string;
    postal_code: string;
    address_type: string;
    latitude: string;
    longitude: string;
  };
  bankDetail?: {
    accountHolderName: string;
    accountId: string;
    bankBIC: string;
  };
  name: string;
  lastLoginDate: string;
  user_id: string;
  sellProductList: Array<Product>;
}