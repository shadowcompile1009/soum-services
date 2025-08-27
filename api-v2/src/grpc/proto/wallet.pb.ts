/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "wallet";

export interface GetWalletRequest {
  ownerId: string;
}

export interface GetTransactionRequest {
  id: string;
}

export interface UpdateAmountTransactionRequest {
  transactionId: string;
  amount: number;
}

export interface GetWalletResponse {
  id: string;
  ownerId: string;
  tag: string;
  balance: number;
  status: string;
  createdAt: number;
  updatedAt: number;
  pendingTransactions: number;
  onholdBalance: number;
  availableBalance: number;
  totalBalance: number;
}

export interface UpdateWalletRequest {
  walletId: string;
  amount: number;
  transactionType: string;
}

export interface UpdateTransactionRequest {
  transactionId: string;
  status: string;
}

export interface CreateTransactionRequest {
  ownerId: string;
  type: string;
  amount: number;
  orderId: string;
  description: string;
  status?: string | undefined;
  metadata?: CreateTransactionRequest_Metadata | undefined;
}

export interface CreateTransactionRequest_Metadata {
  creditType: string;
}

export interface TransactionResponse {
  id: string;
  ownerId: string;
  walletId: string;
  amount: number;
  status: string;
  type: string;
  createdAt: number;
  updatedAt: number;
  orderId: string;
}

export interface GetTransactionsRequest {
  orderId: string;
}

export interface GetTransactionsResponse {
  data: TransactionResponse[];
}

export interface GetCreditsByOrderIdsRequest {
  orderIds: string[];
}

export interface GetCreditsByOrderIdsResponse {
  data: TransactionResponse[];
}

export interface GetPayoutSettingsRequest {
}

export interface GetGlobalWalletToggleRequest {
}

export interface GetGlobalWalletToggleResponse {
  id: string;
  name: string;
  display: string;
  type: string;
  configurable: string;
  value: boolean;
}

export interface GetPayoutSettingsResponse {
  id: string;
  name: string;
  description: string;
  type: string;
  value: boolean;
}

export interface GetListingFeeRequest {
  settingKey: string;
}

export interface GetListingFeeResponse {
  id: string;
  walletSettingsId: string;
  listingFee: string;
}

export interface Permission {
  key: string;
  description: string;
}

export interface GetPermissionsRequest {
  serviceName: string;
}

export interface GetPermissionsResponse {
  permissions: Permission[];
}

function createBaseGetWalletRequest(): GetWalletRequest {
  return { ownerId: "" };
}

