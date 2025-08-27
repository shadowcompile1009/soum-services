/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "category";

export interface GetCatConPriceRangeRequest {
  variantId: string;
  conditionId: string;
  catConditionQuality: string;
}

export interface GetCatConPriceRangeResponse {
  priceRange: PriceNudge | undefined;
}

export interface PriceNudge {
  min: number;
  max: number;
}

export interface GetProductCatConRequest {
  id: string;
  variantId: string;
  sellPrice: number;
}

export interface GetProductCatConResponse {
  condition: Condition | undefined;
  priceQuality: PriceQuality | undefined;
}

export interface Banner {
  lang: string;
  url: string;
  source: string;
}

export interface PriceQuality {
  name: string;
}

export interface Condition {
  id: string;
  name: string;
  nameAr: string;
  labelColor: string;
  textColor: string;
  banners: Banner[];
  positionEn: number;
  positionAr: number;
}

export interface CategoryIds {
  ids: string[];
}

export interface GetCategoriesRequest {
  limit: number;
  offset: number;
  type: string;
  categories?: CategoryIds | undefined;
}

export interface GetCategoryByNameRequest {
  name: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  status: string;
  type: string;
  parentId: string;
  icon: Icon | undefined;
  position: number;
}

export interface GetCategoriesResponse {
  categories: Category[];
}

export interface CreateCategoryRequest {
  name: string;
  nameAr: string;
  position: number;
  status: string;
  type: string;
  parentId: string;
  icons: Icon[];
  id: string;
  maxPercentage?: number | undefined;
  currentPrice?: number | undefined;
}

export interface Icon {
  type: string;
  url: string;
  source: string;
}

export interface CreateCategoryResponse {
}

export interface GetAttributesRequest {
  size: number;
  page: number;
  search: string;
  optionsIncluded?: boolean | undefined;
}

export interface Option {
  id: string;
  nameEn: string;
  nameAr: string;
  status: string;
  positionAr: number;
  positionEn: number;
}

export interface Attribute {
  id: string;
  nameEn: string;
  nameAr: string;
  status: string;
  options: Option[];
  iconURL?: string | undefined;
}

export interface UpdateAttributeRequest {
  id: string;
  nameEn: string;
  nameAr: string;
  status: string;
  options: Option[];
}

export interface UpdateAttributeResponse {
  id: string;
  name: string;
  nameAr: string;
  status: string;
  options: Option[];
}

export interface GetAttributesResponse {
  attributes: Attribute[];
  total: number;
}

export interface DeleteAttributeRequest {
  id: string;
}

export interface DeleteAttributeResponse {
}

export interface GetAttributeRequest {
  id: string;
}

export interface GetAttributeResponse {
  attribute: Attribute | undefined;
}

export interface CreateAttributeRequest {
  name: string;
  nameAr: string;
  status: string;
  options: Option[];
}

export interface CreateAttributeResponse {
  id: string;
  name: string;
  nameAr: string;
  status: string;
  options: Option[];
}

export interface GetConditionsRequest {
  ids: string[];
}

export interface GetConditionsResponse {
  conditions: Condition[];
}

export interface GetMultipleAttributeRequest {
  ids: string[];
}

export interface GetMultipleAttributeResponse {
  attributes: Attribute[];
}

function createBaseGetCatConPriceRangeRequest(): GetCatConPriceRangeRequest {
  return { variantId: "", conditionId: "", catConditionQuality: "" };
}

