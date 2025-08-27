/* eslint-disable */
import _m0 from "protobufjs/minimal";

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
  productId: string;
}

export interface CalculateCommissionSummaryResponseForList {
  calculateCommissionSummaryResponses: CalculateCommissionSummaryResponse[];
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

export interface CalculateCommissionSummaryRequestForList {
  calculateCommissionSummaryRequests: CalculateCommissionSummaryRequest[];
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

export interface ForceUpdateCommissionRequest {
  productId: string;
  orderId: string;
  grandTotal: number;
  payout: number;
  discount: number;
  buyerCommission: number;
  sellPrice: number;
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
  modelId: string;
  varientId: string;
  conditionId: string;
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
  paymentCardType?: string | undefined;
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

export interface UpdateUsageCountRequest {
  promoCodeId: string;
  count: number;
}

export interface UpdateUsageCountResponse {
  ok: boolean;
}

export interface GetPromoDetailsRequest {
  filterField: string;
  filterFieldValue: string;
}

export interface PromoCodeScope {
  promoCodeScopeType: string;
  ids: string[];
}

export interface AvailablePayment {
  paymentProvider: string;
  paymentProviderType: string;
}

export interface DetailedPromoCode {
  promoLimit?: number | undefined;
  promoType: string;
  promoGenerator: string;
  discount?: number | undefined;
  percentage?: number | undefined;
  id: string;
  userType: string;
  status: string;
  code: string;
  isDefault: boolean;
  promoCodeScope: PromoCodeScope[];
  availablePayment: AvailablePayment[];
}

export interface GetDefaultPromoCodeRequest {
}

export interface GetFeedPromosRequest {
  feedIds: string[];
}

export interface GetFeedPromosResponse {
  DetailedPromoCode: DetailedPromoCode[];
}

export interface GetFeedPromoRequest {
  feedId: string;
}

export interface GetPromosByIdsRequest {
  ids: string[];
}

export interface GetPromosByIdsResponse {
  promos: DetailedPromoCode[];
}

function createBaseCommissionAnalysis(): CommissionAnalysis {
  return {
    commissionTotalPercentage: 0,
    commissionTotalFixed: 0,
    paymentCommissionExtraFees: 0,
    paymentCommission: 0,
    paymentCommissionVat: 0,
    nonPaymentCommission: 0,
    nonPaymentCommissionVat: 0,
    paymentCommissionWithVat: 0,
    nonPaymentCommissionWithVat: 0,
    penaltyCommission: 0,
    penaltyCommissionVat: 0,
    realEstateVat: 0,
  };
}

export const CommissionAnalysis = {
  encode(message: CommissionAnalysis, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.commissionTotalPercentage !== 0) {
      writer.uint32(9).double(message.commissionTotalPercentage);
    }
    if (message.commissionTotalFixed !== 0) {
      writer.uint32(17).double(message.commissionTotalFixed);
    }
    if (message.paymentCommissionExtraFees !== 0) {
      writer.uint32(25).double(message.paymentCommissionExtraFees);
    }
    if (message.paymentCommission !== 0) {
      writer.uint32(33).double(message.paymentCommission);
    }
    if (message.paymentCommissionVat !== 0) {
      writer.uint32(41).double(message.paymentCommissionVat);
    }
    if (message.nonPaymentCommission !== 0) {
      writer.uint32(49).double(message.nonPaymentCommission);
    }
    if (message.nonPaymentCommissionVat !== 0) {
      writer.uint32(57).double(message.nonPaymentCommissionVat);
    }
    if (message.paymentCommissionWithVat !== 0) {
      writer.uint32(65).double(message.paymentCommissionWithVat);
    }
    if (message.nonPaymentCommissionWithVat !== 0) {
      writer.uint32(73).double(message.nonPaymentCommissionWithVat);
    }
    if (message.penaltyCommission !== 0) {
      writer.uint32(81).double(message.penaltyCommission);
    }
    if (message.penaltyCommissionVat !== 0) {
      writer.uint32(89).double(message.penaltyCommissionVat);
    }
    if (message.realEstateVat !== 0) {
      writer.uint32(97).double(message.realEstateVat);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommissionAnalysis {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommissionAnalysis();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.commissionTotalPercentage = reader.double();
          break;
        case 2:
          message.commissionTotalFixed = reader.double();
          break;
        case 3:
          message.paymentCommissionExtraFees = reader.double();
          break;
        case 4:
          message.paymentCommission = reader.double();
          break;
        case 5:
          message.paymentCommissionVat = reader.double();
          break;
        case 6:
          message.nonPaymentCommission = reader.double();
          break;
        case 7:
          message.nonPaymentCommissionVat = reader.double();
          break;
        case 8:
          message.paymentCommissionWithVat = reader.double();
          break;
        case 9:
          message.nonPaymentCommissionWithVat = reader.double();
          break;
        case 10:
          message.penaltyCommission = reader.double();
          break;
        case 11:
          message.penaltyCommissionVat = reader.double();
          break;
        case 12:
          message.realEstateVat = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CommissionAnalysis {
    return {
      commissionTotalPercentage: isSet(object.commissionTotalPercentage) ? Number(object.commissionTotalPercentage) : 0,
      commissionTotalFixed: isSet(object.commissionTotalFixed) ? Number(object.commissionTotalFixed) : 0,
      paymentCommissionExtraFees: isSet(object.paymentCommissionExtraFees)
        ? Number(object.paymentCommissionExtraFees)
        : 0,
      paymentCommission: isSet(object.paymentCommission) ? Number(object.paymentCommission) : 0,
      paymentCommissionVat: isSet(object.paymentCommissionVat) ? Number(object.paymentCommissionVat) : 0,
      nonPaymentCommission: isSet(object.nonPaymentCommission) ? Number(object.nonPaymentCommission) : 0,
      nonPaymentCommissionVat: isSet(object.nonPaymentCommissionVat) ? Number(object.nonPaymentCommissionVat) : 0,
      paymentCommissionWithVat: isSet(object.paymentCommissionWithVat) ? Number(object.paymentCommissionWithVat) : 0,
      nonPaymentCommissionWithVat: isSet(object.nonPaymentCommissionWithVat)
        ? Number(object.nonPaymentCommissionWithVat)
        : 0,
      penaltyCommission: isSet(object.penaltyCommission) ? Number(object.penaltyCommission) : 0,
      penaltyCommissionVat: isSet(object.penaltyCommissionVat) ? Number(object.penaltyCommissionVat) : 0,
      realEstateVat: isSet(object.realEstateVat) ? Number(object.realEstateVat) : 0,
    };
  },

  toJSON(message: CommissionAnalysis): unknown {
    const obj: any = {};
    message.commissionTotalPercentage !== undefined &&
      (obj.commissionTotalPercentage = message.commissionTotalPercentage);
    message.commissionTotalFixed !== undefined && (obj.commissionTotalFixed = message.commissionTotalFixed);
    message.paymentCommissionExtraFees !== undefined &&
      (obj.paymentCommissionExtraFees = message.paymentCommissionExtraFees);
    message.paymentCommission !== undefined && (obj.paymentCommission = message.paymentCommission);
    message.paymentCommissionVat !== undefined && (obj.paymentCommissionVat = message.paymentCommissionVat);
    message.nonPaymentCommission !== undefined && (obj.nonPaymentCommission = message.nonPaymentCommission);
    message.nonPaymentCommissionVat !== undefined && (obj.nonPaymentCommissionVat = message.nonPaymentCommissionVat);
    message.paymentCommissionWithVat !== undefined && (obj.paymentCommissionWithVat = message.paymentCommissionWithVat);
    message.nonPaymentCommissionWithVat !== undefined &&
      (obj.nonPaymentCommissionWithVat = message.nonPaymentCommissionWithVat);
    message.penaltyCommission !== undefined && (obj.penaltyCommission = message.penaltyCommission);
    message.penaltyCommissionVat !== undefined && (obj.penaltyCommissionVat = message.penaltyCommissionVat);
    message.realEstateVat !== undefined && (obj.realEstateVat = message.realEstateVat);
    return obj;
  },

  create<I extends Exact<DeepPartial<CommissionAnalysis>, I>>(base?: I): CommissionAnalysis {
    return CommissionAnalysis.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CommissionAnalysis>, I>>(object: I): CommissionAnalysis {
    const message = createBaseCommissionAnalysis();
    message.commissionTotalPercentage = object.commissionTotalPercentage ?? 0;
    message.commissionTotalFixed = object.commissionTotalFixed ?? 0;
    message.paymentCommissionExtraFees = object.paymentCommissionExtraFees ?? 0;
    message.paymentCommission = object.paymentCommission ?? 0;
    message.paymentCommissionVat = object.paymentCommissionVat ?? 0;
    message.nonPaymentCommission = object.nonPaymentCommission ?? 0;
    message.nonPaymentCommissionVat = object.nonPaymentCommissionVat ?? 0;
    message.paymentCommissionWithVat = object.paymentCommissionWithVat ?? 0;
    message.nonPaymentCommissionWithVat = object.nonPaymentCommissionWithVat ?? 0;
    message.penaltyCommission = object.penaltyCommission ?? 0;
    message.penaltyCommissionVat = object.penaltyCommissionVat ?? 0;
    message.realEstateVat = object.realEstateVat ?? 0;
    return message;
  },
};

function createBaseCalculateCommissionSummaryResponse(): CalculateCommissionSummaryResponse {
  return { commissionSummaries: [], productId: "" };
}

export const CalculateCommissionSummaryResponse = {
  encode(message: CalculateCommissionSummaryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.commissionSummaries) {
      BreakDownResponse.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.productId !== "") {
      writer.uint32(18).string(message.productId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CalculateCommissionSummaryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCalculateCommissionSummaryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.commissionSummaries.push(BreakDownResponse.decode(reader, reader.uint32()));
          break;
        case 2:
          message.productId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CalculateCommissionSummaryResponse {
    return {
      commissionSummaries: Array.isArray(object?.commissionSummaries)
        ? object.commissionSummaries.map((e: any) => BreakDownResponse.fromJSON(e))
        : [],
      productId: isSet(object.productId) ? String(object.productId) : "",
    };
  },

  toJSON(message: CalculateCommissionSummaryResponse): unknown {
    const obj: any = {};
    if (message.commissionSummaries) {
      obj.commissionSummaries = message.commissionSummaries.map((e) => e ? BreakDownResponse.toJSON(e) : undefined);
    } else {
      obj.commissionSummaries = [];
    }
    message.productId !== undefined && (obj.productId = message.productId);
    return obj;
  },

  create<I extends Exact<DeepPartial<CalculateCommissionSummaryResponse>, I>>(
    base?: I,
  ): CalculateCommissionSummaryResponse {
    return CalculateCommissionSummaryResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CalculateCommissionSummaryResponse>, I>>(
    object: I,
  ): CalculateCommissionSummaryResponse {
    const message = createBaseCalculateCommissionSummaryResponse();
    message.commissionSummaries = object.commissionSummaries?.map((e) => BreakDownResponse.fromPartial(e)) || [];
    message.productId = object.productId ?? "";
    return message;
  },
};

function createBaseCalculateCommissionSummaryResponseForList(): CalculateCommissionSummaryResponseForList {
  return { calculateCommissionSummaryResponses: [] };
}

export const CalculateCommissionSummaryResponseForList = {
  encode(message: CalculateCommissionSummaryResponseForList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.calculateCommissionSummaryResponses) {
      CalculateCommissionSummaryResponse.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CalculateCommissionSummaryResponseForList {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCalculateCommissionSummaryResponseForList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.calculateCommissionSummaryResponses.push(
            CalculateCommissionSummaryResponse.decode(reader, reader.uint32()),
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CalculateCommissionSummaryResponseForList {
    return {
      calculateCommissionSummaryResponses: Array.isArray(object?.calculateCommissionSummaryResponses)
        ? object.calculateCommissionSummaryResponses.map((e: any) => CalculateCommissionSummaryResponse.fromJSON(e))
        : [],
    };
  },

  toJSON(message: CalculateCommissionSummaryResponseForList): unknown {
    const obj: any = {};
    if (message.calculateCommissionSummaryResponses) {
      obj.calculateCommissionSummaryResponses = message.calculateCommissionSummaryResponses.map((e) =>
        e ? CalculateCommissionSummaryResponse.toJSON(e) : undefined
      );
    } else {
      obj.calculateCommissionSummaryResponses = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CalculateCommissionSummaryResponseForList>, I>>(
    base?: I,
  ): CalculateCommissionSummaryResponseForList {
    return CalculateCommissionSummaryResponseForList.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CalculateCommissionSummaryResponseForList>, I>>(
    object: I,
  ): CalculateCommissionSummaryResponseForList {
    const message = createBaseCalculateCommissionSummaryResponseForList();
    message.calculateCommissionSummaryResponses =
      object.calculateCommissionSummaryResponses?.map((e) => CalculateCommissionSummaryResponse.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBreakDownResponse(): BreakDownResponse {
  return { withPromo: undefined, withoutPromo: undefined };
}

export const BreakDownResponse = {
  encode(message: BreakDownResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.withPromo !== undefined) {
      CommissionSummaryResponse.encode(message.withPromo, writer.uint32(10).fork()).ldelim();
    }
    if (message.withoutPromo !== undefined) {
      CommissionSummaryResponse.encode(message.withoutPromo, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BreakDownResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBreakDownResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withPromo = CommissionSummaryResponse.decode(reader, reader.uint32());
          break;
        case 2:
          message.withoutPromo = CommissionSummaryResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BreakDownResponse {
    return {
      withPromo: isSet(object.withPromo) ? CommissionSummaryResponse.fromJSON(object.withPromo) : undefined,
      withoutPromo: isSet(object.withoutPromo) ? CommissionSummaryResponse.fromJSON(object.withoutPromo) : undefined,
    };
  },

  toJSON(message: BreakDownResponse): unknown {
    const obj: any = {};
    message.withPromo !== undefined &&
      (obj.withPromo = message.withPromo ? CommissionSummaryResponse.toJSON(message.withPromo) : undefined);
    message.withoutPromo !== undefined &&
      (obj.withoutPromo = message.withoutPromo ? CommissionSummaryResponse.toJSON(message.withoutPromo) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<BreakDownResponse>, I>>(base?: I): BreakDownResponse {
    return BreakDownResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BreakDownResponse>, I>>(object: I): BreakDownResponse {
    const message = createBaseBreakDownResponse();
    message.withPromo = (object.withPromo !== undefined && object.withPromo !== null)
      ? CommissionSummaryResponse.fromPartial(object.withPromo)
      : undefined;
    message.withoutPromo = (object.withoutPromo !== undefined && object.withoutPromo !== null)
      ? CommissionSummaryResponse.fromPartial(object.withoutPromo)
      : undefined;
    return message;
  },
};

function createBaseCalculateCommissionSummaryRequest(): CalculateCommissionSummaryRequest {
  return {
    commission: undefined,
    product: undefined,
    calculationSettings: undefined,
    promoCode: undefined,
    allPayments: false,
    paymentModuleName: "",
    paymentOption: undefined,
    reservation: undefined,
    addonIds: [],
    financingRequest: undefined,
  };
}

export const CalculateCommissionSummaryRequest = {
  encode(message: CalculateCommissionSummaryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.commission !== undefined) {
      CommissionFilters.encode(message.commission, writer.uint32(10).fork()).ldelim();
    }
    if (message.product !== undefined) {
      Product.encode(message.product, writer.uint32(18).fork()).ldelim();
    }
    if (message.calculationSettings !== undefined) {
      CalculationSettings.encode(message.calculationSettings, writer.uint32(26).fork()).ldelim();
    }
    if (message.promoCode !== undefined) {
      PromoCode.encode(message.promoCode, writer.uint32(34).fork()).ldelim();
    }
    if (message.allPayments === true) {
      writer.uint32(40).bool(message.allPayments);
    }
    if (message.paymentModuleName !== "") {
      writer.uint32(50).string(message.paymentModuleName);
    }
    if (message.paymentOption !== undefined) {
      PaymentOption.encode(message.paymentOption, writer.uint32(58).fork()).ldelim();
    }
    if (message.reservation !== undefined) {
      Reservation.encode(message.reservation, writer.uint32(66).fork()).ldelim();
    }
    for (const v of message.addonIds) {
      writer.uint32(74).string(v!);
    }
    if (message.financingRequest !== undefined) {
      FinancingRequest.encode(message.financingRequest, writer.uint32(82).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CalculateCommissionSummaryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCalculateCommissionSummaryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.commission = CommissionFilters.decode(reader, reader.uint32());
          break;
        case 2:
          message.product = Product.decode(reader, reader.uint32());
          break;
        case 3:
          message.calculationSettings = CalculationSettings.decode(reader, reader.uint32());
          break;
        case 4:
          message.promoCode = PromoCode.decode(reader, reader.uint32());
          break;
        case 5:
          message.allPayments = reader.bool();
          break;
        case 6:
          message.paymentModuleName = reader.string();
          break;
        case 7:
          message.paymentOption = PaymentOption.decode(reader, reader.uint32());
          break;
        case 8:
          message.reservation = Reservation.decode(reader, reader.uint32());
          break;
        case 9:
          message.addonIds.push(reader.string());
          break;
        case 10:
          message.financingRequest = FinancingRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CalculateCommissionSummaryRequest {
    return {
      commission: isSet(object.commission) ? CommissionFilters.fromJSON(object.commission) : undefined,
      product: isSet(object.product) ? Product.fromJSON(object.product) : undefined,
      calculationSettings: isSet(object.calculationSettings)
        ? CalculationSettings.fromJSON(object.calculationSettings)
        : undefined,
      promoCode: isSet(object.promoCode) ? PromoCode.fromJSON(object.promoCode) : undefined,
      allPayments: isSet(object.allPayments) ? Boolean(object.allPayments) : false,
      paymentModuleName: isSet(object.paymentModuleName) ? String(object.paymentModuleName) : "",
      paymentOption: isSet(object.paymentOption) ? PaymentOption.fromJSON(object.paymentOption) : undefined,
      reservation: isSet(object.reservation) ? Reservation.fromJSON(object.reservation) : undefined,
      addonIds: Array.isArray(object?.addonIds) ? object.addonIds.map((e: any) => String(e)) : [],
      financingRequest: isSet(object.financingRequest) ? FinancingRequest.fromJSON(object.financingRequest) : undefined,
    };
  },

  toJSON(message: CalculateCommissionSummaryRequest): unknown {
    const obj: any = {};
    message.commission !== undefined &&
      (obj.commission = message.commission ? CommissionFilters.toJSON(message.commission) : undefined);
    message.product !== undefined && (obj.product = message.product ? Product.toJSON(message.product) : undefined);
    message.calculationSettings !== undefined && (obj.calculationSettings = message.calculationSettings
      ? CalculationSettings.toJSON(message.calculationSettings)
      : undefined);
    message.promoCode !== undefined &&
      (obj.promoCode = message.promoCode ? PromoCode.toJSON(message.promoCode) : undefined);
    message.allPayments !== undefined && (obj.allPayments = message.allPayments);
    message.paymentModuleName !== undefined && (obj.paymentModuleName = message.paymentModuleName);
    message.paymentOption !== undefined &&
      (obj.paymentOption = message.paymentOption ? PaymentOption.toJSON(message.paymentOption) : undefined);
    message.reservation !== undefined &&
      (obj.reservation = message.reservation ? Reservation.toJSON(message.reservation) : undefined);
    if (message.addonIds) {
      obj.addonIds = message.addonIds.map((e) => e);
    } else {
      obj.addonIds = [];
    }
    message.financingRequest !== undefined &&
      (obj.financingRequest = message.financingRequest ? FinancingRequest.toJSON(message.financingRequest) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<CalculateCommissionSummaryRequest>, I>>(
    base?: I,
  ): CalculateCommissionSummaryRequest {
    return CalculateCommissionSummaryRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CalculateCommissionSummaryRequest>, I>>(
    object: I,
  ): CalculateCommissionSummaryRequest {
    const message = createBaseCalculateCommissionSummaryRequest();
    message.commission = (object.commission !== undefined && object.commission !== null)
      ? CommissionFilters.fromPartial(object.commission)
      : undefined;
    message.product = (object.product !== undefined && object.product !== null)
      ? Product.fromPartial(object.product)
      : undefined;
    message.calculationSettings = (object.calculationSettings !== undefined && object.calculationSettings !== null)
      ? CalculationSettings.fromPartial(object.calculationSettings)
      : undefined;
    message.promoCode = (object.promoCode !== undefined && object.promoCode !== null)
      ? PromoCode.fromPartial(object.promoCode)
      : undefined;
    message.allPayments = object.allPayments ?? false;
    message.paymentModuleName = object.paymentModuleName ?? "";
    message.paymentOption = (object.paymentOption !== undefined && object.paymentOption !== null)
      ? PaymentOption.fromPartial(object.paymentOption)
      : undefined;
    message.reservation = (object.reservation !== undefined && object.reservation !== null)
      ? Reservation.fromPartial(object.reservation)
      : undefined;
    message.addonIds = object.addonIds?.map((e) => e) || [];
    message.financingRequest = (object.financingRequest !== undefined && object.financingRequest !== null)
      ? FinancingRequest.fromPartial(object.financingRequest)
      : undefined;
    return message;
  },
};

function createBaseCalculateCommissionSummaryRequestForList(): CalculateCommissionSummaryRequestForList {
  return { calculateCommissionSummaryRequests: [] };
}

export const CalculateCommissionSummaryRequestForList = {
  encode(message: CalculateCommissionSummaryRequestForList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.calculateCommissionSummaryRequests) {
      CalculateCommissionSummaryRequest.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CalculateCommissionSummaryRequestForList {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCalculateCommissionSummaryRequestForList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.calculateCommissionSummaryRequests.push(
            CalculateCommissionSummaryRequest.decode(reader, reader.uint32()),
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CalculateCommissionSummaryRequestForList {
    return {
      calculateCommissionSummaryRequests: Array.isArray(object?.calculateCommissionSummaryRequests)
        ? object.calculateCommissionSummaryRequests.map((e: any) => CalculateCommissionSummaryRequest.fromJSON(e))
        : [],
    };
  },

  toJSON(message: CalculateCommissionSummaryRequestForList): unknown {
    const obj: any = {};
    if (message.calculateCommissionSummaryRequests) {
      obj.calculateCommissionSummaryRequests = message.calculateCommissionSummaryRequests.map((e) =>
        e ? CalculateCommissionSummaryRequest.toJSON(e) : undefined
      );
    } else {
      obj.calculateCommissionSummaryRequests = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CalculateCommissionSummaryRequestForList>, I>>(
    base?: I,
  ): CalculateCommissionSummaryRequestForList {
    return CalculateCommissionSummaryRequestForList.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CalculateCommissionSummaryRequestForList>, I>>(
    object: I,
  ): CalculateCommissionSummaryRequestForList {
    const message = createBaseCalculateCommissionSummaryRequestForList();
    message.calculateCommissionSummaryRequests =
      object.calculateCommissionSummaryRequests?.map((e) => CalculateCommissionSummaryRequest.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCreateCommissionSummaryRequest(): CreateCommissionSummaryRequest {
  return {
    commission: undefined,
    product: undefined,
    calculationSettings: undefined,
    promoCode: undefined,
    order: undefined,
    paymentModuleName: "",
    paymentOption: undefined,
    reservation: undefined,
    addOns: [],
    financingRequest: undefined,
  };
}

export const CreateCommissionSummaryRequest = {
  encode(message: CreateCommissionSummaryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.commission !== undefined) {
      CommissionFilters.encode(message.commission, writer.uint32(10).fork()).ldelim();
    }
    if (message.product !== undefined) {
      Product.encode(message.product, writer.uint32(18).fork()).ldelim();
    }
    if (message.calculationSettings !== undefined) {
      CalculationSettings.encode(message.calculationSettings, writer.uint32(26).fork()).ldelim();
    }
    if (message.promoCode !== undefined) {
      PromoCode.encode(message.promoCode, writer.uint32(34).fork()).ldelim();
    }
    if (message.order !== undefined) {
      Order.encode(message.order, writer.uint32(42).fork()).ldelim();
    }
    if (message.paymentModuleName !== "") {
      writer.uint32(50).string(message.paymentModuleName);
    }
    if (message.paymentOption !== undefined) {
      PaymentOption.encode(message.paymentOption, writer.uint32(58).fork()).ldelim();
    }
    if (message.reservation !== undefined) {
      Reservation.encode(message.reservation, writer.uint32(66).fork()).ldelim();
    }
    for (const v of message.addOns) {
      AddOn.encode(v!, writer.uint32(74).fork()).ldelim();
    }
    if (message.financingRequest !== undefined) {
      FinancingRequest.encode(message.financingRequest, writer.uint32(82).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateCommissionSummaryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateCommissionSummaryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.commission = CommissionFilters.decode(reader, reader.uint32());
          break;
        case 2:
          message.product = Product.decode(reader, reader.uint32());
          break;
        case 3:
          message.calculationSettings = CalculationSettings.decode(reader, reader.uint32());
          break;
        case 4:
          message.promoCode = PromoCode.decode(reader, reader.uint32());
          break;
        case 5:
          message.order = Order.decode(reader, reader.uint32());
          break;
        case 6:
          message.paymentModuleName = reader.string();
          break;
        case 7:
          message.paymentOption = PaymentOption.decode(reader, reader.uint32());
          break;
        case 8:
          message.reservation = Reservation.decode(reader, reader.uint32());
          break;
        case 9:
          message.addOns.push(AddOn.decode(reader, reader.uint32()));
          break;
        case 10:
          message.financingRequest = FinancingRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateCommissionSummaryRequest {
    return {
      commission: isSet(object.commission) ? CommissionFilters.fromJSON(object.commission) : undefined,
      product: isSet(object.product) ? Product.fromJSON(object.product) : undefined,
      calculationSettings: isSet(object.calculationSettings)
        ? CalculationSettings.fromJSON(object.calculationSettings)
        : undefined,
      promoCode: isSet(object.promoCode) ? PromoCode.fromJSON(object.promoCode) : undefined,
      order: isSet(object.order) ? Order.fromJSON(object.order) : undefined,
      paymentModuleName: isSet(object.paymentModuleName) ? String(object.paymentModuleName) : "",
      paymentOption: isSet(object.paymentOption) ? PaymentOption.fromJSON(object.paymentOption) : undefined,
      reservation: isSet(object.reservation) ? Reservation.fromJSON(object.reservation) : undefined,
      addOns: Array.isArray(object?.addOns) ? object.addOns.map((e: any) => AddOn.fromJSON(e)) : [],
      financingRequest: isSet(object.financingRequest) ? FinancingRequest.fromJSON(object.financingRequest) : undefined,
    };
  },

  toJSON(message: CreateCommissionSummaryRequest): unknown {
    const obj: any = {};
    message.commission !== undefined &&
      (obj.commission = message.commission ? CommissionFilters.toJSON(message.commission) : undefined);
    message.product !== undefined && (obj.product = message.product ? Product.toJSON(message.product) : undefined);
    message.calculationSettings !== undefined && (obj.calculationSettings = message.calculationSettings
      ? CalculationSettings.toJSON(message.calculationSettings)
      : undefined);
    message.promoCode !== undefined &&
      (obj.promoCode = message.promoCode ? PromoCode.toJSON(message.promoCode) : undefined);
    message.order !== undefined && (obj.order = message.order ? Order.toJSON(message.order) : undefined);
    message.paymentModuleName !== undefined && (obj.paymentModuleName = message.paymentModuleName);
    message.paymentOption !== undefined &&
      (obj.paymentOption = message.paymentOption ? PaymentOption.toJSON(message.paymentOption) : undefined);
    message.reservation !== undefined &&
      (obj.reservation = message.reservation ? Reservation.toJSON(message.reservation) : undefined);
    if (message.addOns) {
      obj.addOns = message.addOns.map((e) => e ? AddOn.toJSON(e) : undefined);
    } else {
      obj.addOns = [];
    }
    message.financingRequest !== undefined &&
      (obj.financingRequest = message.financingRequest ? FinancingRequest.toJSON(message.financingRequest) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateCommissionSummaryRequest>, I>>(base?: I): CreateCommissionSummaryRequest {
    return CreateCommissionSummaryRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateCommissionSummaryRequest>, I>>(
    object: I,
  ): CreateCommissionSummaryRequest {
    const message = createBaseCreateCommissionSummaryRequest();
    message.commission = (object.commission !== undefined && object.commission !== null)
      ? CommissionFilters.fromPartial(object.commission)
      : undefined;
    message.product = (object.product !== undefined && object.product !== null)
      ? Product.fromPartial(object.product)
      : undefined;
    message.calculationSettings = (object.calculationSettings !== undefined && object.calculationSettings !== null)
      ? CalculationSettings.fromPartial(object.calculationSettings)
      : undefined;
    message.promoCode = (object.promoCode !== undefined && object.promoCode !== null)
      ? PromoCode.fromPartial(object.promoCode)
      : undefined;
    message.order = (object.order !== undefined && object.order !== null) ? Order.fromPartial(object.order) : undefined;
    message.paymentModuleName = object.paymentModuleName ?? "";
    message.paymentOption = (object.paymentOption !== undefined && object.paymentOption !== null)
      ? PaymentOption.fromPartial(object.paymentOption)
      : undefined;
    message.reservation = (object.reservation !== undefined && object.reservation !== null)
      ? Reservation.fromPartial(object.reservation)
      : undefined;
    message.addOns = object.addOns?.map((e) => AddOn.fromPartial(e)) || [];
    message.financingRequest = (object.financingRequest !== undefined && object.financingRequest !== null)
      ? FinancingRequest.fromPartial(object.financingRequest)
      : undefined;
    return message;
  },
};

function createBaseUpdateSellerCommissionRequest(): UpdateSellerCommissionRequest {
  return { product: undefined, sellerNewCommission: 0 };
}

export const UpdateSellerCommissionRequest = {
  encode(message: UpdateSellerCommissionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.product !== undefined) {
      Product.encode(message.product, writer.uint32(10).fork()).ldelim();
    }
    if (message.sellerNewCommission !== 0) {
      writer.uint32(17).double(message.sellerNewCommission);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateSellerCommissionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateSellerCommissionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.product = Product.decode(reader, reader.uint32());
          break;
        case 2:
          message.sellerNewCommission = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateSellerCommissionRequest {
    return {
      product: isSet(object.product) ? Product.fromJSON(object.product) : undefined,
      sellerNewCommission: isSet(object.sellerNewCommission) ? Number(object.sellerNewCommission) : 0,
    };
  },

  toJSON(message: UpdateSellerCommissionRequest): unknown {
    const obj: any = {};
    message.product !== undefined && (obj.product = message.product ? Product.toJSON(message.product) : undefined);
    message.sellerNewCommission !== undefined && (obj.sellerNewCommission = message.sellerNewCommission);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateSellerCommissionRequest>, I>>(base?: I): UpdateSellerCommissionRequest {
    return UpdateSellerCommissionRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateSellerCommissionRequest>, I>>(
    object: I,
  ): UpdateSellerCommissionRequest {
    const message = createBaseUpdateSellerCommissionRequest();
    message.product = (object.product !== undefined && object.product !== null)
      ? Product.fromPartial(object.product)
      : undefined;
    message.sellerNewCommission = object.sellerNewCommission ?? 0;
    return message;
  },
};

function createBaseForceUpdateCommissionRequest(): ForceUpdateCommissionRequest {
  return { productId: "", orderId: "", grandTotal: 0, payout: 0, discount: 0, buyerCommission: 0, sellPrice: 0 };
}

export const ForceUpdateCommissionRequest = {
  encode(message: ForceUpdateCommissionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productId !== "") {
      writer.uint32(10).string(message.productId);
    }
    if (message.orderId !== "") {
      writer.uint32(18).string(message.orderId);
    }
    if (message.grandTotal !== 0) {
      writer.uint32(25).double(message.grandTotal);
    }
    if (message.payout !== 0) {
      writer.uint32(33).double(message.payout);
    }
    if (message.discount !== 0) {
      writer.uint32(41).double(message.discount);
    }
    if (message.buyerCommission !== 0) {
      writer.uint32(49).double(message.buyerCommission);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(57).double(message.sellPrice);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ForceUpdateCommissionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseForceUpdateCommissionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        case 2:
          message.orderId = reader.string();
          break;
        case 3:
          message.grandTotal = reader.double();
          break;
        case 4:
          message.payout = reader.double();
          break;
        case 5:
          message.discount = reader.double();
          break;
        case 6:
          message.buyerCommission = reader.double();
          break;
        case 7:
          message.sellPrice = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ForceUpdateCommissionRequest {
    return {
      productId: isSet(object.productId) ? String(object.productId) : "",
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
      grandTotal: isSet(object.grandTotal) ? Number(object.grandTotal) : 0,
      payout: isSet(object.payout) ? Number(object.payout) : 0,
      discount: isSet(object.discount) ? Number(object.discount) : 0,
      buyerCommission: isSet(object.buyerCommission) ? Number(object.buyerCommission) : 0,
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
    };
  },

  toJSON(message: ForceUpdateCommissionRequest): unknown {
    const obj: any = {};
    message.productId !== undefined && (obj.productId = message.productId);
    message.orderId !== undefined && (obj.orderId = message.orderId);
    message.grandTotal !== undefined && (obj.grandTotal = message.grandTotal);
    message.payout !== undefined && (obj.payout = message.payout);
    message.discount !== undefined && (obj.discount = message.discount);
    message.buyerCommission !== undefined && (obj.buyerCommission = message.buyerCommission);
    message.sellPrice !== undefined && (obj.sellPrice = message.sellPrice);
    return obj;
  },

  create<I extends Exact<DeepPartial<ForceUpdateCommissionRequest>, I>>(base?: I): ForceUpdateCommissionRequest {
    return ForceUpdateCommissionRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ForceUpdateCommissionRequest>, I>>(object: I): ForceUpdateCommissionRequest {
    const message = createBaseForceUpdateCommissionRequest();
    message.productId = object.productId ?? "";
    message.orderId = object.orderId ?? "";
    message.grandTotal = object.grandTotal ?? 0;
    message.payout = object.payout ?? 0;
    message.discount = object.discount ?? 0;
    message.buyerCommission = object.buyerCommission ?? 0;
    message.sellPrice = object.sellPrice ?? 0;
    return message;
  },
};

function createBaseUpdateSellPriceRequest(): UpdateSellPriceRequest {
  return { product: undefined };
}

export const UpdateSellPriceRequest = {
  encode(message: UpdateSellPriceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.product !== undefined) {
      Product.encode(message.product, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateSellPriceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateSellPriceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.product = Product.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateSellPriceRequest {
    return { product: isSet(object.product) ? Product.fromJSON(object.product) : undefined };
  },

  toJSON(message: UpdateSellPriceRequest): unknown {
    const obj: any = {};
    message.product !== undefined && (obj.product = message.product ? Product.toJSON(message.product) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateSellPriceRequest>, I>>(base?: I): UpdateSellPriceRequest {
    return UpdateSellPriceRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateSellPriceRequest>, I>>(object: I): UpdateSellPriceRequest {
    const message = createBaseUpdateSellPriceRequest();
    message.product = (object.product !== undefined && object.product !== null)
      ? Product.fromPartial(object.product)
      : undefined;
    return message;
  },
};

function createBaseMigrateCommissionSummaryRequest(): MigrateCommissionSummaryRequest {
  return {
    commission: undefined,
    product: undefined,
    calculationSettings: undefined,
    promoCode: undefined,
    order: undefined,
    paymentModuleName: "",
  };
}

export const MigrateCommissionSummaryRequest = {
  encode(message: MigrateCommissionSummaryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.commission !== undefined) {
      CommissionFilters.encode(message.commission, writer.uint32(10).fork()).ldelim();
    }
    if (message.product !== undefined) {
      Product.encode(message.product, writer.uint32(18).fork()).ldelim();
    }
    if (message.calculationSettings !== undefined) {
      MigrationCalculationSettings.encode(message.calculationSettings, writer.uint32(26).fork()).ldelim();
    }
    if (message.promoCode !== undefined) {
      PromoCode.encode(message.promoCode, writer.uint32(34).fork()).ldelim();
    }
    if (message.order !== undefined) {
      Order.encode(message.order, writer.uint32(42).fork()).ldelim();
    }
    if (message.paymentModuleName !== "") {
      writer.uint32(50).string(message.paymentModuleName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MigrateCommissionSummaryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMigrateCommissionSummaryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.commission = CommissionFilters.decode(reader, reader.uint32());
          break;
        case 2:
          message.product = Product.decode(reader, reader.uint32());
          break;
        case 3:
          message.calculationSettings = MigrationCalculationSettings.decode(reader, reader.uint32());
          break;
        case 4:
          message.promoCode = PromoCode.decode(reader, reader.uint32());
          break;
        case 5:
          message.order = Order.decode(reader, reader.uint32());
          break;
        case 6:
          message.paymentModuleName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MigrateCommissionSummaryRequest {
    return {
      commission: isSet(object.commission) ? CommissionFilters.fromJSON(object.commission) : undefined,
      product: isSet(object.product) ? Product.fromJSON(object.product) : undefined,
      calculationSettings: isSet(object.calculationSettings)
        ? MigrationCalculationSettings.fromJSON(object.calculationSettings)
        : undefined,
      promoCode: isSet(object.promoCode) ? PromoCode.fromJSON(object.promoCode) : undefined,
      order: isSet(object.order) ? Order.fromJSON(object.order) : undefined,
      paymentModuleName: isSet(object.paymentModuleName) ? String(object.paymentModuleName) : "",
    };
  },

  toJSON(message: MigrateCommissionSummaryRequest): unknown {
    const obj: any = {};
    message.commission !== undefined &&
      (obj.commission = message.commission ? CommissionFilters.toJSON(message.commission) : undefined);
    message.product !== undefined && (obj.product = message.product ? Product.toJSON(message.product) : undefined);
    message.calculationSettings !== undefined && (obj.calculationSettings = message.calculationSettings
      ? MigrationCalculationSettings.toJSON(message.calculationSettings)
      : undefined);
    message.promoCode !== undefined &&
      (obj.promoCode = message.promoCode ? PromoCode.toJSON(message.promoCode) : undefined);
    message.order !== undefined && (obj.order = message.order ? Order.toJSON(message.order) : undefined);
    message.paymentModuleName !== undefined && (obj.paymentModuleName = message.paymentModuleName);
    return obj;
  },

  create<I extends Exact<DeepPartial<MigrateCommissionSummaryRequest>, I>>(base?: I): MigrateCommissionSummaryRequest {
    return MigrateCommissionSummaryRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MigrateCommissionSummaryRequest>, I>>(
    object: I,
  ): MigrateCommissionSummaryRequest {
    const message = createBaseMigrateCommissionSummaryRequest();
    message.commission = (object.commission !== undefined && object.commission !== null)
      ? CommissionFilters.fromPartial(object.commission)
      : undefined;
    message.product = (object.product !== undefined && object.product !== null)
      ? Product.fromPartial(object.product)
      : undefined;
    message.calculationSettings = (object.calculationSettings !== undefined && object.calculationSettings !== null)
      ? MigrationCalculationSettings.fromPartial(object.calculationSettings)
      : undefined;
    message.promoCode = (object.promoCode !== undefined && object.promoCode !== null)
      ? PromoCode.fromPartial(object.promoCode)
      : undefined;
    message.order = (object.order !== undefined && object.order !== null) ? Order.fromPartial(object.order) : undefined;
    message.paymentModuleName = object.paymentModuleName ?? "";
    return message;
  },
};

function createBaseOrder(): Order {
  return { id: "" };
}

export const Order = {
  encode(message: Order, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Order {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOrder();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Order {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: Order): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<Order>, I>>(base?: I): Order {
    return Order.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Order>, I>>(object: I): Order {
    const message = createBaseOrder();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseAddOn(): AddOn {
  return { id: "", addOnPrice: 0 };
}

export const AddOn = {
  encode(message: AddOn, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.addOnPrice !== 0) {
      writer.uint32(17).double(message.addOnPrice);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddOn {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddOn();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.addOnPrice = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddOn {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      addOnPrice: isSet(object.addOnPrice) ? Number(object.addOnPrice) : 0,
    };
  },

  toJSON(message: AddOn): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.addOnPrice !== undefined && (obj.addOnPrice = message.addOnPrice);
    return obj;
  },

  create<I extends Exact<DeepPartial<AddOn>, I>>(base?: I): AddOn {
    return AddOn.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AddOn>, I>>(object: I): AddOn {
    const message = createBaseAddOn();
    message.id = object.id ?? "";
    message.addOnPrice = object.addOnPrice ?? 0;
    return message;
  },
};

function createBasePaymentOption(): PaymentOption {
  return { id: "", paymentProvider: "", paymentCardType: "" };
}

export const PaymentOption = {
  encode(message: PaymentOption, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.paymentProvider !== "") {
      writer.uint32(18).string(message.paymentProvider);
    }
    if (message.paymentCardType !== "") {
      writer.uint32(26).string(message.paymentCardType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PaymentOption {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePaymentOption();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.paymentProvider = reader.string();
          break;
        case 3:
          message.paymentCardType = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PaymentOption {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      paymentProvider: isSet(object.paymentProvider) ? String(object.paymentProvider) : "",
      paymentCardType: isSet(object.paymentCardType) ? String(object.paymentCardType) : "",
    };
  },

  toJSON(message: PaymentOption): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.paymentProvider !== undefined && (obj.paymentProvider = message.paymentProvider);
    message.paymentCardType !== undefined && (obj.paymentCardType = message.paymentCardType);
    return obj;
  },

  create<I extends Exact<DeepPartial<PaymentOption>, I>>(base?: I): PaymentOption {
    return PaymentOption.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PaymentOption>, I>>(object: I): PaymentOption {
    const message = createBasePaymentOption();
    message.id = object.id ?? "";
    message.paymentProvider = object.paymentProvider ?? "";
    message.paymentCardType = object.paymentCardType ?? "";
    return message;
  },
};

function createBaseCommissionFilters(): CommissionFilters {
  return { userType: "", isBuyer: false };
}

export const CommissionFilters = {
  encode(message: CommissionFilters, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userType !== "") {
      writer.uint32(10).string(message.userType);
    }
    if (message.isBuyer === true) {
      writer.uint32(16).bool(message.isBuyer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommissionFilters {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommissionFilters();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userType = reader.string();
          break;
        case 2:
          message.isBuyer = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CommissionFilters {
    return {
      userType: isSet(object.userType) ? String(object.userType) : "",
      isBuyer: isSet(object.isBuyer) ? Boolean(object.isBuyer) : false,
    };
  },

  toJSON(message: CommissionFilters): unknown {
    const obj: any = {};
    message.userType !== undefined && (obj.userType = message.userType);
    message.isBuyer !== undefined && (obj.isBuyer = message.isBuyer);
    return obj;
  },

  create<I extends Exact<DeepPartial<CommissionFilters>, I>>(base?: I): CommissionFilters {
    return CommissionFilters.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CommissionFilters>, I>>(object: I): CommissionFilters {
    const message = createBaseCommissionFilters();
    message.userType = object.userType ?? "";
    message.isBuyer = object.isBuyer ?? false;
    return message;
  },
};

function createBaseProduct(): Product {
  return {
    id: "",
    sellPrice: 0,
    priceRange: "",
    source: "",
    categoryId: "",
    modelId: "",
    varientId: "",
    conditionId: "",
  };
}

export const Product = {
  encode(message: Product, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(16).int32(message.sellPrice);
    }
    if (message.priceRange !== "") {
      writer.uint32(26).string(message.priceRange);
    }
    if (message.source !== "") {
      writer.uint32(34).string(message.source);
    }
    if (message.categoryId !== "") {
      writer.uint32(42).string(message.categoryId);
    }
    if (message.modelId !== "") {
      writer.uint32(50).string(message.modelId);
    }
    if (message.varientId !== "") {
      writer.uint32(58).string(message.varientId);
    }
    if (message.conditionId !== "") {
      writer.uint32(66).string(message.conditionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Product {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProduct();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.sellPrice = reader.int32();
          break;
        case 3:
          message.priceRange = reader.string();
          break;
        case 4:
          message.source = reader.string();
          break;
        case 5:
          message.categoryId = reader.string();
          break;
        case 6:
          message.modelId = reader.string();
          break;
        case 7:
          message.varientId = reader.string();
          break;
        case 8:
          message.conditionId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Product {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
      priceRange: isSet(object.priceRange) ? String(object.priceRange) : "",
      source: isSet(object.source) ? String(object.source) : "",
      categoryId: isSet(object.categoryId) ? String(object.categoryId) : "",
      modelId: isSet(object.modelId) ? String(object.modelId) : "",
      varientId: isSet(object.varientId) ? String(object.varientId) : "",
      conditionId: isSet(object.conditionId) ? String(object.conditionId) : "",
    };
  },

  toJSON(message: Product): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.sellPrice !== undefined && (obj.sellPrice = Math.round(message.sellPrice));
    message.priceRange !== undefined && (obj.priceRange = message.priceRange);
    message.source !== undefined && (obj.source = message.source);
    message.categoryId !== undefined && (obj.categoryId = message.categoryId);
    message.modelId !== undefined && (obj.modelId = message.modelId);
    message.varientId !== undefined && (obj.varientId = message.varientId);
    message.conditionId !== undefined && (obj.conditionId = message.conditionId);
    return obj;
  },

  create<I extends Exact<DeepPartial<Product>, I>>(base?: I): Product {
    return Product.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Product>, I>>(object: I): Product {
    const message = createBaseProduct();
    message.id = object.id ?? "";
    message.sellPrice = object.sellPrice ?? 0;
    message.priceRange = object.priceRange ?? "";
    message.source = object.source ?? "";
    message.categoryId = object.categoryId ?? "";
    message.modelId = object.modelId ?? "";
    message.varientId = object.varientId ?? "";
    message.conditionId = object.conditionId ?? "";
    return message;
  },
};

function createBaseCalculationSettings(): CalculationSettings {
  return {
    vatPercentage: 0,
    applyDeliveryFeeSPPs: false,
    applyDeliveryFeeMPPs: false,
    applyDeliveryFee: false,
    deliveryFeeThreshold: 0,
    deliveryFee: 0,
    referralFixedAmount: 0,
    applyReservation: false,
    applyFinancing: false,
  };
}

export const CalculationSettings = {
  encode(message: CalculationSettings, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.vatPercentage !== 0) {
      writer.uint32(8).int32(message.vatPercentage);
    }
    if (message.applyDeliveryFeeSPPs === true) {
      writer.uint32(16).bool(message.applyDeliveryFeeSPPs);
    }
    if (message.applyDeliveryFeeMPPs === true) {
      writer.uint32(24).bool(message.applyDeliveryFeeMPPs);
    }
    if (message.applyDeliveryFee === true) {
      writer.uint32(32).bool(message.applyDeliveryFee);
    }
    if (message.deliveryFeeThreshold !== 0) {
      writer.uint32(40).int32(message.deliveryFeeThreshold);
    }
    if (message.deliveryFee !== 0) {
      writer.uint32(48).int32(message.deliveryFee);
    }
    if (message.referralFixedAmount !== 0) {
      writer.uint32(56).int32(message.referralFixedAmount);
    }
    if (message.applyReservation === true) {
      writer.uint32(64).bool(message.applyReservation);
    }
    if (message.applyFinancing === true) {
      writer.uint32(72).bool(message.applyFinancing);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CalculationSettings {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCalculationSettings();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.vatPercentage = reader.int32();
          break;
        case 2:
          message.applyDeliveryFeeSPPs = reader.bool();
          break;
        case 3:
          message.applyDeliveryFeeMPPs = reader.bool();
          break;
        case 4:
          message.applyDeliveryFee = reader.bool();
          break;
        case 5:
          message.deliveryFeeThreshold = reader.int32();
          break;
        case 6:
          message.deliveryFee = reader.int32();
          break;
        case 7:
          message.referralFixedAmount = reader.int32();
          break;
        case 8:
          message.applyReservation = reader.bool();
          break;
        case 9:
          message.applyFinancing = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CalculationSettings {
    return {
      vatPercentage: isSet(object.vatPercentage) ? Number(object.vatPercentage) : 0,
      applyDeliveryFeeSPPs: isSet(object.applyDeliveryFeeSPPs) ? Boolean(object.applyDeliveryFeeSPPs) : false,
      applyDeliveryFeeMPPs: isSet(object.applyDeliveryFeeMPPs) ? Boolean(object.applyDeliveryFeeMPPs) : false,
      applyDeliveryFee: isSet(object.applyDeliveryFee) ? Boolean(object.applyDeliveryFee) : false,
      deliveryFeeThreshold: isSet(object.deliveryFeeThreshold) ? Number(object.deliveryFeeThreshold) : 0,
      deliveryFee: isSet(object.deliveryFee) ? Number(object.deliveryFee) : 0,
      referralFixedAmount: isSet(object.referralFixedAmount) ? Number(object.referralFixedAmount) : 0,
      applyReservation: isSet(object.applyReservation) ? Boolean(object.applyReservation) : false,
      applyFinancing: isSet(object.applyFinancing) ? Boolean(object.applyFinancing) : false,
    };
  },

  toJSON(message: CalculationSettings): unknown {
    const obj: any = {};
    message.vatPercentage !== undefined && (obj.vatPercentage = Math.round(message.vatPercentage));
    message.applyDeliveryFeeSPPs !== undefined && (obj.applyDeliveryFeeSPPs = message.applyDeliveryFeeSPPs);
    message.applyDeliveryFeeMPPs !== undefined && (obj.applyDeliveryFeeMPPs = message.applyDeliveryFeeMPPs);
    message.applyDeliveryFee !== undefined && (obj.applyDeliveryFee = message.applyDeliveryFee);
    message.deliveryFeeThreshold !== undefined && (obj.deliveryFeeThreshold = Math.round(message.deliveryFeeThreshold));
    message.deliveryFee !== undefined && (obj.deliveryFee = Math.round(message.deliveryFee));
    message.referralFixedAmount !== undefined && (obj.referralFixedAmount = Math.round(message.referralFixedAmount));
    message.applyReservation !== undefined && (obj.applyReservation = message.applyReservation);
    message.applyFinancing !== undefined && (obj.applyFinancing = message.applyFinancing);
    return obj;
  },

  create<I extends Exact<DeepPartial<CalculationSettings>, I>>(base?: I): CalculationSettings {
    return CalculationSettings.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CalculationSettings>, I>>(object: I): CalculationSettings {
    const message = createBaseCalculationSettings();
    message.vatPercentage = object.vatPercentage ?? 0;
    message.applyDeliveryFeeSPPs = object.applyDeliveryFeeSPPs ?? false;
    message.applyDeliveryFeeMPPs = object.applyDeliveryFeeMPPs ?? false;
    message.applyDeliveryFee = object.applyDeliveryFee ?? false;
    message.deliveryFeeThreshold = object.deliveryFeeThreshold ?? 0;
    message.deliveryFee = object.deliveryFee ?? 0;
    message.referralFixedAmount = object.referralFixedAmount ?? 0;
    message.applyReservation = object.applyReservation ?? false;
    message.applyFinancing = object.applyFinancing ?? false;
    return message;
  },
};

function createBaseMigrationCalculationSettings(): MigrationCalculationSettings {
  return {
    vatPercentage: 0,
    applyDeliveryFeeSPPs: false,
    applyDeliveryFeeMPPs: false,
    applyDeliveryFee: false,
    deliveryFeeThreshold: 0,
    deliveryFee: 0,
    referralFixedAmount: 0,
    buyerCommissionPercentage: 0,
    sellerCommissionPercentage: 0,
    priceQualityExtraCommission: 0,
  };
}

export const MigrationCalculationSettings = {
  encode(message: MigrationCalculationSettings, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.vatPercentage !== 0) {
      writer.uint32(8).int32(message.vatPercentage);
    }
    if (message.applyDeliveryFeeSPPs === true) {
      writer.uint32(16).bool(message.applyDeliveryFeeSPPs);
    }
    if (message.applyDeliveryFeeMPPs === true) {
      writer.uint32(24).bool(message.applyDeliveryFeeMPPs);
    }
    if (message.applyDeliveryFee === true) {
      writer.uint32(32).bool(message.applyDeliveryFee);
    }
    if (message.deliveryFeeThreshold !== 0) {
      writer.uint32(40).int32(message.deliveryFeeThreshold);
    }
    if (message.deliveryFee !== 0) {
      writer.uint32(48).int32(message.deliveryFee);
    }
    if (message.referralFixedAmount !== 0) {
      writer.uint32(56).int32(message.referralFixedAmount);
    }
    if (message.buyerCommissionPercentage !== 0) {
      writer.uint32(64).int32(message.buyerCommissionPercentage);
    }
    if (message.sellerCommissionPercentage !== 0) {
      writer.uint32(72).int32(message.sellerCommissionPercentage);
    }
    if (message.priceQualityExtraCommission !== 0) {
      writer.uint32(80).int32(message.priceQualityExtraCommission);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MigrationCalculationSettings {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMigrationCalculationSettings();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.vatPercentage = reader.int32();
          break;
        case 2:
          message.applyDeliveryFeeSPPs = reader.bool();
          break;
        case 3:
          message.applyDeliveryFeeMPPs = reader.bool();
          break;
        case 4:
          message.applyDeliveryFee = reader.bool();
          break;
        case 5:
          message.deliveryFeeThreshold = reader.int32();
          break;
        case 6:
          message.deliveryFee = reader.int32();
          break;
        case 7:
          message.referralFixedAmount = reader.int32();
          break;
        case 8:
          message.buyerCommissionPercentage = reader.int32();
          break;
        case 9:
          message.sellerCommissionPercentage = reader.int32();
          break;
        case 10:
          message.priceQualityExtraCommission = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MigrationCalculationSettings {
    return {
      vatPercentage: isSet(object.vatPercentage) ? Number(object.vatPercentage) : 0,
      applyDeliveryFeeSPPs: isSet(object.applyDeliveryFeeSPPs) ? Boolean(object.applyDeliveryFeeSPPs) : false,
      applyDeliveryFeeMPPs: isSet(object.applyDeliveryFeeMPPs) ? Boolean(object.applyDeliveryFeeMPPs) : false,
      applyDeliveryFee: isSet(object.applyDeliveryFee) ? Boolean(object.applyDeliveryFee) : false,
      deliveryFeeThreshold: isSet(object.deliveryFeeThreshold) ? Number(object.deliveryFeeThreshold) : 0,
      deliveryFee: isSet(object.deliveryFee) ? Number(object.deliveryFee) : 0,
      referralFixedAmount: isSet(object.referralFixedAmount) ? Number(object.referralFixedAmount) : 0,
      buyerCommissionPercentage: isSet(object.buyerCommissionPercentage) ? Number(object.buyerCommissionPercentage) : 0,
      sellerCommissionPercentage: isSet(object.sellerCommissionPercentage)
        ? Number(object.sellerCommissionPercentage)
        : 0,
      priceQualityExtraCommission: isSet(object.priceQualityExtraCommission)
        ? Number(object.priceQualityExtraCommission)
        : 0,
    };
  },

  toJSON(message: MigrationCalculationSettings): unknown {
    const obj: any = {};
    message.vatPercentage !== undefined && (obj.vatPercentage = Math.round(message.vatPercentage));
    message.applyDeliveryFeeSPPs !== undefined && (obj.applyDeliveryFeeSPPs = message.applyDeliveryFeeSPPs);
    message.applyDeliveryFeeMPPs !== undefined && (obj.applyDeliveryFeeMPPs = message.applyDeliveryFeeMPPs);
    message.applyDeliveryFee !== undefined && (obj.applyDeliveryFee = message.applyDeliveryFee);
    message.deliveryFeeThreshold !== undefined && (obj.deliveryFeeThreshold = Math.round(message.deliveryFeeThreshold));
    message.deliveryFee !== undefined && (obj.deliveryFee = Math.round(message.deliveryFee));
    message.referralFixedAmount !== undefined && (obj.referralFixedAmount = Math.round(message.referralFixedAmount));
    message.buyerCommissionPercentage !== undefined &&
      (obj.buyerCommissionPercentage = Math.round(message.buyerCommissionPercentage));
    message.sellerCommissionPercentage !== undefined &&
      (obj.sellerCommissionPercentage = Math.round(message.sellerCommissionPercentage));
    message.priceQualityExtraCommission !== undefined &&
      (obj.priceQualityExtraCommission = Math.round(message.priceQualityExtraCommission));
    return obj;
  },

  create<I extends Exact<DeepPartial<MigrationCalculationSettings>, I>>(base?: I): MigrationCalculationSettings {
    return MigrationCalculationSettings.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MigrationCalculationSettings>, I>>(object: I): MigrationCalculationSettings {
    const message = createBaseMigrationCalculationSettings();
    message.vatPercentage = object.vatPercentage ?? 0;
    message.applyDeliveryFeeSPPs = object.applyDeliveryFeeSPPs ?? false;
    message.applyDeliveryFeeMPPs = object.applyDeliveryFeeMPPs ?? false;
    message.applyDeliveryFee = object.applyDeliveryFee ?? false;
    message.deliveryFeeThreshold = object.deliveryFeeThreshold ?? 0;
    message.deliveryFee = object.deliveryFee ?? 0;
    message.referralFixedAmount = object.referralFixedAmount ?? 0;
    message.buyerCommissionPercentage = object.buyerCommissionPercentage ?? 0;
    message.sellerCommissionPercentage = object.sellerCommissionPercentage ?? 0;
    message.priceQualityExtraCommission = object.priceQualityExtraCommission ?? 0;
    return message;
  },
};

function createBaseReservation(): Reservation {
  return { reservationAmount: 0, reservationRemainingAmount: 0 };
}

export const Reservation = {
  encode(message: Reservation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reservationAmount !== 0) {
      writer.uint32(9).double(message.reservationAmount);
    }
    if (message.reservationRemainingAmount !== 0) {
      writer.uint32(97).double(message.reservationRemainingAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Reservation {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReservation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.reservationAmount = reader.double();
          break;
        case 12:
          message.reservationRemainingAmount = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Reservation {
    return {
      reservationAmount: isSet(object.reservationAmount) ? Number(object.reservationAmount) : 0,
      reservationRemainingAmount: isSet(object.reservationRemainingAmount)
        ? Number(object.reservationRemainingAmount)
        : 0,
    };
  },

  toJSON(message: Reservation): unknown {
    const obj: any = {};
    message.reservationAmount !== undefined && (obj.reservationAmount = message.reservationAmount);
    message.reservationRemainingAmount !== undefined &&
      (obj.reservationRemainingAmount = message.reservationRemainingAmount);
    return obj;
  },

  create<I extends Exact<DeepPartial<Reservation>, I>>(base?: I): Reservation {
    return Reservation.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Reservation>, I>>(object: I): Reservation {
    const message = createBaseReservation();
    message.reservationAmount = object.reservationAmount ?? 0;
    message.reservationRemainingAmount = object.reservationRemainingAmount ?? 0;
    return message;
  },
};

function createBaseFinancingRequest(): FinancingRequest {
  return { amount: 0 };
}

export const FinancingRequest = {
  encode(message: FinancingRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.amount !== 0) {
      writer.uint32(9).double(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FinancingRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFinancingRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FinancingRequest {
    return { amount: isSet(object.amount) ? Number(object.amount) : 0 };
  },

  toJSON(message: FinancingRequest): unknown {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount);
    return obj;
  },

  create<I extends Exact<DeepPartial<FinancingRequest>, I>>(base?: I): FinancingRequest {
    return FinancingRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FinancingRequest>, I>>(object: I): FinancingRequest {
    const message = createBaseFinancingRequest();
    message.amount = object.amount ?? 0;
    return message;
  },
};

function createBasePromoCode(): PromoCode {
  return { promoLimit: 0, type: "", generator: "", discount: 0, percentage: 0 };
}

export const PromoCode = {
  encode(message: PromoCode, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.promoLimit !== 0) {
      writer.uint32(8).int32(message.promoLimit);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.generator !== "") {
      writer.uint32(26).string(message.generator);
    }
    if (message.discount !== 0) {
      writer.uint32(32).int32(message.discount);
    }
    if (message.percentage !== 0) {
      writer.uint32(40).int32(message.percentage);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PromoCode {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePromoCode();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.promoLimit = reader.int32();
          break;
        case 2:
          message.type = reader.string();
          break;
        case 3:
          message.generator = reader.string();
          break;
        case 4:
          message.discount = reader.int32();
          break;
        case 5:
          message.percentage = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PromoCode {
    return {
      promoLimit: isSet(object.promoLimit) ? Number(object.promoLimit) : 0,
      type: isSet(object.type) ? String(object.type) : "",
      generator: isSet(object.generator) ? String(object.generator) : "",
      discount: isSet(object.discount) ? Number(object.discount) : 0,
      percentage: isSet(object.percentage) ? Number(object.percentage) : 0,
    };
  },

  toJSON(message: PromoCode): unknown {
    const obj: any = {};
    message.promoLimit !== undefined && (obj.promoLimit = Math.round(message.promoLimit));
    message.type !== undefined && (obj.type = message.type);
    message.generator !== undefined && (obj.generator = message.generator);
    message.discount !== undefined && (obj.discount = Math.round(message.discount));
    message.percentage !== undefined && (obj.percentage = Math.round(message.percentage));
    return obj;
  },

  create<I extends Exact<DeepPartial<PromoCode>, I>>(base?: I): PromoCode {
    return PromoCode.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PromoCode>, I>>(object: I): PromoCode {
    const message = createBasePromoCode();
    message.promoLimit = object.promoLimit ?? 0;
    message.type = object.type ?? "";
    message.generator = object.generator ?? "";
    message.discount = object.discount ?? 0;
    message.percentage = object.percentage ?? 0;
    return message;
  },
};

function createBaseCommissionSummaryResponse(): CommissionSummaryResponse {
  return {
    id: "",
    commission: 0,
    commissionVat: 0,
    deliveryFee: 0,
    deliveryFeeVat: 0,
    totalVat: 0,
    discount: 0,
    grandTotal: 0,
    commissionDiscount: 0,
    sellPrice: 0,
    commissionAnalysis: undefined,
    paymentId: "",
    reservation: undefined,
    addOnsTotal: 0,
    addOnsVat: 0,
    addOnsGrandTotal: 0,
    realEstateVat: 0,
    financingRequest: undefined,
    paymentCardType: undefined,
  };
}

export const CommissionSummaryResponse = {
  encode(message: CommissionSummaryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.commission !== 0) {
      writer.uint32(17).double(message.commission);
    }
    if (message.commissionVat !== 0) {
      writer.uint32(25).double(message.commissionVat);
    }
    if (message.deliveryFee !== 0) {
      writer.uint32(33).double(message.deliveryFee);
    }
    if (message.deliveryFeeVat !== 0) {
      writer.uint32(41).double(message.deliveryFeeVat);
    }
    if (message.totalVat !== 0) {
      writer.uint32(49).double(message.totalVat);
    }
    if (message.discount !== 0) {
      writer.uint32(57).double(message.discount);
    }
    if (message.grandTotal !== 0) {
      writer.uint32(65).double(message.grandTotal);
    }
    if (message.commissionDiscount !== 0) {
      writer.uint32(73).double(message.commissionDiscount);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(81).double(message.sellPrice);
    }
    if (message.commissionAnalysis !== undefined) {
      CommissionAnalysis.encode(message.commissionAnalysis, writer.uint32(90).fork()).ldelim();
    }
    if (message.paymentId !== "") {
      writer.uint32(98).string(message.paymentId);
    }
    if (message.reservation !== undefined) {
      Reservation.encode(message.reservation, writer.uint32(106).fork()).ldelim();
    }
    if (message.addOnsTotal !== 0) {
      writer.uint32(113).double(message.addOnsTotal);
    }
    if (message.addOnsVat !== 0) {
      writer.uint32(121).double(message.addOnsVat);
    }
    if (message.addOnsGrandTotal !== 0) {
      writer.uint32(129).double(message.addOnsGrandTotal);
    }
    if (message.realEstateVat !== 0) {
      writer.uint32(137).double(message.realEstateVat);
    }
    if (message.financingRequest !== undefined) {
      FinancingRequest.encode(message.financingRequest, writer.uint32(146).fork()).ldelim();
    }
    if (message.paymentCardType !== undefined) {
      writer.uint32(154).string(message.paymentCardType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommissionSummaryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommissionSummaryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.commission = reader.double();
          break;
        case 3:
          message.commissionVat = reader.double();
          break;
        case 4:
          message.deliveryFee = reader.double();
          break;
        case 5:
          message.deliveryFeeVat = reader.double();
          break;
        case 6:
          message.totalVat = reader.double();
          break;
        case 7:
          message.discount = reader.double();
          break;
        case 8:
          message.grandTotal = reader.double();
          break;
        case 9:
          message.commissionDiscount = reader.double();
          break;
        case 10:
          message.sellPrice = reader.double();
          break;
        case 11:
          message.commissionAnalysis = CommissionAnalysis.decode(reader, reader.uint32());
          break;
        case 12:
          message.paymentId = reader.string();
          break;
        case 13:
          message.reservation = Reservation.decode(reader, reader.uint32());
          break;
        case 14:
          message.addOnsTotal = reader.double();
          break;
        case 15:
          message.addOnsVat = reader.double();
          break;
        case 16:
          message.addOnsGrandTotal = reader.double();
          break;
        case 17:
          message.realEstateVat = reader.double();
          break;
        case 18:
          message.financingRequest = FinancingRequest.decode(reader, reader.uint32());
          break;
        case 19:
          message.paymentCardType = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CommissionSummaryResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      commission: isSet(object.commission) ? Number(object.commission) : 0,
      commissionVat: isSet(object.commissionVat) ? Number(object.commissionVat) : 0,
      deliveryFee: isSet(object.deliveryFee) ? Number(object.deliveryFee) : 0,
      deliveryFeeVat: isSet(object.deliveryFeeVat) ? Number(object.deliveryFeeVat) : 0,
      totalVat: isSet(object.totalVat) ? Number(object.totalVat) : 0,
      discount: isSet(object.discount) ? Number(object.discount) : 0,
      grandTotal: isSet(object.grandTotal) ? Number(object.grandTotal) : 0,
      commissionDiscount: isSet(object.commissionDiscount) ? Number(object.commissionDiscount) : 0,
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
      commissionAnalysis: isSet(object.commissionAnalysis)
        ? CommissionAnalysis.fromJSON(object.commissionAnalysis)
        : undefined,
      paymentId: isSet(object.paymentId) ? String(object.paymentId) : "",
      reservation: isSet(object.reservation) ? Reservation.fromJSON(object.reservation) : undefined,
      addOnsTotal: isSet(object.addOnsTotal) ? Number(object.addOnsTotal) : 0,
      addOnsVat: isSet(object.addOnsVat) ? Number(object.addOnsVat) : 0,
      addOnsGrandTotal: isSet(object.addOnsGrandTotal) ? Number(object.addOnsGrandTotal) : 0,
      realEstateVat: isSet(object.realEstateVat) ? Number(object.realEstateVat) : 0,
      financingRequest: isSet(object.financingRequest) ? FinancingRequest.fromJSON(object.financingRequest) : undefined,
      paymentCardType: isSet(object.paymentCardType) ? String(object.paymentCardType) : undefined,
    };
  },

  toJSON(message: CommissionSummaryResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.commission !== undefined && (obj.commission = message.commission);
    message.commissionVat !== undefined && (obj.commissionVat = message.commissionVat);
    message.deliveryFee !== undefined && (obj.deliveryFee = message.deliveryFee);
    message.deliveryFeeVat !== undefined && (obj.deliveryFeeVat = message.deliveryFeeVat);
    message.totalVat !== undefined && (obj.totalVat = message.totalVat);
    message.discount !== undefined && (obj.discount = message.discount);
    message.grandTotal !== undefined && (obj.grandTotal = message.grandTotal);
    message.commissionDiscount !== undefined && (obj.commissionDiscount = message.commissionDiscount);
    message.sellPrice !== undefined && (obj.sellPrice = message.sellPrice);
    message.commissionAnalysis !== undefined && (obj.commissionAnalysis = message.commissionAnalysis
      ? CommissionAnalysis.toJSON(message.commissionAnalysis)
      : undefined);
    message.paymentId !== undefined && (obj.paymentId = message.paymentId);
    message.reservation !== undefined &&
      (obj.reservation = message.reservation ? Reservation.toJSON(message.reservation) : undefined);
    message.addOnsTotal !== undefined && (obj.addOnsTotal = message.addOnsTotal);
    message.addOnsVat !== undefined && (obj.addOnsVat = message.addOnsVat);
    message.addOnsGrandTotal !== undefined && (obj.addOnsGrandTotal = message.addOnsGrandTotal);
    message.realEstateVat !== undefined && (obj.realEstateVat = message.realEstateVat);
    message.financingRequest !== undefined &&
      (obj.financingRequest = message.financingRequest ? FinancingRequest.toJSON(message.financingRequest) : undefined);
    message.paymentCardType !== undefined && (obj.paymentCardType = message.paymentCardType);
    return obj;
  },

  create<I extends Exact<DeepPartial<CommissionSummaryResponse>, I>>(base?: I): CommissionSummaryResponse {
    return CommissionSummaryResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CommissionSummaryResponse>, I>>(object: I): CommissionSummaryResponse {
    const message = createBaseCommissionSummaryResponse();
    message.id = object.id ?? "";
    message.commission = object.commission ?? 0;
    message.commissionVat = object.commissionVat ?? 0;
    message.deliveryFee = object.deliveryFee ?? 0;
    message.deliveryFeeVat = object.deliveryFeeVat ?? 0;
    message.totalVat = object.totalVat ?? 0;
    message.discount = object.discount ?? 0;
    message.grandTotal = object.grandTotal ?? 0;
    message.commissionDiscount = object.commissionDiscount ?? 0;
    message.sellPrice = object.sellPrice ?? 0;
    message.commissionAnalysis = (object.commissionAnalysis !== undefined && object.commissionAnalysis !== null)
      ? CommissionAnalysis.fromPartial(object.commissionAnalysis)
      : undefined;
    message.paymentId = object.paymentId ?? "";
    message.reservation = (object.reservation !== undefined && object.reservation !== null)
      ? Reservation.fromPartial(object.reservation)
      : undefined;
    message.addOnsTotal = object.addOnsTotal ?? 0;
    message.addOnsVat = object.addOnsVat ?? 0;
    message.addOnsGrandTotal = object.addOnsGrandTotal ?? 0;
    message.realEstateVat = object.realEstateVat ?? 0;
    message.financingRequest = (object.financingRequest !== undefined && object.financingRequest !== null)
      ? FinancingRequest.fromPartial(object.financingRequest)
      : undefined;
    message.paymentCardType = object.paymentCardType ?? undefined;
    return message;
  },
};

function createBaseProductCommissionSummaryRequest(): ProductCommissionSummaryRequest {
  return { orderId: "", productId: "", isBuyer: false, isOriginalBreakDown: false };
}

export const ProductCommissionSummaryRequest = {
  encode(message: ProductCommissionSummaryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderId !== "") {
      writer.uint32(10).string(message.orderId);
    }
    if (message.productId !== "") {
      writer.uint32(18).string(message.productId);
    }
    if (message.isBuyer === true) {
      writer.uint32(24).bool(message.isBuyer);
    }
    if (message.isOriginalBreakDown === true) {
      writer.uint32(32).bool(message.isOriginalBreakDown);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProductCommissionSummaryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProductCommissionSummaryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderId = reader.string();
          break;
        case 2:
          message.productId = reader.string();
          break;
        case 3:
          message.isBuyer = reader.bool();
          break;
        case 4:
          message.isOriginalBreakDown = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProductCommissionSummaryRequest {
    return {
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
      productId: isSet(object.productId) ? String(object.productId) : "",
      isBuyer: isSet(object.isBuyer) ? Boolean(object.isBuyer) : false,
      isOriginalBreakDown: isSet(object.isOriginalBreakDown) ? Boolean(object.isOriginalBreakDown) : false,
    };
  },

  toJSON(message: ProductCommissionSummaryRequest): unknown {
    const obj: any = {};
    message.orderId !== undefined && (obj.orderId = message.orderId);
    message.productId !== undefined && (obj.productId = message.productId);
    message.isBuyer !== undefined && (obj.isBuyer = message.isBuyer);
    message.isOriginalBreakDown !== undefined && (obj.isOriginalBreakDown = message.isOriginalBreakDown);
    return obj;
  },

  create<I extends Exact<DeepPartial<ProductCommissionSummaryRequest>, I>>(base?: I): ProductCommissionSummaryRequest {
    return ProductCommissionSummaryRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ProductCommissionSummaryRequest>, I>>(
    object: I,
  ): ProductCommissionSummaryRequest {
    const message = createBaseProductCommissionSummaryRequest();
    message.orderId = object.orderId ?? "";
    message.productId = object.productId ?? "";
    message.isBuyer = object.isBuyer ?? false;
    message.isOriginalBreakDown = object.isOriginalBreakDown ?? false;
    return message;
  },
};

function createBaseProductCommissionSummaryResponse(): ProductCommissionSummaryResponse {
  return {
    id: "",
    commission: 0,
    commissionVat: 0,
    deliveryFee: 0,
    deliveryFeeVat: 0,
    totalVat: 0,
    discount: 0,
    grandTotal: 0,
    commissionDiscount: 0,
    productId: "",
    orderId: "",
    sellPrice: 0,
    commissionAnalysis: undefined,
    reservation: undefined,
    financingRequest: undefined,
  };
}

export const ProductCommissionSummaryResponse = {
  encode(message: ProductCommissionSummaryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.commission !== 0) {
      writer.uint32(17).double(message.commission);
    }
    if (message.commissionVat !== 0) {
      writer.uint32(25).double(message.commissionVat);
    }
    if (message.deliveryFee !== 0) {
      writer.uint32(33).double(message.deliveryFee);
    }
    if (message.deliveryFeeVat !== 0) {
      writer.uint32(41).double(message.deliveryFeeVat);
    }
    if (message.totalVat !== 0) {
      writer.uint32(49).double(message.totalVat);
    }
    if (message.discount !== 0) {
      writer.uint32(57).double(message.discount);
    }
    if (message.grandTotal !== 0) {
      writer.uint32(65).double(message.grandTotal);
    }
    if (message.commissionDiscount !== 0) {
      writer.uint32(73).double(message.commissionDiscount);
    }
    if (message.productId !== "") {
      writer.uint32(82).string(message.productId);
    }
    if (message.orderId !== "") {
      writer.uint32(90).string(message.orderId);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(97).double(message.sellPrice);
    }
    if (message.commissionAnalysis !== undefined) {
      CommissionAnalysis.encode(message.commissionAnalysis, writer.uint32(106).fork()).ldelim();
    }
    if (message.reservation !== undefined) {
      Reservation.encode(message.reservation, writer.uint32(114).fork()).ldelim();
    }
    if (message.financingRequest !== undefined) {
      FinancingRequest.encode(message.financingRequest, writer.uint32(122).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProductCommissionSummaryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProductCommissionSummaryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.commission = reader.double();
          break;
        case 3:
          message.commissionVat = reader.double();
          break;
        case 4:
          message.deliveryFee = reader.double();
          break;
        case 5:
          message.deliveryFeeVat = reader.double();
          break;
        case 6:
          message.totalVat = reader.double();
          break;
        case 7:
          message.discount = reader.double();
          break;
        case 8:
          message.grandTotal = reader.double();
          break;
        case 9:
          message.commissionDiscount = reader.double();
          break;
        case 10:
          message.productId = reader.string();
          break;
        case 11:
          message.orderId = reader.string();
          break;
        case 12:
          message.sellPrice = reader.double();
          break;
        case 13:
          message.commissionAnalysis = CommissionAnalysis.decode(reader, reader.uint32());
          break;
        case 14:
          message.reservation = Reservation.decode(reader, reader.uint32());
          break;
        case 15:
          message.financingRequest = FinancingRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProductCommissionSummaryResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      commission: isSet(object.commission) ? Number(object.commission) : 0,
      commissionVat: isSet(object.commissionVat) ? Number(object.commissionVat) : 0,
      deliveryFee: isSet(object.deliveryFee) ? Number(object.deliveryFee) : 0,
      deliveryFeeVat: isSet(object.deliveryFeeVat) ? Number(object.deliveryFeeVat) : 0,
      totalVat: isSet(object.totalVat) ? Number(object.totalVat) : 0,
      discount: isSet(object.discount) ? Number(object.discount) : 0,
      grandTotal: isSet(object.grandTotal) ? Number(object.grandTotal) : 0,
      commissionDiscount: isSet(object.commissionDiscount) ? Number(object.commissionDiscount) : 0,
      productId: isSet(object.productId) ? String(object.productId) : "",
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
      commissionAnalysis: isSet(object.commissionAnalysis)
        ? CommissionAnalysis.fromJSON(object.commissionAnalysis)
        : undefined,
      reservation: isSet(object.reservation) ? Reservation.fromJSON(object.reservation) : undefined,
      financingRequest: isSet(object.financingRequest) ? FinancingRequest.fromJSON(object.financingRequest) : undefined,
    };
  },

  toJSON(message: ProductCommissionSummaryResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.commission !== undefined && (obj.commission = message.commission);
    message.commissionVat !== undefined && (obj.commissionVat = message.commissionVat);
    message.deliveryFee !== undefined && (obj.deliveryFee = message.deliveryFee);
    message.deliveryFeeVat !== undefined && (obj.deliveryFeeVat = message.deliveryFeeVat);
    message.totalVat !== undefined && (obj.totalVat = message.totalVat);
    message.discount !== undefined && (obj.discount = message.discount);
    message.grandTotal !== undefined && (obj.grandTotal = message.grandTotal);
    message.commissionDiscount !== undefined && (obj.commissionDiscount = message.commissionDiscount);
    message.productId !== undefined && (obj.productId = message.productId);
    message.orderId !== undefined && (obj.orderId = message.orderId);
    message.sellPrice !== undefined && (obj.sellPrice = message.sellPrice);
    message.commissionAnalysis !== undefined && (obj.commissionAnalysis = message.commissionAnalysis
      ? CommissionAnalysis.toJSON(message.commissionAnalysis)
      : undefined);
    message.reservation !== undefined &&
      (obj.reservation = message.reservation ? Reservation.toJSON(message.reservation) : undefined);
    message.financingRequest !== undefined &&
      (obj.financingRequest = message.financingRequest ? FinancingRequest.toJSON(message.financingRequest) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<ProductCommissionSummaryResponse>, I>>(
    base?: I,
  ): ProductCommissionSummaryResponse {
    return ProductCommissionSummaryResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ProductCommissionSummaryResponse>, I>>(
    object: I,
  ): ProductCommissionSummaryResponse {
    const message = createBaseProductCommissionSummaryResponse();
    message.id = object.id ?? "";
    message.commission = object.commission ?? 0;
    message.commissionVat = object.commissionVat ?? 0;
    message.deliveryFee = object.deliveryFee ?? 0;
    message.deliveryFeeVat = object.deliveryFeeVat ?? 0;
    message.totalVat = object.totalVat ?? 0;
    message.discount = object.discount ?? 0;
    message.grandTotal = object.grandTotal ?? 0;
    message.commissionDiscount = object.commissionDiscount ?? 0;
    message.productId = object.productId ?? "";
    message.orderId = object.orderId ?? "";
    message.sellPrice = object.sellPrice ?? 0;
    message.commissionAnalysis = (object.commissionAnalysis !== undefined && object.commissionAnalysis !== null)
      ? CommissionAnalysis.fromPartial(object.commissionAnalysis)
      : undefined;
    message.reservation = (object.reservation !== undefined && object.reservation !== null)
      ? Reservation.fromPartial(object.reservation)
      : undefined;
    message.financingRequest = (object.financingRequest !== undefined && object.financingRequest !== null)
      ? FinancingRequest.fromPartial(object.financingRequest)
      : undefined;
    return message;
  },
};

function createBaseCalculateAddonSummaryRequest(): CalculateAddonSummaryRequest {
  return { productPrice: 0, addonSummaryCalculateData: [] };
}

export const CalculateAddonSummaryRequest = {
  encode(message: CalculateAddonSummaryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productPrice !== 0) {
      writer.uint32(9).double(message.productPrice);
    }
    for (const v of message.addonSummaryCalculateData) {
      AddonSummaryCalculateData.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CalculateAddonSummaryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCalculateAddonSummaryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productPrice = reader.double();
          break;
        case 2:
          message.addonSummaryCalculateData.push(AddonSummaryCalculateData.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CalculateAddonSummaryRequest {
    return {
      productPrice: isSet(object.productPrice) ? Number(object.productPrice) : 0,
      addonSummaryCalculateData: Array.isArray(object?.addonSummaryCalculateData)
        ? object.addonSummaryCalculateData.map((e: any) => AddonSummaryCalculateData.fromJSON(e))
        : [],
    };
  },

  toJSON(message: CalculateAddonSummaryRequest): unknown {
    const obj: any = {};
    message.productPrice !== undefined && (obj.productPrice = message.productPrice);
    if (message.addonSummaryCalculateData) {
      obj.addonSummaryCalculateData = message.addonSummaryCalculateData.map((e) =>
        e ? AddonSummaryCalculateData.toJSON(e) : undefined
      );
    } else {
      obj.addonSummaryCalculateData = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CalculateAddonSummaryRequest>, I>>(base?: I): CalculateAddonSummaryRequest {
    return CalculateAddonSummaryRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CalculateAddonSummaryRequest>, I>>(object: I): CalculateAddonSummaryRequest {
    const message = createBaseCalculateAddonSummaryRequest();
    message.productPrice = object.productPrice ?? 0;
    message.addonSummaryCalculateData =
      object.addonSummaryCalculateData?.map((e) => AddonSummaryCalculateData.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAddonSummaryCalculateData(): AddonSummaryCalculateData {
  return { priceType: "", addonPrice: 0 };
}

export const AddonSummaryCalculateData = {
  encode(message: AddonSummaryCalculateData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.priceType !== "") {
      writer.uint32(10).string(message.priceType);
    }
    if (message.addonPrice !== 0) {
      writer.uint32(17).double(message.addonPrice);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddonSummaryCalculateData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddonSummaryCalculateData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.priceType = reader.string();
          break;
        case 2:
          message.addonPrice = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddonSummaryCalculateData {
    return {
      priceType: isSet(object.priceType) ? String(object.priceType) : "",
      addonPrice: isSet(object.addonPrice) ? Number(object.addonPrice) : 0,
    };
  },

  toJSON(message: AddonSummaryCalculateData): unknown {
    const obj: any = {};
    message.priceType !== undefined && (obj.priceType = message.priceType);
    message.addonPrice !== undefined && (obj.addonPrice = message.addonPrice);
    return obj;
  },

  create<I extends Exact<DeepPartial<AddonSummaryCalculateData>, I>>(base?: I): AddonSummaryCalculateData {
    return AddonSummaryCalculateData.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AddonSummaryCalculateData>, I>>(object: I): AddonSummaryCalculateData {
    const message = createBaseAddonSummaryCalculateData();
    message.priceType = object.priceType ?? "";
    message.addonPrice = object.addonPrice ?? 0;
    return message;
  },
};

function createBaseCalculateAddonSummaryResponse(): CalculateAddonSummaryResponse {
  return { addOnsTotal: 0, addOnsVat: 0, addOnsGrandTotal: 0 };
}

export const CalculateAddonSummaryResponse = {
  encode(message: CalculateAddonSummaryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.addOnsTotal !== 0) {
      writer.uint32(9).double(message.addOnsTotal);
    }
    if (message.addOnsVat !== 0) {
      writer.uint32(17).double(message.addOnsVat);
    }
    if (message.addOnsGrandTotal !== 0) {
      writer.uint32(25).double(message.addOnsGrandTotal);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CalculateAddonSummaryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCalculateAddonSummaryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.addOnsTotal = reader.double();
          break;
        case 2:
          message.addOnsVat = reader.double();
          break;
        case 3:
          message.addOnsGrandTotal = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CalculateAddonSummaryResponse {
    return {
      addOnsTotal: isSet(object.addOnsTotal) ? Number(object.addOnsTotal) : 0,
      addOnsVat: isSet(object.addOnsVat) ? Number(object.addOnsVat) : 0,
      addOnsGrandTotal: isSet(object.addOnsGrandTotal) ? Number(object.addOnsGrandTotal) : 0,
    };
  },

  toJSON(message: CalculateAddonSummaryResponse): unknown {
    const obj: any = {};
    message.addOnsTotal !== undefined && (obj.addOnsTotal = message.addOnsTotal);
    message.addOnsVat !== undefined && (obj.addOnsVat = message.addOnsVat);
    message.addOnsGrandTotal !== undefined && (obj.addOnsGrandTotal = message.addOnsGrandTotal);
    return obj;
  },

  create<I extends Exact<DeepPartial<CalculateAddonSummaryResponse>, I>>(base?: I): CalculateAddonSummaryResponse {
    return CalculateAddonSummaryResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CalculateAddonSummaryResponse>, I>>(
    object: I,
  ): CalculateAddonSummaryResponse {
    const message = createBaseCalculateAddonSummaryResponse();
    message.addOnsTotal = object.addOnsTotal ?? 0;
    message.addOnsVat = object.addOnsVat ?? 0;
    message.addOnsGrandTotal = object.addOnsGrandTotal ?? 0;
    return message;
  },
};

function createBaseUpdateUsageCountRequest(): UpdateUsageCountRequest {
  return { promoCodeId: "", count: 0 };
}

export const UpdateUsageCountRequest = {
  encode(message: UpdateUsageCountRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.promoCodeId !== "") {
      writer.uint32(10).string(message.promoCodeId);
    }
    if (message.count !== 0) {
      writer.uint32(16).int32(message.count);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateUsageCountRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateUsageCountRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.promoCodeId = reader.string();
          break;
        case 2:
          message.count = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateUsageCountRequest {
    return {
      promoCodeId: isSet(object.promoCodeId) ? String(object.promoCodeId) : "",
      count: isSet(object.count) ? Number(object.count) : 0,
    };
  },

  toJSON(message: UpdateUsageCountRequest): unknown {
    const obj: any = {};
    message.promoCodeId !== undefined && (obj.promoCodeId = message.promoCodeId);
    message.count !== undefined && (obj.count = Math.round(message.count));
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateUsageCountRequest>, I>>(base?: I): UpdateUsageCountRequest {
    return UpdateUsageCountRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateUsageCountRequest>, I>>(object: I): UpdateUsageCountRequest {
    const message = createBaseUpdateUsageCountRequest();
    message.promoCodeId = object.promoCodeId ?? "";
    message.count = object.count ?? 0;
    return message;
  },
};

function createBaseUpdateUsageCountResponse(): UpdateUsageCountResponse {
  return { ok: false };
}

export const UpdateUsageCountResponse = {
  encode(message: UpdateUsageCountResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ok === true) {
      writer.uint32(8).bool(message.ok);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateUsageCountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateUsageCountResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ok = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateUsageCountResponse {
    return { ok: isSet(object.ok) ? Boolean(object.ok) : false };
  },

  toJSON(message: UpdateUsageCountResponse): unknown {
    const obj: any = {};
    message.ok !== undefined && (obj.ok = message.ok);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateUsageCountResponse>, I>>(base?: I): UpdateUsageCountResponse {
    return UpdateUsageCountResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateUsageCountResponse>, I>>(object: I): UpdateUsageCountResponse {
    const message = createBaseUpdateUsageCountResponse();
    message.ok = object.ok ?? false;
    return message;
  },
};

function createBaseGetPromoDetailsRequest(): GetPromoDetailsRequest {
  return { filterField: "", filterFieldValue: "" };
}

export const GetPromoDetailsRequest = {
  encode(message: GetPromoDetailsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.filterField !== "") {
      writer.uint32(10).string(message.filterField);
    }
    if (message.filterFieldValue !== "") {
      writer.uint32(18).string(message.filterFieldValue);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPromoDetailsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPromoDetailsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.filterField = reader.string();
          break;
        case 2:
          message.filterFieldValue = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPromoDetailsRequest {
    return {
      filterField: isSet(object.filterField) ? String(object.filterField) : "",
      filterFieldValue: isSet(object.filterFieldValue) ? String(object.filterFieldValue) : "",
    };
  },

  toJSON(message: GetPromoDetailsRequest): unknown {
    const obj: any = {};
    message.filterField !== undefined && (obj.filterField = message.filterField);
    message.filterFieldValue !== undefined && (obj.filterFieldValue = message.filterFieldValue);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPromoDetailsRequest>, I>>(base?: I): GetPromoDetailsRequest {
    return GetPromoDetailsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPromoDetailsRequest>, I>>(object: I): GetPromoDetailsRequest {
    const message = createBaseGetPromoDetailsRequest();
    message.filterField = object.filterField ?? "";
    message.filterFieldValue = object.filterFieldValue ?? "";
    return message;
  },
};

function createBasePromoCodeScope(): PromoCodeScope {
  return { promoCodeScopeType: "", ids: [] };
}

export const PromoCodeScope = {
  encode(message: PromoCodeScope, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.promoCodeScopeType !== "") {
      writer.uint32(10).string(message.promoCodeScopeType);
    }
    for (const v of message.ids) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PromoCodeScope {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePromoCodeScope();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.promoCodeScopeType = reader.string();
          break;
        case 2:
          message.ids.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PromoCodeScope {
    return {
      promoCodeScopeType: isSet(object.promoCodeScopeType) ? String(object.promoCodeScopeType) : "",
      ids: Array.isArray(object?.ids) ? object.ids.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: PromoCodeScope): unknown {
    const obj: any = {};
    message.promoCodeScopeType !== undefined && (obj.promoCodeScopeType = message.promoCodeScopeType);
    if (message.ids) {
      obj.ids = message.ids.map((e) => e);
    } else {
      obj.ids = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PromoCodeScope>, I>>(base?: I): PromoCodeScope {
    return PromoCodeScope.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PromoCodeScope>, I>>(object: I): PromoCodeScope {
    const message = createBasePromoCodeScope();
    message.promoCodeScopeType = object.promoCodeScopeType ?? "";
    message.ids = object.ids?.map((e) => e) || [];
    return message;
  },
};

function createBaseAvailablePayment(): AvailablePayment {
  return { paymentProvider: "", paymentProviderType: "" };
}

export const AvailablePayment = {
  encode(message: AvailablePayment, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.paymentProvider !== "") {
      writer.uint32(10).string(message.paymentProvider);
    }
    if (message.paymentProviderType !== "") {
      writer.uint32(18).string(message.paymentProviderType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AvailablePayment {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAvailablePayment();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.paymentProvider = reader.string();
          break;
        case 2:
          message.paymentProviderType = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AvailablePayment {
    return {
      paymentProvider: isSet(object.paymentProvider) ? String(object.paymentProvider) : "",
      paymentProviderType: isSet(object.paymentProviderType) ? String(object.paymentProviderType) : "",
    };
  },

  toJSON(message: AvailablePayment): unknown {
    const obj: any = {};
    message.paymentProvider !== undefined && (obj.paymentProvider = message.paymentProvider);
    message.paymentProviderType !== undefined && (obj.paymentProviderType = message.paymentProviderType);
    return obj;
  },

  create<I extends Exact<DeepPartial<AvailablePayment>, I>>(base?: I): AvailablePayment {
    return AvailablePayment.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AvailablePayment>, I>>(object: I): AvailablePayment {
    const message = createBaseAvailablePayment();
    message.paymentProvider = object.paymentProvider ?? "";
    message.paymentProviderType = object.paymentProviderType ?? "";
    return message;
  },
};

function createBaseDetailedPromoCode(): DetailedPromoCode {
  return {
    promoLimit: undefined,
    promoType: "",
    promoGenerator: "",
    discount: undefined,
    percentage: undefined,
    id: "",
    userType: "",
    status: "",
    code: "",
    isDefault: false,
    promoCodeScope: [],
    availablePayment: [],
  };
}

export const DetailedPromoCode = {
  encode(message: DetailedPromoCode, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.promoLimit !== undefined) {
      writer.uint32(13).float(message.promoLimit);
    }
    if (message.promoType !== "") {
      writer.uint32(18).string(message.promoType);
    }
    if (message.promoGenerator !== "") {
      writer.uint32(26).string(message.promoGenerator);
    }
    if (message.discount !== undefined) {
      writer.uint32(37).float(message.discount);
    }
    if (message.percentage !== undefined) {
      writer.uint32(45).float(message.percentage);
    }
    if (message.id !== "") {
      writer.uint32(50).string(message.id);
    }
    if (message.userType !== "") {
      writer.uint32(58).string(message.userType);
    }
    if (message.status !== "") {
      writer.uint32(66).string(message.status);
    }
    if (message.code !== "") {
      writer.uint32(74).string(message.code);
    }
    if (message.isDefault === true) {
      writer.uint32(80).bool(message.isDefault);
    }
    for (const v of message.promoCodeScope) {
      PromoCodeScope.encode(v!, writer.uint32(90).fork()).ldelim();
    }
    for (const v of message.availablePayment) {
      AvailablePayment.encode(v!, writer.uint32(98).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DetailedPromoCode {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDetailedPromoCode();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.promoLimit = reader.float();
          break;
        case 2:
          message.promoType = reader.string();
          break;
        case 3:
          message.promoGenerator = reader.string();
          break;
        case 4:
          message.discount = reader.float();
          break;
        case 5:
          message.percentage = reader.float();
          break;
        case 6:
          message.id = reader.string();
          break;
        case 7:
          message.userType = reader.string();
          break;
        case 8:
          message.status = reader.string();
          break;
        case 9:
          message.code = reader.string();
          break;
        case 10:
          message.isDefault = reader.bool();
          break;
        case 11:
          message.promoCodeScope.push(PromoCodeScope.decode(reader, reader.uint32()));
          break;
        case 12:
          message.availablePayment.push(AvailablePayment.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DetailedPromoCode {
    return {
      promoLimit: isSet(object.promoLimit) ? Number(object.promoLimit) : undefined,
      promoType: isSet(object.promoType) ? String(object.promoType) : "",
      promoGenerator: isSet(object.promoGenerator) ? String(object.promoGenerator) : "",
      discount: isSet(object.discount) ? Number(object.discount) : undefined,
      percentage: isSet(object.percentage) ? Number(object.percentage) : undefined,
      id: isSet(object.id) ? String(object.id) : "",
      userType: isSet(object.userType) ? String(object.userType) : "",
      status: isSet(object.status) ? String(object.status) : "",
      code: isSet(object.code) ? String(object.code) : "",
      isDefault: isSet(object.isDefault) ? Boolean(object.isDefault) : false,
      promoCodeScope: Array.isArray(object?.promoCodeScope)
        ? object.promoCodeScope.map((e: any) => PromoCodeScope.fromJSON(e))
        : [],
      availablePayment: Array.isArray(object?.availablePayment)
        ? object.availablePayment.map((e: any) => AvailablePayment.fromJSON(e))
        : [],
    };
  },

  toJSON(message: DetailedPromoCode): unknown {
    const obj: any = {};
    message.promoLimit !== undefined && (obj.promoLimit = message.promoLimit);
    message.promoType !== undefined && (obj.promoType = message.promoType);
    message.promoGenerator !== undefined && (obj.promoGenerator = message.promoGenerator);
    message.discount !== undefined && (obj.discount = message.discount);
    message.percentage !== undefined && (obj.percentage = message.percentage);
    message.id !== undefined && (obj.id = message.id);
    message.userType !== undefined && (obj.userType = message.userType);
    message.status !== undefined && (obj.status = message.status);
    message.code !== undefined && (obj.code = message.code);
    message.isDefault !== undefined && (obj.isDefault = message.isDefault);
    if (message.promoCodeScope) {
      obj.promoCodeScope = message.promoCodeScope.map((e) => e ? PromoCodeScope.toJSON(e) : undefined);
    } else {
      obj.promoCodeScope = [];
    }
    if (message.availablePayment) {
      obj.availablePayment = message.availablePayment.map((e) => e ? AvailablePayment.toJSON(e) : undefined);
    } else {
      obj.availablePayment = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DetailedPromoCode>, I>>(base?: I): DetailedPromoCode {
    return DetailedPromoCode.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DetailedPromoCode>, I>>(object: I): DetailedPromoCode {
    const message = createBaseDetailedPromoCode();
    message.promoLimit = object.promoLimit ?? undefined;
    message.promoType = object.promoType ?? "";
    message.promoGenerator = object.promoGenerator ?? "";
    message.discount = object.discount ?? undefined;
    message.percentage = object.percentage ?? undefined;
    message.id = object.id ?? "";
    message.userType = object.userType ?? "";
    message.status = object.status ?? "";
    message.code = object.code ?? "";
    message.isDefault = object.isDefault ?? false;
    message.promoCodeScope = object.promoCodeScope?.map((e) => PromoCodeScope.fromPartial(e)) || [];
    message.availablePayment = object.availablePayment?.map((e) => AvailablePayment.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetDefaultPromoCodeRequest(): GetDefaultPromoCodeRequest {
  return {};
}

export const GetDefaultPromoCodeRequest = {
  encode(_: GetDefaultPromoCodeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDefaultPromoCodeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDefaultPromoCodeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): GetDefaultPromoCodeRequest {
    return {};
  },

  toJSON(_: GetDefaultPromoCodeRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetDefaultPromoCodeRequest>, I>>(base?: I): GetDefaultPromoCodeRequest {
    return GetDefaultPromoCodeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetDefaultPromoCodeRequest>, I>>(_: I): GetDefaultPromoCodeRequest {
    const message = createBaseGetDefaultPromoCodeRequest();
    return message;
  },
};

function createBaseGetFeedPromosRequest(): GetFeedPromosRequest {
  return { feedIds: [] };
}

export const GetFeedPromosRequest = {
  encode(message: GetFeedPromosRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.feedIds) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetFeedPromosRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetFeedPromosRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.feedIds.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetFeedPromosRequest {
    return { feedIds: Array.isArray(object?.feedIds) ? object.feedIds.map((e: any) => String(e)) : [] };
  },

  toJSON(message: GetFeedPromosRequest): unknown {
    const obj: any = {};
    if (message.feedIds) {
      obj.feedIds = message.feedIds.map((e) => e);
    } else {
      obj.feedIds = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetFeedPromosRequest>, I>>(base?: I): GetFeedPromosRequest {
    return GetFeedPromosRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetFeedPromosRequest>, I>>(object: I): GetFeedPromosRequest {
    const message = createBaseGetFeedPromosRequest();
    message.feedIds = object.feedIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseGetFeedPromosResponse(): GetFeedPromosResponse {
  return { DetailedPromoCode: [] };
}

export const GetFeedPromosResponse = {
  encode(message: GetFeedPromosResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.DetailedPromoCode) {
      DetailedPromoCode.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetFeedPromosResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetFeedPromosResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.DetailedPromoCode.push(DetailedPromoCode.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetFeedPromosResponse {
    return {
      DetailedPromoCode: Array.isArray(object?.DetailedPromoCode)
        ? object.DetailedPromoCode.map((e: any) => DetailedPromoCode.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetFeedPromosResponse): unknown {
    const obj: any = {};
    if (message.DetailedPromoCode) {
      obj.DetailedPromoCode = message.DetailedPromoCode.map((e) => e ? DetailedPromoCode.toJSON(e) : undefined);
    } else {
      obj.DetailedPromoCode = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetFeedPromosResponse>, I>>(base?: I): GetFeedPromosResponse {
    return GetFeedPromosResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetFeedPromosResponse>, I>>(object: I): GetFeedPromosResponse {
    const message = createBaseGetFeedPromosResponse();
    message.DetailedPromoCode = object.DetailedPromoCode?.map((e) => DetailedPromoCode.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetFeedPromoRequest(): GetFeedPromoRequest {
  return { feedId: "" };
}

export const GetFeedPromoRequest = {
  encode(message: GetFeedPromoRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.feedId !== "") {
      writer.uint32(10).string(message.feedId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetFeedPromoRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetFeedPromoRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.feedId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetFeedPromoRequest {
    return { feedId: isSet(object.feedId) ? String(object.feedId) : "" };
  },

  toJSON(message: GetFeedPromoRequest): unknown {
    const obj: any = {};
    message.feedId !== undefined && (obj.feedId = message.feedId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetFeedPromoRequest>, I>>(base?: I): GetFeedPromoRequest {
    return GetFeedPromoRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetFeedPromoRequest>, I>>(object: I): GetFeedPromoRequest {
    const message = createBaseGetFeedPromoRequest();
    message.feedId = object.feedId ?? "";
    return message;
  },
};

function createBaseGetPromosByIdsRequest(): GetPromosByIdsRequest {
  return { ids: [] };
}

export const GetPromosByIdsRequest = {
  encode(message: GetPromosByIdsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.ids) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPromosByIdsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPromosByIdsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ids.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPromosByIdsRequest {
    return { ids: Array.isArray(object?.ids) ? object.ids.map((e: any) => String(e)) : [] };
  },

  toJSON(message: GetPromosByIdsRequest): unknown {
    const obj: any = {};
    if (message.ids) {
      obj.ids = message.ids.map((e) => e);
    } else {
      obj.ids = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPromosByIdsRequest>, I>>(base?: I): GetPromosByIdsRequest {
    return GetPromosByIdsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPromosByIdsRequest>, I>>(object: I): GetPromosByIdsRequest {
    const message = createBaseGetPromosByIdsRequest();
    message.ids = object.ids?.map((e) => e) || [];
    return message;
  },
};

function createBaseGetPromosByIdsResponse(): GetPromosByIdsResponse {
  return { promos: [] };
}

export const GetPromosByIdsResponse = {
  encode(message: GetPromosByIdsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.promos) {
      DetailedPromoCode.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPromosByIdsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPromosByIdsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.promos.push(DetailedPromoCode.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPromosByIdsResponse {
    return {
      promos: Array.isArray(object?.promos) ? object.promos.map((e: any) => DetailedPromoCode.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetPromosByIdsResponse): unknown {
    const obj: any = {};
    if (message.promos) {
      obj.promos = message.promos.map((e) => e ? DetailedPromoCode.toJSON(e) : undefined);
    } else {
      obj.promos = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPromosByIdsResponse>, I>>(base?: I): GetPromosByIdsResponse {
    return GetPromosByIdsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPromosByIdsResponse>, I>>(object: I): GetPromosByIdsResponse {
    const message = createBaseGetPromosByIdsResponse();
    message.promos = object.promos?.map((e) => DetailedPromoCode.fromPartial(e)) || [];
    return message;
  },
};

export interface CommissionService {
  calculateProductCommissionSummary(
    request: CalculateCommissionSummaryRequest,
  ): Promise<CalculateCommissionSummaryResponse>;
  calculateProductCommissionSummaryForList(
    request: CalculateCommissionSummaryRequestForList,
  ): Promise<CalculateCommissionSummaryResponseForList>;
  createProductCommissionSummary(request: CreateCommissionSummaryRequest): Promise<CommissionSummaryResponse>;
  migrateProductCommissionSummary(request: MigrateCommissionSummaryRequest): Promise<CommissionSummaryResponse>;
  getProductCommissionSummary(request: ProductCommissionSummaryRequest): Promise<ProductCommissionSummaryResponse>;
  updateSellerCommission(request: UpdateSellerCommissionRequest): Promise<ProductCommissionSummaryResponse>;
  updateSellPrice(request: UpdateSellPriceRequest): Promise<ProductCommissionSummaryResponse>;
  addSellerCommissionPenalty(request: UpdateSellerCommissionRequest): Promise<ProductCommissionSummaryResponse>;
  calculateAddonSummary(request: CalculateAddonSummaryRequest): Promise<CalculateAddonSummaryResponse>;
  updateUsageCount(request: UpdateUsageCountRequest): Promise<UpdateUsageCountResponse>;
  getPromoDetails(request: GetPromoDetailsRequest): Promise<DetailedPromoCode>;
  getDefaultPromoCode(request: GetDefaultPromoCodeRequest): Promise<DetailedPromoCode>;
  getFeedPromos(request: GetFeedPromosRequest): Promise<GetFeedPromosResponse>;
  getFeedPromo(request: GetFeedPromoRequest): Promise<DetailedPromoCode>;
  GetPromosByIds(request: GetPromosByIdsRequest): Promise<GetPromosByIdsResponse>;
  forceUpdateCommission(request: ForceUpdateCommissionRequest): Promise<ProductCommissionSummaryResponse>;
}

export class CommissionServiceClientImpl implements CommissionService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "commission.CommissionService";
    this.rpc = rpc;
    this.calculateProductCommissionSummary = this.calculateProductCommissionSummary.bind(this);
    this.calculateProductCommissionSummaryForList = this.calculateProductCommissionSummaryForList.bind(this);
    this.createProductCommissionSummary = this.createProductCommissionSummary.bind(this);
    this.migrateProductCommissionSummary = this.migrateProductCommissionSummary.bind(this);
    this.getProductCommissionSummary = this.getProductCommissionSummary.bind(this);
    this.updateSellerCommission = this.updateSellerCommission.bind(this);
    this.updateSellPrice = this.updateSellPrice.bind(this);
    this.addSellerCommissionPenalty = this.addSellerCommissionPenalty.bind(this);
    this.calculateAddonSummary = this.calculateAddonSummary.bind(this);
    this.updateUsageCount = this.updateUsageCount.bind(this);
    this.getPromoDetails = this.getPromoDetails.bind(this);
    this.getDefaultPromoCode = this.getDefaultPromoCode.bind(this);
    this.getFeedPromos = this.getFeedPromos.bind(this);
    this.getFeedPromo = this.getFeedPromo.bind(this);
    this.GetPromosByIds = this.GetPromosByIds.bind(this);
    this.forceUpdateCommission = this.forceUpdateCommission.bind(this);
  }
  calculateProductCommissionSummary(
    request: CalculateCommissionSummaryRequest,
  ): Promise<CalculateCommissionSummaryResponse> {
    const data = CalculateCommissionSummaryRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "calculateProductCommissionSummary", data);
    return promise.then((data) => CalculateCommissionSummaryResponse.decode(new _m0.Reader(data)));
  }

  calculateProductCommissionSummaryForList(
    request: CalculateCommissionSummaryRequestForList,
  ): Promise<CalculateCommissionSummaryResponseForList> {
    const data = CalculateCommissionSummaryRequestForList.encode(request).finish();
    const promise = this.rpc.request(this.service, "calculateProductCommissionSummaryForList", data);
    return promise.then((data) => CalculateCommissionSummaryResponseForList.decode(new _m0.Reader(data)));
  }

  createProductCommissionSummary(request: CreateCommissionSummaryRequest): Promise<CommissionSummaryResponse> {
    const data = CreateCommissionSummaryRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "createProductCommissionSummary", data);
    return promise.then((data) => CommissionSummaryResponse.decode(new _m0.Reader(data)));
  }

  migrateProductCommissionSummary(request: MigrateCommissionSummaryRequest): Promise<CommissionSummaryResponse> {
    const data = MigrateCommissionSummaryRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "migrateProductCommissionSummary", data);
    return promise.then((data) => CommissionSummaryResponse.decode(new _m0.Reader(data)));
  }

  getProductCommissionSummary(request: ProductCommissionSummaryRequest): Promise<ProductCommissionSummaryResponse> {
    const data = ProductCommissionSummaryRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "getProductCommissionSummary", data);
    return promise.then((data) => ProductCommissionSummaryResponse.decode(new _m0.Reader(data)));
  }

  updateSellerCommission(request: UpdateSellerCommissionRequest): Promise<ProductCommissionSummaryResponse> {
    const data = UpdateSellerCommissionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "updateSellerCommission", data);
    return promise.then((data) => ProductCommissionSummaryResponse.decode(new _m0.Reader(data)));
  }

  updateSellPrice(request: UpdateSellPriceRequest): Promise<ProductCommissionSummaryResponse> {
    const data = UpdateSellPriceRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "updateSellPrice", data);
    return promise.then((data) => ProductCommissionSummaryResponse.decode(new _m0.Reader(data)));
  }

  addSellerCommissionPenalty(request: UpdateSellerCommissionRequest): Promise<ProductCommissionSummaryResponse> {
    const data = UpdateSellerCommissionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "addSellerCommissionPenalty", data);
    return promise.then((data) => ProductCommissionSummaryResponse.decode(new _m0.Reader(data)));
  }

  calculateAddonSummary(request: CalculateAddonSummaryRequest): Promise<CalculateAddonSummaryResponse> {
    const data = CalculateAddonSummaryRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "calculateAddonSummary", data);
    return promise.then((data) => CalculateAddonSummaryResponse.decode(new _m0.Reader(data)));
  }

  updateUsageCount(request: UpdateUsageCountRequest): Promise<UpdateUsageCountResponse> {
    const data = UpdateUsageCountRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "updateUsageCount", data);
    return promise.then((data) => UpdateUsageCountResponse.decode(new _m0.Reader(data)));
  }

  getPromoDetails(request: GetPromoDetailsRequest): Promise<DetailedPromoCode> {
    const data = GetPromoDetailsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "getPromoDetails", data);
    return promise.then((data) => DetailedPromoCode.decode(new _m0.Reader(data)));
  }

  getDefaultPromoCode(request: GetDefaultPromoCodeRequest): Promise<DetailedPromoCode> {
    const data = GetDefaultPromoCodeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "getDefaultPromoCode", data);
    return promise.then((data) => DetailedPromoCode.decode(new _m0.Reader(data)));
  }

  getFeedPromos(request: GetFeedPromosRequest): Promise<GetFeedPromosResponse> {
    const data = GetFeedPromosRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "getFeedPromos", data);
    return promise.then((data) => GetFeedPromosResponse.decode(new _m0.Reader(data)));
  }

  getFeedPromo(request: GetFeedPromoRequest): Promise<DetailedPromoCode> {
    const data = GetFeedPromoRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "getFeedPromo", data);
    return promise.then((data) => DetailedPromoCode.decode(new _m0.Reader(data)));
  }

  GetPromosByIds(request: GetPromosByIdsRequest): Promise<GetPromosByIdsResponse> {
    const data = GetPromosByIdsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetPromosByIds", data);
    return promise.then((data) => GetPromosByIdsResponse.decode(new _m0.Reader(data)));
  }

  forceUpdateCommission(request: ForceUpdateCommissionRequest): Promise<ProductCommissionSummaryResponse> {
    const data = ForceUpdateCommissionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "forceUpdateCommission", data);
    return promise.then((data) => ProductCommissionSummaryResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
