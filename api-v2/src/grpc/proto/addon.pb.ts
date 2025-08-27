/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "addon";

export interface GetAddonsRequest {
  addonIds: string[];
  modelId: string;
  price: number;
}

export interface AddonItem {
  id: string;
  status: string;
  type: string;
  image: string;
  nameEn: string;
  nameAr: string;
  taglineAr: string[];
  taglineEn: string[];
  descriptionEn: string;
  descriptionAr: string;
  priceType: string;
  price: number;
  validityType: string;
  validity: number;
  modelIds: string[];
  sellerIds: string[];
}

export interface GetAddonsResponse {
  addons: AddonItem[];
}

function createBaseGetAddonsRequest(): GetAddonsRequest {
  return { addonIds: [], modelId: "", price: 0 };
}

export const GetAddonsRequest = {
  encode(message: GetAddonsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.addonIds) {
      writer.uint32(10).string(v!);
    }
    if (message.modelId !== "") {
      writer.uint32(18).string(message.modelId);
    }
    if (message.price !== 0) {
      writer.uint32(29).float(message.price);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAddonsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAddonsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.addonIds.push(reader.string());
          break;
        case 2:
          message.modelId = reader.string();
          break;
        case 3:
          message.price = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAddonsRequest {
    return {
      addonIds: Array.isArray(object?.addonIds) ? object.addonIds.map((e: any) => String(e)) : [],
      modelId: isSet(object.modelId) ? String(object.modelId) : "",
      price: isSet(object.price) ? Number(object.price) : 0,
    };
  },

  toJSON(message: GetAddonsRequest): unknown {
    const obj: any = {};
    if (message.addonIds) {
      obj.addonIds = message.addonIds.map((e) => e);
    } else {
      obj.addonIds = [];
    }
    message.modelId !== undefined && (obj.modelId = message.modelId);
    message.price !== undefined && (obj.price = message.price);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAddonsRequest>, I>>(base?: I): GetAddonsRequest {
    return GetAddonsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetAddonsRequest>, I>>(object: I): GetAddonsRequest {
    const message = createBaseGetAddonsRequest();
    message.addonIds = object.addonIds?.map((e) => e) || [];
    message.modelId = object.modelId ?? "";
    message.price = object.price ?? 0;
    return message;
  },
};

function createBaseAddonItem(): AddonItem {
  return {
    id: "",
    status: "",
    type: "",
    image: "",
    nameEn: "",
    nameAr: "",
    taglineAr: [],
    taglineEn: [],
    descriptionEn: "",
    descriptionAr: "",
    priceType: "",
    price: 0,
    validityType: "",
    validity: 0,
    modelIds: [],
    sellerIds: [],
  };
}

export const AddonItem = {
  encode(message: AddonItem, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.status !== "") {
      writer.uint32(18).string(message.status);
    }
    if (message.type !== "") {
      writer.uint32(26).string(message.type);
    }
    if (message.image !== "") {
      writer.uint32(34).string(message.image);
    }
    if (message.nameEn !== "") {
      writer.uint32(42).string(message.nameEn);
    }
    if (message.nameAr !== "") {
      writer.uint32(50).string(message.nameAr);
    }
    for (const v of message.taglineAr) {
      writer.uint32(58).string(v!);
    }
    for (const v of message.taglineEn) {
      writer.uint32(66).string(v!);
    }
    if (message.descriptionEn !== "") {
      writer.uint32(74).string(message.descriptionEn);
    }
    if (message.descriptionAr !== "") {
      writer.uint32(82).string(message.descriptionAr);
    }
    if (message.priceType !== "") {
      writer.uint32(90).string(message.priceType);
    }
    if (message.price !== 0) {
      writer.uint32(97).double(message.price);
    }
    if (message.validityType !== "") {
      writer.uint32(106).string(message.validityType);
    }
    if (message.validity !== 0) {
      writer.uint32(112).int32(message.validity);
    }
    for (const v of message.modelIds) {
      writer.uint32(122).string(v!);
    }
    for (const v of message.sellerIds) {
      writer.uint32(130).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddonItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddonItem();
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
          message.type = reader.string();
          break;
        case 4:
          message.image = reader.string();
          break;
        case 5:
          message.nameEn = reader.string();
          break;
        case 6:
          message.nameAr = reader.string();
          break;
        case 7:
          message.taglineAr.push(reader.string());
          break;
        case 8:
          message.taglineEn.push(reader.string());
          break;
        case 9:
          message.descriptionEn = reader.string();
          break;
        case 10:
          message.descriptionAr = reader.string();
          break;
        case 11:
          message.priceType = reader.string();
          break;
        case 12:
          message.price = reader.double();
          break;
        case 13:
          message.validityType = reader.string();
          break;
        case 14:
          message.validity = reader.int32();
          break;
        case 15:
          message.modelIds.push(reader.string());
          break;
        case 16:
          message.sellerIds.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddonItem {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      status: isSet(object.status) ? String(object.status) : "",
      type: isSet(object.type) ? String(object.type) : "",
      image: isSet(object.image) ? String(object.image) : "",
      nameEn: isSet(object.nameEn) ? String(object.nameEn) : "",
      nameAr: isSet(object.nameAr) ? String(object.nameAr) : "",
      taglineAr: Array.isArray(object?.taglineAr) ? object.taglineAr.map((e: any) => String(e)) : [],
      taglineEn: Array.isArray(object?.taglineEn) ? object.taglineEn.map((e: any) => String(e)) : [],
      descriptionEn: isSet(object.descriptionEn) ? String(object.descriptionEn) : "",
      descriptionAr: isSet(object.descriptionAr) ? String(object.descriptionAr) : "",
      priceType: isSet(object.priceType) ? String(object.priceType) : "",
      price: isSet(object.price) ? Number(object.price) : 0,
      validityType: isSet(object.validityType) ? String(object.validityType) : "",
      validity: isSet(object.validity) ? Number(object.validity) : 0,
      modelIds: Array.isArray(object?.modelIds) ? object.modelIds.map((e: any) => String(e)) : [],
      sellerIds: Array.isArray(object?.sellerIds) ? object.sellerIds.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: AddonItem): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.status !== undefined && (obj.status = message.status);
    message.type !== undefined && (obj.type = message.type);
    message.image !== undefined && (obj.image = message.image);
    message.nameEn !== undefined && (obj.nameEn = message.nameEn);
    message.nameAr !== undefined && (obj.nameAr = message.nameAr);
    if (message.taglineAr) {
      obj.taglineAr = message.taglineAr.map((e) => e);
    } else {
      obj.taglineAr = [];
    }
    if (message.taglineEn) {
      obj.taglineEn = message.taglineEn.map((e) => e);
    } else {
      obj.taglineEn = [];
    }
    message.descriptionEn !== undefined && (obj.descriptionEn = message.descriptionEn);
    message.descriptionAr !== undefined && (obj.descriptionAr = message.descriptionAr);
    message.priceType !== undefined && (obj.priceType = message.priceType);
    message.price !== undefined && (obj.price = message.price);
    message.validityType !== undefined && (obj.validityType = message.validityType);
    message.validity !== undefined && (obj.validity = Math.round(message.validity));
    if (message.modelIds) {
      obj.modelIds = message.modelIds.map((e) => e);
    } else {
      obj.modelIds = [];
    }
    if (message.sellerIds) {
      obj.sellerIds = message.sellerIds.map((e) => e);
    } else {
      obj.sellerIds = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AddonItem>, I>>(base?: I): AddonItem {
    return AddonItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<AddonItem>, I>>(object: I): AddonItem {
    const message = createBaseAddonItem();
    message.id = object.id ?? "";
    message.status = object.status ?? "";
    message.type = object.type ?? "";
    message.image = object.image ?? "";
    message.nameEn = object.nameEn ?? "";
    message.nameAr = object.nameAr ?? "";
    message.taglineAr = object.taglineAr?.map((e) => e) || [];
    message.taglineEn = object.taglineEn?.map((e) => e) || [];
    message.descriptionEn = object.descriptionEn ?? "";
    message.descriptionAr = object.descriptionAr ?? "";
    message.priceType = object.priceType ?? "";
    message.price = object.price ?? 0;
    message.validityType = object.validityType ?? "";
    message.validity = object.validity ?? 0;
    message.modelIds = object.modelIds?.map((e) => e) || [];
    message.sellerIds = object.sellerIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseGetAddonsResponse(): GetAddonsResponse {
  return { addons: [] };
}

export const GetAddonsResponse = {
  encode(message: GetAddonsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.addons) {
      AddonItem.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAddonsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAddonsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.addons.push(AddonItem.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAddonsResponse {
    return { addons: Array.isArray(object?.addons) ? object.addons.map((e: any) => AddonItem.fromJSON(e)) : [] };
  },

  toJSON(message: GetAddonsResponse): unknown {
    const obj: any = {};
    if (message.addons) {
      obj.addons = message.addons.map((e) => e ? AddonItem.toJSON(e) : undefined);
    } else {
      obj.addons = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAddonsResponse>, I>>(base?: I): GetAddonsResponse {
    return GetAddonsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetAddonsResponse>, I>>(object: I): GetAddonsResponse {
    const message = createBaseGetAddonsResponse();
    message.addons = object.addons?.map((e) => AddonItem.fromPartial(e)) || [];
    return message;
  },
};

export interface AddonService {
  GetAddons(request: GetAddonsRequest): Promise<GetAddonsResponse>;
}

export class AddonServiceClientImpl implements AddonService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "addon.AddonService";
    this.rpc = rpc;
    this.GetAddons = this.GetAddons.bind(this);
  }
  GetAddons(request: GetAddonsRequest): Promise<GetAddonsResponse> {
    const data = GetAddonsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetAddons", data);
    return promise.then((data) => GetAddonsResponse.decode(new _m0.Reader(data)));
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
