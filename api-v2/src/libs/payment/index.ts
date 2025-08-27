import { CheckoutAddress } from '../hyperpay';

export type CheckoutRequest = {
  phoneNumber: string;
  email: string;
  name: string;
  orderId: string;
  orderNumber: string;
  paymentId: string;
  userAddress: CheckoutAddress;
  amount: number;
  currency: string;
  paymentType?: string;
  testMode?: string;
  countryCode?: string;
  userId?: string;
  lang: string;
  registerDate: Date;
  items?: PaymentItem[];
};

export type CancelRequest = {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  items?: PaymentItem[];
};

export type PaymentItem = {
  title: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  category?: string;
  productImage: string;
  productId: string;
};

export type PaymentCaptureRequest = {
  paymentId: string;
  amount: number;
  items: PaymentItem[];
};

export enum Country {
  KSA = 'SA',
}

export enum Currency {
  SAR = 'SAR',
}
