import { PaymentModuleName } from '../../enums/PO-module-name.enum';

export class ProductSummaryInputDto {
  productId: string;
  promoCode: string;
  actionType: string;
  userType: string;
  bidAmount?: number;
}

export class GetProductSummaryInputDto {
  productId: string;
  promoCode?: string;
  applyDefaultPromo?: boolean;
  actionType?: string;
  allPayments: boolean;
  userType?: string;
  paymentProvider?: string;
  paymentType?: string;
  paymentModule?: PaymentModuleName;
}
