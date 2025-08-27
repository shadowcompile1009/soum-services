/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "commission";

export interface CommissionAnalysis {
  commissionTotalPercentage: number;
  commissionTotalFixed: number;
  paymentCommissionExtraFees: number;
  paymentCommission: number;
  paymentCommissionVat: number;
  nonPaymentCommission: number;
  nonPaymentCommissionVat: number;
  paymentCommissionWithVat: number;
  nonPaymentCommissionWithVat: number;
  penaltyCommission: number;
  penaltyCommissionVat: number;
  realEstateVat: number;
}

export interface CalculateCommissionSummaryResponse {
  commissionSummaries: BreakDownResponse[];
}

export interface BreakDownResponse {
  withPromo: CommissionSummaryResponse | undefined;
  withoutPromo: CommissionSummaryResponse | undefined;
}

export interface CalculateCommissionSummaryRequest {
  commission: CommissionFilters | undefined;
  product: Product | undefined;
  calculationSettings: CalculationSettings | undefined;
  promoCode: PromoCode | undefined;
  allPayments: boolean;
  paymentModuleName: string;
  paymentOption: PaymentOption | undefined;
  reservation: Reservation | undefined;
  addonIds: string[];
  financingRequest: FinancingRequest | undefined;
}

export interface CreateCommissionSummaryRequest {
  commission: CommissionFilters | undefined;
  product: Product | undefined;
  calculationSettings: CalculationSettings | undefined;
  promoCode: PromoCode | undefined;
  order: Order | undefined;
  paymentModuleName: string;
  paymentOption: PaymentOption | undefined;
  reservation: Reservation | undefined;
  addOns: AddOn[];
  financingRequest: FinancingRequest | undefined;
}

export interface UpdateSellerCommissionRequest {
  product: Product | undefined;
  sellerNewCommission: number;
}

export interface UpdateSellPriceRequest {
  product: Product | undefined;
}

export interface MigrateCommissionSummaryRequest {
  commission: CommissionFilters | undefined;
  product: Product | undefined;
  calculationSettings: MigrationCalculationSettings | undefined;
  promoCode: PromoCode | undefined;
  order: Order | undefined;
  paymentModuleName: string;
}

export interface Order {
  id: string;
}

export interface AddOn {
  id: string;
  addOnPrice: number;
}

export interface PaymentOption {
  id: string;
  paymentProvider: string;
  paymentCardType: string;
}

export interface CommissionFilters {
  userType: string;
  isBuyer: boolean;
}

export interface Product {
  id: string;
  sellPrice: number;
  priceRange: string;
  source: string;
  categoryId: string;
}

export interface CalculationSettings {
  vatPercentage: number;
  applyDeliveryFeeSPPs: boolean;
  applyDeliveryFeeMPPs: boolean;
  applyDeliveryFee: boolean;
  deliveryFeeThreshold: number;
  deliveryFee: number;
  referralFixedAmount: number;
  applyReservation: boolean;
  applyFinancing: boolean;
}

export interface MigrationCalculationSettings {
  vatPercentage: number;
  applyDeliveryFeeSPPs: boolean;
  applyDeliveryFeeMPPs: boolean;
  applyDeliveryFee: boolean;
  deliveryFeeThreshold: number;
  deliveryFee: number;
  referralFixedAmount: number;
  buyerCommissionPercentage: number;
  sellerCommissionPercentage: number;
  priceQualityExtraCommission: number;
}

export interface Reservation {
  reservationAmount: number;
  reservationRemainingAmount: number;
}

export interface FinancingRequest {
  amount: number;
}

export interface PromoCode {
  promoLimit: number;
  type: string;
  generator: string;
  discount: number;
  percentage: number;
}

export interface CommissionSummaryResponse {
  id: string;
  commission: number;
  commissionVat: number;
  deliveryFee: number;
  deliveryFeeVat: number;
  totalVat: number;
  discount: number;
  grandTotal: number;
  commissionDiscount: number;
  sellPrice: number;
  commissionAnalysis: CommissionAnalysis | undefined;
  paymentId: string;
  reservation: Reservation | undefined;
  addOnsTotal: number;
  addOnsVat: number;
  addOnsGrandTotal: number;
  realEstateVat: number;
  financingRequest: FinancingRequest | undefined;
}

export interface ProductCommissionSummaryRequest {
  orderId: string;
  productId: string;
  isBuyer: boolean;
  isOriginalBreakDown: boolean;
}

