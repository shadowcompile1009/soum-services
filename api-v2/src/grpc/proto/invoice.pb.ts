/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "invoice";

export interface CreateInvoiceRequest {
  orderId: string;
  invoiceType: string;
  userType: string;
  eventName: string;
  buyerBusinessModel: string;
  sellerBusinessModel: string;
}

export interface CreateInvoiceResponse {
}

function createBaseCreateInvoiceRequest(): CreateInvoiceRequest {
  return { orderId: "", invoiceType: "", userType: "", eventName: "", buyerBusinessModel: "", sellerBusinessModel: "" };
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
    if (message.buyerBusinessModel !== "") {
      writer.uint32(42).string(message.buyerBusinessModel);
    }
    if (message.sellerBusinessModel !== "") {
      writer.uint32(50).string(message.sellerBusinessModel);
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
        case 5:
          message.buyerBusinessModel = reader.string();
          break;
        case 6:
          message.sellerBusinessModel = reader.string();
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
      buyerBusinessModel: isSet(object.buyerBusinessModel) ? String(object.buyerBusinessModel) : "",
      sellerBusinessModel: isSet(object.sellerBusinessModel) ? String(object.sellerBusinessModel) : "",
    };
  },

  toJSON(message: CreateInvoiceRequest): unknown {
    const obj: any = {};
    message.orderId !== undefined && (obj.orderId = message.orderId);
    message.invoiceType !== undefined && (obj.invoiceType = message.invoiceType);
    message.userType !== undefined && (obj.userType = message.userType);
    message.eventName !== undefined && (obj.eventName = message.eventName);
    message.buyerBusinessModel !== undefined && (obj.buyerBusinessModel = message.buyerBusinessModel);
    message.sellerBusinessModel !== undefined && (obj.sellerBusinessModel = message.sellerBusinessModel);
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
    message.buyerBusinessModel = object.buyerBusinessModel ?? "";
    message.sellerBusinessModel = object.sellerBusinessModel ?? "";
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

export interface InvoiceService {
  createInvoice(request: CreateInvoiceRequest): Promise<CreateInvoiceResponse>;
}

export class InvoiceServiceClientImpl implements InvoiceService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "invoice.InvoiceService";
    this.rpc = rpc;
    this.createInvoice = this.createInvoice.bind(this);
  }
  createInvoice(request: CreateInvoiceRequest): Promise<CreateInvoiceResponse> {
    const data = CreateInvoiceRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "createInvoice", data);
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
