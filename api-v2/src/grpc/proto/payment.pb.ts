/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "payment";

export enum PayoutStatus {
  COMPLETED = 0,
  PROCESSING = 1,
  FAILED = 2,
  ERROR = 3,
  UNRECOGNIZED = -1,
}

export function payoutStatusFromJSON(object: any): PayoutStatus {
  switch (object) {
    case 0:
    case "COMPLETED":
      return PayoutStatus.COMPLETED;
    case 1:
    case "PROCESSING":
      return PayoutStatus.PROCESSING;
    case 2:
    case "FAILED":
      return PayoutStatus.FAILED;
    case 3:
    case "ERROR":
      return PayoutStatus.ERROR;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PayoutStatus.UNRECOGNIZED;
  }
}

export function payoutStatusToJSON(object: PayoutStatus): string {
  switch (object) {
    case PayoutStatus.COMPLETED:
      return "COMPLETED";
    case PayoutStatus.PROCESSING:
      return "PROCESSING";
    case PayoutStatus.FAILED:
      return "FAILED";
    case PayoutStatus.ERROR:
      return "ERROR";
    case PayoutStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetPaymentOptionsRequest {
  moduleName: string;
  isEnabled: boolean;
}

export interface GetPaymentOptionRequest {
  id: string;
}

export interface GetPaymentOptionsResponse {
  paymentOptions: PaymentOption[];
}

export interface PaymentOption {
  id: string;
  paymentProvider: string;
  paymentCardType: string;
  displayName: string;
}

export interface ReturnUrl {
  url: string;
  urlType: string;
}

export interface CreateTransactionRequest {
  userId: string;
  productId: string;
  amount: number;
  paymentOptionId: string;
  soumTransactionNumber: string;
  transactionType: string;
  items: CreateTransactionRequest_TransactionItem[];
  nationalId?: string | undefined;
  orderId: string;
  returnUrls: ReturnUrl[];
  transactionActionType?: string | undefined;
}

export interface CreateTransactionRequest_TransactionItem {
  title: string;
  description: string;
  unitPrice: string;
  vatAmount: string;
  quantity?: number | undefined;
  category?: string | undefined;
  productImage?: string | undefined;
  productId?: string | undefined;
}

export interface CreateTransactionResponse {
  transactionId: string;
  checkoutId: string;
  checkoutURL: string;
  soumTransactionNumber: string;
  transactionStatusId: string;
  transactionType: string;
}

export interface GetTransactionRequest {
  transactionId: string;
}

export interface TransactionResponse {
  transactionId: string;
  checkoutId: string;
  checkoutURL: string;
  soumTransactionNumber: string;
  transactionStatusId: string;
  transactionType: string;
  paymentOptionId: string;
  operationId?: string | undefined;
  totalAmount: number;
  paymentOption:
    | PaymentOption
    | undefined;
  /** big number, will delete it soon */
  providerResponse?: string | undefined;
}

export interface CaptureTransactionRequest {
  transactionId: string;
}

export interface ReverseTransactionRequest {
  transactionId: string;
}

export interface GetTransactionBySoumTransactionNumberRequest {
  soumTransactionNumber: string;
}

export interface ValidateBNPLForUserRequest {
  userId: string;
  productId: string;
  amount: number;
  paymentOption: PaymentOption | undefined;
  soumTransactionNumber: string;
  transactionType: string;
  items: ValidateBNPLForUserRequest_TransactionItem[];
  nationalId?: string | undefined;
}

export interface ValidateBNPLForUserRequest_TransactionItem {
  title: string;
  description: string;
  unitPrice: string;
  vatAmount: string;
}

export interface ValidateBNPLForUserResponse {
  isValid: boolean;
  reason?: string | undefined;
}

export interface CreatePayoutRequest {
  amount: number;
  recipientId: string;
  agentId: string;
  orderId: string;
}

export interface CreatePayoutResponse {
  status: PayoutStatus;
}

export interface CheckPayoutStatusRequest {
  orderId: string;
}

export interface CheckPayoutStatusResponse {
  status: PayoutStatus;
}

function createBaseGetPaymentOptionsRequest(): GetPaymentOptionsRequest {
  return { moduleName: "", isEnabled: false };
}

export const GetPaymentOptionsRequest = {
  encode(message: GetPaymentOptionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.moduleName !== "") {
      writer.uint32(10).string(message.moduleName);
    }
    if (message.isEnabled === true) {
      writer.uint32(16).bool(message.isEnabled);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPaymentOptionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPaymentOptionsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.moduleName = reader.string();
          break;
        case 2:
          message.isEnabled = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPaymentOptionsRequest {
    return {
      moduleName: isSet(object.moduleName) ? String(object.moduleName) : "",
      isEnabled: isSet(object.isEnabled) ? Boolean(object.isEnabled) : false,
    };
  },

  toJSON(message: GetPaymentOptionsRequest): unknown {
    const obj: any = {};
    message.moduleName !== undefined && (obj.moduleName = message.moduleName);
    message.isEnabled !== undefined && (obj.isEnabled = message.isEnabled);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPaymentOptionsRequest>, I>>(base?: I): GetPaymentOptionsRequest {
    return GetPaymentOptionsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPaymentOptionsRequest>, I>>(object: I): GetPaymentOptionsRequest {
    const message = createBaseGetPaymentOptionsRequest();
    message.moduleName = object.moduleName ?? "";
    message.isEnabled = object.isEnabled ?? false;
    return message;
  },
};

function createBaseGetPaymentOptionRequest(): GetPaymentOptionRequest {
  return { id: "" };
}

export const GetPaymentOptionRequest = {
  encode(message: GetPaymentOptionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPaymentOptionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPaymentOptionRequest();
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

  fromJSON(object: any): GetPaymentOptionRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: GetPaymentOptionRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPaymentOptionRequest>, I>>(base?: I): GetPaymentOptionRequest {
    return GetPaymentOptionRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPaymentOptionRequest>, I>>(object: I): GetPaymentOptionRequest {
    const message = createBaseGetPaymentOptionRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseGetPaymentOptionsResponse(): GetPaymentOptionsResponse {
  return { paymentOptions: [] };
}

export const GetPaymentOptionsResponse = {
  encode(message: GetPaymentOptionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.paymentOptions) {
      PaymentOption.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPaymentOptionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPaymentOptionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.paymentOptions.push(PaymentOption.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPaymentOptionsResponse {
    return {
      paymentOptions: Array.isArray(object?.paymentOptions)
        ? object.paymentOptions.map((e: any) => PaymentOption.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetPaymentOptionsResponse): unknown {
    const obj: any = {};
    if (message.paymentOptions) {
      obj.paymentOptions = message.paymentOptions.map((e) => e ? PaymentOption.toJSON(e) : undefined);
    } else {
      obj.paymentOptions = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPaymentOptionsResponse>, I>>(base?: I): GetPaymentOptionsResponse {
    return GetPaymentOptionsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPaymentOptionsResponse>, I>>(object: I): GetPaymentOptionsResponse {
    const message = createBaseGetPaymentOptionsResponse();
    message.paymentOptions = object.paymentOptions?.map((e) => PaymentOption.fromPartial(e)) || [];
    return message;
  },
};

function createBasePaymentOption(): PaymentOption {
  return { id: "", paymentProvider: "", paymentCardType: "", displayName: "" };
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
    if (message.displayName !== "") {
      writer.uint32(34).string(message.displayName);
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
        case 4:
          message.displayName = reader.string();
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
      displayName: isSet(object.displayName) ? String(object.displayName) : "",
    };
  },

  toJSON(message: PaymentOption): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.paymentProvider !== undefined && (obj.paymentProvider = message.paymentProvider);
    message.paymentCardType !== undefined && (obj.paymentCardType = message.paymentCardType);
    message.displayName !== undefined && (obj.displayName = message.displayName);
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
    message.displayName = object.displayName ?? "";
    return message;
  },
};

function createBaseReturnUrl(): ReturnUrl {
  return { url: "", urlType: "" };
}

export const ReturnUrl = {
  encode(message: ReturnUrl, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    if (message.urlType !== "") {
      writer.uint32(18).string(message.urlType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReturnUrl {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReturnUrl();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.url = reader.string();
          break;
        case 2:
          message.urlType = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReturnUrl {
    return {
      url: isSet(object.url) ? String(object.url) : "",
      urlType: isSet(object.urlType) ? String(object.urlType) : "",
    };
  },

  toJSON(message: ReturnUrl): unknown {
    const obj: any = {};
    message.url !== undefined && (obj.url = message.url);
    message.urlType !== undefined && (obj.urlType = message.urlType);
    return obj;
  },

  create<I extends Exact<DeepPartial<ReturnUrl>, I>>(base?: I): ReturnUrl {
    return ReturnUrl.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ReturnUrl>, I>>(object: I): ReturnUrl {
    const message = createBaseReturnUrl();
    message.url = object.url ?? "";
    message.urlType = object.urlType ?? "";
    return message;
  },
};

function createBaseCreateTransactionRequest(): CreateTransactionRequest {
  return {
    userId: "",
    productId: "",
    amount: 0,
    paymentOptionId: "",
    soumTransactionNumber: "",
    transactionType: "",
    items: [],
    nationalId: undefined,
    orderId: "",
    returnUrls: [],
    transactionActionType: undefined,
  };
}

export const CreateTransactionRequest = {
  encode(message: CreateTransactionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.productId !== "") {
      writer.uint32(18).string(message.productId);
    }
    if (message.amount !== 0) {
      writer.uint32(25).double(message.amount);
    }
    if (message.paymentOptionId !== "") {
      writer.uint32(34).string(message.paymentOptionId);
    }
    if (message.soumTransactionNumber !== "") {
      writer.uint32(42).string(message.soumTransactionNumber);
    }
    if (message.transactionType !== "") {
      writer.uint32(50).string(message.transactionType);
    }
    for (const v of message.items) {
      CreateTransactionRequest_TransactionItem.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    if (message.nationalId !== undefined) {
      writer.uint32(66).string(message.nationalId);
    }
    if (message.orderId !== "") {
      writer.uint32(74).string(message.orderId);
    }
    for (const v of message.returnUrls) {
      ReturnUrl.encode(v!, writer.uint32(82).fork()).ldelim();
    }
    if (message.transactionActionType !== undefined) {
      writer.uint32(90).string(message.transactionActionType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateTransactionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTransactionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.productId = reader.string();
          break;
        case 3:
          message.amount = reader.double();
          break;
        case 4:
          message.paymentOptionId = reader.string();
          break;
        case 5:
          message.soumTransactionNumber = reader.string();
          break;
        case 6:
          message.transactionType = reader.string();
          break;
        case 7:
          message.items.push(CreateTransactionRequest_TransactionItem.decode(reader, reader.uint32()));
          break;
        case 8:
          message.nationalId = reader.string();
          break;
        case 9:
          message.orderId = reader.string();
          break;
        case 10:
          message.returnUrls.push(ReturnUrl.decode(reader, reader.uint32()));
          break;
        case 11:
          message.transactionActionType = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateTransactionRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      productId: isSet(object.productId) ? String(object.productId) : "",
      amount: isSet(object.amount) ? Number(object.amount) : 0,
      paymentOptionId: isSet(object.paymentOptionId) ? String(object.paymentOptionId) : "",
      soumTransactionNumber: isSet(object.soumTransactionNumber) ? String(object.soumTransactionNumber) : "",
      transactionType: isSet(object.transactionType) ? String(object.transactionType) : "",
      items: Array.isArray(object?.items)
        ? object.items.map((e: any) => CreateTransactionRequest_TransactionItem.fromJSON(e))
        : [],
      nationalId: isSet(object.nationalId) ? String(object.nationalId) : undefined,
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
      returnUrls: Array.isArray(object?.returnUrls) ? object.returnUrls.map((e: any) => ReturnUrl.fromJSON(e)) : [],
      transactionActionType: isSet(object.transactionActionType) ? String(object.transactionActionType) : undefined,
    };
  },

  toJSON(message: CreateTransactionRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.productId !== undefined && (obj.productId = message.productId);
    message.amount !== undefined && (obj.amount = message.amount);
    message.paymentOptionId !== undefined && (obj.paymentOptionId = message.paymentOptionId);
    message.soumTransactionNumber !== undefined && (obj.soumTransactionNumber = message.soumTransactionNumber);
    message.transactionType !== undefined && (obj.transactionType = message.transactionType);
    if (message.items) {
      obj.items = message.items.map((e) => e ? CreateTransactionRequest_TransactionItem.toJSON(e) : undefined);
    } else {
      obj.items = [];
    }
    message.nationalId !== undefined && (obj.nationalId = message.nationalId);
    message.orderId !== undefined && (obj.orderId = message.orderId);
    if (message.returnUrls) {
      obj.returnUrls = message.returnUrls.map((e) => e ? ReturnUrl.toJSON(e) : undefined);
    } else {
      obj.returnUrls = [];
    }
    message.transactionActionType !== undefined && (obj.transactionActionType = message.transactionActionType);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateTransactionRequest>, I>>(base?: I): CreateTransactionRequest {
    return CreateTransactionRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateTransactionRequest>, I>>(object: I): CreateTransactionRequest {
    const message = createBaseCreateTransactionRequest();
    message.userId = object.userId ?? "";
    message.productId = object.productId ?? "";
    message.amount = object.amount ?? 0;
    message.paymentOptionId = object.paymentOptionId ?? "";
    message.soumTransactionNumber = object.soumTransactionNumber ?? "";
    message.transactionType = object.transactionType ?? "";
    message.items = object.items?.map((e) => CreateTransactionRequest_TransactionItem.fromPartial(e)) || [];
    message.nationalId = object.nationalId ?? undefined;
    message.orderId = object.orderId ?? "";
    message.returnUrls = object.returnUrls?.map((e) => ReturnUrl.fromPartial(e)) || [];
    message.transactionActionType = object.transactionActionType ?? undefined;
    return message;
  },
};

function createBaseCreateTransactionRequest_TransactionItem(): CreateTransactionRequest_TransactionItem {
  return {
    title: "",
    description: "",
    unitPrice: "",
    vatAmount: "",
    quantity: undefined,
    category: undefined,
    productImage: undefined,
    productId: undefined,
  };
}

export const CreateTransactionRequest_TransactionItem = {
  encode(message: CreateTransactionRequest_TransactionItem, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.unitPrice !== "") {
      writer.uint32(26).string(message.unitPrice);
    }
    if (message.vatAmount !== "") {
      writer.uint32(34).string(message.vatAmount);
    }
    if (message.quantity !== undefined) {
      writer.uint32(40).int32(message.quantity);
    }
    if (message.category !== undefined) {
      writer.uint32(50).string(message.category);
    }
    if (message.productImage !== undefined) {
      writer.uint32(58).string(message.productImage);
    }
    if (message.productId !== undefined) {
      writer.uint32(66).string(message.productId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateTransactionRequest_TransactionItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTransactionRequest_TransactionItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.unitPrice = reader.string();
          break;
        case 4:
          message.vatAmount = reader.string();
          break;
        case 5:
          message.quantity = reader.int32();
          break;
        case 6:
          message.category = reader.string();
          break;
        case 7:
          message.productImage = reader.string();
          break;
        case 8:
          message.productId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateTransactionRequest_TransactionItem {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      unitPrice: isSet(object.unitPrice) ? String(object.unitPrice) : "",
      vatAmount: isSet(object.vatAmount) ? String(object.vatAmount) : "",
      quantity: isSet(object.quantity) ? Number(object.quantity) : undefined,
      category: isSet(object.category) ? String(object.category) : undefined,
      productImage: isSet(object.productImage) ? String(object.productImage) : undefined,
      productId: isSet(object.productId) ? String(object.productId) : undefined,
    };
  },

  toJSON(message: CreateTransactionRequest_TransactionItem): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.unitPrice !== undefined && (obj.unitPrice = message.unitPrice);
    message.vatAmount !== undefined && (obj.vatAmount = message.vatAmount);
    message.quantity !== undefined && (obj.quantity = Math.round(message.quantity));
    message.category !== undefined && (obj.category = message.category);
    message.productImage !== undefined && (obj.productImage = message.productImage);
    message.productId !== undefined && (obj.productId = message.productId);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateTransactionRequest_TransactionItem>, I>>(
    base?: I,
  ): CreateTransactionRequest_TransactionItem {
    return CreateTransactionRequest_TransactionItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateTransactionRequest_TransactionItem>, I>>(
    object: I,
  ): CreateTransactionRequest_TransactionItem {
    const message = createBaseCreateTransactionRequest_TransactionItem();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.unitPrice = object.unitPrice ?? "";
    message.vatAmount = object.vatAmount ?? "";
    message.quantity = object.quantity ?? undefined;
    message.category = object.category ?? undefined;
    message.productImage = object.productImage ?? undefined;
    message.productId = object.productId ?? undefined;
    return message;
  },
};

function createBaseCreateTransactionResponse(): CreateTransactionResponse {
  return {
    transactionId: "",
    checkoutId: "",
    checkoutURL: "",
    soumTransactionNumber: "",
    transactionStatusId: "",
    transactionType: "",
  };
}

export const CreateTransactionResponse = {
  encode(message: CreateTransactionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateTransactionResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTransactionResponse();
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
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateTransactionResponse {
    return {
      transactionId: isSet(object.transactionId) ? String(object.transactionId) : "",
      checkoutId: isSet(object.checkoutId) ? String(object.checkoutId) : "",
      checkoutURL: isSet(object.checkoutURL) ? String(object.checkoutURL) : "",
      soumTransactionNumber: isSet(object.soumTransactionNumber) ? String(object.soumTransactionNumber) : "",
      transactionStatusId: isSet(object.transactionStatusId) ? String(object.transactionStatusId) : "",
      transactionType: isSet(object.transactionType) ? String(object.transactionType) : "",
    };
  },

  toJSON(message: CreateTransactionResponse): unknown {
    const obj: any = {};
    message.transactionId !== undefined && (obj.transactionId = message.transactionId);
    message.checkoutId !== undefined && (obj.checkoutId = message.checkoutId);
    message.checkoutURL !== undefined && (obj.checkoutURL = message.checkoutURL);
    message.soumTransactionNumber !== undefined && (obj.soumTransactionNumber = message.soumTransactionNumber);
    message.transactionStatusId !== undefined && (obj.transactionStatusId = message.transactionStatusId);
    message.transactionType !== undefined && (obj.transactionType = message.transactionType);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateTransactionResponse>, I>>(base?: I): CreateTransactionResponse {
    return CreateTransactionResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateTransactionResponse>, I>>(object: I): CreateTransactionResponse {
    const message = createBaseCreateTransactionResponse();
    message.transactionId = object.transactionId ?? "";
    message.checkoutId = object.checkoutId ?? "";
    message.checkoutURL = object.checkoutURL ?? "";
    message.soumTransactionNumber = object.soumTransactionNumber ?? "";
    message.transactionStatusId = object.transactionStatusId ?? "";
    message.transactionType = object.transactionType ?? "";
    return message;
  },
};

function createBaseGetTransactionRequest(): GetTransactionRequest {
  return { transactionId: "" };
}

export const GetTransactionRequest = {
  encode(message: GetTransactionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.transactionId !== "") {
      writer.uint32(10).string(message.transactionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTransactionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTransactionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactionId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTransactionRequest {
    return { transactionId: isSet(object.transactionId) ? String(object.transactionId) : "" };
  },

  toJSON(message: GetTransactionRequest): unknown {
    const obj: any = {};
    message.transactionId !== undefined && (obj.transactionId = message.transactionId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetTransactionRequest>, I>>(base?: I): GetTransactionRequest {
    return GetTransactionRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetTransactionRequest>, I>>(object: I): GetTransactionRequest {
    const message = createBaseGetTransactionRequest();
    message.transactionId = object.transactionId ?? "";
    return message;
  },
};

function createBaseTransactionResponse(): TransactionResponse {
  return {
    transactionId: "",
    checkoutId: "",
    checkoutURL: "",
    soumTransactionNumber: "",
    transactionStatusId: "",
    transactionType: "",
    paymentOptionId: "",
    operationId: undefined,
    totalAmount: 0,
    paymentOption: undefined,
    providerResponse: undefined,
  };
}

export const TransactionResponse = {
  encode(message: TransactionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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
    if (message.operationId !== undefined) {
      writer.uint32(66).string(message.operationId);
    }
    if (message.totalAmount !== 0) {
      writer.uint32(73).double(message.totalAmount);
    }
    if (message.paymentOption !== undefined) {
      PaymentOption.encode(message.paymentOption, writer.uint32(82).fork()).ldelim();
    }
    if (message.providerResponse !== undefined) {
      writer.uint32(242).string(message.providerResponse);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionResponse();
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
        case 8:
          message.operationId = reader.string();
          break;
        case 9:
          message.totalAmount = reader.double();
          break;
        case 10:
          message.paymentOption = PaymentOption.decode(reader, reader.uint32());
          break;
        case 30:
          message.providerResponse = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransactionResponse {
    return {
      transactionId: isSet(object.transactionId) ? String(object.transactionId) : "",
      checkoutId: isSet(object.checkoutId) ? String(object.checkoutId) : "",
      checkoutURL: isSet(object.checkoutURL) ? String(object.checkoutURL) : "",
      soumTransactionNumber: isSet(object.soumTransactionNumber) ? String(object.soumTransactionNumber) : "",
      transactionStatusId: isSet(object.transactionStatusId) ? String(object.transactionStatusId) : "",
      transactionType: isSet(object.transactionType) ? String(object.transactionType) : "",
      paymentOptionId: isSet(object.paymentOptionId) ? String(object.paymentOptionId) : "",
      operationId: isSet(object.operationId) ? String(object.operationId) : undefined,
      totalAmount: isSet(object.totalAmount) ? Number(object.totalAmount) : 0,
      paymentOption: isSet(object.paymentOption) ? PaymentOption.fromJSON(object.paymentOption) : undefined,
      providerResponse: isSet(object.providerResponse) ? String(object.providerResponse) : undefined,
    };
  },

  toJSON(message: TransactionResponse): unknown {
    const obj: any = {};
    message.transactionId !== undefined && (obj.transactionId = message.transactionId);
    message.checkoutId !== undefined && (obj.checkoutId = message.checkoutId);
    message.checkoutURL !== undefined && (obj.checkoutURL = message.checkoutURL);
    message.soumTransactionNumber !== undefined && (obj.soumTransactionNumber = message.soumTransactionNumber);
    message.transactionStatusId !== undefined && (obj.transactionStatusId = message.transactionStatusId);
    message.transactionType !== undefined && (obj.transactionType = message.transactionType);
    message.paymentOptionId !== undefined && (obj.paymentOptionId = message.paymentOptionId);
    message.operationId !== undefined && (obj.operationId = message.operationId);
    message.totalAmount !== undefined && (obj.totalAmount = message.totalAmount);
    message.paymentOption !== undefined &&
      (obj.paymentOption = message.paymentOption ? PaymentOption.toJSON(message.paymentOption) : undefined);
    message.providerResponse !== undefined && (obj.providerResponse = message.providerResponse);
    return obj;
  },

  create<I extends Exact<DeepPartial<TransactionResponse>, I>>(base?: I): TransactionResponse {
    return TransactionResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TransactionResponse>, I>>(object: I): TransactionResponse {
    const message = createBaseTransactionResponse();
    message.transactionId = object.transactionId ?? "";
    message.checkoutId = object.checkoutId ?? "";
    message.checkoutURL = object.checkoutURL ?? "";
    message.soumTransactionNumber = object.soumTransactionNumber ?? "";
    message.transactionStatusId = object.transactionStatusId ?? "";
    message.transactionType = object.transactionType ?? "";
    message.paymentOptionId = object.paymentOptionId ?? "";
    message.operationId = object.operationId ?? undefined;
    message.totalAmount = object.totalAmount ?? 0;
    message.paymentOption = (object.paymentOption !== undefined && object.paymentOption !== null)
      ? PaymentOption.fromPartial(object.paymentOption)
      : undefined;
    message.providerResponse = object.providerResponse ?? undefined;
    return message;
  },
};

function createBaseCaptureTransactionRequest(): CaptureTransactionRequest {
  return { transactionId: "" };
}

export const CaptureTransactionRequest = {
  encode(message: CaptureTransactionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.transactionId !== "") {
      writer.uint32(10).string(message.transactionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CaptureTransactionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCaptureTransactionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactionId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CaptureTransactionRequest {
    return { transactionId: isSet(object.transactionId) ? String(object.transactionId) : "" };
  },

  toJSON(message: CaptureTransactionRequest): unknown {
    const obj: any = {};
    message.transactionId !== undefined && (obj.transactionId = message.transactionId);
    return obj;
  },

  create<I extends Exact<DeepPartial<CaptureTransactionRequest>, I>>(base?: I): CaptureTransactionRequest {
    return CaptureTransactionRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CaptureTransactionRequest>, I>>(object: I): CaptureTransactionRequest {
    const message = createBaseCaptureTransactionRequest();
    message.transactionId = object.transactionId ?? "";
    return message;
  },
};

function createBaseReverseTransactionRequest(): ReverseTransactionRequest {
  return { transactionId: "" };
}

export const ReverseTransactionRequest = {
  encode(message: ReverseTransactionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.transactionId !== "") {
      writer.uint32(10).string(message.transactionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReverseTransactionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReverseTransactionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactionId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReverseTransactionRequest {
    return { transactionId: isSet(object.transactionId) ? String(object.transactionId) : "" };
  },

  toJSON(message: ReverseTransactionRequest): unknown {
    const obj: any = {};
    message.transactionId !== undefined && (obj.transactionId = message.transactionId);
    return obj;
  },

  create<I extends Exact<DeepPartial<ReverseTransactionRequest>, I>>(base?: I): ReverseTransactionRequest {
    return ReverseTransactionRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ReverseTransactionRequest>, I>>(object: I): ReverseTransactionRequest {
    const message = createBaseReverseTransactionRequest();
    message.transactionId = object.transactionId ?? "";
    return message;
  },
};

function createBaseGetTransactionBySoumTransactionNumberRequest(): GetTransactionBySoumTransactionNumberRequest {
  return { soumTransactionNumber: "" };
}

export const GetTransactionBySoumTransactionNumberRequest = {
  encode(message: GetTransactionBySoumTransactionNumberRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.soumTransactionNumber !== "") {
      writer.uint32(10).string(message.soumTransactionNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTransactionBySoumTransactionNumberRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTransactionBySoumTransactionNumberRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.soumTransactionNumber = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTransactionBySoumTransactionNumberRequest {
    return { soumTransactionNumber: isSet(object.soumTransactionNumber) ? String(object.soumTransactionNumber) : "" };
  },

  toJSON(message: GetTransactionBySoumTransactionNumberRequest): unknown {
    const obj: any = {};
    message.soumTransactionNumber !== undefined && (obj.soumTransactionNumber = message.soumTransactionNumber);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetTransactionBySoumTransactionNumberRequest>, I>>(
    base?: I,
  ): GetTransactionBySoumTransactionNumberRequest {
    return GetTransactionBySoumTransactionNumberRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetTransactionBySoumTransactionNumberRequest>, I>>(
    object: I,
  ): GetTransactionBySoumTransactionNumberRequest {
    const message = createBaseGetTransactionBySoumTransactionNumberRequest();
    message.soumTransactionNumber = object.soumTransactionNumber ?? "";
    return message;
  },
};

function createBaseValidateBNPLForUserRequest(): ValidateBNPLForUserRequest {
  return {
    userId: "",
    productId: "",
    amount: 0,
    paymentOption: undefined,
    soumTransactionNumber: "",
    transactionType: "",
    items: [],
    nationalId: undefined,
  };
}

export const ValidateBNPLForUserRequest = {
  encode(message: ValidateBNPLForUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.productId !== "") {
      writer.uint32(18).string(message.productId);
    }
    if (message.amount !== 0) {
      writer.uint32(25).double(message.amount);
    }
    if (message.paymentOption !== undefined) {
      PaymentOption.encode(message.paymentOption, writer.uint32(34).fork()).ldelim();
    }
    if (message.soumTransactionNumber !== "") {
      writer.uint32(42).string(message.soumTransactionNumber);
    }
    if (message.transactionType !== "") {
      writer.uint32(50).string(message.transactionType);
    }
    for (const v of message.items) {
      ValidateBNPLForUserRequest_TransactionItem.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    if (message.nationalId !== undefined) {
      writer.uint32(66).string(message.nationalId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidateBNPLForUserRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidateBNPLForUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.productId = reader.string();
          break;
        case 3:
          message.amount = reader.double();
          break;
        case 4:
          message.paymentOption = PaymentOption.decode(reader, reader.uint32());
          break;
        case 5:
          message.soumTransactionNumber = reader.string();
          break;
        case 6:
          message.transactionType = reader.string();
          break;
        case 7:
          message.items.push(ValidateBNPLForUserRequest_TransactionItem.decode(reader, reader.uint32()));
          break;
        case 8:
          message.nationalId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ValidateBNPLForUserRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      productId: isSet(object.productId) ? String(object.productId) : "",
      amount: isSet(object.amount) ? Number(object.amount) : 0,
      paymentOption: isSet(object.paymentOption) ? PaymentOption.fromJSON(object.paymentOption) : undefined,
      soumTransactionNumber: isSet(object.soumTransactionNumber) ? String(object.soumTransactionNumber) : "",
      transactionType: isSet(object.transactionType) ? String(object.transactionType) : "",
      items: Array.isArray(object?.items)
        ? object.items.map((e: any) => ValidateBNPLForUserRequest_TransactionItem.fromJSON(e))
        : [],
      nationalId: isSet(object.nationalId) ? String(object.nationalId) : undefined,
    };
  },

  toJSON(message: ValidateBNPLForUserRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.productId !== undefined && (obj.productId = message.productId);
    message.amount !== undefined && (obj.amount = message.amount);
    message.paymentOption !== undefined &&
      (obj.paymentOption = message.paymentOption ? PaymentOption.toJSON(message.paymentOption) : undefined);
    message.soumTransactionNumber !== undefined && (obj.soumTransactionNumber = message.soumTransactionNumber);
    message.transactionType !== undefined && (obj.transactionType = message.transactionType);
    if (message.items) {
      obj.items = message.items.map((e) => e ? ValidateBNPLForUserRequest_TransactionItem.toJSON(e) : undefined);
    } else {
      obj.items = [];
    }
    message.nationalId !== undefined && (obj.nationalId = message.nationalId);
    return obj;
  },

  create<I extends Exact<DeepPartial<ValidateBNPLForUserRequest>, I>>(base?: I): ValidateBNPLForUserRequest {
    return ValidateBNPLForUserRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ValidateBNPLForUserRequest>, I>>(object: I): ValidateBNPLForUserRequest {
    const message = createBaseValidateBNPLForUserRequest();
    message.userId = object.userId ?? "";
    message.productId = object.productId ?? "";
    message.amount = object.amount ?? 0;
    message.paymentOption = (object.paymentOption !== undefined && object.paymentOption !== null)
      ? PaymentOption.fromPartial(object.paymentOption)
      : undefined;
    message.soumTransactionNumber = object.soumTransactionNumber ?? "";
    message.transactionType = object.transactionType ?? "";
    message.items = object.items?.map((e) => ValidateBNPLForUserRequest_TransactionItem.fromPartial(e)) || [];
    message.nationalId = object.nationalId ?? undefined;
    return message;
  },
};

function createBaseValidateBNPLForUserRequest_TransactionItem(): ValidateBNPLForUserRequest_TransactionItem {
  return { title: "", description: "", unitPrice: "", vatAmount: "" };
}

export const ValidateBNPLForUserRequest_TransactionItem = {
  encode(message: ValidateBNPLForUserRequest_TransactionItem, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.unitPrice !== "") {
      writer.uint32(26).string(message.unitPrice);
    }
    if (message.vatAmount !== "") {
      writer.uint32(34).string(message.vatAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidateBNPLForUserRequest_TransactionItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidateBNPLForUserRequest_TransactionItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.unitPrice = reader.string();
          break;
        case 4:
          message.vatAmount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ValidateBNPLForUserRequest_TransactionItem {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      unitPrice: isSet(object.unitPrice) ? String(object.unitPrice) : "",
      vatAmount: isSet(object.vatAmount) ? String(object.vatAmount) : "",
    };
  },

  toJSON(message: ValidateBNPLForUserRequest_TransactionItem): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.unitPrice !== undefined && (obj.unitPrice = message.unitPrice);
    message.vatAmount !== undefined && (obj.vatAmount = message.vatAmount);
    return obj;
  },

  create<I extends Exact<DeepPartial<ValidateBNPLForUserRequest_TransactionItem>, I>>(
    base?: I,
  ): ValidateBNPLForUserRequest_TransactionItem {
    return ValidateBNPLForUserRequest_TransactionItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ValidateBNPLForUserRequest_TransactionItem>, I>>(
    object: I,
  ): ValidateBNPLForUserRequest_TransactionItem {
    const message = createBaseValidateBNPLForUserRequest_TransactionItem();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.unitPrice = object.unitPrice ?? "";
    message.vatAmount = object.vatAmount ?? "";
    return message;
  },
};

function createBaseValidateBNPLForUserResponse(): ValidateBNPLForUserResponse {
  return { isValid: false, reason: undefined };
}

export const ValidateBNPLForUserResponse = {
  encode(message: ValidateBNPLForUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isValid === true) {
      writer.uint32(8).bool(message.isValid);
    }
    if (message.reason !== undefined) {
      writer.uint32(18).string(message.reason);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidateBNPLForUserResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidateBNPLForUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.isValid = reader.bool();
          break;
        case 2:
          message.reason = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ValidateBNPLForUserResponse {
    return {
      isValid: isSet(object.isValid) ? Boolean(object.isValid) : false,
      reason: isSet(object.reason) ? String(object.reason) : undefined,
    };
  },

  toJSON(message: ValidateBNPLForUserResponse): unknown {
    const obj: any = {};
    message.isValid !== undefined && (obj.isValid = message.isValid);
    message.reason !== undefined && (obj.reason = message.reason);
    return obj;
  },

  create<I extends Exact<DeepPartial<ValidateBNPLForUserResponse>, I>>(base?: I): ValidateBNPLForUserResponse {
    return ValidateBNPLForUserResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ValidateBNPLForUserResponse>, I>>(object: I): ValidateBNPLForUserResponse {
    const message = createBaseValidateBNPLForUserResponse();
    message.isValid = object.isValid ?? false;
    message.reason = object.reason ?? undefined;
    return message;
  },
};

function createBaseCreatePayoutRequest(): CreatePayoutRequest {
  return { amount: 0, recipientId: "", agentId: "", orderId: "" };
}

export const CreatePayoutRequest = {
  encode(message: CreatePayoutRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.amount !== 0) {
      writer.uint32(9).double(message.amount);
    }
    if (message.recipientId !== "") {
      writer.uint32(18).string(message.recipientId);
    }
    if (message.agentId !== "") {
      writer.uint32(26).string(message.agentId);
    }
    if (message.orderId !== "") {
      writer.uint32(34).string(message.orderId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreatePayoutRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreatePayoutRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = reader.double();
          break;
        case 2:
          message.recipientId = reader.string();
          break;
        case 3:
          message.agentId = reader.string();
          break;
        case 4:
          message.orderId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreatePayoutRequest {
    return {
      amount: isSet(object.amount) ? Number(object.amount) : 0,
      recipientId: isSet(object.recipientId) ? String(object.recipientId) : "",
      agentId: isSet(object.agentId) ? String(object.agentId) : "",
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
    };
  },

  toJSON(message: CreatePayoutRequest): unknown {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount);
    message.recipientId !== undefined && (obj.recipientId = message.recipientId);
    message.agentId !== undefined && (obj.agentId = message.agentId);
    message.orderId !== undefined && (obj.orderId = message.orderId);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreatePayoutRequest>, I>>(base?: I): CreatePayoutRequest {
    return CreatePayoutRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreatePayoutRequest>, I>>(object: I): CreatePayoutRequest {
    const message = createBaseCreatePayoutRequest();
    message.amount = object.amount ?? 0;
    message.recipientId = object.recipientId ?? "";
    message.agentId = object.agentId ?? "";
    message.orderId = object.orderId ?? "";
    return message;
  },
};

function createBaseCreatePayoutResponse(): CreatePayoutResponse {
  return { status: 0 };
}

export const CreatePayoutResponse = {
  encode(message: CreatePayoutResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status !== 0) {
      writer.uint32(8).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreatePayoutResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreatePayoutResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreatePayoutResponse {
    return { status: isSet(object.status) ? payoutStatusFromJSON(object.status) : 0 };
  },

  toJSON(message: CreatePayoutResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = payoutStatusToJSON(message.status));
    return obj;
  },

  create<I extends Exact<DeepPartial<CreatePayoutResponse>, I>>(base?: I): CreatePayoutResponse {
    return CreatePayoutResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreatePayoutResponse>, I>>(object: I): CreatePayoutResponse {
    const message = createBaseCreatePayoutResponse();
    message.status = object.status ?? 0;
    return message;
  },
};

function createBaseCheckPayoutStatusRequest(): CheckPayoutStatusRequest {
  return { orderId: "" };
}

export const CheckPayoutStatusRequest = {
  encode(message: CheckPayoutStatusRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderId !== "") {
      writer.uint32(10).string(message.orderId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckPayoutStatusRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckPayoutStatusRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CheckPayoutStatusRequest {
    return { orderId: isSet(object.orderId) ? String(object.orderId) : "" };
  },

  toJSON(message: CheckPayoutStatusRequest): unknown {
    const obj: any = {};
    message.orderId !== undefined && (obj.orderId = message.orderId);
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckPayoutStatusRequest>, I>>(base?: I): CheckPayoutStatusRequest {
    return CheckPayoutStatusRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CheckPayoutStatusRequest>, I>>(object: I): CheckPayoutStatusRequest {
    const message = createBaseCheckPayoutStatusRequest();
    message.orderId = object.orderId ?? "";
    return message;
  },
};

function createBaseCheckPayoutStatusResponse(): CheckPayoutStatusResponse {
  return { status: 0 };
}

export const CheckPayoutStatusResponse = {
  encode(message: CheckPayoutStatusResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status !== 0) {
      writer.uint32(8).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckPayoutStatusResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckPayoutStatusResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CheckPayoutStatusResponse {
    return { status: isSet(object.status) ? payoutStatusFromJSON(object.status) : 0 };
  },

  toJSON(message: CheckPayoutStatusResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = payoutStatusToJSON(message.status));
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckPayoutStatusResponse>, I>>(base?: I): CheckPayoutStatusResponse {
    return CheckPayoutStatusResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CheckPayoutStatusResponse>, I>>(object: I): CheckPayoutStatusResponse {
    const message = createBaseCheckPayoutStatusResponse();
    message.status = object.status ?? 0;
    return message;
  },
};

export interface PaymentService {
  CreateTransaction(request: CreateTransactionRequest): Promise<CreateTransactionResponse>;
  GetTransactionById(request: GetTransactionRequest): Promise<TransactionResponse>;
  CaptureTransaction(request: CaptureTransactionRequest): Promise<TransactionResponse>;
  ReverseTransaction(request: ReverseTransactionRequest): Promise<TransactionResponse>;
  GetPaymentOptions(request: GetPaymentOptionsRequest): Promise<GetPaymentOptionsResponse>;
  GetPaymentOption(request: GetPaymentOptionRequest): Promise<PaymentOption>;
  GetTransactionBySoumTransactionNumber(
    request: GetTransactionBySoumTransactionNumberRequest,
  ): Promise<TransactionResponse>;
  ValidateBNPLForUser(request: ValidateBNPLForUserRequest): Promise<ValidateBNPLForUserResponse>;
  CreatePayout(request: CreatePayoutRequest): Promise<CreatePayoutResponse>;
  CheckPayoutStatus(request: CheckPayoutStatusRequest): Promise<CheckPayoutStatusResponse>;
}

export class PaymentServiceClientImpl implements PaymentService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "payment.PaymentService";
    this.rpc = rpc;
    this.CreateTransaction = this.CreateTransaction.bind(this);
    this.GetTransactionById = this.GetTransactionById.bind(this);
    this.CaptureTransaction = this.CaptureTransaction.bind(this);
    this.ReverseTransaction = this.ReverseTransaction.bind(this);
    this.GetPaymentOptions = this.GetPaymentOptions.bind(this);
    this.GetPaymentOption = this.GetPaymentOption.bind(this);
    this.GetTransactionBySoumTransactionNumber = this.GetTransactionBySoumTransactionNumber.bind(this);
    this.ValidateBNPLForUser = this.ValidateBNPLForUser.bind(this);
    this.CreatePayout = this.CreatePayout.bind(this);
    this.CheckPayoutStatus = this.CheckPayoutStatus.bind(this);
  }
  CreateTransaction(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    const data = CreateTransactionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateTransaction", data);
    return promise.then((data) => CreateTransactionResponse.decode(new _m0.Reader(data)));
  }

  GetTransactionById(request: GetTransactionRequest): Promise<TransactionResponse> {
    const data = GetTransactionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetTransactionById", data);
    return promise.then((data) => TransactionResponse.decode(new _m0.Reader(data)));
  }

  CaptureTransaction(request: CaptureTransactionRequest): Promise<TransactionResponse> {
    const data = CaptureTransactionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CaptureTransaction", data);
    return promise.then((data) => TransactionResponse.decode(new _m0.Reader(data)));
  }

  ReverseTransaction(request: ReverseTransactionRequest): Promise<TransactionResponse> {
    const data = ReverseTransactionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ReverseTransaction", data);
    return promise.then((data) => TransactionResponse.decode(new _m0.Reader(data)));
  }

  GetPaymentOptions(request: GetPaymentOptionsRequest): Promise<GetPaymentOptionsResponse> {
    const data = GetPaymentOptionsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetPaymentOptions", data);
    return promise.then((data) => GetPaymentOptionsResponse.decode(new _m0.Reader(data)));
  }

  GetPaymentOption(request: GetPaymentOptionRequest): Promise<PaymentOption> {
    const data = GetPaymentOptionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetPaymentOption", data);
    return promise.then((data) => PaymentOption.decode(new _m0.Reader(data)));
  }

  GetTransactionBySoumTransactionNumber(
    request: GetTransactionBySoumTransactionNumberRequest,
  ): Promise<TransactionResponse> {
    const data = GetTransactionBySoumTransactionNumberRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetTransactionBySoumTransactionNumber", data);
    return promise.then((data) => TransactionResponse.decode(new _m0.Reader(data)));
  }

  ValidateBNPLForUser(request: ValidateBNPLForUserRequest): Promise<ValidateBNPLForUserResponse> {
    const data = ValidateBNPLForUserRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ValidateBNPLForUser", data);
    return promise.then((data) => ValidateBNPLForUserResponse.decode(new _m0.Reader(data)));
  }

  CreatePayout(request: CreatePayoutRequest): Promise<CreatePayoutResponse> {
    const data = CreatePayoutRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreatePayout", data);
    return promise.then((data) => CreatePayoutResponse.decode(new _m0.Reader(data)));
  }

  CheckPayoutStatus(request: CheckPayoutStatusRequest): Promise<CheckPayoutStatusResponse> {
    const data = CheckPayoutStatusRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CheckPayoutStatus", data);
    return promise.then((data) => CheckPayoutStatusResponse.decode(new _m0.Reader(data)));
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