export interface ProductCommissionSummaryResponse {
  id: string;
  commission: number;
  commissionVat: number;
  deliveryFee: number;
  deliveryFeeVat: number;
  totalVat: number;
  discount: number;
  grandTotal: number;
  commissionDiscount: number;
  productId: string;
  orderId: string;
  sellPrice: number;
  commissionAnalysis: CommissionAnalysis | undefined;
  reservation: Reservation | undefined;
  financingRequest: FinancingRequest | undefined;
}

export interface CalculateAddonSummaryRequest {
  productPrice: number;
  addonSummaryCalculateData: AddonSummaryCalculateData[];
}

export interface AddonSummaryCalculateData {
  priceType: string;
  addonPrice: number;
}

export interface CalculateAddonSummaryResponse {
  addOnsTotal: number;
  addOnsVat: number;
  addOnsGrandTotal: number;
}

export const COMMISSION_PACKAGE_NAME = "commission";

export interface CommissionServiceClient {
  calculateProductCommissionSummary(
    request: CalculateCommissionSummaryRequest,
  ): Observable<CalculateCommissionSummaryResponse>;

  createProductCommissionSummary(request: CreateCommissionSummaryRequest): Observable<CommissionSummaryResponse>;

  migrateProductCommissionSummary(request: MigrateCommissionSummaryRequest): Observable<CommissionSummaryResponse>;

  getProductCommissionSummary(request: ProductCommissionSummaryRequest): Observable<ProductCommissionSummaryResponse>;

  updateSellerCommission(request: UpdateSellerCommissionRequest): Observable<ProductCommissionSummaryResponse>;

  updateSellPrice(request: UpdateSellPriceRequest): Observable<ProductCommissionSummaryResponse>;

  addSellerCommissionPenalty(request: UpdateSellerCommissionRequest): Observable<ProductCommissionSummaryResponse>;

  calculateAddonSummary(request: CalculateAddonSummaryRequest): Observable<CalculateAddonSummaryResponse>;
}

export interface CommissionServiceController {
  calculateProductCommissionSummary(
    request: CalculateCommissionSummaryRequest,
  ):
    | Promise<CalculateCommissionSummaryResponse>
    | Observable<CalculateCommissionSummaryResponse>
    | CalculateCommissionSummaryResponse;

  createProductCommissionSummary(
    request: CreateCommissionSummaryRequest,
  ): Promise<CommissionSummaryResponse> | Observable<CommissionSummaryResponse> | CommissionSummaryResponse;

  migrateProductCommissionSummary(
    request: MigrateCommissionSummaryRequest,
  ): Promise<CommissionSummaryResponse> | Observable<CommissionSummaryResponse> | CommissionSummaryResponse;

  getProductCommissionSummary(
    request: ProductCommissionSummaryRequest,
  ):
    | Promise<ProductCommissionSummaryResponse>
    | Observable<ProductCommissionSummaryResponse>
    | ProductCommissionSummaryResponse;

  updateSellerCommission(
    request: UpdateSellerCommissionRequest,
  ):
    | Promise<ProductCommissionSummaryResponse>
    | Observable<ProductCommissionSummaryResponse>
    | ProductCommissionSummaryResponse;

  updateSellPrice(
    request: UpdateSellPriceRequest,
  ):
    | Promise<ProductCommissionSummaryResponse>
    | Observable<ProductCommissionSummaryResponse>
    | ProductCommissionSummaryResponse;

  addSellerCommissionPenalty(
    request: UpdateSellerCommissionRequest,
  ):
    | Promise<ProductCommissionSummaryResponse>
    | Observable<ProductCommissionSummaryResponse>
    | ProductCommissionSummaryResponse;

  calculateAddonSummary(
    request: CalculateAddonSummaryRequest,
  ): Promise<CalculateAddonSummaryResponse> | Observable<CalculateAddonSummaryResponse> | CalculateAddonSummaryResponse;
}

export function CommissionServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "calculateProductCommissionSummary",
      "createProductCommissionSummary",
      "migrateProductCommissionSummary",
      "getProductCommissionSummary",
      "updateSellerCommission",
      "updateSellPrice",
      "addSellerCommissionPenalty",
      "calculateAddonSummary",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("CommissionService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("CommissionService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const COMMISSION_SERVICE_NAME = "CommissionService";
