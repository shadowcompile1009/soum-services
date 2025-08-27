import { PaymentProvider, PaymentProviderType } from '../../models/Payment';
import { AddOnSummary } from '../../models/Brand';
import { PaymentModuleName } from '../../enums/PO-module-name.enum';

export type ReturnURL = {
  url: string;
  urlType: UrlType;
};

export enum UrlType {
  SUCCESS = 'success',
  FAILURE = 'failure',
  CANCEL = 'cancel',
  NOTIFICATION = 'notification',
}
export class PurchaseProductDto {
  productId: string;
  orderId: string;
  promoCodeId: string;
  paymentType: PaymentProviderType; // will be deprecated soon
  paymentProvider?: PaymentProvider; // will be deprecated soon
  actionType: string; // this is only for old support
  returnUrls: ReturnURL[];
  lang?: string;
  paymentId?: string;
  bidAmount?: number;
  orderNumber?: string;
  nationalId?: string;
  addOns?: AddOnSummary;
  paymentModule?: PaymentModuleName;
}
