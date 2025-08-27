/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "recommendation";

export interface AddNewUserRequest {
  userId: string;
  name: string;
}

export interface AddNewUserResponse {
  status: boolean;
}

export interface AddNewItemRequest {
  itemId: string;
  isHidden: boolean;
  labels: string[];
  categories: string[];
  timestamp: string;
}

export interface AddNewItemResponse {
  status: boolean;
}

export interface AddMultipleItemsRequest {
  items: AddNewItemRequest[];
}

export interface AddMultipleItemsResponse {
  status: boolean;
}

export interface DeleteItemsRequest {
  itemIds: string[];
}

export interface DeleteItemsResponse {
  status: boolean;
}

export interface AddFeedbackRequest {
  userId: string;
  itemId: string;
  type: string;
}

export interface AddFeedbackResponse {
  status: boolean;
}

export interface RemoveFeedbackRequest {
  userId: string;
  itemId: string;
  type: string;
}

export interface RemoveFeedbackResponse {
  status: boolean;
}

function createBaseAddNewUserRequest(): AddNewUserRequest {
  return { userId: "", name: "" };
}

export const AddNewUserRequest = {
  encode(message: AddNewUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddNewUserRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddNewUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddNewUserRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      name: isSet(object.name) ? String(object.name) : "",
    };
  },

  toJSON(message: AddNewUserRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  create<I extends Exact<DeepPartial<AddNewUserRequest>, I>>(base?: I): AddNewUserRequest {
    return AddNewUserRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AddNewUserRequest>, I>>(object: I): AddNewUserRequest {
    const message = createBaseAddNewUserRequest();
    message.userId = object.userId ?? "";
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseAddNewUserResponse(): AddNewUserResponse {
  return { status: false };
}

export const AddNewUserResponse = {
  encode(message: AddNewUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status === true) {
      writer.uint32(8).bool(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddNewUserResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddNewUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddNewUserResponse {
    return { status: isSet(object.status) ? Boolean(object.status) : false };
  },

  toJSON(message: AddNewUserResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  create<I extends Exact<DeepPartial<AddNewUserResponse>, I>>(base?: I): AddNewUserResponse {
    return AddNewUserResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AddNewUserResponse>, I>>(object: I): AddNewUserResponse {
    const message = createBaseAddNewUserResponse();
    message.status = object.status ?? false;
    return message;
  },
};

function createBaseAddNewItemRequest(): AddNewItemRequest {
  return { itemId: "", isHidden: false, labels: [], categories: [], timestamp: "" };
}

export const AddNewItemRequest = {
  encode(message: AddNewItemRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.itemId !== "") {
      writer.uint32(10).string(message.itemId);
    }
    if (message.isHidden === true) {
      writer.uint32(16).bool(message.isHidden);
    }
    for (const v of message.labels) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.categories) {
      writer.uint32(34).string(v!);
    }
    if (message.timestamp !== "") {
      writer.uint32(42).string(message.timestamp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddNewItemRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddNewItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.itemId = reader.string();
          break;
        case 2:
          message.isHidden = reader.bool();
          break;
        case 3:
          message.labels.push(reader.string());
          break;
        case 4:
          message.categories.push(reader.string());
          break;
        case 5:
          message.timestamp = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddNewItemRequest {
    return {
      itemId: isSet(object.itemId) ? String(object.itemId) : "",
      isHidden: isSet(object.isHidden) ? Boolean(object.isHidden) : false,
      labels: Array.isArray(object?.labels) ? object.labels.map((e: any) => String(e)) : [],
      categories: Array.isArray(object?.categories) ? object.categories.map((e: any) => String(e)) : [],
      timestamp: isSet(object.timestamp) ? String(object.timestamp) : "",
    };
  },

  toJSON(message: AddNewItemRequest): unknown {
    const obj: any = {};
    message.itemId !== undefined && (obj.itemId = message.itemId);
    message.isHidden !== undefined && (obj.isHidden = message.isHidden);
    if (message.labels) {
      obj.labels = message.labels.map((e) => e);
    } else {
      obj.labels = [];
    }
    if (message.categories) {
      obj.categories = message.categories.map((e) => e);
    } else {
      obj.categories = [];
    }
    message.timestamp !== undefined && (obj.timestamp = message.timestamp);
    return obj;
  },

  create<I extends Exact<DeepPartial<AddNewItemRequest>, I>>(base?: I): AddNewItemRequest {
    return AddNewItemRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AddNewItemRequest>, I>>(object: I): AddNewItemRequest {
    const message = createBaseAddNewItemRequest();
    message.itemId = object.itemId ?? "";
    message.isHidden = object.isHidden ?? false;
    message.labels = object.labels?.map((e) => e) || [];
    message.categories = object.categories?.map((e) => e) || [];
    message.timestamp = object.timestamp ?? "";
    return message;
  },
};

function createBaseAddNewItemResponse(): AddNewItemResponse {
  return { status: false };
}

export const AddNewItemResponse = {
  encode(message: AddNewItemResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status === true) {
      writer.uint32(8).bool(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddNewItemResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddNewItemResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddNewItemResponse {
    return { status: isSet(object.status) ? Boolean(object.status) : false };
  },

  toJSON(message: AddNewItemResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  create<I extends Exact<DeepPartial<AddNewItemResponse>, I>>(base?: I): AddNewItemResponse {
    return AddNewItemResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AddNewItemResponse>, I>>(object: I): AddNewItemResponse {
    const message = createBaseAddNewItemResponse();
    message.status = object.status ?? false;
    return message;
  },
};

function createBaseAddMultipleItemsRequest(): AddMultipleItemsRequest {
  return { items: [] };
}

export const AddMultipleItemsRequest = {
  encode(message: AddMultipleItemsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.items) {
      AddNewItemRequest.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddMultipleItemsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddMultipleItemsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.items.push(AddNewItemRequest.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddMultipleItemsRequest {
    return { items: Array.isArray(object?.items) ? object.items.map((e: any) => AddNewItemRequest.fromJSON(e)) : [] };
  },

  toJSON(message: AddMultipleItemsRequest): unknown {
    const obj: any = {};
    if (message.items) {
      obj.items = message.items.map((e) => e ? AddNewItemRequest.toJSON(e) : undefined);
    } else {
      obj.items = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AddMultipleItemsRequest>, I>>(base?: I): AddMultipleItemsRequest {
    return AddMultipleItemsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AddMultipleItemsRequest>, I>>(object: I): AddMultipleItemsRequest {
    const message = createBaseAddMultipleItemsRequest();
    message.items = object.items?.map((e) => AddNewItemRequest.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAddMultipleItemsResponse(): AddMultipleItemsResponse {
  return { status: false };
}

export const AddMultipleItemsResponse = {
  encode(message: AddMultipleItemsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status === true) {
      writer.uint32(8).bool(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddMultipleItemsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddMultipleItemsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddMultipleItemsResponse {
    return { status: isSet(object.status) ? Boolean(object.status) : false };
  },

  toJSON(message: AddMultipleItemsResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  create<I extends Exact<DeepPartial<AddMultipleItemsResponse>, I>>(base?: I): AddMultipleItemsResponse {
    return AddMultipleItemsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AddMultipleItemsResponse>, I>>(object: I): AddMultipleItemsResponse {
    const message = createBaseAddMultipleItemsResponse();
    message.status = object.status ?? false;
    return message;
  },
};

function createBaseDeleteItemsRequest(): DeleteItemsRequest {
  return { itemIds: [] };
}

export const DeleteItemsRequest = {
  encode(message: DeleteItemsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.itemIds) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteItemsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteItemsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.itemIds.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteItemsRequest {
    return { itemIds: Array.isArray(object?.itemIds) ? object.itemIds.map((e: any) => String(e)) : [] };
  },

  toJSON(message: DeleteItemsRequest): unknown {
    const obj: any = {};
    if (message.itemIds) {
      obj.itemIds = message.itemIds.map((e) => e);
    } else {
      obj.itemIds = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteItemsRequest>, I>>(base?: I): DeleteItemsRequest {
    return DeleteItemsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DeleteItemsRequest>, I>>(object: I): DeleteItemsRequest {
    const message = createBaseDeleteItemsRequest();
    message.itemIds = object.itemIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseDeleteItemsResponse(): DeleteItemsResponse {
  return { status: false };
}

export const DeleteItemsResponse = {
  encode(message: DeleteItemsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status === true) {
      writer.uint32(8).bool(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteItemsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteItemsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteItemsResponse {
    return { status: isSet(object.status) ? Boolean(object.status) : false };
  },

  toJSON(message: DeleteItemsResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteItemsResponse>, I>>(base?: I): DeleteItemsResponse {
    return DeleteItemsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DeleteItemsResponse>, I>>(object: I): DeleteItemsResponse {
    const message = createBaseDeleteItemsResponse();
    message.status = object.status ?? false;
    return message;
  },
};

function createBaseAddFeedbackRequest(): AddFeedbackRequest {
  return { userId: "", itemId: "", type: "" };
}

export const AddFeedbackRequest = {
  encode(message: AddFeedbackRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.itemId !== "") {
      writer.uint32(18).string(message.itemId);
    }
    if (message.type !== "") {
      writer.uint32(26).string(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddFeedbackRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddFeedbackRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.itemId = reader.string();
          break;
        case 3:
          message.type = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddFeedbackRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      itemId: isSet(object.itemId) ? String(object.itemId) : "",
      type: isSet(object.type) ? String(object.type) : "",
    };
  },

  toJSON(message: AddFeedbackRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.itemId !== undefined && (obj.itemId = message.itemId);
    message.type !== undefined && (obj.type = message.type);
    return obj;
  },

  create<I extends Exact<DeepPartial<AddFeedbackRequest>, I>>(base?: I): AddFeedbackRequest {
    return AddFeedbackRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AddFeedbackRequest>, I>>(object: I): AddFeedbackRequest {
    const message = createBaseAddFeedbackRequest();
    message.userId = object.userId ?? "";
    message.itemId = object.itemId ?? "";
    message.type = object.type ?? "";
    return message;
  },
};

function createBaseAddFeedbackResponse(): AddFeedbackResponse {
  return { status: false };
}

export const AddFeedbackResponse = {
  encode(message: AddFeedbackResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status === true) {
      writer.uint32(8).bool(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddFeedbackResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddFeedbackResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddFeedbackResponse {
    return { status: isSet(object.status) ? Boolean(object.status) : false };
  },

  toJSON(message: AddFeedbackResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  create<I extends Exact<DeepPartial<AddFeedbackResponse>, I>>(base?: I): AddFeedbackResponse {
    return AddFeedbackResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AddFeedbackResponse>, I>>(object: I): AddFeedbackResponse {
    const message = createBaseAddFeedbackResponse();
    message.status = object.status ?? false;
    return message;
  },
};

function createBaseRemoveFeedbackRequest(): RemoveFeedbackRequest {
  return { userId: "", itemId: "", type: "" };
}

export const RemoveFeedbackRequest = {
  encode(message: RemoveFeedbackRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.itemId !== "") {
      writer.uint32(18).string(message.itemId);
    }
    if (message.type !== "") {
      writer.uint32(26).string(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveFeedbackRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveFeedbackRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.itemId = reader.string();
          break;
        case 3:
          message.type = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RemoveFeedbackRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      itemId: isSet(object.itemId) ? String(object.itemId) : "",
      type: isSet(object.type) ? String(object.type) : "",
    };
  },

  toJSON(message: RemoveFeedbackRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.itemId !== undefined && (obj.itemId = message.itemId);
    message.type !== undefined && (obj.type = message.type);
    return obj;
  },

  create<I extends Exact<DeepPartial<RemoveFeedbackRequest>, I>>(base?: I): RemoveFeedbackRequest {
    return RemoveFeedbackRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RemoveFeedbackRequest>, I>>(object: I): RemoveFeedbackRequest {
    const message = createBaseRemoveFeedbackRequest();
    message.userId = object.userId ?? "";
    message.itemId = object.itemId ?? "";
    message.type = object.type ?? "";
    return message;
  },
};

function createBaseRemoveFeedbackResponse(): RemoveFeedbackResponse {
  return { status: false };
}

export const RemoveFeedbackResponse = {
  encode(message: RemoveFeedbackResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status === true) {
      writer.uint32(8).bool(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveFeedbackResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveFeedbackResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RemoveFeedbackResponse {
    return { status: isSet(object.status) ? Boolean(object.status) : false };
  },

  toJSON(message: RemoveFeedbackResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  create<I extends Exact<DeepPartial<RemoveFeedbackResponse>, I>>(base?: I): RemoveFeedbackResponse {
    return RemoveFeedbackResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RemoveFeedbackResponse>, I>>(object: I): RemoveFeedbackResponse {
    const message = createBaseRemoveFeedbackResponse();
    message.status = object.status ?? false;
    return message;
  },
};

export interface RecommendationService {
  AddNewUser(request: AddNewUserRequest): Promise<AddNewUserResponse>;
  AddNewItem(request: AddNewItemRequest): Promise<AddNewItemResponse>;
  AddMultipleItems(request: AddMultipleItemsRequest): Promise<AddMultipleItemsResponse>;
  DeleteItems(request: DeleteItemsRequest): Promise<DeleteItemsResponse>;
  AddFeedback(request: AddFeedbackRequest): Promise<AddFeedbackResponse>;
  RemoveFeedback(request: RemoveFeedbackRequest): Promise<RemoveFeedbackResponse>;
}

export class RecommendationServiceClientImpl implements RecommendationService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "recommendation.RecommendationService";
    this.rpc = rpc;
    this.AddNewUser = this.AddNewUser.bind(this);
    this.AddNewItem = this.AddNewItem.bind(this);
    this.AddMultipleItems = this.AddMultipleItems.bind(this);
    this.DeleteItems = this.DeleteItems.bind(this);
    this.AddFeedback = this.AddFeedback.bind(this);
    this.RemoveFeedback = this.RemoveFeedback.bind(this);
  }
  AddNewUser(request: AddNewUserRequest): Promise<AddNewUserResponse> {
    const data = AddNewUserRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "AddNewUser", data);
    return promise.then((data) => AddNewUserResponse.decode(new _m0.Reader(data)));
  }

  AddNewItem(request: AddNewItemRequest): Promise<AddNewItemResponse> {
    const data = AddNewItemRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "AddNewItem", data);
    return promise.then((data) => AddNewItemResponse.decode(new _m0.Reader(data)));
  }

  AddMultipleItems(request: AddMultipleItemsRequest): Promise<AddMultipleItemsResponse> {
    const data = AddMultipleItemsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "AddMultipleItems", data);
    return promise.then((data) => AddMultipleItemsResponse.decode(new _m0.Reader(data)));
  }

  DeleteItems(request: DeleteItemsRequest): Promise<DeleteItemsResponse> {
    const data = DeleteItemsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "DeleteItems", data);
    return promise.then((data) => DeleteItemsResponse.decode(new _m0.Reader(data)));
  }

  AddFeedback(request: AddFeedbackRequest): Promise<AddFeedbackResponse> {
    const data = AddFeedbackRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "AddFeedback", data);
    return promise.then((data) => AddFeedbackResponse.decode(new _m0.Reader(data)));
  }

  RemoveFeedback(request: RemoveFeedbackRequest): Promise<RemoveFeedbackResponse> {
    const data = RemoveFeedbackRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "RemoveFeedback", data);
    return promise.then((data) => RemoveFeedbackResponse.decode(new _m0.Reader(data)));
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
