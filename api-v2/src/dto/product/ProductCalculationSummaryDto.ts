import { CommissionAnalysis } from '../../grpc/proto/commission/CommissionAnalysis';
import { PromoCodePayment } from '../../models/LegacyPromoCode';

export class ProductCalculationSummaryDto {
  productPriceSummary: ProductSPriceSummary;
  productPriceDiscountSummary: ProductPriceDiscountSummary;
  promoCode: promoCodeSummary;
  downPayment: downPaymentSummary;
  reservation: ReservationSummary;
}

export class ReservationSummary {
  reservationAmount: number;
}

export class FinancingRequestSummary {
  amount: number;
}

export class ProductSPriceSummary {
  itemSellPrice: number;
  commission: number;
  vat: number;
  shipping: number;
  grandTotal: number;
  commissionAnalysis: CommissionAnalysis;
  reservation: ReservationSummary;
  financingRequest: FinancingRequestSummary;
  paymentCardType?: string;
}

export class ProductPriceDiscountSummary extends ProductSPriceSummary {
  discountValue: number;
}

export class promoCodeSummary {
  code: string;
  id: string;
  isDefault: boolean;
  availablePayments: PromoCodePayment[];
}

export class downPaymentSummary {
  amount: number;
  remainingDownPaymentRounded: number;
}

export class ProductPriceDto {
  discountValue?: number;
  sellPrice: number;
  commission: number;
  vat: number;
  grandTotal: number;
  shipping: number;
}