export const GetCatConPriceRangeRequest = {
  encode(message: GetCatConPriceRangeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.variantId !== "") {
      writer.uint32(10).string(message.variantId);
    }
    if (message.conditionId !== "") {
      writer.uint32(18).string(message.conditionId);
    }
    if (message.catConditionQuality !== "") {
      writer.uint32(26).string(message.catConditionQuality);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCatConPriceRangeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCatConPriceRangeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.variantId = reader.string();
          break;
        case 2:
          message.conditionId = reader.string();
          break;
        case 3:
          message.catConditionQuality = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCatConPriceRangeRequest {
    return {
      variantId: isSet(object.variantId) ? String(object.variantId) : "",
      conditionId: isSet(object.conditionId) ? String(object.conditionId) : "",
      catConditionQuality: isSet(object.catConditionQuality) ? String(object.catConditionQuality) : "",
    };
  },

  toJSON(message: GetCatConPriceRangeRequest): unknown {
    const obj: any = {};
    message.variantId !== undefined && (obj.variantId = message.variantId);
    message.conditionId !== undefined && (obj.conditionId = message.conditionId);
    message.catConditionQuality !== undefined && (obj.catConditionQuality = message.catConditionQuality);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCatConPriceRangeRequest>, I>>(base?: I): GetCatConPriceRangeRequest {
    return GetCatConPriceRangeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCatConPriceRangeRequest>, I>>(object: I): GetCatConPriceRangeRequest {
    const message = createBaseGetCatConPriceRangeRequest();
    message.variantId = object.variantId ?? "";
    message.conditionId = object.conditionId ?? "";
    message.catConditionQuality = object.catConditionQuality ?? "";
    return message;
  },
};

function createBaseGetCatConPriceRangeResponse(): GetCatConPriceRangeResponse {
  return { priceRange: undefined };
}

export const GetCatConPriceRangeResponse = {
  encode(message: GetCatConPriceRangeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.priceRange !== undefined) {
      PriceNudge.encode(message.priceRange, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCatConPriceRangeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCatConPriceRangeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.priceRange = PriceNudge.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCatConPriceRangeResponse {
    return { priceRange: isSet(object.priceRange) ? PriceNudge.fromJSON(object.priceRange) : undefined };
  },

  toJSON(message: GetCatConPriceRangeResponse): unknown {
    const obj: any = {};
    message.priceRange !== undefined &&
      (obj.priceRange = message.priceRange ? PriceNudge.toJSON(message.priceRange) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCatConPriceRangeResponse>, I>>(base?: I): GetCatConPriceRangeResponse {
    return GetCatConPriceRangeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCatConPriceRangeResponse>, I>>(object: I): GetCatConPriceRangeResponse {
    const message = createBaseGetCatConPriceRangeResponse();
    message.priceRange = (object.priceRange !== undefined && object.priceRange !== null)
      ? PriceNudge.fromPartial(object.priceRange)
      : undefined;
    return message;
  },
};

function createBasePriceNudge(): PriceNudge {
  return { min: 0, max: 0 };
}

export const PriceNudge = {
  encode(message: PriceNudge, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.min !== 0) {
      writer.uint32(9).double(message.min);
    }
    if (message.max !== 0) {
      writer.uint32(17).double(message.max);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PriceNudge {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePriceNudge();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.min = reader.double();
          break;
        case 2:
          message.max = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PriceNudge {
    return { min: isSet(object.min) ? Number(object.min) : 0, max: isSet(object.max) ? Number(object.max) : 0 };
  },

  toJSON(message: PriceNudge): unknown {
    const obj: any = {};
    message.min !== undefined && (obj.min = message.min);
    message.max !== undefined && (obj.max = message.max);
    return obj;
  },

  create<I extends Exact<DeepPartial<PriceNudge>, I>>(base?: I): PriceNudge {
    return PriceNudge.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PriceNudge>, I>>(object: I): PriceNudge {
    const message = createBasePriceNudge();
    message.min = object.min ?? 0;
    message.max = object.max ?? 0;
    return message;
  },
};

function createBaseGetProductCatConRequest(): GetProductCatConRequest {
  return { id: "", variantId: "", sellPrice: 0 };
}

export const GetProductCatConRequest = {
  encode(message: GetProductCatConRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.variantId !== "") {
      writer.uint32(18).string(message.variantId);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(24).int32(message.sellPrice);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetProductCatConRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetProductCatConRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.variantId = reader.string();
          break;
        case 3:
          message.sellPrice = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetProductCatConRequest {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      variantId: isSet(object.variantId) ? String(object.variantId) : "",
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
    };
  },

  toJSON(message: GetProductCatConRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.variantId !== undefined && (obj.variantId = message.variantId);
    message.sellPrice !== undefined && (obj.sellPrice = Math.round(message.sellPrice));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetProductCatConRequest>, I>>(base?: I): GetProductCatConRequest {
    return GetProductCatConRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetProductCatConRequest>, I>>(object: I): GetProductCatConRequest {
    const message = createBaseGetProductCatConRequest();
    message.id = object.id ?? "";
    message.variantId = object.variantId ?? "";
    message.sellPrice = object.sellPrice ?? 0;
    return message;
  },
};

function createBaseGetProductCatConResponse(): GetProductCatConResponse {
  return { condition: undefined, priceQuality: undefined };
}

export const GetProductCatConResponse = {
  encode(message: GetProductCatConResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.condition !== undefined) {
      Condition.encode(message.condition, writer.uint32(10).fork()).ldelim();
    }
    if (message.priceQuality !== undefined) {
      PriceQuality.encode(message.priceQuality, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetProductCatConResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetProductCatConResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.condition = Condition.decode(reader, reader.uint32());
          break;
        case 2:
          message.priceQuality = PriceQuality.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetProductCatConResponse {
    return {
      condition: isSet(object.condition) ? Condition.fromJSON(object.condition) : undefined,
      priceQuality: isSet(object.priceQuality) ? PriceQuality.fromJSON(object.priceQuality) : undefined,
    };
  },

  toJSON(message: GetProductCatConResponse): unknown {
    const obj: any = {};
    message.condition !== undefined &&
      (obj.condition = message.condition ? Condition.toJSON(message.condition) : undefined);
    message.priceQuality !== undefined &&
      (obj.priceQuality = message.priceQuality ? PriceQuality.toJSON(message.priceQuality) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetProductCatConResponse>, I>>(base?: I): GetProductCatConResponse {
    return GetProductCatConResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetProductCatConResponse>, I>>(object: I): GetProductCatConResponse {
    const message = createBaseGetProductCatConResponse();
    message.condition = (object.condition !== undefined && object.condition !== null)
      ? Condition.fromPartial(object.condition)
      : undefined;
    message.priceQuality = (object.priceQuality !== undefined && object.priceQuality !== null)
      ? PriceQuality.fromPartial(object.priceQuality)
      : undefined;
    return message;
  },
};

function createBaseBanner(): Banner {
  return { lang: "", url: "", source: "" };
}

export const Banner = {
  encode(message: Banner, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.lang !== "") {
      writer.uint32(10).string(message.lang);
    }
    if (message.url !== "") {
      writer.uint32(18).string(message.url);
    }
    if (message.source !== "") {
      writer.uint32(26).string(message.source);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Banner {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBanner();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.lang = reader.string();
          break;
        case 2:
          message.url = reader.string();
          break;
        case 3:
          message.source = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Banner {
    return {
      lang: isSet(object.lang) ? String(object.lang) : "",
      url: isSet(object.url) ? String(object.url) : "",
      source: isSet(object.source) ? String(object.source) : "",
    };
  },

  toJSON(message: Banner): unknown {
    const obj: any = {};
    message.lang !== undefined && (obj.lang = message.lang);
    message.url !== undefined && (obj.url = message.url);
    message.source !== undefined && (obj.source = message.source);
    return obj;
  },

  create<I extends Exact<DeepPartial<Banner>, I>>(base?: I): Banner {
    return Banner.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Banner>, I>>(object: I): Banner {
    const message = createBaseBanner();
    message.lang = object.lang ?? "";
    message.url = object.url ?? "";
    message.source = object.source ?? "";
    return message;
  },
};

function createBasePriceQuality(): PriceQuality {
  return { name: "" };
}

export const PriceQuality = {
  encode(message: PriceQuality, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PriceQuality {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePriceQuality();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PriceQuality {
    return { name: isSet(object.name) ? String(object.name) : "" };
  },

  toJSON(message: PriceQuality): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  create<I extends Exact<DeepPartial<PriceQuality>, I>>(base?: I): PriceQuality {
    return PriceQuality.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PriceQuality>, I>>(object: I): PriceQuality {
    const message = createBasePriceQuality();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseCondition(): Condition {
  return { id: "", name: "", nameAr: "", labelColor: "", textColor: "", banners: [], positionEn: 0, positionAr: 0 };
}

export const Condition = {
  encode(message: Condition, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.nameAr !== "") {
      writer.uint32(26).string(message.nameAr);
    }
    if (message.labelColor !== "") {
      writer.uint32(34).string(message.labelColor);
    }
    if (message.textColor !== "") {
      writer.uint32(42).string(message.textColor);
    }
    for (const v of message.banners) {
      Banner.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.positionEn !== 0) {
      writer.uint32(56).int32(message.positionEn);
    }
    if (message.positionAr !== 0) {
      writer.uint32(64).int32(message.positionAr);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Condition {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCondition();
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
          message.nameAr = reader.string();
          break;
        case 4:
          message.labelColor = reader.string();
          break;
        case 5:
          message.textColor = reader.string();
          break;
        case 6:
          message.banners.push(Banner.decode(reader, reader.uint32()));
          break;
        case 7:
          message.positionEn = reader.int32();
          break;
        case 8:
          message.positionAr = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Condition {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      nameAr: isSet(object.nameAr) ? String(object.nameAr) : "",
      labelColor: isSet(object.labelColor) ? String(object.labelColor) : "",
      textColor: isSet(object.textColor) ? String(object.textColor) : "",
      banners: Array.isArray(object?.banners) ? object.banners.map((e: any) => Banner.fromJSON(e)) : [],
      positionEn: isSet(object.positionEn) ? Number(object.positionEn) : 0,
      positionAr: isSet(object.positionAr) ? Number(object.positionAr) : 0,
    };
  },

  toJSON(message: Condition): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.nameAr !== undefined && (obj.nameAr = message.nameAr);
    message.labelColor !== undefined && (obj.labelColor = message.labelColor);
    message.textColor !== undefined && (obj.textColor = message.textColor);
    if (message.banners) {
      obj.banners = message.banners.map((e) => e ? Banner.toJSON(e) : undefined);
    } else {
      obj.banners = [];
    }
    message.positionEn !== undefined && (obj.positionEn = Math.round(message.positionEn));
    message.positionAr !== undefined && (obj.positionAr = Math.round(message.positionAr));
    return obj;
  },

  create<I extends Exact<DeepPartial<Condition>, I>>(base?: I): Condition {
    return Condition.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Condition>, I>>(object: I): Condition {
    const message = createBaseCondition();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.nameAr = object.nameAr ?? "";
    message.labelColor = object.labelColor ?? "";
    message.textColor = object.textColor ?? "";
    message.banners = object.banners?.map((e) => Banner.fromPartial(e)) || [];
    message.positionEn = object.positionEn ?? 0;
    message.positionAr = object.positionAr ?? 0;
    return message;
  },
};

function createBaseCategoryIds(): CategoryIds {
  return { ids: [] };
}

export const CategoryIds = {
  encode(message: CategoryIds, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.ids) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CategoryIds {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCategoryIds();
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

  fromJSON(object: any): CategoryIds {
    return { ids: Array.isArray(object?.ids) ? object.ids.map((e: any) => String(e)) : [] };
  },

  toJSON(message: CategoryIds): unknown {
    const obj: any = {};
    if (message.ids) {
      obj.ids = message.ids.map((e) => e);
    } else {
      obj.ids = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CategoryIds>, I>>(base?: I): CategoryIds {
    return CategoryIds.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CategoryIds>, I>>(object: I): CategoryIds {
    const message = createBaseCategoryIds();
    message.ids = object.ids?.map((e) => e) || [];
    return message;
  },
};

function createBaseGetCategoriesRequest(): GetCategoriesRequest {
  return { limit: 0, offset: 0, type: "", categories: undefined };
}

export const GetCategoriesRequest = {
  encode(message: GetCategoriesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(8).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(16).int32(message.offset);
    }
    if (message.type !== "") {
      writer.uint32(26).string(message.type);
    }
    if (message.categories !== undefined) {
      CategoryIds.encode(message.categories, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCategoriesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCategoriesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.limit = reader.int32();
          break;
        case 2:
          message.offset = reader.int32();
          break;
        case 3:
          message.type = reader.string();
          break;
        case 4:
          message.categories = CategoryIds.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCategoriesRequest {
    return {
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
      type: isSet(object.type) ? String(object.type) : "",
      categories: isSet(object.categories) ? CategoryIds.fromJSON(object.categories) : undefined,
    };
  },

  toJSON(message: GetCategoriesRequest): unknown {
    const obj: any = {};
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    message.type !== undefined && (obj.type = message.type);
    message.categories !== undefined &&
      (obj.categories = message.categories ? CategoryIds.toJSON(message.categories) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCategoriesRequest>, I>>(base?: I): GetCategoriesRequest {
    return GetCategoriesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCategoriesRequest>, I>>(object: I): GetCategoriesRequest {
    const message = createBaseGetCategoriesRequest();
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    message.type = object.type ?? "";
    message.categories = (object.categories !== undefined && object.categories !== null)
      ? CategoryIds.fromPartial(object.categories)
      : undefined;
    return message;
  },
};

function createBaseGetCategoryByNameRequest(): GetCategoryByNameRequest {
  return { name: "" };
}

export const GetCategoryByNameRequest = {
  encode(message: GetCategoryByNameRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCategoryByNameRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCategoryByNameRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCategoryByNameRequest {
    return { name: isSet(object.name) ? String(object.name) : "" };
  },

  toJSON(message: GetCategoryByNameRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCategoryByNameRequest>, I>>(base?: I): GetCategoryByNameRequest {
    return GetCategoryByNameRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCategoryByNameRequest>, I>>(object: I): GetCategoryByNameRequest {
    const message = createBaseGetCategoryByNameRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseCategory(): Category {
  return { id: "", name: "", nameAr: "", status: "", type: "", parentId: "", icon: undefined, position: 0 };
}

export const Category = {
  encode(message: Category, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.nameAr !== "") {
      writer.uint32(26).string(message.nameAr);
    }
    if (message.status !== "") {
      writer.uint32(34).string(message.status);
    }
    if (message.type !== "") {
      writer.uint32(42).string(message.type);
    }
    if (message.parentId !== "") {
      writer.uint32(50).string(message.parentId);
    }
    if (message.icon !== undefined) {
      Icon.encode(message.icon, writer.uint32(58).fork()).ldelim();
    }
    if (message.position !== 0) {
      writer.uint32(64).int32(message.position);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Category {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCategory();
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
          message.nameAr = reader.string();
          break;
        case 4:
          message.status = reader.string();
          break;
        case 5:
          message.type = reader.string();
          break;
        case 6:
          message.parentId = reader.string();
          break;
        case 7:
          message.icon = Icon.decode(reader, reader.uint32());
          break;
        case 8:
          message.position = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Category {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      nameAr: isSet(object.nameAr) ? String(object.nameAr) : "",
      status: isSet(object.status) ? String(object.status) : "",
      type: isSet(object.type) ? String(object.type) : "",
      parentId: isSet(object.parentId) ? String(object.parentId) : "",
      icon: isSet(object.icon) ? Icon.fromJSON(object.icon) : undefined,
      position: isSet(object.position) ? Number(object.position) : 0,
    };
  },

  toJSON(message: Category): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.nameAr !== undefined && (obj.nameAr = message.nameAr);
    message.status !== undefined && (obj.status = message.status);
    message.type !== undefined && (obj.type = message.type);
    message.parentId !== undefined && (obj.parentId = message.parentId);
    message.icon !== undefined && (obj.icon = message.icon ? Icon.toJSON(message.icon) : undefined);
    message.position !== undefined && (obj.position = Math.round(message.position));
    return obj;
  },

  create<I extends Exact<DeepPartial<Category>, I>>(base?: I): Category {
    return Category.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Category>, I>>(object: I): Category {
    const message = createBaseCategory();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.nameAr = object.nameAr ?? "";
    message.status = object.status ?? "";
    message.type = object.type ?? "";
    message.parentId = object.parentId ?? "";
    message.icon = (object.icon !== undefined && object.icon !== null) ? Icon.fromPartial(object.icon) : undefined;
    message.position = object.position ?? 0;
    return message;
  },
};

function createBaseGetCategoriesResponse(): GetCategoriesResponse {
  return { categories: [] };
}

export const GetCategoriesResponse = {
  encode(message: GetCategoriesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.categories) {
      Category.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCategoriesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCategoriesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.categories.push(Category.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCategoriesResponse {
    return {
      categories: Array.isArray(object?.categories) ? object.categories.map((e: any) => Category.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetCategoriesResponse): unknown {
    const obj: any = {};
    if (message.categories) {
      obj.categories = message.categories.map((e) => e ? Category.toJSON(e) : undefined);
    } else {
      obj.categories = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCategoriesResponse>, I>>(base?: I): GetCategoriesResponse {
    return GetCategoriesResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCategoriesResponse>, I>>(object: I): GetCategoriesResponse {
    const message = createBaseGetCategoriesResponse();
    message.categories = object.categories?.map((e) => Category.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCreateCategoryRequest(): CreateCategoryRequest {
  return {
    name: "",
    nameAr: "",
    position: 0,
    status: "",
    type: "",
    parentId: "",
    icons: [],
    id: "",
    maxPercentage: undefined,
    currentPrice: undefined,
  };
}

export const CreateCategoryRequest = {
  encode(message: CreateCategoryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.nameAr !== "") {
      writer.uint32(18).string(message.nameAr);
    }
    if (message.position !== 0) {
      writer.uint32(24).int32(message.position);
    }
    if (message.status !== "") {
      writer.uint32(34).string(message.status);
    }
    if (message.type !== "") {
      writer.uint32(42).string(message.type);
    }
    if (message.parentId !== "") {
      writer.uint32(50).string(message.parentId);
    }
    for (const v of message.icons) {
      Icon.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    if (message.id !== "") {
      writer.uint32(66).string(message.id);
    }
    if (message.maxPercentage !== undefined) {
      writer.uint32(72).int32(message.maxPercentage);
    }
    if (message.currentPrice !== undefined) {
      writer.uint32(80).int32(message.currentPrice);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateCategoryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateCategoryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.nameAr = reader.string();
          break;
        case 3:
          message.position = reader.int32();
          break;
        case 4:
          message.status = reader.string();
          break;
        case 5:
          message.type = reader.string();
          break;
        case 6:
          message.parentId = reader.string();
          break;
        case 7:
          message.icons.push(Icon.decode(reader, reader.uint32()));
          break;
        case 8:
          message.id = reader.string();
          break;
        case 9:
          message.maxPercentage = reader.int32();
          break;
        case 10:
          message.currentPrice = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateCategoryRequest {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      nameAr: isSet(object.nameAr) ? String(object.nameAr) : "",
      position: isSet(object.position) ? Number(object.position) : 0,
      status: isSet(object.status) ? String(object.status) : "",
      type: isSet(object.type) ? String(object.type) : "",
      parentId: isSet(object.parentId) ? String(object.parentId) : "",
      icons: Array.isArray(object?.icons) ? object.icons.map((e: any) => Icon.fromJSON(e)) : [],
      id: isSet(object.id) ? String(object.id) : "",
      maxPercentage: isSet(object.maxPercentage) ? Number(object.maxPercentage) : undefined,
      currentPrice: isSet(object.currentPrice) ? Number(object.currentPrice) : undefined,
    };
  },

  toJSON(message: CreateCategoryRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.nameAr !== undefined && (obj.nameAr = message.nameAr);
    message.position !== undefined && (obj.position = Math.round(message.position));
    message.status !== undefined && (obj.status = message.status);
    message.type !== undefined && (obj.type = message.type);
    message.parentId !== undefined && (obj.parentId = message.parentId);
    if (message.icons) {
      obj.icons = message.icons.map((e) => e ? Icon.toJSON(e) : undefined);
    } else {
      obj.icons = [];
    }
    message.id !== undefined && (obj.id = message.id);
    message.maxPercentage !== undefined && (obj.maxPercentage = Math.round(message.maxPercentage));
    message.currentPrice !== undefined && (obj.currentPrice = Math.round(message.currentPrice));
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateCategoryRequest>, I>>(base?: I): CreateCategoryRequest {
    return CreateCategoryRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateCategoryRequest>, I>>(object: I): CreateCategoryRequest {
    const message = createBaseCreateCategoryRequest();
    message.name = object.name ?? "";
    message.nameAr = object.nameAr ?? "";
    message.position = object.position ?? 0;
    message.status = object.status ?? "";
    message.type = object.type ?? "";
    message.parentId = object.parentId ?? "";
    message.icons = object.icons?.map((e) => Icon.fromPartial(e)) || [];
    message.id = object.id ?? "";
    message.maxPercentage = object.maxPercentage ?? undefined;
    message.currentPrice = object.currentPrice ?? undefined;
    return message;
  },
};

function createBaseIcon(): Icon {
  return { type: "", url: "", source: "" };
}

export const Icon = {
  encode(message: Icon, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.url !== "") {
      writer.uint32(18).string(message.url);
    }
    if (message.source !== "") {
      writer.uint32(26).string(message.source);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Icon {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIcon();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.string();
          break;
        case 2:
          message.url = reader.string();
          break;
        case 3:
          message.source = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Icon {
    return {
      type: isSet(object.type) ? String(object.type) : "",
      url: isSet(object.url) ? String(object.url) : "",
      source: isSet(object.source) ? String(object.source) : "",
    };
  },

  toJSON(message: Icon): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.url !== undefined && (obj.url = message.url);
    message.source !== undefined && (obj.source = message.source);
    return obj;
  },

  create<I extends Exact<DeepPartial<Icon>, I>>(base?: I): Icon {
    return Icon.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Icon>, I>>(object: I): Icon {
    const message = createBaseIcon();
    message.type = object.type ?? "";
    message.url = object.url ?? "";
    message.source = object.source ?? "";
    return message;
  },
};

function createBaseCreateCategoryResponse(): CreateCategoryResponse {
  return {};
}

export const CreateCategoryResponse = {
  encode(_: CreateCategoryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateCategoryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateCategoryResponse();
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

  fromJSON(_: any): CreateCategoryResponse {
    return {};
  },

  toJSON(_: CreateCategoryResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateCategoryResponse>, I>>(base?: I): CreateCategoryResponse {
    return CreateCategoryResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateCategoryResponse>, I>>(_: I): CreateCategoryResponse {
    const message = createBaseCreateCategoryResponse();
    return message;
  },
};

function createBaseGetAttributesRequest(): GetAttributesRequest {
  return { size: 0, page: 0, search: "", optionsIncluded: undefined };
}

export const GetAttributesRequest = {
  encode(message: GetAttributesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.size !== 0) {
      writer.uint32(8).int32(message.size);
    }
    if (message.page !== 0) {
      writer.uint32(16).int32(message.page);
    }
    if (message.search !== "") {
      writer.uint32(26).string(message.search);
    }
    if (message.optionsIncluded !== undefined) {
      writer.uint32(32).bool(message.optionsIncluded);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAttributesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAttributesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.size = reader.int32();
          break;
        case 2:
          message.page = reader.int32();
          break;
        case 3:
          message.search = reader.string();
          break;
        case 4:
          message.optionsIncluded = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAttributesRequest {
    return {
      size: isSet(object.size) ? Number(object.size) : 0,
      page: isSet(object.page) ? Number(object.page) : 0,
      search: isSet(object.search) ? String(object.search) : "",
      optionsIncluded: isSet(object.optionsIncluded) ? Boolean(object.optionsIncluded) : undefined,
    };
  },

  toJSON(message: GetAttributesRequest): unknown {
    const obj: any = {};
    message.size !== undefined && (obj.size = Math.round(message.size));
    message.page !== undefined && (obj.page = Math.round(message.page));
    message.search !== undefined && (obj.search = message.search);
    message.optionsIncluded !== undefined && (obj.optionsIncluded = message.optionsIncluded);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAttributesRequest>, I>>(base?: I): GetAttributesRequest {
    return GetAttributesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetAttributesRequest>, I>>(object: I): GetAttributesRequest {
    const message = createBaseGetAttributesRequest();
    message.size = object.size ?? 0;
    message.page = object.page ?? 0;
    message.search = object.search ?? "";
    message.optionsIncluded = object.optionsIncluded ?? undefined;
    return message;
  },
};

function createBaseOption(): Option {
  return { id: "", nameEn: "", nameAr: "", status: "", positionAr: 0, positionEn: 0 };
}

export const Option = {
  encode(message: Option, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.nameEn !== "") {
      writer.uint32(18).string(message.nameEn);
    }
    if (message.nameAr !== "") {
      writer.uint32(26).string(message.nameAr);
    }
    if (message.status !== "") {
      writer.uint32(34).string(message.status);
    }
    if (message.positionAr !== 0) {
      writer.uint32(40).int32(message.positionAr);
    }
    if (message.positionEn !== 0) {
      writer.uint32(48).int32(message.positionEn);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Option {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOption();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.nameEn = reader.string();
          break;
        case 3:
          message.nameAr = reader.string();
          break;
        case 4:
          message.status = reader.string();
          break;
        case 5:
          message.positionAr = reader.int32();
          break;
        case 6:
          message.positionEn = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Option {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      nameEn: isSet(object.nameEn) ? String(object.nameEn) : "",
      nameAr: isSet(object.nameAr) ? String(object.nameAr) : "",
      status: isSet(object.status) ? String(object.status) : "",
      positionAr: isSet(object.positionAr) ? Number(object.positionAr) : 0,
      positionEn: isSet(object.positionEn) ? Number(object.positionEn) : 0,
    };
  },

  toJSON(message: Option): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.nameEn !== undefined && (obj.nameEn = message.nameEn);
    message.nameAr !== undefined && (obj.nameAr = message.nameAr);
    message.status !== undefined && (obj.status = message.status);
    message.positionAr !== undefined && (obj.positionAr = Math.round(message.positionAr));
    message.positionEn !== undefined && (obj.positionEn = Math.round(message.positionEn));
    return obj;
  },

  create<I extends Exact<DeepPartial<Option>, I>>(base?: I): Option {
    return Option.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Option>, I>>(object: I): Option {
    const message = createBaseOption();
    message.id = object.id ?? "";
    message.nameEn = object.nameEn ?? "";
    message.nameAr = object.nameAr ?? "";
    message.status = object.status ?? "";
    message.positionAr = object.positionAr ?? 0;
    message.positionEn = object.positionEn ?? 0;
    return message;
  },
};

function createBaseAttribute(): Attribute {
  return { id: "", nameEn: "", nameAr: "", status: "", options: [], iconURL: undefined };
}

export const Attribute = {
  encode(message: Attribute, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.nameEn !== "") {
      writer.uint32(18).string(message.nameEn);
    }
    if (message.nameAr !== "") {
      writer.uint32(26).string(message.nameAr);
    }
    if (message.status !== "") {
      writer.uint32(34).string(message.status);
    }
    for (const v of message.options) {
      Option.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    if (message.iconURL !== undefined) {
      writer.uint32(50).string(message.iconURL);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Attribute {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAttribute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.nameEn = reader.string();
          break;
        case 3:
          message.nameAr = reader.string();
          break;
        case 4:
          message.status = reader.string();
          break;
        case 5:
          message.options.push(Option.decode(reader, reader.uint32()));
          break;
        case 6:
          message.iconURL = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Attribute {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      nameEn: isSet(object.nameEn) ? String(object.nameEn) : "",
      nameAr: isSet(object.nameAr) ? String(object.nameAr) : "",
      status: isSet(object.status) ? String(object.status) : "",
      options: Array.isArray(object?.options) ? object.options.map((e: any) => Option.fromJSON(e)) : [],
      iconURL: isSet(object.iconURL) ? String(object.iconURL) : undefined,
    };
  },

  toJSON(message: Attribute): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.nameEn !== undefined && (obj.nameEn = message.nameEn);
    message.nameAr !== undefined && (obj.nameAr = message.nameAr);
    message.status !== undefined && (obj.status = message.status);
    if (message.options) {
      obj.options = message.options.map((e) => e ? Option.toJSON(e) : undefined);
    } else {
      obj.options = [];
    }
    message.iconURL !== undefined && (obj.iconURL = message.iconURL);
    return obj;
  },

  create<I extends Exact<DeepPartial<Attribute>, I>>(base?: I): Attribute {
    return Attribute.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Attribute>, I>>(object: I): Attribute {
    const message = createBaseAttribute();
    message.id = object.id ?? "";
    message.nameEn = object.nameEn ?? "";
    message.nameAr = object.nameAr ?? "";
    message.status = object.status ?? "";
    message.options = object.options?.map((e) => Option.fromPartial(e)) || [];
    message.iconURL = object.iconURL ?? undefined;
    return message;
  },
};

function createBaseUpdateAttributeRequest(): UpdateAttributeRequest {
  return { id: "", nameEn: "", nameAr: "", status: "", options: [] };
}

export const UpdateAttributeRequest = {
  encode(message: UpdateAttributeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.nameEn !== "") {
      writer.uint32(18).string(message.nameEn);
    }
    if (message.nameAr !== "") {
      writer.uint32(26).string(message.nameAr);
    }
    if (message.status !== "") {
      writer.uint32(34).string(message.status);
    }
    for (const v of message.options) {
      Option.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateAttributeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateAttributeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.nameEn = reader.string();
          break;
        case 3:
          message.nameAr = reader.string();
          break;
        case 4:
          message.status = reader.string();
          break;
        case 5:
          message.options.push(Option.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateAttributeRequest {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      nameEn: isSet(object.nameEn) ? String(object.nameEn) : "",
      nameAr: isSet(object.nameAr) ? String(object.nameAr) : "",
      status: isSet(object.status) ? String(object.status) : "",
      options: Array.isArray(object?.options) ? object.options.map((e: any) => Option.fromJSON(e)) : [],
    };
  },

  toJSON(message: UpdateAttributeRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.nameEn !== undefined && (obj.nameEn = message.nameEn);
    message.nameAr !== undefined && (obj.nameAr = message.nameAr);
    message.status !== undefined && (obj.status = message.status);
    if (message.options) {
      obj.options = message.options.map((e) => e ? Option.toJSON(e) : undefined);
    } else {
      obj.options = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateAttributeRequest>, I>>(base?: I): UpdateAttributeRequest {
    return UpdateAttributeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateAttributeRequest>, I>>(object: I): UpdateAttributeRequest {
    const message = createBaseUpdateAttributeRequest();
    message.id = object.id ?? "";
    message.nameEn = object.nameEn ?? "";
    message.nameAr = object.nameAr ?? "";
    message.status = object.status ?? "";
    message.options = object.options?.map((e) => Option.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUpdateAttributeResponse(): UpdateAttributeResponse {
  return { id: "", name: "", nameAr: "", status: "", options: [] };
}

export const UpdateAttributeResponse = {
  encode(message: UpdateAttributeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.nameAr !== "") {
      writer.uint32(26).string(message.nameAr);
    }
    if (message.status !== "") {
      writer.uint32(34).string(message.status);
    }
    for (const v of message.options) {
      Option.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateAttributeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateAttributeResponse();
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
          message.nameAr = reader.string();
          break;
        case 4:
          message.status = reader.string();
          break;
        case 5:
          message.options.push(Option.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateAttributeResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      nameAr: isSet(object.nameAr) ? String(object.nameAr) : "",
      status: isSet(object.status) ? String(object.status) : "",
      options: Array.isArray(object?.options) ? object.options.map((e: any) => Option.fromJSON(e)) : [],
    };
  },

  toJSON(message: UpdateAttributeResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.nameAr !== undefined && (obj.nameAr = message.nameAr);
    message.status !== undefined && (obj.status = message.status);
    if (message.options) {
      obj.options = message.options.map((e) => e ? Option.toJSON(e) : undefined);
    } else {
      obj.options = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateAttributeResponse>, I>>(base?: I): UpdateAttributeResponse {
    return UpdateAttributeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateAttributeResponse>, I>>(object: I): UpdateAttributeResponse {
    const message = createBaseUpdateAttributeResponse();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.nameAr = object.nameAr ?? "";
    message.status = object.status ?? "";
    message.options = object.options?.map((e) => Option.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetAttributesResponse(): GetAttributesResponse {
  return { attributes: [], total: 0 };
}

export const GetAttributesResponse = {
  encode(message: GetAttributesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.attributes) {
      Attribute.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.total !== 0) {
      writer.uint32(16).int32(message.total);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAttributesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAttributesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.attributes.push(Attribute.decode(reader, reader.uint32()));
          break;
        case 2:
          message.total = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAttributesResponse {
    return {
      attributes: Array.isArray(object?.attributes) ? object.attributes.map((e: any) => Attribute.fromJSON(e)) : [],
      total: isSet(object.total) ? Number(object.total) : 0,
    };
  },

  toJSON(message: GetAttributesResponse): unknown {
    const obj: any = {};
    if (message.attributes) {
      obj.attributes = message.attributes.map((e) => e ? Attribute.toJSON(e) : undefined);
    } else {
      obj.attributes = [];
    }
    message.total !== undefined && (obj.total = Math.round(message.total));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAttributesResponse>, I>>(base?: I): GetAttributesResponse {
    return GetAttributesResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetAttributesResponse>, I>>(object: I): GetAttributesResponse {
    const message = createBaseGetAttributesResponse();
    message.attributes = object.attributes?.map((e) => Attribute.fromPartial(e)) || [];
    message.total = object.total ?? 0;
    return message;
  },
};

function createBaseDeleteAttributeRequest(): DeleteAttributeRequest {
  return { id: "" };
}

export const DeleteAttributeRequest = {
  encode(message: DeleteAttributeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteAttributeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteAttributeRequest();
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

  fromJSON(object: any): DeleteAttributeRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: DeleteAttributeRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteAttributeRequest>, I>>(base?: I): DeleteAttributeRequest {
    return DeleteAttributeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DeleteAttributeRequest>, I>>(object: I): DeleteAttributeRequest {
    const message = createBaseDeleteAttributeRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseDeleteAttributeResponse(): DeleteAttributeResponse {
  return {};
}

export const DeleteAttributeResponse = {
  encode(_: DeleteAttributeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteAttributeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteAttributeResponse();
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

  fromJSON(_: any): DeleteAttributeResponse {
    return {};
  },

  toJSON(_: DeleteAttributeResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteAttributeResponse>, I>>(base?: I): DeleteAttributeResponse {
    return DeleteAttributeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DeleteAttributeResponse>, I>>(_: I): DeleteAttributeResponse {
    const message = createBaseDeleteAttributeResponse();
    return message;
  },
};

function createBaseGetAttributeRequest(): GetAttributeRequest {
  return { id: "" };
}

export const GetAttributeRequest = {
  encode(message: GetAttributeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAttributeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAttributeRequest();
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

  fromJSON(object: any): GetAttributeRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: GetAttributeRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAttributeRequest>, I>>(base?: I): GetAttributeRequest {
    return GetAttributeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetAttributeRequest>, I>>(object: I): GetAttributeRequest {
    const message = createBaseGetAttributeRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseGetAttributeResponse(): GetAttributeResponse {
  return { attribute: undefined };
}

export const GetAttributeResponse = {
  encode(message: GetAttributeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.attribute !== undefined) {
      Attribute.encode(message.attribute, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAttributeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAttributeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.attribute = Attribute.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAttributeResponse {
    return { attribute: isSet(object.attribute) ? Attribute.fromJSON(object.attribute) : undefined };
  },

  toJSON(message: GetAttributeResponse): unknown {
    const obj: any = {};
    message.attribute !== undefined &&
      (obj.attribute = message.attribute ? Attribute.toJSON(message.attribute) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAttributeResponse>, I>>(base?: I): GetAttributeResponse {
    return GetAttributeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetAttributeResponse>, I>>(object: I): GetAttributeResponse {
    const message = createBaseGetAttributeResponse();
    message.attribute = (object.attribute !== undefined && object.attribute !== null)
      ? Attribute.fromPartial(object.attribute)
      : undefined;
    return message;
  },
};

function createBaseCreateAttributeRequest(): CreateAttributeRequest {
  return { name: "", nameAr: "", status: "", options: [] };
}

export const CreateAttributeRequest = {
  encode(message: CreateAttributeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.nameAr !== "") {
      writer.uint32(18).string(message.nameAr);
    }
    if (message.status !== "") {
      writer.uint32(26).string(message.status);
    }
    for (const v of message.options) {
      Option.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateAttributeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateAttributeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.nameAr = reader.string();
          break;
        case 3:
          message.status = reader.string();
          break;
        case 4:
          message.options.push(Option.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateAttributeRequest {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      nameAr: isSet(object.nameAr) ? String(object.nameAr) : "",
      status: isSet(object.status) ? String(object.status) : "",
      options: Array.isArray(object?.options) ? object.options.map((e: any) => Option.fromJSON(e)) : [],
    };
  },

  toJSON(message: CreateAttributeRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.nameAr !== undefined && (obj.nameAr = message.nameAr);
    message.status !== undefined && (obj.status = message.status);
    if (message.options) {
      obj.options = message.options.map((e) => e ? Option.toJSON(e) : undefined);
    } else {
      obj.options = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateAttributeRequest>, I>>(base?: I): CreateAttributeRequest {
    return CreateAttributeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateAttributeRequest>, I>>(object: I): CreateAttributeRequest {
    const message = createBaseCreateAttributeRequest();
    message.name = object.name ?? "";
    message.nameAr = object.nameAr ?? "";
    message.status = object.status ?? "";
    message.options = object.options?.map((e) => Option.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCreateAttributeResponse(): CreateAttributeResponse {
  return { id: "", name: "", nameAr: "", status: "", options: [] };
}

export const CreateAttributeResponse = {
  encode(message: CreateAttributeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.nameAr !== "") {
      writer.uint32(26).string(message.nameAr);
    }
    if (message.status !== "") {
      writer.uint32(34).string(message.status);
    }
    for (const v of message.options) {
      Option.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateAttributeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateAttributeResponse();
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
          message.nameAr = reader.string();
          break;
        case 4:
          message.status = reader.string();
          break;
        case 5:
          message.options.push(Option.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateAttributeResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      nameAr: isSet(object.nameAr) ? String(object.nameAr) : "",
      status: isSet(object.status) ? String(object.status) : "",
      options: Array.isArray(object?.options) ? object.options.map((e: any) => Option.fromJSON(e)) : [],
    };
  },

  toJSON(message: CreateAttributeResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.nameAr !== undefined && (obj.nameAr = message.nameAr);
    message.status !== undefined && (obj.status = message.status);
    if (message.options) {
      obj.options = message.options.map((e) => e ? Option.toJSON(e) : undefined);
    } else {
      obj.options = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateAttributeResponse>, I>>(base?: I): CreateAttributeResponse {
    return CreateAttributeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateAttributeResponse>, I>>(object: I): CreateAttributeResponse {
    const message = createBaseCreateAttributeResponse();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.nameAr = object.nameAr ?? "";
    message.status = object.status ?? "";
    message.options = object.options?.map((e) => Option.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetConditionsRequest(): GetConditionsRequest {
  return { ids: [] };
}

export const GetConditionsRequest = {
  encode(message: GetConditionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.ids) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetConditionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetConditionsRequest();
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

  fromJSON(object: any): GetConditionsRequest {
    return { ids: Array.isArray(object?.ids) ? object.ids.map((e: any) => String(e)) : [] };
  },

  toJSON(message: GetConditionsRequest): unknown {
    const obj: any = {};
    if (message.ids) {
      obj.ids = message.ids.map((e) => e);
    } else {
      obj.ids = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetConditionsRequest>, I>>(base?: I): GetConditionsRequest {
    return GetConditionsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetConditionsRequest>, I>>(object: I): GetConditionsRequest {
    const message = createBaseGetConditionsRequest();
    message.ids = object.ids?.map((e) => e) || [];
    return message;
  },
};

function createBaseGetConditionsResponse(): GetConditionsResponse {
  return { conditions: [] };
}

export const GetConditionsResponse = {
  encode(message: GetConditionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.conditions) {
      Condition.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetConditionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetConditionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.conditions.push(Condition.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetConditionsResponse {
    return {
      conditions: Array.isArray(object?.conditions) ? object.conditions.map((e: any) => Condition.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetConditionsResponse): unknown {
    const obj: any = {};
    if (message.conditions) {
      obj.conditions = message.conditions.map((e) => e ? Condition.toJSON(e) : undefined);
    } else {
      obj.conditions = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetConditionsResponse>, I>>(base?: I): GetConditionsResponse {
    return GetConditionsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetConditionsResponse>, I>>(object: I): GetConditionsResponse {
    const message = createBaseGetConditionsResponse();
    message.conditions = object.conditions?.map((e) => Condition.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetMultipleAttributeRequest(): GetMultipleAttributeRequest {
  return { ids: [] };
}

export const GetMultipleAttributeRequest = {
  encode(message: GetMultipleAttributeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.ids) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetMultipleAttributeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetMultipleAttributeRequest();
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

  fromJSON(object: any): GetMultipleAttributeRequest {
    return { ids: Array.isArray(object?.ids) ? object.ids.map((e: any) => String(e)) : [] };
  },

  toJSON(message: GetMultipleAttributeRequest): unknown {
    const obj: any = {};
    if (message.ids) {
      obj.ids = message.ids.map((e) => e);
    } else {
      obj.ids = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetMultipleAttributeRequest>, I>>(base?: I): GetMultipleAttributeRequest {
    return GetMultipleAttributeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetMultipleAttributeRequest>, I>>(object: I): GetMultipleAttributeRequest {
    const message = createBaseGetMultipleAttributeRequest();
    message.ids = object.ids?.map((e) => e) || [];
    return message;
  },
};

function createBaseGetMultipleAttributeResponse(): GetMultipleAttributeResponse {
  return { attributes: [] };
}

export const GetMultipleAttributeResponse = {
  encode(message: GetMultipleAttributeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.attributes) {
      Attribute.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetMultipleAttributeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetMultipleAttributeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.attributes.push(Attribute.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetMultipleAttributeResponse {
    return {
      attributes: Array.isArray(object?.attributes) ? object.attributes.map((e: any) => Attribute.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetMultipleAttributeResponse): unknown {
    const obj: any = {};
    if (message.attributes) {
      obj.attributes = message.attributes.map((e) => e ? Attribute.toJSON(e) : undefined);
    } else {
      obj.attributes = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetMultipleAttributeResponse>, I>>(base?: I): GetMultipleAttributeResponse {
    return GetMultipleAttributeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetMultipleAttributeResponse>, I>>(object: I): GetMultipleAttributeResponse {
    const message = createBaseGetMultipleAttributeResponse();
    message.attributes = object.attributes?.map((e) => Attribute.fromPartial(e)) || [];
    return message;
  },
};

export interface CategoryService {
  GetCatConPriceRange(request: GetCatConPriceRangeRequest): Promise<GetCatConPriceRangeResponse>;
  GetProductCatCon(request: GetProductCatConRequest): Promise<GetProductCatConResponse>;
  GetConditions(request: GetConditionsRequest): Promise<GetConditionsResponse>;
  GetCategories(request: GetCategoriesRequest): Promise<GetCategoriesResponse>;
  CreateCategory(request: CreateCategoryRequest): Promise<CreateCategoryResponse>;
  GetCategoryByName(request: GetCategoryByNameRequest): Promise<Category>;
  GetAttributes(request: GetAttributesRequest): Promise<GetAttributesResponse>;
  UpdateAttribute(request: UpdateAttributeRequest): Promise<UpdateAttributeResponse>;
  DeleteAttribute(request: DeleteAttributeRequest): Promise<DeleteAttributeResponse>;
  GetAttribute(request: GetAttributeRequest): Promise<GetAttributeResponse>;
  CreateAttribute(request: CreateAttributeRequest): Promise<CreateAttributeResponse>;
  GetMultipleAttribute(request: GetMultipleAttributeRequest): Promise<GetMultipleAttributeResponse>;
}

export class CategoryServiceClientImpl implements CategoryService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "category.CategoryService";
    this.rpc = rpc;
    this.GetCatConPriceRange = this.GetCatConPriceRange.bind(this);
    this.GetProductCatCon = this.GetProductCatCon.bind(this);
    this.GetConditions = this.GetConditions.bind(this);
    this.GetCategories = this.GetCategories.bind(this);
    this.CreateCategory = this.CreateCategory.bind(this);
    this.GetCategoryByName = this.GetCategoryByName.bind(this);
    this.GetAttributes = this.GetAttributes.bind(this);
    this.UpdateAttribute = this.UpdateAttribute.bind(this);
    this.DeleteAttribute = this.DeleteAttribute.bind(this);
    this.GetAttribute = this.GetAttribute.bind(this);
    this.CreateAttribute = this.CreateAttribute.bind(this);
    this.GetMultipleAttribute = this.GetMultipleAttribute.bind(this);
  }
  GetCatConPriceRange(request: GetCatConPriceRangeRequest): Promise<GetCatConPriceRangeResponse> {
    const data = GetCatConPriceRangeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetCatConPriceRange", data);
    return promise.then((data) => GetCatConPriceRangeResponse.decode(new _m0.Reader(data)));
  }

  GetProductCatCon(request: GetProductCatConRequest): Promise<GetProductCatConResponse> {
    const data = GetProductCatConRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetProductCatCon", data);
    return promise.then((data) => GetProductCatConResponse.decode(new _m0.Reader(data)));
  }

  GetConditions(request: GetConditionsRequest): Promise<GetConditionsResponse> {
    const data = GetConditionsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetConditions", data);
    return promise.then((data) => GetConditionsResponse.decode(new _m0.Reader(data)));
  }

  GetCategories(request: GetCategoriesRequest): Promise<GetCategoriesResponse> {
    const data = GetCategoriesRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetCategories", data);
    return promise.then((data) => GetCategoriesResponse.decode(new _m0.Reader(data)));
  }

  CreateCategory(request: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    const data = CreateCategoryRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateCategory", data);
    return promise.then((data) => CreateCategoryResponse.decode(new _m0.Reader(data)));
  }

  GetCategoryByName(request: GetCategoryByNameRequest): Promise<Category> {
    const data = GetCategoryByNameRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetCategoryByName", data);
    return promise.then((data) => Category.decode(new _m0.Reader(data)));
  }

  GetAttributes(request: GetAttributesRequest): Promise<GetAttributesResponse> {
    const data = GetAttributesRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetAttributes", data);
    return promise.then((data) => GetAttributesResponse.decode(new _m0.Reader(data)));
  }

  UpdateAttribute(request: UpdateAttributeRequest): Promise<UpdateAttributeResponse> {
    const data = UpdateAttributeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateAttribute", data);
    return promise.then((data) => UpdateAttributeResponse.decode(new _m0.Reader(data)));
  }

  DeleteAttribute(request: DeleteAttributeRequest): Promise<DeleteAttributeResponse> {
    const data = DeleteAttributeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "DeleteAttribute", data);
    return promise.then((data) => DeleteAttributeResponse.decode(new _m0.Reader(data)));
  }

  GetAttribute(request: GetAttributeRequest): Promise<GetAttributeResponse> {
    const data = GetAttributeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetAttribute", data);
    return promise.then((data) => GetAttributeResponse.decode(new _m0.Reader(data)));
  }

  CreateAttribute(request: CreateAttributeRequest): Promise<CreateAttributeResponse> {
    const data = CreateAttributeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateAttribute", data);
    return promise.then((data) => CreateAttributeResponse.decode(new _m0.Reader(data)));
  }

  GetMultipleAttribute(request: GetMultipleAttributeRequest): Promise<GetMultipleAttributeResponse> {
    const data = GetMultipleAttributeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetMultipleAttribute", data);
    return promise.then((data) => GetMultipleAttributeResponse.decode(new _m0.Reader(data)));
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
