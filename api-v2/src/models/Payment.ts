// @ts-nocheck
import { Document, model, Schema } from 'mongoose';
import { TransactionStatus } from '../enums/TransactionStatus';

export type PaymentDocument = Document & {
  payment_provider: PaymentProvider;
  payment_provider_type: PaymentProviderType;
  payment_action_type: PaymentActionType;
  payment_completeness: PaymentCompleteness;
  soum_payment_type: SoumPaymentType;
  payment_input: PaymentInput;
  payment_response: any;
  checkout_payment_response: any;
  payment_status: TransactionStatus;
  checkout_payment_status: TransactionStatus;
  created_date: Date;
  updated_date: Date;
};
export class PaymentInput {
  amount: number;
  payment_number: string;
  currency: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  name: string;
  surname: string;
  country_code: string;
  mobile_number: string;
  order: string;
  product: string;
  product_id: string; // this should be replaced with product only
  userId?: string;
}

export interface HyperPayPaymentInput extends PaymentInput {
  entityId: string;
}
export enum PaymentCompleteness {
  Partial = 'partial',
  Full = 'full',
}
export enum SoumPaymentType {
  OnlineProvider = 'onlineProvider',
  CashOnDelivery = 'cashOnDelivery',
}
export enum PaymentProvider {
  HyperPay = 'hyperPay',
  Tabby = 'tabby',
  TAMARA = 'tamara',
  TAMAM = 'tamam',
  MOYASAR = 'moyasar',
  MADFU = 'madfu',
  EMKAN = 'emkan',
}
export enum PaymentProviderType {
  ApplePay = 'APPLEPAY',
  Mada = 'MADA',
  VisaMaster = 'VISA_MASTER',
  StcPay = 'STC_PAY',
  Tabby = 'TABBY',
  TAMARA = 'TAMARA',
  TAMAM = 'TAMAM',
  URPAY = 'URPAY',
  Visa = 'VISA',
  MADFU = 'MADFU',
  EMKAN = 'EMKAN',
}
export enum PaymentActionType {
  ListingFees = 'listingFees',
  Order = 'order',
}
const paymentSchema = new Schema<PaymentDocument>({
  payment_provider: { type: PaymentProvider },
  payment_provider_type: { type: PaymentProviderType },
  payment_action_type: { type: PaymentActionType },
  payment_completeness: { type: PaymentCompleteness },
  soum_payment_type: { type: SoumPaymentType },
  payment_input: { type: Object },
  payment_response: { type: Object },
  checkout_payment_response: { type: Object },
  payment_status: { type: TransactionStatus },
  checkout_payment_status: { type: TransactionStatus },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
});
export const Payment = model<PaymentDocument>(
  'Payment',
  paymentSchema,
  'Payment'
);
