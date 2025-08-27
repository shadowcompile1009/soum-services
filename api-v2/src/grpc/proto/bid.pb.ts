/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "bid";

export interface GetOfferForProductRequest {
  productId: string;
  userId: string;
}

export interface OfferResponse {
  id: string;
  status: string;
  sellPrice: number;
  buyerOfferSummary: OfferSummary | undefined;
}

export interface OfferSummary {
  commission: number;
  commissionVat: number;
  grandTotal: number;
}

export interface GetBidSettingsRequest {
}

export interface GetBidSettingsResponse {
  value: boolean;
  availablePayment: string;
  config: string;
}

export interface ClearExpiredProductBidsRequest {
  productIds: string[];
}

export interface ClearExpiredProductBidsResponse {
}

export interface TransactionUpdateRequest {
  transactionId: string;
  checkoutId: string;
  checkoutURL: string;
  soumTransactionNumber: string;
  transactionStatusId: string;
  transactionType: string;
  paymentOptionId: string;
}

export interface TransactionUpdateResponse {
}

export interface GetOfferCountOfUserRequest {
  userId: string;
}

export interface OfferCountResponse {
  count: number;
}

function createBaseGetOfferForProductRequest(): GetOfferForProductRequest {
  return { productId: "", userId: "" };
}

export const GetOfferForProductRequest = {
  encode(message: GetOfferForProductRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productId !== "") {
      writer.uint32(10).string(message.productId);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOfferForProductRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOfferForProductRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        case 2:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetOfferForProductRequest {
    return {
      productId: isSet(object.productId) ? String(object.productId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
    };
  },

  toJSON(message: GetOfferForProductRequest): unknown {
    const obj: any = {};
    message.productId !== undefined && (obj.productId = message.productId);
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetOfferForProductRequest>, I>>(base?: I): GetOfferForProductRequest {
    return GetOfferForProductRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetOfferForProductRequest>, I>>(object: I): GetOfferForProductRequest {
    const message = createBaseGetOfferForProductRequest();
    message.productId = object.productId ?? "";
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseOfferResponse(): OfferResponse {
  return { id: "", status: "", sellPrice: 0, buyerOfferSummary: undefined };
}

export const OfferResponse = {
  encode(message: OfferResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.status !== "") {
      writer.uint32(18).string(message.status);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(24).int32(message.sellPrice);
    }
    if (message.buyerOfferSummary !== undefined) {
      OfferSummary.encode(message.buyerOfferSummary, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OfferResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOfferResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.status = reader.string();
          break;
        case 3:
          message.sellPrice = reader.int32();
          break;
        case 4:
          message.buyerOfferSummary = OfferSummary.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OfferResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      status: isSet(object.status) ? String(object.status) : "",
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
      buyerOfferSummary: isSet(object.buyerOfferSummary) ? OfferSummary.fromJSON(object.buyerOfferSummary) : undefined,
    };
  },

  toJSON(message: OfferResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.status !== undefined && (obj.status = message.status);
    message.sellPrice !== undefined && (obj.sellPrice = Math.round(message.sellPrice));
    message.buyerOfferSummary !== undefined &&
      (obj.buyerOfferSummary = message.buyerOfferSummary ? OfferSummary.toJSON(message.buyerOfferSummary) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<OfferResponse>, I>>(base?: I): OfferResponse {
    return OfferResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<OfferResponse>, I>>(object: I): OfferResponse {
    const message = createBaseOfferResponse();
    message.id = object.id ?? "";
    message.status = object.status ?? "";
    message.sellPrice = object.sellPrice ?? 0;
    message.buyerOfferSummary = (object.buyerOfferSummary !== undefined && object.buyerOfferSummary !== null)
      ? OfferSummary.fromPartial(object.buyerOfferSummary)
      : undefined;
    return message;
  },
};

function createBaseOfferSummary(): OfferSummary {
  return { commission: 0, commissionVat: 0, grandTotal: 0 };
}

export const OfferSummary = {
  encode(message: OfferSummary, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.commission !== 0) {
      writer.uint32(9).double(message.commission);
    }
    if (message.commissionVat !== 0) {
      writer.uint32(17).double(message.commissionVat);
    }
    if (message.grandTotal !== 0) {
      writer.uint32(25).double(message.grandTotal);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OfferSummary {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOfferSummary();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.commission = reader.double();
          break;
        case 2:
          message.commissionVat = reader.double();
          break;
        case 3:
          message.grandTotal = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OfferSummary {
    return {
      commission: isSet(object.commission) ? Number(object.commission) : 0,
      commissionVat: isSet(object.commissionVat) ? Number(object.commissionVat) : 0,
      grandTotal: isSet(object.grandTotal) ? Number(object.grandTotal) : 0,
    };
  },

  toJSON(message: OfferSummary): unknown {
    const obj: any = {};
    message.commission !== undefined && (obj.commission = message.commission);
    message.commissionVat !== undefined && (obj.commissionVat = message.commissionVat);
    message.grandTotal !== undefined && (obj.grandTotal = message.grandTotal);
    return obj;
  },

  create<I extends Exact<DeepPartial<OfferSummary>, I>>(base?: I): OfferSummary {
    return OfferSummary.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<OfferSummary>, I>>(object: I): OfferSummary {
    const message = createBaseOfferSummary();
    message.commission = object.commission ?? 0;
    message.commissionVat = object.commissionVat ?? 0;
    message.grandTotal = object.grandTotal ?? 0;
    return message;
  },
};

function createBaseGetBidSettingsRequest(): GetBidSettingsRequest {
  return {};
}

export const GetBidSettingsRequest = {
  encode(_: GetBidSettingsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetBidSettingsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetBidSettingsRequest();
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

  fromJSON(_: any): GetBidSettingsRequest {
    return {};
  },

  toJSON(_: GetBidSettingsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetBidSettingsRequest>, I>>(base?: I): GetBidSettingsRequest {
    return GetBidSettingsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetBidSettingsRequest>, I>>(_: I): GetBidSettingsRequest {
    const message = createBaseGetBidSettingsRequest();
    return message;
  },
};

function createBaseGetBidSettingsResponse(): GetBidSettingsResponse {
  return { value: false, availablePayment: "", config: "" };
}

export const GetBidSettingsResponse = {
  encode(message: GetBidSettingsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value === true) {
      writer.uint32(8).bool(message.value);
    }
    if (message.availablePayment !== "") {
      writer.uint32(18).string(message.availablePayment);
    }
    if (message.config !== "") {
      writer.uint32(26).string(message.config);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetBidSettingsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetBidSettingsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value = reader.bool();
          break;
        case 2:
          message.availablePayment = reader.string();
          break;
        case 3:
          message.config = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetBidSettingsResponse {
    return {
      value: isSet(object.value) ? Boolean(object.value) : false,
      availablePayment: isSet(object.availablePayment) ? String(object.availablePayment) : "",
      config: isSet(object.config) ? String(object.config) : "",
    };
  },

  toJSON(message: GetBidSettingsResponse): unknown {
    const obj: any = {};
    message.value !== undefined && (obj.value = message.value);
    message.availablePayment !== undefined && (obj.availablePayment = message.availablePayment);
    message.config !== undefined && (obj.config = message.config);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetBidSettingsResponse>, I>>(base?: I): GetBidSettingsResponse {
    return GetBidSettingsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetBidSettingsResponse>, I>>(object: I): GetBidSettingsResponse {
    const message = createBaseGetBidSettingsResponse();
    message.value = object.value ?? false;
    message.availablePayment = object.availablePayment ?? "";
    message.config = object.config ?? "";
    return message;
  },
};

function createBaseClearExpiredProductBidsRequest(): ClearExpiredProductBidsRequest {
  return { productIds: [] };
}

export const ClearExpiredProductBidsRequest = {
  encode(message: ClearExpiredProductBidsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.productIds) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClearExpiredProductBidsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClearExpiredProductBidsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productIds.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ClearExpiredProductBidsRequest {
    return { productIds: Array.isArray(object?.productIds) ? object.productIds.map((e: any) => String(e)) : [] };
  },

  toJSON(message: ClearExpiredProductBidsRequest): unknown {
    const obj: any = {};
    if (message.productIds) {
      obj.productIds = message.productIds.map((e) => e);
    } else {
      obj.productIds = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ClearExpiredProductBidsRequest>, I>>(base?: I): ClearExpiredProductBidsRequest {
    return ClearExpiredProductBidsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ClearExpiredProductBidsRequest>, I>>(
    object: I,
  ): ClearExpiredProductBidsRequest {
    const message = createBaseClearExpiredProductBidsRequest();
    message.productIds = object.productIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseClearExpiredProductBidsResponse(): ClearExpiredProductBidsResponse {
  return {};
}

export const ClearExpiredProductBidsResponse = {
  encode(_: ClearExpiredProductBidsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClearExpiredProductBidsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClearExpiredProductBidsResponse();
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

  fromJSON(_: any): ClearExpiredProductBidsResponse {
    return {};
  },

  toJSON(_: ClearExpiredProductBidsResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ClearExpiredProductBidsResponse>, I>>(base?: I): ClearExpiredProductBidsResponse {
    return ClearExpiredProductBidsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ClearExpiredProductBidsResponse>, I>>(_: I): ClearExpiredProductBidsResponse {
    const message = createBaseClearExpiredProductBidsResponse();
    return message;
  },
};

function createBaseTransactionUpdateRequest(): TransactionUpdateRequest {
  return {
    transactionId: "",
    checkoutId: "",
    checkoutURL: "",
    soumTransactionNumber: "",
    transactionStatusId: "",
    transactionType: "",
    paymentOptionId: "",
  };
}

export const TransactionUpdateRequest = {
  encode(message: TransactionUpdateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.transactionId !== "") {
      writer.uint32(10).string(message.transactionId);
    }
    if (message.checkoutId !== "") {
      writer.uint32(18).string(message.checkoutId);
    }
    if (message.checkoutURL !== "") {
      writer.uint32(26).string(message.checkoutURL);
    }
    if (message.soumTransactionNumber !== "") {
      writer.uint32(34).string(message.soumTransactionNumber);
    }
    if (message.transactionStatusId !== "") {
      writer.uint32(42).string(message.transactionStatusId);
    }
    if (message.transactionType !== "") {
      writer.uint32(50).string(message.transactionType);
    }
    if (message.paymentOptionId !== "") {
      writer.uint32(58).string(message.paymentOptionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionUpdateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionUpdateRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactionId = reader.string();
          break;
        case 2:
          message.checkoutId = reader.string();
          break;
        case 3:
          message.checkoutURL = reader.string();
          break;
        case 4:
          message.soumTransactionNumber = reader.string();
          break;
        case 5:
          message.transactionStatusId = reader.string();
          break;
        case 6:
          message.transactionType = reader.string();
          break;
        case 7:
          message.paymentOptionId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransactionUpdateRequest {
    return {
      transactionId: isSet(object.transactionId) ? String(object.transactionId) : "",
      checkoutId: isSet(object.checkoutId) ? String(object.checkoutId) : "",
      checkoutURL: isSet(object.checkoutURL) ? String(object.checkoutURL) : "",
      soumTransactionNumber: isSet(object.soumTransactionNumber) ? String(object.soumTransactionNumber) : "",
      transactionStatusId: isSet(object.transactionStatusId) ? String(object.transactionStatusId) : "",
      transactionType: isSet(object.transactionType) ? String(object.transactionType) : "",
      paymentOptionId: isSet(object.paymentOptionId) ? String(object.paymentOptionId) : "",
    };
  },

  toJSON(message: TransactionUpdateRequest): unknown {
    const obj: any = {};
    message.transactionId !== undefined && (obj.transactionId = message.transactionId);
    message.checkoutId !== undefined && (obj.checkoutId = message.checkoutId);
    message.checkoutURL !== undefined && (obj.checkoutURL = message.checkoutURL);
    message.soumTransactionNumber !== undefined && (obj.soumTransactionNumber = message.soumTransactionNumber);
    message.transactionStatusId !== undefined && (obj.transactionStatusId = message.transactionStatusId);
    message.transactionType !== undefined && (obj.transactionType = message.transactionType);
    message.paymentOptionId !== undefined && (obj.paymentOptionId = message.paymentOptionId);
    return obj;
  },

  create<I extends Exact<DeepPartial<TransactionUpdateRequest>, I>>(base?: I): TransactionUpdateRequest {
    return TransactionUpdateRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TransactionUpdateRequest>, I>>(object: I): TransactionUpdateRequest {
    const message = createBaseTransactionUpdateRequest();
    message.transactionId = object.transactionId ?? "";
    message.checkoutId = object.checkoutId ?? "";
    message.checkoutURL = object.checkoutURL ?? "";
    message.soumTransactionNumber = object.soumTransactionNumber ?? "";
    message.transactionStatusId = object.transactionStatusId ?? "";
    message.transactionType = object.transactionType ?? "";
    message.paymentOptionId = object.paymentOptionId ?? "";
    return message;
  },
};

function createBaseTransactionUpdateResponse(): TransactionUpdateResponse {
  return {};
}

export const TransactionUpdateResponse = {
  encode(_: TransactionUpdateResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionUpdateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionUpdateResponse();
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

  fromJSON(_: any): TransactionUpdateResponse {
    return {};
  },

  toJSON(_: TransactionUpdateResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<TransactionUpdateResponse>, I>>(base?: I): TransactionUpdateResponse {
    return TransactionUpdateResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TransactionUpdateResponse>, I>>(_: I): TransactionUpdateResponse {
    const message = createBaseTransactionUpdateResponse();
    return message;
  },
};

function createBaseGetOfferCountOfUserRequest(): GetOfferCountOfUserRequest {
  return { userId: "" };
}

export const GetOfferCountOfUserRequest = {
  encode(message: GetOfferCountOfUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOfferCountOfUserRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOfferCountOfUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetOfferCountOfUserRequest {
    return { userId: isSet(object.userId) ? String(object.userId) : "" };
  },

  toJSON(message: GetOfferCountOfUserRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetOfferCountOfUserRequest>, I>>(base?: I): GetOfferCountOfUserRequest {
    return GetOfferCountOfUserRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetOfferCountOfUserRequest>, I>>(object: I): GetOfferCountOfUserRequest {
    const message = createBaseGetOfferCountOfUserRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseOfferCountResponse(): OfferCountResponse {
  return { count: 0 };
}

export const OfferCountResponse = {
  encode(message: OfferCountResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.count !== 0) {
      writer.uint32(8).int32(message.count);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OfferCountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOfferCountResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.count = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OfferCountResponse {
    return { count: isSet(object.count) ? Number(object.count) : 0 };
  },

  toJSON(message: OfferCountResponse): unknown {
    const obj: any = {};
    message.count !== undefined && (obj.count = Math.round(message.count));
    return obj;
  },

  create<I extends Exact<DeepPartial<OfferCountResponse>, I>>(base?: I): OfferCountResponse {
    return OfferCountResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<OfferCountResponse>, I>>(object: I): OfferCountResponse {
    const message = createBaseOfferCountResponse();
    message.count = object.count ?? 0;
    return message;
  },
};

export interface BidService {
  GetBidSettings(request: GetBidSettingsRequest): Promise<GetBidSettingsResponse>;
  ClearExpiredProductBids(request: ClearExpiredProductBidsRequest): Promise<ClearExpiredProductBidsResponse>;
  TransactionUpdate(request: TransactionUpdateRequest): Promise<TransactionUpdateResponse>;
  GetOfferForProduct(request: GetOfferForProductRequest): Promise<OfferResponse>;
  GetOfferCountOfUser(request: GetOfferCountOfUserRequest): Promise<OfferCountResponse>;
}

export class BidServiceClientImpl implements BidService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "bid.BidService";
    this.rpc = rpc;
    this.GetBidSettings = this.GetBidSettings.bind(this);
    this.ClearExpiredProductBids = this.ClearExpiredProductBids.bind(this);
    this.TransactionUpdate = this.TransactionUpdate.bind(this);
    this.GetOfferForProduct = this.GetOfferForProduct.bind(this);
    this.GetOfferCountOfUser = this.GetOfferCountOfUser.bind(this);
  }
  GetBidSettings(request: GetBidSettingsRequest): Promise<GetBidSettingsResponse> {
    const data = GetBidSettingsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetBidSettings", data);
    return promise.then((data) => GetBidSettingsResponse.decode(new _m0.Reader(data)));
  }

  ClearExpiredProductBids(request: ClearExpiredProductBidsRequest): Promise<ClearExpiredProductBidsResponse> {
    const data = ClearExpiredProductBidsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ClearExpiredProductBids", data);
    return promise.then((data) => ClearExpiredProductBidsResponse.decode(new _m0.Reader(data)));
  }

  TransactionUpdate(request: TransactionUpdateRequest): Promise<TransactionUpdateResponse> {
    const data = TransactionUpdateRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "TransactionUpdate", data);
    return promise.then((data) => TransactionUpdateResponse.decode(new _m0.Reader(data)));
  }

  GetOfferForProduct(request: GetOfferForProductRequest): Promise<OfferResponse> {
    const data = GetOfferForProductRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetOfferForProduct", data);
    return promise.then((data) => OfferResponse.decode(new _m0.Reader(data)));
  }

  GetOfferCountOfUser(request: GetOfferCountOfUserRequest): Promise<OfferCountResponse> {
    const data = GetOfferCountOfUserRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetOfferCountOfUser", data);
    return promise.then((data) => OfferCountResponse.decode(new _m0.Reader(data)));
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
