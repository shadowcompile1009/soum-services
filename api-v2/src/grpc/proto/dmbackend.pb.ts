/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "dmbackend";

export interface GetHoldingPenaltyBalanceRequest {
  sellerId: string;
  range: string;
}

export interface GetHoldingPenaltyBalanceResponse {
  amount: number;
}

export interface GetStandingPenaltyToDmoRequest {
  dmoId: string;
}

export interface GetStandingPenaltyToDmoResponse {
  dmoId: string;
  userId: string;
  penalty: number;
}

export interface UpdateHoldingPenaltyRequest {
  sellerId: string;
  dmoId: string;
  isPayout: boolean;
}

export interface UpdateHoldingPenaltyResponse {
}

export interface GetCancellationFeeRequest {
}

export interface GetCancellationFeeResponse {
  cancelFee: number;
}

export interface GetPenalizedOrdersMerchantRequest {
  merchantId: string;
  page: number;
  size: number;
  range: string;
}

export interface GetPenalizedOrdersMerchantResponse {
  orders: GetPenalizedOrdersMerchantResponse_PenalizedOrders[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetPenalizedOrdersMerchantResponse_PenalizedOrders {
  productName: string;
  orderNumber: string;
  payoutAmount: number;
  penalty: number;
  finalPayout: number;
  nctReason: string;
  nctReasonAR: string;
}

export interface CreateInvoiceRequest {
  orderId: string;
  invoiceType: string;
  userType: string;
  eventName: string;
}

export interface CreateInvoiceResponse {
}

function createBaseGetHoldingPenaltyBalanceRequest(): GetHoldingPenaltyBalanceRequest {
  return { sellerId: "", range: "" };
}

export const GetHoldingPenaltyBalanceRequest = {
  encode(message: GetHoldingPenaltyBalanceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sellerId !== "") {
      writer.uint32(10).string(message.sellerId);
    }
    if (message.range !== "") {
      writer.uint32(18).string(message.range);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetHoldingPenaltyBalanceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetHoldingPenaltyBalanceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sellerId = reader.string();
          break;
        case 2:
          message.range = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetHoldingPenaltyBalanceRequest {
    return {
      sellerId: isSet(object.sellerId) ? String(object.sellerId) : "",
      range: isSet(object.range) ? String(object.range) : "",
    };
  },

  toJSON(message: GetHoldingPenaltyBalanceRequest): unknown {
    const obj: any = {};
    message.sellerId !== undefined && (obj.sellerId = message.sellerId);
    message.range !== undefined && (obj.range = message.range);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetHoldingPenaltyBalanceRequest>, I>>(base?: I): GetHoldingPenaltyBalanceRequest {
    return GetHoldingPenaltyBalanceRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetHoldingPenaltyBalanceRequest>, I>>(
    object: I,
  ): GetHoldingPenaltyBalanceRequest {
    const message = createBaseGetHoldingPenaltyBalanceRequest();
    message.sellerId = object.sellerId ?? "";
    message.range = object.range ?? "";
    return message;
  },
};

function createBaseGetHoldingPenaltyBalanceResponse(): GetHoldingPenaltyBalanceResponse {
  return { amount: 0 };
}

export const GetHoldingPenaltyBalanceResponse = {
  encode(message: GetHoldingPenaltyBalanceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.amount !== 0) {
      writer.uint32(13).float(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetHoldingPenaltyBalanceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetHoldingPenaltyBalanceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetHoldingPenaltyBalanceResponse {
    return { amount: isSet(object.amount) ? Number(object.amount) : 0 };
  },

  toJSON(message: GetHoldingPenaltyBalanceResponse): unknown {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetHoldingPenaltyBalanceResponse>, I>>(
    base?: I,
  ): GetHoldingPenaltyBalanceResponse {
    return GetHoldingPenaltyBalanceResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetHoldingPenaltyBalanceResponse>, I>>(
    object: I,
  ): GetHoldingPenaltyBalanceResponse {
    const message = createBaseGetHoldingPenaltyBalanceResponse();
    message.amount = object.amount ?? 0;
    return message;
  },
};

function createBaseGetStandingPenaltyToDmoRequest(): GetStandingPenaltyToDmoRequest {
  return { dmoId: "" };
}

export const GetStandingPenaltyToDmoRequest = {
  encode(message: GetStandingPenaltyToDmoRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.dmoId !== "") {
      writer.uint32(10).string(message.dmoId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetStandingPenaltyToDmoRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetStandingPenaltyToDmoRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.dmoId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetStandingPenaltyToDmoRequest {
    return { dmoId: isSet(object.dmoId) ? String(object.dmoId) : "" };
  },

  toJSON(message: GetStandingPenaltyToDmoRequest): unknown {
    const obj: any = {};
    message.dmoId !== undefined && (obj.dmoId = message.dmoId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetStandingPenaltyToDmoRequest>, I>>(base?: I): GetStandingPenaltyToDmoRequest {
    return GetStandingPenaltyToDmoRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetStandingPenaltyToDmoRequest>, I>>(
    object: I,
  ): GetStandingPenaltyToDmoRequest {
    const message = createBaseGetStandingPenaltyToDmoRequest();
    message.dmoId = object.dmoId ?? "";
    return message;
  },
};

function createBaseGetStandingPenaltyToDmoResponse(): GetStandingPenaltyToDmoResponse {
  return { dmoId: "", userId: "", penalty: 0 };
}

export const GetStandingPenaltyToDmoResponse = {
  encode(message: GetStandingPenaltyToDmoResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.dmoId !== "") {
      writer.uint32(10).string(message.dmoId);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    if (message.penalty !== 0) {
      writer.uint32(29).float(message.penalty);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetStandingPenaltyToDmoResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetStandingPenaltyToDmoResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.dmoId = reader.string();
          break;
        case 2:
          message.userId = reader.string();
          break;
        case 3:
          message.penalty = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetStandingPenaltyToDmoResponse {
    return {
      dmoId: isSet(object.dmoId) ? String(object.dmoId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      penalty: isSet(object.penalty) ? Number(object.penalty) : 0,
    };
  },

  toJSON(message: GetStandingPenaltyToDmoResponse): unknown {
    const obj: any = {};
    message.dmoId !== undefined && (obj.dmoId = message.dmoId);
    message.userId !== undefined && (obj.userId = message.userId);
    message.penalty !== undefined && (obj.penalty = message.penalty);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetStandingPenaltyToDmoResponse>, I>>(base?: I): GetStandingPenaltyToDmoResponse {
    return GetStandingPenaltyToDmoResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetStandingPenaltyToDmoResponse>, I>>(
    object: I,
  ): GetStandingPenaltyToDmoResponse {
    const message = createBaseGetStandingPenaltyToDmoResponse();
    message.dmoId = object.dmoId ?? "";
    message.userId = object.userId ?? "";
    message.penalty = object.penalty ?? 0;
    return message;
  },
};

function createBaseUpdateHoldingPenaltyRequest(): UpdateHoldingPenaltyRequest {
  return { sellerId: "", dmoId: "", isPayout: false };
}

export const UpdateHoldingPenaltyRequest = {
  encode(message: UpdateHoldingPenaltyRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sellerId !== "") {
      writer.uint32(10).string(message.sellerId);
    }
    if (message.dmoId !== "") {
      writer.uint32(18).string(message.dmoId);
    }
    if (message.isPayout === true) {
      writer.uint32(24).bool(message.isPayout);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateHoldingPenaltyRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateHoldingPenaltyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sellerId = reader.string();
          break;
        case 2:
          message.dmoId = reader.string();
          break;
        case 3:
          message.isPayout = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateHoldingPenaltyRequest {
    return {
      sellerId: isSet(object.sellerId) ? String(object.sellerId) : "",
      dmoId: isSet(object.dmoId) ? String(object.dmoId) : "",
      isPayout: isSet(object.isPayout) ? Boolean(object.isPayout) : false,
    };
  },

  toJSON(message: UpdateHoldingPenaltyRequest): unknown {
    const obj: any = {};
    message.sellerId !== undefined && (obj.sellerId = message.sellerId);
    message.dmoId !== undefined && (obj.dmoId = message.dmoId);
    message.isPayout !== undefined && (obj.isPayout = message.isPayout);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateHoldingPenaltyRequest>, I>>(base?: I): UpdateHoldingPenaltyRequest {
    return UpdateHoldingPenaltyRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateHoldingPenaltyRequest>, I>>(object: I): UpdateHoldingPenaltyRequest {
    const message = createBaseUpdateHoldingPenaltyRequest();
    message.sellerId = object.sellerId ?? "";
    message.dmoId = object.dmoId ?? "";
    message.isPayout = object.isPayout ?? false;
    return message;
  },
};

function createBaseUpdateHoldingPenaltyResponse(): UpdateHoldingPenaltyResponse {
  return {};
}

export const UpdateHoldingPenaltyResponse = {
  encode(_: UpdateHoldingPenaltyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateHoldingPenaltyResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateHoldingPenaltyResponse();
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

  fromJSON(_: any): UpdateHoldingPenaltyResponse {
    return {};
  },

  toJSON(_: UpdateHoldingPenaltyResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateHoldingPenaltyResponse>, I>>(base?: I): UpdateHoldingPenaltyResponse {
    return UpdateHoldingPenaltyResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateHoldingPenaltyResponse>, I>>(_: I): UpdateHoldingPenaltyResponse {
    const message = createBaseUpdateHoldingPenaltyResponse();
    return message;
  },
};

function createBaseGetCancellationFeeRequest(): GetCancellationFeeRequest {
  return {};
}

export const GetCancellationFeeRequest = {
  encode(_: GetCancellationFeeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCancellationFeeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCancellationFeeRequest();
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

  fromJSON(_: any): GetCancellationFeeRequest {
    return {};
  },

  toJSON(_: GetCancellationFeeRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCancellationFeeRequest>, I>>(base?: I): GetCancellationFeeRequest {
    return GetCancellationFeeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCancellationFeeRequest>, I>>(_: I): GetCancellationFeeRequest {
    const message = createBaseGetCancellationFeeRequest();
    return message;
  },
};

function createBaseGetCancellationFeeResponse(): GetCancellationFeeResponse {
  return { cancelFee: 0 };
}

export const GetCancellationFeeResponse = {
  encode(message: GetCancellationFeeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cancelFee !== 0) {
      writer.uint32(13).float(message.cancelFee);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCancellationFeeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCancellationFeeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cancelFee = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCancellationFeeResponse {
    return { cancelFee: isSet(object.cancelFee) ? Number(object.cancelFee) : 0 };
  },

  toJSON(message: GetCancellationFeeResponse): unknown {
    const obj: any = {};
    message.cancelFee !== undefined && (obj.cancelFee = message.cancelFee);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCancellationFeeResponse>, I>>(base?: I): GetCancellationFeeResponse {
    return GetCancellationFeeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCancellationFeeResponse>, I>>(object: I): GetCancellationFeeResponse {
    const message = createBaseGetCancellationFeeResponse();
    message.cancelFee = object.cancelFee ?? 0;
    return message;
  },
};

function createBaseGetPenalizedOrdersMerchantRequest(): GetPenalizedOrdersMerchantRequest {
  return { merchantId: "", page: 0, size: 0, range: "" };
}

export const GetPenalizedOrdersMerchantRequest = {
  encode(message: GetPenalizedOrdersMerchantRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.merchantId !== "") {
      writer.uint32(10).string(message.merchantId);
    }
    if (message.page !== 0) {
      writer.uint32(16).int32(message.page);
    }
    if (message.size !== 0) {
      writer.uint32(24).int32(message.size);
    }
    if (message.range !== "") {
      writer.uint32(34).string(message.range);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPenalizedOrdersMerchantRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPenalizedOrdersMerchantRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.merchantId = reader.string();
          break;
        case 2:
          message.page = reader.int32();
          break;
        case 3:
          message.size = reader.int32();
          break;
        case 4:
          message.range = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPenalizedOrdersMerchantRequest {
    return {
      merchantId: isSet(object.merchantId) ? String(object.merchantId) : "",
      page: isSet(object.page) ? Number(object.page) : 0,
      size: isSet(object.size) ? Number(object.size) : 0,
      range: isSet(object.range) ? String(object.range) : "",
    };
  },

  toJSON(message: GetPenalizedOrdersMerchantRequest): unknown {
    const obj: any = {};
    message.merchantId !== undefined && (obj.merchantId = message.merchantId);
    message.page !== undefined && (obj.page = Math.round(message.page));
    message.size !== undefined && (obj.size = Math.round(message.size));
    message.range !== undefined && (obj.range = message.range);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPenalizedOrdersMerchantRequest>, I>>(
    base?: I,
  ): GetPenalizedOrdersMerchantRequest {
    return GetPenalizedOrdersMerchantRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPenalizedOrdersMerchantRequest>, I>>(
    object: I,
  ): GetPenalizedOrdersMerchantRequest {
    const message = createBaseGetPenalizedOrdersMerchantRequest();
    message.merchantId = object.merchantId ?? "";
    message.page = object.page ?? 0;
    message.size = object.size ?? 0;
    message.range = object.range ?? "";
    return message;
  },
};

function createBaseGetPenalizedOrdersMerchantResponse(): GetPenalizedOrdersMerchantResponse {
  return { orders: [], totalItems: 0, totalPages: 0, currentPage: 0, pageSize: 0 };
}

export const GetPenalizedOrdersMerchantResponse = {
  encode(message: GetPenalizedOrdersMerchantResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.orders) {
      GetPenalizedOrdersMerchantResponse_PenalizedOrders.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.totalItems !== 0) {
      writer.uint32(16).int32(message.totalItems);
    }
    if (message.totalPages !== 0) {
      writer.uint32(24).int32(message.totalPages);
    }
    if (message.currentPage !== 0) {
      writer.uint32(32).int32(message.currentPage);
    }
    if (message.pageSize !== 0) {
      writer.uint32(40).int32(message.pageSize);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPenalizedOrdersMerchantResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPenalizedOrdersMerchantResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orders.push(GetPenalizedOrdersMerchantResponse_PenalizedOrders.decode(reader, reader.uint32()));
          break;
        case 2:
          message.totalItems = reader.int32();
          break;
        case 3:
          message.totalPages = reader.int32();
          break;
        case 4:
          message.currentPage = reader.int32();
          break;
        case 5:
          message.pageSize = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPenalizedOrdersMerchantResponse {
    return {
      orders: Array.isArray(object?.orders)
        ? object.orders.map((e: any) => GetPenalizedOrdersMerchantResponse_PenalizedOrders.fromJSON(e))
        : [],
      totalItems: isSet(object.totalItems) ? Number(object.totalItems) : 0,
      totalPages: isSet(object.totalPages) ? Number(object.totalPages) : 0,
      currentPage: isSet(object.currentPage) ? Number(object.currentPage) : 0,
      pageSize: isSet(object.pageSize) ? Number(object.pageSize) : 0,
    };
  },

  toJSON(message: GetPenalizedOrdersMerchantResponse): unknown {
    const obj: any = {};
    if (message.orders) {
      obj.orders = message.orders.map((e) =>
        e ? GetPenalizedOrdersMerchantResponse_PenalizedOrders.toJSON(e) : undefined
      );
    } else {
      obj.orders = [];
    }
    message.totalItems !== undefined && (obj.totalItems = Math.round(message.totalItems));
    message.totalPages !== undefined && (obj.totalPages = Math.round(message.totalPages));
    message.currentPage !== undefined && (obj.currentPage = Math.round(message.currentPage));
    message.pageSize !== undefined && (obj.pageSize = Math.round(message.pageSize));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPenalizedOrdersMerchantResponse>, I>>(
    base?: I,
  ): GetPenalizedOrdersMerchantResponse {
    return GetPenalizedOrdersMerchantResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPenalizedOrdersMerchantResponse>, I>>(
    object: I,
  ): GetPenalizedOrdersMerchantResponse {
    const message = createBaseGetPenalizedOrdersMerchantResponse();
    message.orders = object.orders?.map((e) => GetPenalizedOrdersMerchantResponse_PenalizedOrders.fromPartial(e)) || [];
    message.totalItems = object.totalItems ?? 0;
    message.totalPages = object.totalPages ?? 0;
    message.currentPage = object.currentPage ?? 0;
    message.pageSize = object.pageSize ?? 0;
    return message;
  },
};

function createBaseGetPenalizedOrdersMerchantResponse_PenalizedOrders(): GetPenalizedOrdersMerchantResponse_PenalizedOrders {
  return {
    productName: "",
    orderNumber: "",
    payoutAmount: 0,
    penalty: 0,
    finalPayout: 0,
    nctReason: "",
    nctReasonAR: "",
  };
}

export const GetPenalizedOrdersMerchantResponse_PenalizedOrders = {
  encode(
    message: GetPenalizedOrdersMerchantResponse_PenalizedOrders,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.productName !== "") {
      writer.uint32(10).string(message.productName);
    }
    if (message.orderNumber !== "") {
      writer.uint32(18).string(message.orderNumber);
    }
    if (message.payoutAmount !== 0) {
      writer.uint32(29).float(message.payoutAmount);
    }
    if (message.penalty !== 0) {
      writer.uint32(37).float(message.penalty);
    }
    if (message.finalPayout !== 0) {
      writer.uint32(45).float(message.finalPayout);
    }
    if (message.nctReason !== "") {
      writer.uint32(50).string(message.nctReason);
    }
    if (message.nctReasonAR !== "") {
      writer.uint32(58).string(message.nctReasonAR);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPenalizedOrdersMerchantResponse_PenalizedOrders {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPenalizedOrdersMerchantResponse_PenalizedOrders();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productName = reader.string();
          break;
        case 2:
          message.orderNumber = reader.string();
          break;
        case 3:
          message.payoutAmount = reader.float();
          break;
        case 4:
          message.penalty = reader.float();
          break;
        case 5:
          message.finalPayout = reader.float();
          break;
        case 6:
          message.nctReason = reader.string();
          break;
        case 7:
          message.nctReasonAR = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPenalizedOrdersMerchantResponse_PenalizedOrders {
    return {
      productName: isSet(object.productName) ? String(object.productName) : "",
      orderNumber: isSet(object.orderNumber) ? String(object.orderNumber) : "",
      payoutAmount: isSet(object.payoutAmount) ? Number(object.payoutAmount) : 0,
      penalty: isSet(object.penalty) ? Number(object.penalty) : 0,
      finalPayout: isSet(object.finalPayout) ? Number(object.finalPayout) : 0,
      nctReason: isSet(object.nctReason) ? String(object.nctReason) : "",
      nctReasonAR: isSet(object.nctReasonAR) ? String(object.nctReasonAR) : "",
    };
  },

  toJSON(message: GetPenalizedOrdersMerchantResponse_PenalizedOrders): unknown {
    const obj: any = {};
    message.productName !== undefined && (obj.productName = message.productName);
    message.orderNumber !== undefined && (obj.orderNumber = message.orderNumber);
    message.payoutAmount !== undefined && (obj.payoutAmount = message.payoutAmount);
    message.penalty !== undefined && (obj.penalty = message.penalty);
    message.finalPayout !== undefined && (obj.finalPayout = message.finalPayout);
    message.nctReason !== undefined && (obj.nctReason = message.nctReason);
    message.nctReasonAR !== undefined && (obj.nctReasonAR = message.nctReasonAR);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPenalizedOrdersMerchantResponse_PenalizedOrders>, I>>(
    base?: I,
  ): GetPenalizedOrdersMerchantResponse_PenalizedOrders {
    return GetPenalizedOrdersMerchantResponse_PenalizedOrders.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPenalizedOrdersMerchantResponse_PenalizedOrders>, I>>(
    object: I,
  ): GetPenalizedOrdersMerchantResponse_PenalizedOrders {
    const message = createBaseGetPenalizedOrdersMerchantResponse_PenalizedOrders();
    message.productName = object.productName ?? "";
    message.orderNumber = object.orderNumber ?? "";
    message.payoutAmount = object.payoutAmount ?? 0;
    message.penalty = object.penalty ?? 0;
    message.finalPayout = object.finalPayout ?? 0;
    message.nctReason = object.nctReason ?? "";
    message.nctReasonAR = object.nctReasonAR ?? "";
    return message;
  },
};

function createBaseCreateInvoiceRequest(): CreateInvoiceRequest {
  return { orderId: "", invoiceType: "", userType: "", eventName: "" };
}

export const CreateInvoiceRequest = {
  encode(message: CreateInvoiceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderId !== "") {
      writer.uint32(10).string(message.orderId);
    }
    if (message.invoiceType !== "") {
      writer.uint32(18).string(message.invoiceType);
    }
    if (message.userType !== "") {
      writer.uint32(26).string(message.userType);
    }
    if (message.eventName !== "") {
      writer.uint32(34).string(message.eventName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateInvoiceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateInvoiceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderId = reader.string();
          break;
        case 2:
          message.invoiceType = reader.string();
          break;
        case 3:
          message.userType = reader.string();
          break;
        case 4:
          message.eventName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateInvoiceRequest {
    return {
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
      invoiceType: isSet(object.invoiceType) ? String(object.invoiceType) : "",
      userType: isSet(object.userType) ? String(object.userType) : "",
      eventName: isSet(object.eventName) ? String(object.eventName) : "",
    };
  },

  toJSON(message: CreateInvoiceRequest): unknown {
    const obj: any = {};
    message.orderId !== undefined && (obj.orderId = message.orderId);
    message.invoiceType !== undefined && (obj.invoiceType = message.invoiceType);
    message.userType !== undefined && (obj.userType = message.userType);
    message.eventName !== undefined && (obj.eventName = message.eventName);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateInvoiceRequest>, I>>(base?: I): CreateInvoiceRequest {
    return CreateInvoiceRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateInvoiceRequest>, I>>(object: I): CreateInvoiceRequest {
    const message = createBaseCreateInvoiceRequest();
    message.orderId = object.orderId ?? "";
    message.invoiceType = object.invoiceType ?? "";
    message.userType = object.userType ?? "";
    message.eventName = object.eventName ?? "";
    return message;
  },
};

function createBaseCreateInvoiceResponse(): CreateInvoiceResponse {
  return {};
}

export const CreateInvoiceResponse = {
  encode(_: CreateInvoiceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateInvoiceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateInvoiceResponse();
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

  fromJSON(_: any): CreateInvoiceResponse {
    return {};
  },

  toJSON(_: CreateInvoiceResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateInvoiceResponse>, I>>(base?: I): CreateInvoiceResponse {
    return CreateInvoiceResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateInvoiceResponse>, I>>(_: I): CreateInvoiceResponse {
    const message = createBaseCreateInvoiceResponse();
    return message;
  },
};

export interface DmBackendService {
  GetHoldingPenaltyBalance(request: GetHoldingPenaltyBalanceRequest): Promise<GetHoldingPenaltyBalanceResponse>;
  GetStandingPenaltyToDmo(request: GetStandingPenaltyToDmoRequest): Promise<GetStandingPenaltyToDmoResponse>;
  UpdateHoldingPenalty(request: UpdateHoldingPenaltyRequest): Promise<UpdateHoldingPenaltyResponse>;
  GetCancellationFee(request: GetCancellationFeeRequest): Promise<GetCancellationFeeResponse>;
  GetPenalizedOrdersMerchant(request: GetPenalizedOrdersMerchantRequest): Promise<GetPenalizedOrdersMerchantResponse>;
  CreateInvoice(request: CreateInvoiceRequest): Promise<CreateInvoiceResponse>;
}

export class DmBackendServiceClientImpl implements DmBackendService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "dmbackend.DmBackendService";
    this.rpc = rpc;
    this.GetHoldingPenaltyBalance = this.GetHoldingPenaltyBalance.bind(this);
    this.GetStandingPenaltyToDmo = this.GetStandingPenaltyToDmo.bind(this);
    this.UpdateHoldingPenalty = this.UpdateHoldingPenalty.bind(this);
    this.GetCancellationFee = this.GetCancellationFee.bind(this);
    this.GetPenalizedOrdersMerchant = this.GetPenalizedOrdersMerchant.bind(this);
    this.CreateInvoice = this.CreateInvoice.bind(this);
  }
  GetHoldingPenaltyBalance(request: GetHoldingPenaltyBalanceRequest): Promise<GetHoldingPenaltyBalanceResponse> {
    const data = GetHoldingPenaltyBalanceRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetHoldingPenaltyBalance", data);
    return promise.then((data) => GetHoldingPenaltyBalanceResponse.decode(new _m0.Reader(data)));
  }

  GetStandingPenaltyToDmo(request: GetStandingPenaltyToDmoRequest): Promise<GetStandingPenaltyToDmoResponse> {
    const data = GetStandingPenaltyToDmoRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetStandingPenaltyToDmo", data);
    return promise.then((data) => GetStandingPenaltyToDmoResponse.decode(new _m0.Reader(data)));
  }

  UpdateHoldingPenalty(request: UpdateHoldingPenaltyRequest): Promise<UpdateHoldingPenaltyResponse> {
    const data = UpdateHoldingPenaltyRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateHoldingPenalty", data);
    return promise.then((data) => UpdateHoldingPenaltyResponse.decode(new _m0.Reader(data)));
  }

  GetCancellationFee(request: GetCancellationFeeRequest): Promise<GetCancellationFeeResponse> {
    const data = GetCancellationFeeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetCancellationFee", data);
    return promise.then((data) => GetCancellationFeeResponse.decode(new _m0.Reader(data)));
  }

  GetPenalizedOrdersMerchant(request: GetPenalizedOrdersMerchantRequest): Promise<GetPenalizedOrdersMerchantResponse> {
    const data = GetPenalizedOrdersMerchantRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetPenalizedOrdersMerchant", data);
    return promise.then((data) => GetPenalizedOrdersMerchantResponse.decode(new _m0.Reader(data)));
  }

  CreateInvoice(request: CreateInvoiceRequest): Promise<CreateInvoiceResponse> {
    const data = CreateInvoiceRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateInvoice", data);
    return promise.then((data) => CreateInvoiceResponse.decode(new _m0.Reader(data)));
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
