/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "activity";

export interface GetUserActivityRequest {
  userId: string;
}

export interface GetUserActivityResponse {
  userId: string;
  eventType: string;
  module: string;
  createdAt: string;
}

function createBaseGetUserActivityRequest(): GetUserActivityRequest {
  return { userId: "" };
}

export const GetUserActivityRequest = {
  encode(message: GetUserActivityRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserActivityRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserActivityRequest();
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

  fromJSON(object: any): GetUserActivityRequest {
    return { userId: isSet(object.userId) ? String(object.userId) : "" };
  },

  toJSON(message: GetUserActivityRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserActivityRequest>, I>>(base?: I): GetUserActivityRequest {
    return GetUserActivityRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUserActivityRequest>, I>>(object: I): GetUserActivityRequest {
    const message = createBaseGetUserActivityRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseGetUserActivityResponse(): GetUserActivityResponse {
  return { userId: "", eventType: "", module: "", createdAt: "" };
}

export const GetUserActivityResponse = {
  encode(message: GetUserActivityResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.eventType !== "") {
      writer.uint32(18).string(message.eventType);
    }
    if (message.module !== "") {
      writer.uint32(26).string(message.module);
    }
    if (message.createdAt !== "") {
      writer.uint32(34).string(message.createdAt);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserActivityResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserActivityResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.eventType = reader.string();
          break;
        case 3:
          message.module = reader.string();
          break;
        case 4:
          message.createdAt = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserActivityResponse {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      eventType: isSet(object.eventType) ? String(object.eventType) : "",
      module: isSet(object.module) ? String(object.module) : "",
      createdAt: isSet(object.createdAt) ? String(object.createdAt) : "",
    };
  },

  toJSON(message: GetUserActivityResponse): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.eventType !== undefined && (obj.eventType = message.eventType);
    message.module !== undefined && (obj.module = message.module);
    message.createdAt !== undefined && (obj.createdAt = message.createdAt);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserActivityResponse>, I>>(base?: I): GetUserActivityResponse {
    return GetUserActivityResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUserActivityResponse>, I>>(object: I): GetUserActivityResponse {
    const message = createBaseGetUserActivityResponse();
    message.userId = object.userId ?? "";
    message.eventType = object.eventType ?? "";
    message.module = object.module ?? "";
    message.createdAt = object.createdAt ?? "";
    return message;
  },
};

export interface ActivityService {
  GetUserActivity(request: GetUserActivityRequest): Promise<GetUserActivityResponse>;
}

export class ActivityServiceClientImpl implements ActivityService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "activity.ActivityService";
    this.rpc = rpc;
    this.GetUserActivity = this.GetUserActivity.bind(this);
  }
  GetUserActivity(request: GetUserActivityRequest): Promise<GetUserActivityResponse> {
    const data = GetUserActivityRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetUserActivity", data);
    return promise.then((data) => GetUserActivityResponse.decode(new _m0.Reader(data)));
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
