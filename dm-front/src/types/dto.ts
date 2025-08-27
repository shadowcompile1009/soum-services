import { IRole } from './../models/User';
import { Bank } from '@/models/Bank';
import { IPaymentMethod } from '@/models/OrderDetails';

export interface SignInDTO {
  username: string;
  password: string;
}

export interface VerifyTotpDTO {
  mfaCode: string;
  userId: string;
}

export interface BankV2 {
  accountName: string;
  iban: string;
  bankId: string;
  bankCode: string;
  bankName: string;
  bankNameAr: string;
  id: string;
  status: boolean;
}

export interface BuyerRefundDTOV2 {
  paymentMethod: IPaymentMethod;
  grandTotal: number; // hidden field, required for validating amount, not to be send on the server
  amount: number;
  iban?: string;
  bank?: BankV2;
  accountName?: string;
}

export interface BuyerRefundDTO {
  paymentMethod: IPaymentMethod;
  grandTotal: number; // hidden field, required for validating amount, not to be send on the server
  amount: number;
  iban?: string;
  bank?: Bank;
  accountName?: string;
}

export interface SellerPayoutDTO {
  amount: string; // grandTotal
  isQuickPayout: boolean;
}

export interface SellerEditPayoutDTO {
  commission: string;
  iban: string;
  accountName: string;
  bank: Bank;
  commissionAmount?: string;
}
export interface AddNewUserDTO {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role?: IRole;
}

export interface EditUserDTO {
  id: string;
  roleId?: string;
}

export interface AddNewStoriesDTO {
  nameEn?: string;
  nameAr?: string;
  iconURL?: string;
  storyURLs?: string[];
  startDate?: Date;
  endDate?: Date;
  position?: number;
  urlLink?: string;
  isActive?: boolean;
}