export const GetWalletRequest = {
  encode(message: GetWalletRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ownerId !== "") {
      writer.uint32(10).string(message.ownerId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetWalletRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetWalletRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ownerId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetWalletRequest {
    return { ownerId: isSet(object.ownerId) ? String(object.ownerId) : "" };
  },

  toJSON(message: GetWalletRequest): unknown {
    const obj: any = {};
    message.ownerId !== undefined && (obj.ownerId = message.ownerId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetWalletRequest>, I>>(base?: I): GetWalletRequest {
    return GetWalletRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetWalletRequest>, I>>(object: I): GetWalletRequest {
    const message = createBaseGetWalletRequest();
    message.ownerId = object.ownerId ?? "";
    return message;
  },
};

function createBaseGetTransactionRequest(): GetTransactionRequest {
  return { id: "" };
}

export const GetTransactionRequest = {
  encode(message: GetTransactionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
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
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTransactionRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: GetTransactionRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetTransactionRequest>, I>>(base?: I): GetTransactionRequest {
    return GetTransactionRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetTransactionRequest>, I>>(object: I): GetTransactionRequest {
    const message = createBaseGetTransactionRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseUpdateAmountTransactionRequest(): UpdateAmountTransactionRequest {
  return { transactionId: "", amount: 0 };
}

export const UpdateAmountTransactionRequest = {
  encode(message: UpdateAmountTransactionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.transactionId !== "") {
      writer.uint32(10).string(message.transactionId);
    }
    if (message.amount !== 0) {
      writer.uint32(17).double(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateAmountTransactionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateAmountTransactionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactionId = reader.string();
          break;
        case 2:
          message.amount = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateAmountTransactionRequest {
    return {
      transactionId: isSet(object.transactionId) ? String(object.transactionId) : "",
      amount: isSet(object.amount) ? Number(object.amount) : 0,
    };
  },

  toJSON(message: UpdateAmountTransactionRequest): unknown {
    const obj: any = {};
    message.transactionId !== undefined && (obj.transactionId = message.transactionId);
    message.amount !== undefined && (obj.amount = message.amount);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateAmountTransactionRequest>, I>>(base?: I): UpdateAmountTransactionRequest {
    return UpdateAmountTransactionRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateAmountTransactionRequest>, I>>(
    object: I,
  ): UpdateAmountTransactionRequest {
    const message = createBaseUpdateAmountTransactionRequest();
    message.transactionId = object.transactionId ?? "";
    message.amount = object.amount ?? 0;
    return message;
  },
};

function createBaseGetWalletResponse(): GetWalletResponse {
  return {
    id: "",
    ownerId: "",
    tag: "",
    balance: 0,
    status: "",
    createdAt: 0,
    updatedAt: 0,
    pendingTransactions: 0,
    onholdBalance: 0,
    availableBalance: 0,
    totalBalance: 0,
  };
}

export const GetWalletResponse = {
  encode(message: GetWalletResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.ownerId !== "") {
      writer.uint32(18).string(message.ownerId);
    }
    if (message.tag !== "") {
      writer.uint32(26).string(message.tag);
    }
    if (message.balance !== 0) {
      writer.uint32(33).double(message.balance);
    }
    if (message.status !== "") {
      writer.uint32(42).string(message.status);
    }
    if (message.createdAt !== 0) {
      writer.uint32(48).int64(message.createdAt);
    }
    if (message.updatedAt !== 0) {
      writer.uint32(56).int64(message.updatedAt);
    }
    if (message.pendingTransactions !== 0) {
      writer.uint32(65).double(message.pendingTransactions);
    }
    if (message.onholdBalance !== 0) {
      writer.uint32(73).double(message.onholdBalance);
    }
    if (message.availableBalance !== 0) {
      writer.uint32(81).double(message.availableBalance);
    }
    if (message.totalBalance !== 0) {
      writer.uint32(89).double(message.totalBalance);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetWalletResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetWalletResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.ownerId = reader.string();
          break;
        case 3:
          message.tag = reader.string();
          break;
        case 4:
          message.balance = reader.double();
          break;
        case 5:
          message.status = reader.string();
          break;
        case 6:
          message.createdAt = longToNumber(reader.int64() as Long);
          break;
        case 7:
          message.updatedAt = longToNumber(reader.int64() as Long);
          break;
        case 8:
          message.pendingTransactions = reader.double();
          break;
        case 9:
          message.onholdBalance = reader.double();
          break;
        case 10:
          message.availableBalance = reader.double();
          break;
        case 11:
          message.totalBalance = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetWalletResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      ownerId: isSet(object.ownerId) ? String(object.ownerId) : "",
      tag: isSet(object.tag) ? String(object.tag) : "",
      balance: isSet(object.balance) ? Number(object.balance) : 0,
      status: isSet(object.status) ? String(object.status) : "",
      createdAt: isSet(object.createdAt) ? Number(object.createdAt) : 0,
      updatedAt: isSet(object.updatedAt) ? Number(object.updatedAt) : 0,
      pendingTransactions: isSet(object.pendingTransactions) ? Number(object.pendingTransactions) : 0,
      onholdBalance: isSet(object.onholdBalance) ? Number(object.onholdBalance) : 0,
      availableBalance: isSet(object.availableBalance) ? Number(object.availableBalance) : 0,
      totalBalance: isSet(object.totalBalance) ? Number(object.totalBalance) : 0,
    };
  },

  toJSON(message: GetWalletResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.ownerId !== undefined && (obj.ownerId = message.ownerId);
    message.tag !== undefined && (obj.tag = message.tag);
    message.balance !== undefined && (obj.balance = message.balance);
    message.status !== undefined && (obj.status = message.status);
    message.createdAt !== undefined && (obj.createdAt = Math.round(message.createdAt));
    message.updatedAt !== undefined && (obj.updatedAt = Math.round(message.updatedAt));
    message.pendingTransactions !== undefined && (obj.pendingTransactions = message.pendingTransactions);
    message.onholdBalance !== undefined && (obj.onholdBalance = message.onholdBalance);
    message.availableBalance !== undefined && (obj.availableBalance = message.availableBalance);
    message.totalBalance !== undefined && (obj.totalBalance = message.totalBalance);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetWalletResponse>, I>>(base?: I): GetWalletResponse {
    return GetWalletResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetWalletResponse>, I>>(object: I): GetWalletResponse {
    const message = createBaseGetWalletResponse();
    message.id = object.id ?? "";
    message.ownerId = object.ownerId ?? "";
    message.tag = object.tag ?? "";
    message.balance = object.balance ?? 0;
    message.status = object.status ?? "";
    message.createdAt = object.createdAt ?? 0;
    message.updatedAt = object.updatedAt ?? 0;
    message.pendingTransactions = object.pendingTransactions ?? 0;
    message.onholdBalance = object.onholdBalance ?? 0;
    message.availableBalance = object.availableBalance ?? 0;
    message.totalBalance = object.totalBalance ?? 0;
    return message;
  },
};

function createBaseUpdateWalletRequest(): UpdateWalletRequest {
  return { walletId: "", amount: 0, transactionType: "" };
}

export const UpdateWalletRequest = {
  encode(message: UpdateWalletRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.walletId !== "") {
      writer.uint32(10).string(message.walletId);
    }
    if (message.amount !== 0) {
      writer.uint32(16).int64(message.amount);
    }
    if (message.transactionType !== "") {
      writer.uint32(26).string(message.transactionType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateWalletRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateWalletRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.walletId = reader.string();
          break;
        case 2:
          message.amount = longToNumber(reader.int64() as Long);
          break;
        case 3:
          message.transactionType = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateWalletRequest {
    return {
      walletId: isSet(object.walletId) ? String(object.walletId) : "",
      amount: isSet(object.amount) ? Number(object.amount) : 0,
      transactionType: isSet(object.transactionType) ? String(object.transactionType) : "",
    };
  },

  toJSON(message: UpdateWalletRequest): unknown {
    const obj: any = {};
    message.walletId !== undefined && (obj.walletId = message.walletId);
    message.amount !== undefined && (obj.amount = Math.round(message.amount));
    message.transactionType !== undefined && (obj.transactionType = message.transactionType);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateWalletRequest>, I>>(base?: I): UpdateWalletRequest {
    return UpdateWalletRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateWalletRequest>, I>>(object: I): UpdateWalletRequest {
    const message = createBaseUpdateWalletRequest();
    message.walletId = object.walletId ?? "";
    message.amount = object.amount ?? 0;
    message.transactionType = object.transactionType ?? "";
    return message;
  },
};

function createBaseUpdateTransactionRequest(): UpdateTransactionRequest {
  return { transactionId: "", status: "" };
}

export const UpdateTransactionRequest = {
  encode(message: UpdateTransactionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.transactionId !== "") {
      writer.uint32(10).string(message.transactionId);
    }
    if (message.status !== "") {
      writer.uint32(18).string(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateTransactionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateTransactionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactionId = reader.string();
          break;
        case 2:
          message.status = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateTransactionRequest {
    return {
      transactionId: isSet(object.transactionId) ? String(object.transactionId) : "",
      status: isSet(object.status) ? String(object.status) : "",
    };
  },

  toJSON(message: UpdateTransactionRequest): unknown {
    const obj: any = {};
    message.transactionId !== undefined && (obj.transactionId = message.transactionId);
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateTransactionRequest>, I>>(base?: I): UpdateTransactionRequest {
    return UpdateTransactionRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateTransactionRequest>, I>>(object: I): UpdateTransactionRequest {
    const message = createBaseUpdateTransactionRequest();
    message.transactionId = object.transactionId ?? "";
    message.status = object.status ?? "";
    return message;
  },
};

function createBaseCreateTransactionRequest(): CreateTransactionRequest {
  return { ownerId: "", type: "", amount: 0, orderId: "", description: "", status: undefined, metadata: undefined };
}

export const CreateTransactionRequest = {
  encode(message: CreateTransactionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ownerId !== "") {
      writer.uint32(10).string(message.ownerId);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.amount !== 0) {
      writer.uint32(25).double(message.amount);
    }
    if (message.orderId !== "") {
      writer.uint32(34).string(message.orderId);
    }
    if (message.description !== "") {
      writer.uint32(42).string(message.description);
    }
    if (message.status !== undefined) {
      writer.uint32(50).string(message.status);
    }
    if (message.metadata !== undefined) {
      CreateTransactionRequest_Metadata.encode(message.metadata, writer.uint32(58).fork()).ldelim();
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
          message.ownerId = reader.string();
          break;
        case 2:
          message.type = reader.string();
          break;
        case 3:
          message.amount = reader.double();
          break;
        case 4:
          message.orderId = reader.string();
          break;
        case 5:
          message.description = reader.string();
          break;
        case 6:
          message.status = reader.string();
          break;
        case 7:
          message.metadata = CreateTransactionRequest_Metadata.decode(reader, reader.uint32());
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
      ownerId: isSet(object.ownerId) ? String(object.ownerId) : "",
      type: isSet(object.type) ? String(object.type) : "",
      amount: isSet(object.amount) ? Number(object.amount) : 0,
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
      description: isSet(object.description) ? String(object.description) : "",
      status: isSet(object.status) ? String(object.status) : undefined,
      metadata: isSet(object.metadata) ? CreateTransactionRequest_Metadata.fromJSON(object.metadata) : undefined,
    };
  },

  toJSON(message: CreateTransactionRequest): unknown {
    const obj: any = {};
    message.ownerId !== undefined && (obj.ownerId = message.ownerId);
    message.type !== undefined && (obj.type = message.type);
    message.amount !== undefined && (obj.amount = message.amount);
    message.orderId !== undefined && (obj.orderId = message.orderId);
    message.description !== undefined && (obj.description = message.description);
    message.status !== undefined && (obj.status = message.status);
    message.metadata !== undefined &&
      (obj.metadata = message.metadata ? CreateTransactionRequest_Metadata.toJSON(message.metadata) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateTransactionRequest>, I>>(base?: I): CreateTransactionRequest {
    return CreateTransactionRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateTransactionRequest>, I>>(object: I): CreateTransactionRequest {
    const message = createBaseCreateTransactionRequest();
    message.ownerId = object.ownerId ?? "";
    message.type = object.type ?? "";
    message.amount = object.amount ?? 0;
    message.orderId = object.orderId ?? "";
    message.description = object.description ?? "";
    message.status = object.status ?? undefined;
    message.metadata = (object.metadata !== undefined && object.metadata !== null)
      ? CreateTransactionRequest_Metadata.fromPartial(object.metadata)
      : undefined;
    return message;
  },
};

function createBaseCreateTransactionRequest_Metadata(): CreateTransactionRequest_Metadata {
  return { creditType: "" };
}

export const CreateTransactionRequest_Metadata = {
  encode(message: CreateTransactionRequest_Metadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creditType !== "") {
      writer.uint32(10).string(message.creditType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateTransactionRequest_Metadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateTransactionRequest_Metadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creditType = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateTransactionRequest_Metadata {
    return { creditType: isSet(object.creditType) ? String(object.creditType) : "" };
  },

  toJSON(message: CreateTransactionRequest_Metadata): unknown {
    const obj: any = {};
    message.creditType !== undefined && (obj.creditType = message.creditType);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateTransactionRequest_Metadata>, I>>(
    base?: I,
  ): CreateTransactionRequest_Metadata {
    return CreateTransactionRequest_Metadata.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateTransactionRequest_Metadata>, I>>(
    object: I,
  ): CreateTransactionRequest_Metadata {
    const message = createBaseCreateTransactionRequest_Metadata();
    message.creditType = object.creditType ?? "";
    return message;
  },
};

function createBaseTransactionResponse(): TransactionResponse {
  return {
    id: "",
    ownerId: "",
    walletId: "",
    amount: 0,
    status: "",
    type: "",
    createdAt: 0,
    updatedAt: 0,
    orderId: "",
  };
}

export const TransactionResponse = {
  encode(message: TransactionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.ownerId !== "") {
      writer.uint32(18).string(message.ownerId);
    }
    if (message.walletId !== "") {
      writer.uint32(26).string(message.walletId);
    }
    if (message.amount !== 0) {
      writer.uint32(33).double(message.amount);
    }
    if (message.status !== "") {
      writer.uint32(42).string(message.status);
    }
    if (message.type !== "") {
      writer.uint32(50).string(message.type);
    }
    if (message.createdAt !== 0) {
      writer.uint32(56).int64(message.createdAt);
    }
    if (message.updatedAt !== 0) {
      writer.uint32(64).int64(message.updatedAt);
    }
    if (message.orderId !== "") {
      writer.uint32(74).string(message.orderId);
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
          message.id = reader.string();
          break;
        case 2:
          message.ownerId = reader.string();
          break;
        case 3:
          message.walletId = reader.string();
          break;
        case 4:
          message.amount = reader.double();
          break;
        case 5:
          message.status = reader.string();
          break;
        case 6:
          message.type = reader.string();
          break;
        case 7:
          message.createdAt = longToNumber(reader.int64() as Long);
          break;
        case 8:
          message.updatedAt = longToNumber(reader.int64() as Long);
          break;
        case 9:
          message.orderId = reader.string();
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
      id: isSet(object.id) ? String(object.id) : "",
      ownerId: isSet(object.ownerId) ? String(object.ownerId) : "",
      walletId: isSet(object.walletId) ? String(object.walletId) : "",
      amount: isSet(object.amount) ? Number(object.amount) : 0,
      status: isSet(object.status) ? String(object.status) : "",
      type: isSet(object.type) ? String(object.type) : "",
      createdAt: isSet(object.createdAt) ? Number(object.createdAt) : 0,
      updatedAt: isSet(object.updatedAt) ? Number(object.updatedAt) : 0,
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
    };
  },

  toJSON(message: TransactionResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.ownerId !== undefined && (obj.ownerId = message.ownerId);
    message.walletId !== undefined && (obj.walletId = message.walletId);
    message.amount !== undefined && (obj.amount = message.amount);
    message.status !== undefined && (obj.status = message.status);
    message.type !== undefined && (obj.type = message.type);
    message.createdAt !== undefined && (obj.createdAt = Math.round(message.createdAt));
    message.updatedAt !== undefined && (obj.updatedAt = Math.round(message.updatedAt));
    message.orderId !== undefined && (obj.orderId = message.orderId);
    return obj;
  },

  create<I extends Exact<DeepPartial<TransactionResponse>, I>>(base?: I): TransactionResponse {
    return TransactionResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TransactionResponse>, I>>(object: I): TransactionResponse {
    const message = createBaseTransactionResponse();
    message.id = object.id ?? "";
    message.ownerId = object.ownerId ?? "";
    message.walletId = object.walletId ?? "";
    message.amount = object.amount ?? 0;
    message.status = object.status ?? "";
    message.type = object.type ?? "";
    message.createdAt = object.createdAt ?? 0;
    message.updatedAt = object.updatedAt ?? 0;
    message.orderId = object.orderId ?? "";
    return message;
  },
};

function createBaseGetTransactionsRequest(): GetTransactionsRequest {
  return { orderId: "" };
}

export const GetTransactionsRequest = {
  encode(message: GetTransactionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderId !== "") {
      writer.uint32(10).string(message.orderId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTransactionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTransactionsRequest();
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

  fromJSON(object: any): GetTransactionsRequest {
    return { orderId: isSet(object.orderId) ? String(object.orderId) : "" };
  },

  toJSON(message: GetTransactionsRequest): unknown {
    const obj: any = {};
    message.orderId !== undefined && (obj.orderId = message.orderId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetTransactionsRequest>, I>>(base?: I): GetTransactionsRequest {
    return GetTransactionsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetTransactionsRequest>, I>>(object: I): GetTransactionsRequest {
    const message = createBaseGetTransactionsRequest();
    message.orderId = object.orderId ?? "";
    return message;
  },
};

function createBaseGetTransactionsResponse(): GetTransactionsResponse {
  return { data: [] };
}

export const GetTransactionsResponse = {
  encode(message: GetTransactionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.data) {
      TransactionResponse.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTransactionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTransactionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.data.push(TransactionResponse.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTransactionsResponse {
    return { data: Array.isArray(object?.data) ? object.data.map((e: any) => TransactionResponse.fromJSON(e)) : [] };
  },

  toJSON(message: GetTransactionsResponse): unknown {
    const obj: any = {};
    if (message.data) {
      obj.data = message.data.map((e) => e ? TransactionResponse.toJSON(e) : undefined);
    } else {
      obj.data = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetTransactionsResponse>, I>>(base?: I): GetTransactionsResponse {
    return GetTransactionsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetTransactionsResponse>, I>>(object: I): GetTransactionsResponse {
    const message = createBaseGetTransactionsResponse();
    message.data = object.data?.map((e) => TransactionResponse.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetCreditsByOrderIdsRequest(): GetCreditsByOrderIdsRequest {
  return { orderIds: [] };
}

export const GetCreditsByOrderIdsRequest = {
  encode(message: GetCreditsByOrderIdsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.orderIds) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCreditsByOrderIdsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCreditsByOrderIdsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderIds.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCreditsByOrderIdsRequest {
    return { orderIds: Array.isArray(object?.orderIds) ? object.orderIds.map((e: any) => String(e)) : [] };
  },

  toJSON(message: GetCreditsByOrderIdsRequest): unknown {
    const obj: any = {};
    if (message.orderIds) {
      obj.orderIds = message.orderIds.map((e) => e);
    } else {
      obj.orderIds = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCreditsByOrderIdsRequest>, I>>(base?: I): GetCreditsByOrderIdsRequest {
    return GetCreditsByOrderIdsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCreditsByOrderIdsRequest>, I>>(object: I): GetCreditsByOrderIdsRequest {
    const message = createBaseGetCreditsByOrderIdsRequest();
    message.orderIds = object.orderIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseGetCreditsByOrderIdsResponse(): GetCreditsByOrderIdsResponse {
  return { data: [] };
}

export const GetCreditsByOrderIdsResponse = {
  encode(message: GetCreditsByOrderIdsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.data) {
      TransactionResponse.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCreditsByOrderIdsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCreditsByOrderIdsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.data.push(TransactionResponse.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCreditsByOrderIdsResponse {
    return { data: Array.isArray(object?.data) ? object.data.map((e: any) => TransactionResponse.fromJSON(e)) : [] };
  },

  toJSON(message: GetCreditsByOrderIdsResponse): unknown {
    const obj: any = {};
    if (message.data) {
      obj.data = message.data.map((e) => e ? TransactionResponse.toJSON(e) : undefined);
    } else {
      obj.data = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCreditsByOrderIdsResponse>, I>>(base?: I): GetCreditsByOrderIdsResponse {
    return GetCreditsByOrderIdsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCreditsByOrderIdsResponse>, I>>(object: I): GetCreditsByOrderIdsResponse {
    const message = createBaseGetCreditsByOrderIdsResponse();
    message.data = object.data?.map((e) => TransactionResponse.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetPayoutSettingsRequest(): GetPayoutSettingsRequest {
  return {};
}

export const GetPayoutSettingsRequest = {
  encode(_: GetPayoutSettingsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPayoutSettingsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPayoutSettingsRequest();
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

  fromJSON(_: any): GetPayoutSettingsRequest {
    return {};
  },

  toJSON(_: GetPayoutSettingsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPayoutSettingsRequest>, I>>(base?: I): GetPayoutSettingsRequest {
    return GetPayoutSettingsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPayoutSettingsRequest>, I>>(_: I): GetPayoutSettingsRequest {
    const message = createBaseGetPayoutSettingsRequest();
    return message;
  },
};

function createBaseGetGlobalWalletToggleRequest(): GetGlobalWalletToggleRequest {
  return {};
}

export const GetGlobalWalletToggleRequest = {
  encode(_: GetGlobalWalletToggleRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetGlobalWalletToggleRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetGlobalWalletToggleRequest();
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

  fromJSON(_: any): GetGlobalWalletToggleRequest {
    return {};
  },

  toJSON(_: GetGlobalWalletToggleRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetGlobalWalletToggleRequest>, I>>(base?: I): GetGlobalWalletToggleRequest {
    return GetGlobalWalletToggleRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetGlobalWalletToggleRequest>, I>>(_: I): GetGlobalWalletToggleRequest {
    const message = createBaseGetGlobalWalletToggleRequest();
    return message;
  },
};

function createBaseGetGlobalWalletToggleResponse(): GetGlobalWalletToggleResponse {
  return { id: "", name: "", display: "", type: "", configurable: "", value: false };
}

export const GetGlobalWalletToggleResponse = {
  encode(message: GetGlobalWalletToggleResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.display !== "") {
      writer.uint32(26).string(message.display);
    }
    if (message.type !== "") {
      writer.uint32(34).string(message.type);
    }
    if (message.configurable !== "") {
      writer.uint32(42).string(message.configurable);
    }
    if (message.value === true) {
      writer.uint32(48).bool(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetGlobalWalletToggleResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetGlobalWalletToggleResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.display = reader.string();
          break;
        case 4:
          message.type = reader.string();
          break;
        case 5:
          message.configurable = reader.string();
          break;
        case 6:
          message.value = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetGlobalWalletToggleResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      display: isSet(object.display) ? String(object.display) : "",
      type: isSet(object.type) ? String(object.type) : "",
      configurable: isSet(object.configurable) ? String(object.configurable) : "",
      value: isSet(object.value) ? Boolean(object.value) : false,
    };
  },

  toJSON(message: GetGlobalWalletToggleResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.display !== undefined && (obj.display = message.display);
    message.type !== undefined && (obj.type = message.type);
    message.configurable !== undefined && (obj.configurable = message.configurable);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetGlobalWalletToggleResponse>, I>>(base?: I): GetGlobalWalletToggleResponse {
    return GetGlobalWalletToggleResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetGlobalWalletToggleResponse>, I>>(
    object: I,
  ): GetGlobalWalletToggleResponse {
    const message = createBaseGetGlobalWalletToggleResponse();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.display = object.display ?? "";
    message.type = object.type ?? "";
    message.configurable = object.configurable ?? "";
    message.value = object.value ?? false;
    return message;
  },
};

function createBaseGetPayoutSettingsResponse(): GetPayoutSettingsResponse {
  return { id: "", name: "", description: "", type: "", value: false };
}

export const GetPayoutSettingsResponse = {
  encode(message: GetPayoutSettingsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    if (message.type !== "") {
      writer.uint32(34).string(message.type);
    }
    if (message.value === true) {
      writer.uint32(40).bool(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPayoutSettingsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPayoutSettingsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.description = reader.string();
          break;
        case 4:
          message.type = reader.string();
          break;
        case 5:
          message.value = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPayoutSettingsResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      type: isSet(object.type) ? String(object.type) : "",
      value: isSet(object.value) ? Boolean(object.value) : false,
    };
  },

  toJSON(message: GetPayoutSettingsResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined && (obj.description = message.description);
    message.type !== undefined && (obj.type = message.type);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPayoutSettingsResponse>, I>>(base?: I): GetPayoutSettingsResponse {
    return GetPayoutSettingsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPayoutSettingsResponse>, I>>(object: I): GetPayoutSettingsResponse {
    const message = createBaseGetPayoutSettingsResponse();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.type = object.type ?? "";
    message.value = object.value ?? false;
    return message;
  },
};

function createBaseGetListingFeeRequest(): GetListingFeeRequest {
  return { settingKey: "" };
}

export const GetListingFeeRequest = {
  encode(message: GetListingFeeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.settingKey !== "") {
      writer.uint32(10).string(message.settingKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetListingFeeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetListingFeeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.settingKey = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetListingFeeRequest {
    return { settingKey: isSet(object.settingKey) ? String(object.settingKey) : "" };
  },

  toJSON(message: GetListingFeeRequest): unknown {
    const obj: any = {};
    message.settingKey !== undefined && (obj.settingKey = message.settingKey);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetListingFeeRequest>, I>>(base?: I): GetListingFeeRequest {
    return GetListingFeeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetListingFeeRequest>, I>>(object: I): GetListingFeeRequest {
    const message = createBaseGetListingFeeRequest();
    message.settingKey = object.settingKey ?? "";
    return message;
  },
};

function createBaseGetListingFeeResponse(): GetListingFeeResponse {
  return { id: "", walletSettingsId: "", listingFee: "" };
}

export const GetListingFeeResponse = {
  encode(message: GetListingFeeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.walletSettingsId !== "") {
      writer.uint32(18).string(message.walletSettingsId);
    }
    if (message.listingFee !== "") {
      writer.uint32(26).string(message.listingFee);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetListingFeeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetListingFeeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.walletSettingsId = reader.string();
          break;
        case 3:
          message.listingFee = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetListingFeeResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      walletSettingsId: isSet(object.walletSettingsId) ? String(object.walletSettingsId) : "",
      listingFee: isSet(object.listingFee) ? String(object.listingFee) : "",
    };
  },

  toJSON(message: GetListingFeeResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.walletSettingsId !== undefined && (obj.walletSettingsId = message.walletSettingsId);
    message.listingFee !== undefined && (obj.listingFee = message.listingFee);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetListingFeeResponse>, I>>(base?: I): GetListingFeeResponse {
    return GetListingFeeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetListingFeeResponse>, I>>(object: I): GetListingFeeResponse {
    const message = createBaseGetListingFeeResponse();
    message.id = object.id ?? "";
    message.walletSettingsId = object.walletSettingsId ?? "";
    message.listingFee = object.listingFee ?? "";
    return message;
  },
};

function createBasePermission(): Permission {
  return { key: "", description: "" };
}

export const Permission = {
  encode(message: Permission, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Permission {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePermission();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Permission {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      description: isSet(object.description) ? String(object.description) : "",
    };
  },

  toJSON(message: Permission): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.description !== undefined && (obj.description = message.description);
    return obj;
  },

  create<I extends Exact<DeepPartial<Permission>, I>>(base?: I): Permission {
    return Permission.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Permission>, I>>(object: I): Permission {
    const message = createBasePermission();
    message.key = object.key ?? "";
    message.description = object.description ?? "";
    return message;
  },
};

function createBaseGetPermissionsRequest(): GetPermissionsRequest {
  return { serviceName: "" };
}

export const GetPermissionsRequest = {
  encode(message: GetPermissionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.serviceName !== "") {
      writer.uint32(10).string(message.serviceName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPermissionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPermissionsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.serviceName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPermissionsRequest {
    return { serviceName: isSet(object.serviceName) ? String(object.serviceName) : "" };
  },

  toJSON(message: GetPermissionsRequest): unknown {
    const obj: any = {};
    message.serviceName !== undefined && (obj.serviceName = message.serviceName);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPermissionsRequest>, I>>(base?: I): GetPermissionsRequest {
    return GetPermissionsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPermissionsRequest>, I>>(object: I): GetPermissionsRequest {
    const message = createBaseGetPermissionsRequest();
    message.serviceName = object.serviceName ?? "";
    return message;
  },
};

function createBaseGetPermissionsResponse(): GetPermissionsResponse {
  return { permissions: [] };
}

export const GetPermissionsResponse = {
  encode(message: GetPermissionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.permissions) {
      Permission.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPermissionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPermissionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.permissions.push(Permission.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPermissionsResponse {
    return {
      permissions: Array.isArray(object?.permissions) ? object.permissions.map((e: any) => Permission.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetPermissionsResponse): unknown {
    const obj: any = {};
    if (message.permissions) {
      obj.permissions = message.permissions.map((e) => e ? Permission.toJSON(e) : undefined);
    } else {
      obj.permissions = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPermissionsResponse>, I>>(base?: I): GetPermissionsResponse {
    return GetPermissionsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPermissionsResponse>, I>>(object: I): GetPermissionsResponse {
    const message = createBaseGetPermissionsResponse();
    message.permissions = object.permissions?.map((e) => Permission.fromPartial(e)) || [];
    return message;
  },
};

export interface WalletService {
  GetWallet(request: GetWalletRequest): Promise<GetWalletResponse>;
  CreateTransaction(request: CreateTransactionRequest): Promise<TransactionResponse>;
  GetTransactions(request: GetTransactionsRequest): Promise<GetTransactionsResponse>;
  GetCreditsByOrderIds(request: GetCreditsByOrderIdsRequest): Promise<GetCreditsByOrderIdsResponse>;
  GetPayoutSettings(request: GetPayoutSettingsRequest): Promise<GetPayoutSettingsResponse>;
  GetListingFee(request: GetListingFeeRequest): Promise<GetListingFeeResponse>;
  GetGlobalWalletToggle(request: GetGlobalWalletToggleRequest): Promise<GetGlobalWalletToggleResponse>;
  UpdateWallet(request: UpdateWalletRequest): Promise<GetWalletResponse>;
  UpdateTransaction(request: UpdateTransactionRequest): Promise<TransactionResponse>;
  GetTransactionById(request: GetTransactionRequest): Promise<TransactionResponse>;
  UpdatePendingAmountTransaction(request: UpdateAmountTransactionRequest): Promise<TransactionResponse>;
  GetPermissions(request: GetPermissionsRequest): Promise<GetPermissionsResponse>;
}

export class WalletServiceClientImpl implements WalletService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "wallet.WalletService";
    this.rpc = rpc;
    this.GetWallet = this.GetWallet.bind(this);
    this.CreateTransaction = this.CreateTransaction.bind(this);
    this.GetTransactions = this.GetTransactions.bind(this);
    this.GetCreditsByOrderIds = this.GetCreditsByOrderIds.bind(this);
    this.GetPayoutSettings = this.GetPayoutSettings.bind(this);
    this.GetListingFee = this.GetListingFee.bind(this);
    this.GetGlobalWalletToggle = this.GetGlobalWalletToggle.bind(this);
    this.UpdateWallet = this.UpdateWallet.bind(this);
    this.UpdateTransaction = this.UpdateTransaction.bind(this);
    this.GetTransactionById = this.GetTransactionById.bind(this);
    this.UpdatePendingAmountTransaction = this.UpdatePendingAmountTransaction.bind(this);
    this.GetPermissions = this.GetPermissions.bind(this);
  }
  GetWallet(request: GetWalletRequest): Promise<GetWalletResponse> {
    const data = GetWalletRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetWallet", data);
    return promise.then((data) => GetWalletResponse.decode(new _m0.Reader(data)));
  }

  CreateTransaction(request: CreateTransactionRequest): Promise<TransactionResponse> {
    const data = CreateTransactionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateTransaction", data);
    return promise.then((data) => TransactionResponse.decode(new _m0.Reader(data)));
  }

  GetTransactions(request: GetTransactionsRequest): Promise<GetTransactionsResponse> {
    const data = GetTransactionsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetTransactions", data);
    return promise.then((data) => GetTransactionsResponse.decode(new _m0.Reader(data)));
  }

  GetCreditsByOrderIds(request: GetCreditsByOrderIdsRequest): Promise<GetCreditsByOrderIdsResponse> {
    const data = GetCreditsByOrderIdsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetCreditsByOrderIds", data);
    return promise.then((data) => GetCreditsByOrderIdsResponse.decode(new _m0.Reader(data)));
  }

  GetPayoutSettings(request: GetPayoutSettingsRequest): Promise<GetPayoutSettingsResponse> {
    const data = GetPayoutSettingsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetPayoutSettings", data);
    return promise.then((data) => GetPayoutSettingsResponse.decode(new _m0.Reader(data)));
  }

  GetListingFee(request: GetListingFeeRequest): Promise<GetListingFeeResponse> {
    const data = GetListingFeeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetListingFee", data);
    return promise.then((data) => GetListingFeeResponse.decode(new _m0.Reader(data)));
  }

  GetGlobalWalletToggle(request: GetGlobalWalletToggleRequest): Promise<GetGlobalWalletToggleResponse> {
    const data = GetGlobalWalletToggleRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetGlobalWalletToggle", data);
    return promise.then((data) => GetGlobalWalletToggleResponse.decode(new _m0.Reader(data)));
  }

  UpdateWallet(request: UpdateWalletRequest): Promise<GetWalletResponse> {
    const data = UpdateWalletRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateWallet", data);
    return promise.then((data) => GetWalletResponse.decode(new _m0.Reader(data)));
  }

  UpdateTransaction(request: UpdateTransactionRequest): Promise<TransactionResponse> {
    const data = UpdateTransactionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateTransaction", data);
    return promise.then((data) => TransactionResponse.decode(new _m0.Reader(data)));
  }

  GetTransactionById(request: GetTransactionRequest): Promise<TransactionResponse> {
    const data = GetTransactionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetTransactionById", data);
    return promise.then((data) => TransactionResponse.decode(new _m0.Reader(data)));
  }

  UpdatePendingAmountTransaction(request: UpdateAmountTransactionRequest): Promise<TransactionResponse> {
    const data = UpdateAmountTransactionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdatePendingAmountTransaction", data);
    return promise.then((data) => TransactionResponse.decode(new _m0.Reader(data)));
  }

  GetPermissions(request: GetPermissionsRequest): Promise<GetPermissionsResponse> {
    const data = GetPermissionsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetPermissions", data);
    return promise.then((data) => GetPermissionsResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
