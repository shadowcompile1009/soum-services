/* eslint-disable */
import * as _m0 from 'protobufjs/minimal';

export const protobufPackage = 'search';

export enum OperationMode {
  MODE_UNSPECIFIED = 0,
  OPERATION_MODE_1 = 1,
  OPERATION_MODE_2 = 2,
  UNRECOGNIZED = -1,
}

export function operationModeFromJSON(object: any): OperationMode {
  switch (object) {
    case 0:
    case 'MODE_UNSPECIFIED':
      return OperationMode.MODE_UNSPECIFIED;
    case 1:
    case 'OPERATION_MODE_1':
      return OperationMode.OPERATION_MODE_1;
    case 2:
    case 'OPERATION_MODE_2':
      return OperationMode.OPERATION_MODE_2;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return OperationMode.UNRECOGNIZED;
  }
}

export function operationModeToJSON(object: OperationMode): string {
  switch (object) {
    case OperationMode.MODE_UNSPECIFIED:
      return 'MODE_UNSPECIFIED';
    case OperationMode.OPERATION_MODE_1:
      return 'OPERATION_MODE_1';
    case OperationMode.OPERATION_MODE_2:
      return 'OPERATION_MODE_2';
    case OperationMode.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export interface Title {
  arName: string;
  enName: string;
}

export interface Value {
  arName: string;
  enName: string;
}

export interface Attribute {
  title: Title | undefined;
  value: Value | undefined;
}

export interface SearchResultsResponse {
  hits: SearchResultsResponse_Product[];
  found: number;
  foundDocs: number;
  outOf: number;
  page: number;
  groupedHits: GroupedHits[];
}

export interface SearchResultsResponse_Product {
  arGrade: string;
  arModelName: string;
  arVariantName: string;
  attributes: Attribute[];
  brandId: string;
  brandPosition: number;
  categoryId: string;
  categoryPosition: number;
  completionRate: number;
  createdDate: string;
  grade: string;
  id: string;
  isGreatDeal: boolean;
  isMerchant: boolean;
  keywordsAr: string;
  keywordsEn: string;
  modelId: string;
  modelName: string;
  modelImage: string;
  modelPosition: number;
  originalPrice: number;
  priceRange: string;
  productId: string;
  productImage: string;
  productImages: string[];
  sellPrice: number;
  sellerId: string;
  sortScore: number;
  tags: string;
  variantName: string;
}

export interface GroupedHits {
  groupKey: string[];
  found: number;
}

export interface SearchRequest {
  filters: SearchFiltersRequest | undefined;
}

export interface SearchFiltersRequest {
  q: string;
  queryBy: string[];
  queryByWeights: string[];
  prefix: string[];
  filterBy: string;
  sortBy: string[];
  facetBy: string[];
  maxFacetValues: number;
  facetQuery: string;
  facetQueryNumTypos: number;
  page: number;
  perPage: number;
  groupBy: string[];
  groupLimit: number;
  includeFields: string[];
  excludeFields: string[];
  highlightFields: string[];
  highlightFullFields: string[];
  highlightAffixNumTokens: number;
  highlightStartTag: string;
  highlightEndTag: string;
  snippetThreshold: number;
  numTypos: number[];
  minLen1typo: number;
  minLen2typo: number;
  splitJoinTokens: OperationMode[];
  exhaustiveSearch: boolean;
  dropTokensThreshold: number;
  typoTokensThreshold: number;
  pinnedHits: string[];
  hiddenHits: string[];
  limitHits: number;
  preSegmentedQuery: boolean;
  enableOverrides: boolean;
  prioritizeExactMatch: boolean;
  prioritizeTokenPosition: boolean;
  searchCutoffMs: number;
  useCache: boolean;
  maxCandidates: number;
  infix: OperationMode[];
  preset: string;
  textMatchType: string;
  vectorQuery: string;
  xTypesenseApiKey: string;
  xTypesenseUserId: string;
  offset: number;
  limit: number;
}

export interface SaveOrderRequest {
  orders: Order[];
}

export interface Order {
  id: string;
  merchantId: string;
  orderId: string;
  orderNumber: string;
  dmOrderId: string;
  dmOrderStatus: string;
  paymentStatus: string;
  productId: string;
  productName: string;
  orderStatus: string;
  customerId: string;
  paymentId: string;
  salePrice: number;
  grantTotal: number;
  payoutAmount: number;
  productNameAr: string;
  customerName: string;
  name: string;
  trackingNumber: string;
  variantId: string;
  createdAt: number;
}

export interface SaveOrderResponse {
  message: string;
}

function createBaseTitle(): Title {
  return { arName: '', enName: '' };
}

export const Title = {
  encode(message: Title, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.arName !== '') {
      writer.uint32(10).string(message.arName);
    }
    if (message.enName !== '') {
      writer.uint32(18).string(message.enName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Title {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTitle();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.arName = reader.string();
          break;
        case 2:
          message.enName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Title {
    return {
      arName: isSet(object.arName) ? String(object.arName) : '',
      enName: isSet(object.enName) ? String(object.enName) : '',
    };
  },

  toJSON(message: Title): unknown {
    const obj: any = {};
    message.arName !== undefined && (obj.arName = message.arName);
    message.enName !== undefined && (obj.enName = message.enName);
    return obj;
  },

  create<I extends Exact<DeepPartial<Title>, I>>(base?: I): Title {
    return Title.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Title>, I>>(object: I): Title {
    const message = createBaseTitle();
    message.arName = object.arName ?? '';
    message.enName = object.enName ?? '';
    return message;
  },
};

function createBaseValue(): Value {
  return { arName: '', enName: '' };
}

export const Value = {
  encode(message: Value, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.arName !== '') {
      writer.uint32(10).string(message.arName);
    }
    if (message.enName !== '') {
      writer.uint32(18).string(message.enName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Value {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.arName = reader.string();
          break;
        case 2:
          message.enName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Value {
    return {
      arName: isSet(object.arName) ? String(object.arName) : '',
      enName: isSet(object.enName) ? String(object.enName) : '',
    };
  },

  toJSON(message: Value): unknown {
    const obj: any = {};
    message.arName !== undefined && (obj.arName = message.arName);
    message.enName !== undefined && (obj.enName = message.enName);
    return obj;
  },

  create<I extends Exact<DeepPartial<Value>, I>>(base?: I): Value {
    return Value.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Value>, I>>(object: I): Value {
    const message = createBaseValue();
    message.arName = object.arName ?? '';
    message.enName = object.enName ?? '';
    return message;
  },
};

function createBaseAttribute(): Attribute {
  return { title: undefined, value: undefined };
}

export const Attribute = {
  encode(
    message: Attribute,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.title !== undefined) {
      Title.encode(message.title, writer.uint32(10).fork()).ldelim();
    }
    if (message.value !== undefined) {
      Value.encode(message.value, writer.uint32(18).fork()).ldelim();
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
          message.title = Title.decode(reader, reader.uint32());
          break;
        case 2:
          message.value = Value.decode(reader, reader.uint32());
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
      title: isSet(object.title) ? Title.fromJSON(object.title) : undefined,
      value: isSet(object.value) ? Value.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: Attribute): unknown {
    const obj: any = {};
    message.title !== undefined &&
      (obj.title = message.title ? Title.toJSON(message.title) : undefined);
    message.value !== undefined &&
      (obj.value = message.value ? Value.toJSON(message.value) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<Attribute>, I>>(base?: I): Attribute {
    return Attribute.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Attribute>, I>>(
    object: I
  ): Attribute {
    const message = createBaseAttribute();
    message.title =
      object.title !== undefined && object.title !== null
        ? Title.fromPartial(object.title)
        : undefined;
    message.value =
      object.value !== undefined && object.value !== null
        ? Value.fromPartial(object.value)
        : undefined;
    return message;
  },
};

function createBaseSearchResultsResponse(): SearchResultsResponse {
  return {
    hits: [],
    found: 0,
    foundDocs: 0,
    outOf: 0,
    page: 0,
    groupedHits: [],
  };
}

export const SearchResultsResponse = {
  encode(
    message: SearchResultsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.hits) {
      SearchResultsResponse_Product.encode(
        v!,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.found !== 0) {
      writer.uint32(16).int32(message.found);
    }
    if (message.foundDocs !== 0) {
      writer.uint32(24).int32(message.foundDocs);
    }
    if (message.outOf !== 0) {
      writer.uint32(32).int32(message.outOf);
    }
    if (message.page !== 0) {
      writer.uint32(40).int32(message.page);
    }
    for (const v of message.groupedHits) {
      GroupedHits.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SearchResultsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchResultsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.hits.push(
            SearchResultsResponse_Product.decode(reader, reader.uint32())
          );
          break;
        case 2:
          message.found = reader.int32();
          break;
        case 3:
          message.foundDocs = reader.int32();
          break;
        case 4:
          message.outOf = reader.int32();
          break;
        case 5:
          message.page = reader.int32();
          break;
        case 6:
          message.groupedHits.push(GroupedHits.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SearchResultsResponse {
    return {
      hits: Array.isArray(object?.hits)
        ? object.hits.map((e: any) => SearchResultsResponse_Product.fromJSON(e))
        : [],
      found: isSet(object.found) ? Number(object.found) : 0,
      foundDocs: isSet(object.foundDocs) ? Number(object.foundDocs) : 0,
      outOf: isSet(object.outOf) ? Number(object.outOf) : 0,
      page: isSet(object.page) ? Number(object.page) : 0,
      groupedHits: Array.isArray(object?.groupedHits)
        ? object.groupedHits.map((e: any) => GroupedHits.fromJSON(e))
        : [],
    };
  },

  toJSON(message: SearchResultsResponse): unknown {
    const obj: any = {};
    if (message.hits) {
      obj.hits = message.hits.map(e =>
        e ? SearchResultsResponse_Product.toJSON(e) : undefined
      );
    } else {
      obj.hits = [];
    }
    message.found !== undefined && (obj.found = Math.round(message.found));
    message.foundDocs !== undefined &&
      (obj.foundDocs = Math.round(message.foundDocs));
    message.outOf !== undefined && (obj.outOf = Math.round(message.outOf));
    message.page !== undefined && (obj.page = Math.round(message.page));
    if (message.groupedHits) {
      obj.groupedHits = message.groupedHits.map(e =>
        e ? GroupedHits.toJSON(e) : undefined
      );
    } else {
      obj.groupedHits = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SearchResultsResponse>, I>>(
    base?: I
  ): SearchResultsResponse {
    return SearchResultsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SearchResultsResponse>, I>>(
    object: I
  ): SearchResultsResponse {
    const message = createBaseSearchResultsResponse();
    message.hits =
      object.hits?.map(e => SearchResultsResponse_Product.fromPartial(e)) || [];
    message.found = object.found ?? 0;
    message.foundDocs = object.foundDocs ?? 0;
    message.outOf = object.outOf ?? 0;
    message.page = object.page ?? 0;
    message.groupedHits =
      object.groupedHits?.map(e => GroupedHits.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSearchResultsResponse_Product(): SearchResultsResponse_Product {
  return {
    arGrade: '',
    arModelName: '',
    arVariantName: '',
    attributes: [],
    brandId: '',
    brandPosition: 0,
    categoryId: '',
    categoryPosition: 0,
    completionRate: 0,
    createdDate: '',
    grade: '',
    id: '',
    isGreatDeal: false,
    isMerchant: false,
    keywordsAr: '',
    keywordsEn: '',
    modelId: '',
    modelName: '',
    modelImage: '',
    modelPosition: 0,
    originalPrice: 0,
    priceRange: '',
    productId: '',
    productImage: '',
    productImages: [],
    sellPrice: 0,
    sellerId: '',
    sortScore: 0,
    tags: '',
    variantName: '',
  };
}

export const SearchResultsResponse_Product = {
  encode(
    message: SearchResultsResponse_Product,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.arGrade !== '') {
      writer.uint32(10).string(message.arGrade);
    }
    if (message.arModelName !== '') {
      writer.uint32(18).string(message.arModelName);
    }
    if (message.arVariantName !== '') {
      writer.uint32(26).string(message.arVariantName);
    }
    for (const v of message.attributes) {
      Attribute.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.brandId !== '') {
      writer.uint32(42).string(message.brandId);
    }
    if (message.brandPosition !== 0) {
      writer.uint32(48).int32(message.brandPosition);
    }
    if (message.categoryId !== '') {
      writer.uint32(58).string(message.categoryId);
    }
    if (message.categoryPosition !== 0) {
      writer.uint32(64).int32(message.categoryPosition);
    }
    if (message.completionRate !== 0) {
      writer.uint32(77).float(message.completionRate);
    }
    if (message.createdDate !== '') {
      writer.uint32(82).string(message.createdDate);
    }
    if (message.grade !== '') {
      writer.uint32(90).string(message.grade);
    }
    if (message.id !== '') {
      writer.uint32(98).string(message.id);
    }
    if (message.isGreatDeal === true) {
      writer.uint32(104).bool(message.isGreatDeal);
    }
    if (message.isMerchant === true) {
      writer.uint32(112).bool(message.isMerchant);
    }
    if (message.keywordsAr !== '') {
      writer.uint32(122).string(message.keywordsAr);
    }
    if (message.keywordsEn !== '') {
      writer.uint32(130).string(message.keywordsEn);
    }
    if (message.modelId !== '') {
      writer.uint32(138).string(message.modelId);
    }
    if (message.modelName !== '') {
      writer.uint32(146).string(message.modelName);
    }
    if (message.modelImage !== '') {
      writer.uint32(154).string(message.modelImage);
    }
    if (message.modelPosition !== 0) {
      writer.uint32(160).int32(message.modelPosition);
    }
    if (message.originalPrice !== 0) {
      writer.uint32(168).int32(message.originalPrice);
    }
    if (message.priceRange !== '') {
      writer.uint32(178).string(message.priceRange);
    }
    if (message.productId !== '') {
      writer.uint32(186).string(message.productId);
    }
    if (message.productImage !== '') {
      writer.uint32(194).string(message.productImage);
    }
    for (const v of message.productImages) {
      writer.uint32(202).string(v!);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(208).int32(message.sellPrice);
    }
    if (message.sellerId !== '') {
      writer.uint32(218).string(message.sellerId);
    }
    if (message.sortScore !== 0) {
      writer.uint32(224).int32(message.sortScore);
    }
    if (message.tags !== '') {
      writer.uint32(234).string(message.tags);
    }
    if (message.variantName !== '') {
      writer.uint32(242).string(message.variantName);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SearchResultsResponse_Product {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchResultsResponse_Product();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.arGrade = reader.string();
          break;
        case 2:
          message.arModelName = reader.string();
          break;
        case 3:
          message.arVariantName = reader.string();
          break;
        case 4:
          message.attributes.push(Attribute.decode(reader, reader.uint32()));
          break;
        case 5:
          message.brandId = reader.string();
          break;
        case 6:
          message.brandPosition = reader.int32();
          break;
        case 7:
          message.categoryId = reader.string();
          break;
        case 8:
          message.categoryPosition = reader.int32();
          break;
        case 9:
          message.completionRate = reader.float();
          break;
        case 10:
          message.createdDate = reader.string();
          break;
        case 11:
          message.grade = reader.string();
          break;
        case 12:
          message.id = reader.string();
          break;
        case 13:
          message.isGreatDeal = reader.bool();
          break;
        case 14:
          message.isMerchant = reader.bool();
          break;
        case 15:
          message.keywordsAr = reader.string();
          break;
        case 16:
          message.keywordsEn = reader.string();
          break;
        case 17:
          message.modelId = reader.string();
          break;
        case 18:
          message.modelName = reader.string();
          break;
        case 19:
          message.modelImage = reader.string();
          break;
        case 20:
          message.modelPosition = reader.int32();
          break;
        case 21:
          message.originalPrice = reader.int32();
          break;
        case 22:
          message.priceRange = reader.string();
          break;
        case 23:
          message.productId = reader.string();
          break;
        case 24:
          message.productImage = reader.string();
          break;
        case 25:
          message.productImages.push(reader.string());
          break;
        case 26:
          message.sellPrice = reader.int32();
          break;
        case 27:
          message.sellerId = reader.string();
          break;
        case 28:
          message.sortScore = reader.int32();
          break;
        case 29:
          message.tags = reader.string();
          break;
        case 30:
          message.variantName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SearchResultsResponse_Product {
    return {
      arGrade: isSet(object.arGrade) ? String(object.arGrade) : '',
      arModelName: isSet(object.arModelName) ? String(object.arModelName) : '',
      arVariantName: isSet(object.arVariantName)
        ? String(object.arVariantName)
        : '',
      attributes: Array.isArray(object?.attributes)
        ? object.attributes.map((e: any) => Attribute.fromJSON(e))
        : [],
      brandId: isSet(object.brandId) ? String(object.brandId) : '',
      brandPosition: isSet(object.brandPosition)
        ? Number(object.brandPosition)
        : 0,
      categoryId: isSet(object.categoryId) ? String(object.categoryId) : '',
      categoryPosition: isSet(object.categoryPosition)
        ? Number(object.categoryPosition)
        : 0,
      completionRate: isSet(object.completionRate)
        ? Number(object.completionRate)
        : 0,
      createdDate: isSet(object.createdDate) ? String(object.createdDate) : '',
      grade: isSet(object.grade) ? String(object.grade) : '',
      id: isSet(object.id) ? String(object.id) : '',
      isGreatDeal: isSet(object.isGreatDeal)
        ? Boolean(object.isGreatDeal)
        : false,
      isMerchant: isSet(object.isMerchant) ? Boolean(object.isMerchant) : false,
      keywordsAr: isSet(object.keywordsAr) ? String(object.keywordsAr) : '',
      keywordsEn: isSet(object.keywordsEn) ? String(object.keywordsEn) : '',
      modelId: isSet(object.modelId) ? String(object.modelId) : '',
      modelName: isSet(object.modelName) ? String(object.modelName) : '',
      modelImage: isSet(object.modelImage) ? String(object.modelImage) : '',
      modelPosition: isSet(object.modelPosition)
        ? Number(object.modelPosition)
        : 0,
      originalPrice: isSet(object.originalPrice)
        ? Number(object.originalPrice)
        : 0,
      priceRange: isSet(object.priceRange) ? String(object.priceRange) : '',
      productId: isSet(object.productId) ? String(object.productId) : '',
      productImage: isSet(object.productImage)
        ? String(object.productImage)
        : '',
      productImages: Array.isArray(object?.productImages)
        ? object.productImages.map((e: any) => String(e))
        : [],
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
      sellerId: isSet(object.sellerId) ? String(object.sellerId) : '',
      sortScore: isSet(object.sortScore) ? Number(object.sortScore) : 0,
      tags: isSet(object.tags) ? String(object.tags) : '',
      variantName: isSet(object.variantName) ? String(object.variantName) : '',
    };
  },

  toJSON(message: SearchResultsResponse_Product): unknown {
    const obj: any = {};
    message.arGrade !== undefined && (obj.arGrade = message.arGrade);
    message.arModelName !== undefined &&
      (obj.arModelName = message.arModelName);
    message.arVariantName !== undefined &&
      (obj.arVariantName = message.arVariantName);
    if (message.attributes) {
      obj.attributes = message.attributes.map(e =>
        e ? Attribute.toJSON(e) : undefined
      );
    } else {
      obj.attributes = [];
    }
    message.brandId !== undefined && (obj.brandId = message.brandId);
    message.brandPosition !== undefined &&
      (obj.brandPosition = Math.round(message.brandPosition));
    message.categoryId !== undefined && (obj.categoryId = message.categoryId);
    message.categoryPosition !== undefined &&
      (obj.categoryPosition = Math.round(message.categoryPosition));
    message.completionRate !== undefined &&
      (obj.completionRate = message.completionRate);
    message.createdDate !== undefined &&
      (obj.createdDate = message.createdDate);
    message.grade !== undefined && (obj.grade = message.grade);
    message.id !== undefined && (obj.id = message.id);
    message.isGreatDeal !== undefined &&
      (obj.isGreatDeal = message.isGreatDeal);
    message.isMerchant !== undefined && (obj.isMerchant = message.isMerchant);
    message.keywordsAr !== undefined && (obj.keywordsAr = message.keywordsAr);
    message.keywordsEn !== undefined && (obj.keywordsEn = message.keywordsEn);
    message.modelId !== undefined && (obj.modelId = message.modelId);
    message.modelName !== undefined && (obj.modelName = message.modelName);
    message.modelImage !== undefined && (obj.modelImage = message.modelImage);
    message.modelPosition !== undefined &&
      (obj.modelPosition = Math.round(message.modelPosition));
    message.originalPrice !== undefined &&
      (obj.originalPrice = Math.round(message.originalPrice));
    message.priceRange !== undefined && (obj.priceRange = message.priceRange);
    message.productId !== undefined && (obj.productId = message.productId);
    message.productImage !== undefined &&
      (obj.productImage = message.productImage);
    if (message.productImages) {
      obj.productImages = message.productImages.map(e => e);
    } else {
      obj.productImages = [];
    }
    message.sellPrice !== undefined &&
      (obj.sellPrice = Math.round(message.sellPrice));
    message.sellerId !== undefined && (obj.sellerId = message.sellerId);
    message.sortScore !== undefined &&
      (obj.sortScore = Math.round(message.sortScore));
    message.tags !== undefined && (obj.tags = message.tags);
    message.variantName !== undefined &&
      (obj.variantName = message.variantName);
    return obj;
  },

  create<I extends Exact<DeepPartial<SearchResultsResponse_Product>, I>>(
    base?: I
  ): SearchResultsResponse_Product {
    return SearchResultsResponse_Product.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SearchResultsResponse_Product>, I>>(
    object: I
  ): SearchResultsResponse_Product {
    const message = createBaseSearchResultsResponse_Product();
    message.arGrade = object.arGrade ?? '';
    message.arModelName = object.arModelName ?? '';
    message.arVariantName = object.arVariantName ?? '';
    message.attributes =
      object.attributes?.map(e => Attribute.fromPartial(e)) || [];
    message.brandId = object.brandId ?? '';
    message.brandPosition = object.brandPosition ?? 0;
    message.categoryId = object.categoryId ?? '';
    message.categoryPosition = object.categoryPosition ?? 0;
    message.completionRate = object.completionRate ?? 0;
    message.createdDate = object.createdDate ?? '';
    message.grade = object.grade ?? '';
    message.id = object.id ?? '';
    message.isGreatDeal = object.isGreatDeal ?? false;
    message.isMerchant = object.isMerchant ?? false;
    message.keywordsAr = object.keywordsAr ?? '';
    message.keywordsEn = object.keywordsEn ?? '';
    message.modelId = object.modelId ?? '';
    message.modelName = object.modelName ?? '';
    message.modelImage = object.modelImage ?? '';
    message.modelPosition = object.modelPosition ?? 0;
    message.originalPrice = object.originalPrice ?? 0;
    message.priceRange = object.priceRange ?? '';
    message.productId = object.productId ?? '';
    message.productImage = object.productImage ?? '';
    message.productImages = object.productImages?.map(e => e) || [];
    message.sellPrice = object.sellPrice ?? 0;
    message.sellerId = object.sellerId ?? '';
    message.sortScore = object.sortScore ?? 0;
    message.tags = object.tags ?? '';
    message.variantName = object.variantName ?? '';
    return message;
  },
};

function createBaseGroupedHits(): GroupedHits {
  return { groupKey: [], found: 0 };
}

export const GroupedHits = {
  encode(
    message: GroupedHits,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.groupKey) {
      writer.uint32(10).string(v!);
    }
    if (message.found !== 0) {
      writer.uint32(16).int32(message.found);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GroupedHits {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroupedHits();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.groupKey.push(reader.string());
          break;
        case 2:
          message.found = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GroupedHits {
    return {
      groupKey: Array.isArray(object?.groupKey)
        ? object.groupKey.map((e: any) => String(e))
        : [],
      found: isSet(object.found) ? Number(object.found) : 0,
    };
  },

  toJSON(message: GroupedHits): unknown {
    const obj: any = {};
    if (message.groupKey) {
      obj.groupKey = message.groupKey.map(e => e);
    } else {
      obj.groupKey = [];
    }
    message.found !== undefined && (obj.found = Math.round(message.found));
    return obj;
  },

  create<I extends Exact<DeepPartial<GroupedHits>, I>>(base?: I): GroupedHits {
    return GroupedHits.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GroupedHits>, I>>(
    object: I
  ): GroupedHits {
    const message = createBaseGroupedHits();
    message.groupKey = object.groupKey?.map(e => e) || [];
    message.found = object.found ?? 0;
    return message;
  },
};

function createBaseSearchRequest(): SearchRequest {
  return { filters: undefined };
}

export const SearchRequest = {
  encode(
    message: SearchRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.filters !== undefined) {
      SearchFiltersRequest.encode(
        message.filters,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SearchRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.filters = SearchFiltersRequest.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SearchRequest {
    return {
      filters: isSet(object.filters)
        ? SearchFiltersRequest.fromJSON(object.filters)
        : undefined,
    };
  },

  toJSON(message: SearchRequest): unknown {
    const obj: any = {};
    message.filters !== undefined &&
      (obj.filters = message.filters
        ? SearchFiltersRequest.toJSON(message.filters)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<SearchRequest>, I>>(
    base?: I
  ): SearchRequest {
    return SearchRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SearchRequest>, I>>(
    object: I
  ): SearchRequest {
    const message = createBaseSearchRequest();
    message.filters =
      object.filters !== undefined && object.filters !== null
        ? SearchFiltersRequest.fromPartial(object.filters)
        : undefined;
    return message;
  },
};

function createBaseSearchFiltersRequest(): SearchFiltersRequest {
  return {
    q: '',
    queryBy: [],
    queryByWeights: [],
    prefix: [],
    filterBy: '',
    sortBy: [],
    facetBy: [],
    maxFacetValues: 0,
    facetQuery: '',
    facetQueryNumTypos: 0,
    page: 0,
    perPage: 0,
    groupBy: [],
    groupLimit: 0,
    includeFields: [],
    excludeFields: [],
    highlightFields: [],
    highlightFullFields: [],
    highlightAffixNumTokens: 0,
    highlightStartTag: '',
    highlightEndTag: '',
    snippetThreshold: 0,
    numTypos: [],
    minLen1typo: 0,
    minLen2typo: 0,
    splitJoinTokens: [],
    exhaustiveSearch: false,
    dropTokensThreshold: 0,
    typoTokensThreshold: 0,
    pinnedHits: [],
    hiddenHits: [],
    limitHits: 0,
    preSegmentedQuery: false,
    enableOverrides: false,
    prioritizeExactMatch: false,
    prioritizeTokenPosition: false,
    searchCutoffMs: 0,
    useCache: false,
    maxCandidates: 0,
    infix: [],
    preset: '',
    textMatchType: '',
    vectorQuery: '',
    xTypesenseApiKey: '',
    xTypesenseUserId: '',
    offset: 0,
    limit: 0,
  };
}

export const SearchFiltersRequest = {
  encode(
    message: SearchFiltersRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.q !== '') {
      writer.uint32(10).string(message.q);
    }
    for (const v of message.queryBy) {
      writer.uint32(18).string(v!);
    }
    for (const v of message.queryByWeights) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.prefix) {
      writer.uint32(34).string(v!);
    }
    if (message.filterBy !== '') {
      writer.uint32(42).string(message.filterBy);
    }
    for (const v of message.sortBy) {
      writer.uint32(50).string(v!);
    }
    for (const v of message.facetBy) {
      writer.uint32(58).string(v!);
    }
    if (message.maxFacetValues !== 0) {
      writer.uint32(64).int32(message.maxFacetValues);
    }
    if (message.facetQuery !== '') {
      writer.uint32(74).string(message.facetQuery);
    }
    if (message.facetQueryNumTypos !== 0) {
      writer.uint32(80).int32(message.facetQueryNumTypos);
    }
    if (message.page !== 0) {
      writer.uint32(88).int32(message.page);
    }
    if (message.perPage !== 0) {
      writer.uint32(96).int32(message.perPage);
    }
    for (const v of message.groupBy) {
      writer.uint32(106).string(v!);
    }
    if (message.groupLimit !== 0) {
      writer.uint32(112).int32(message.groupLimit);
    }
    for (const v of message.includeFields) {
      writer.uint32(122).string(v!);
    }
    for (const v of message.excludeFields) {
      writer.uint32(130).string(v!);
    }
    for (const v of message.highlightFields) {
      writer.uint32(138).string(v!);
    }
    for (const v of message.highlightFullFields) {
      writer.uint32(146).string(v!);
    }
    if (message.highlightAffixNumTokens !== 0) {
      writer.uint32(152).int32(message.highlightAffixNumTokens);
    }
    if (message.highlightStartTag !== '') {
      writer.uint32(162).string(message.highlightStartTag);
    }
    if (message.highlightEndTag !== '') {
      writer.uint32(170).string(message.highlightEndTag);
    }
    if (message.snippetThreshold !== 0) {
      writer.uint32(176).int32(message.snippetThreshold);
    }
    writer.uint32(186).fork();
    for (const v of message.numTypos) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.minLen1typo !== 0) {
      writer.uint32(192).int32(message.minLen1typo);
    }
    if (message.minLen2typo !== 0) {
      writer.uint32(200).int32(message.minLen2typo);
    }
    writer.uint32(210).fork();
    for (const v of message.splitJoinTokens) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.exhaustiveSearch === true) {
      writer.uint32(216).bool(message.exhaustiveSearch);
    }
    if (message.dropTokensThreshold !== 0) {
      writer.uint32(224).int32(message.dropTokensThreshold);
    }
    if (message.typoTokensThreshold !== 0) {
      writer.uint32(232).int32(message.typoTokensThreshold);
    }
    for (const v of message.pinnedHits) {
      writer.uint32(242).string(v!);
    }
    for (const v of message.hiddenHits) {
      writer.uint32(250).string(v!);
    }
    if (message.limitHits !== 0) {
      writer.uint32(256).int32(message.limitHits);
    }
    if (message.preSegmentedQuery === true) {
      writer.uint32(264).bool(message.preSegmentedQuery);
    }
    if (message.enableOverrides === true) {
      writer.uint32(272).bool(message.enableOverrides);
    }
    if (message.prioritizeExactMatch === true) {
      writer.uint32(280).bool(message.prioritizeExactMatch);
    }
    if (message.prioritizeTokenPosition === true) {
      writer.uint32(288).bool(message.prioritizeTokenPosition);
    }
    if (message.searchCutoffMs !== 0) {
      writer.uint32(296).int32(message.searchCutoffMs);
    }
    if (message.useCache === true) {
      writer.uint32(304).bool(message.useCache);
    }
    if (message.maxCandidates !== 0) {
      writer.uint32(312).int32(message.maxCandidates);
    }
    writer.uint32(322).fork();
    for (const v of message.infix) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.preset !== '') {
      writer.uint32(330).string(message.preset);
    }
    if (message.textMatchType !== '') {
      writer.uint32(338).string(message.textMatchType);
    }
    if (message.vectorQuery !== '') {
      writer.uint32(346).string(message.vectorQuery);
    }
    if (message.xTypesenseApiKey !== '') {
      writer.uint32(354).string(message.xTypesenseApiKey);
    }
    if (message.xTypesenseUserId !== '') {
      writer.uint32(362).string(message.xTypesenseUserId);
    }
    if (message.offset !== 0) {
      writer.uint32(368).int32(message.offset);
    }
    if (message.limit !== 0) {
      writer.uint32(376).int32(message.limit);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): SearchFiltersRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchFiltersRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.q = reader.string();
          break;
        case 2:
          message.queryBy.push(reader.string());
          break;
        case 3:
          message.queryByWeights.push(reader.string());
          break;
        case 4:
          message.prefix.push(reader.string());
          break;
        case 5:
          message.filterBy = reader.string();
          break;
        case 6:
          message.sortBy.push(reader.string());
          break;
        case 7:
          message.facetBy.push(reader.string());
          break;
        case 8:
          message.maxFacetValues = reader.int32();
          break;
        case 9:
          message.facetQuery = reader.string();
          break;
        case 10:
          message.facetQueryNumTypos = reader.int32();
          break;
        case 11:
          message.page = reader.int32();
          break;
        case 12:
          message.perPage = reader.int32();
          break;
        case 13:
          message.groupBy.push(reader.string());
          break;
        case 14:
          message.groupLimit = reader.int32();
          break;
        case 15:
          message.includeFields.push(reader.string());
          break;
        case 16:
          message.excludeFields.push(reader.string());
          break;
        case 17:
          message.highlightFields.push(reader.string());
          break;
        case 18:
          message.highlightFullFields.push(reader.string());
          break;
        case 19:
          message.highlightAffixNumTokens = reader.int32();
          break;
        case 20:
          message.highlightStartTag = reader.string();
          break;
        case 21:
          message.highlightEndTag = reader.string();
          break;
        case 22:
          message.snippetThreshold = reader.int32();
          break;
        case 23:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.numTypos.push(reader.int32());
            }
          } else {
            message.numTypos.push(reader.int32());
          }
          break;
        case 24:
          message.minLen1typo = reader.int32();
          break;
        case 25:
          message.minLen2typo = reader.int32();
          break;
        case 26:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.splitJoinTokens.push(reader.int32() as any);
            }
          } else {
            message.splitJoinTokens.push(reader.int32() as any);
          }
          break;
        case 27:
          message.exhaustiveSearch = reader.bool();
          break;
        case 28:
          message.dropTokensThreshold = reader.int32();
          break;
        case 29:
          message.typoTokensThreshold = reader.int32();
          break;
        case 30:
          message.pinnedHits.push(reader.string());
          break;
        case 31:
          message.hiddenHits.push(reader.string());
          break;
        case 32:
          message.limitHits = reader.int32();
          break;
        case 33:
          message.preSegmentedQuery = reader.bool();
          break;
        case 34:
          message.enableOverrides = reader.bool();
          break;
        case 35:
          message.prioritizeExactMatch = reader.bool();
          break;
        case 36:
          message.prioritizeTokenPosition = reader.bool();
          break;
        case 37:
          message.searchCutoffMs = reader.int32();
          break;
        case 38:
          message.useCache = reader.bool();
          break;
        case 39:
          message.maxCandidates = reader.int32();
          break;
        case 40:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.infix.push(reader.int32() as any);
            }
          } else {
            message.infix.push(reader.int32() as any);
          }
          break;
        case 41:
          message.preset = reader.string();
          break;
        case 42:
          message.textMatchType = reader.string();
          break;
        case 43:
          message.vectorQuery = reader.string();
          break;
        case 44:
          message.xTypesenseApiKey = reader.string();
          break;
        case 45:
          message.xTypesenseUserId = reader.string();
          break;
        case 46:
          message.offset = reader.int32();
          break;
        case 47:
          message.limit = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SearchFiltersRequest {
    return {
      q: isSet(object.q) ? String(object.q) : '',
      queryBy: Array.isArray(object?.queryBy)
        ? object.queryBy.map((e: any) => String(e))
        : [],
      queryByWeights: Array.isArray(object?.queryByWeights)
        ? object.queryByWeights.map((e: any) => String(e))
        : [],
      prefix: Array.isArray(object?.prefix)
        ? object.prefix.map((e: any) => String(e))
        : [],
      filterBy: isSet(object.filterBy) ? String(object.filterBy) : '',
      sortBy: Array.isArray(object?.sortBy)
        ? object.sortBy.map((e: any) => String(e))
        : [],
      facetBy: Array.isArray(object?.facetBy)
        ? object.facetBy.map((e: any) => String(e))
        : [],
      maxFacetValues: isSet(object.maxFacetValues)
        ? Number(object.maxFacetValues)
        : 0,
      facetQuery: isSet(object.facetQuery) ? String(object.facetQuery) : '',
      facetQueryNumTypos: isSet(object.facetQueryNumTypos)
        ? Number(object.facetQueryNumTypos)
        : 0,
      page: isSet(object.page) ? Number(object.page) : 0,
      perPage: isSet(object.perPage) ? Number(object.perPage) : 0,
      groupBy: Array.isArray(object?.groupBy)
        ? object.groupBy.map((e: any) => String(e))
        : [],
      groupLimit: isSet(object.groupLimit) ? Number(object.groupLimit) : 0,
      includeFields: Array.isArray(object?.includeFields)
        ? object.includeFields.map((e: any) => String(e))
        : [],
      excludeFields: Array.isArray(object?.excludeFields)
        ? object.excludeFields.map((e: any) => String(e))
        : [],
      highlightFields: Array.isArray(object?.highlightFields)
        ? object.highlightFields.map((e: any) => String(e))
        : [],
      highlightFullFields: Array.isArray(object?.highlightFullFields)
        ? object.highlightFullFields.map((e: any) => String(e))
        : [],
      highlightAffixNumTokens: isSet(object.highlightAffixNumTokens)
        ? Number(object.highlightAffixNumTokens)
        : 0,
      highlightStartTag: isSet(object.highlightStartTag)
        ? String(object.highlightStartTag)
        : '',
      highlightEndTag: isSet(object.highlightEndTag)
        ? String(object.highlightEndTag)
        : '',
      snippetThreshold: isSet(object.snippetThreshold)
        ? Number(object.snippetThreshold)
        : 0,
      numTypos: Array.isArray(object?.numTypos)
        ? object.numTypos.map((e: any) => Number(e))
        : [],
      minLen1typo: isSet(object.minLen1typo) ? Number(object.minLen1typo) : 0,
      minLen2typo: isSet(object.minLen2typo) ? Number(object.minLen2typo) : 0,
      splitJoinTokens: Array.isArray(object?.splitJoinTokens)
        ? object.splitJoinTokens.map((e: any) => operationModeFromJSON(e))
        : [],
      exhaustiveSearch: isSet(object.exhaustiveSearch)
        ? Boolean(object.exhaustiveSearch)
        : false,
      dropTokensThreshold: isSet(object.dropTokensThreshold)
        ? Number(object.dropTokensThreshold)
        : 0,
      typoTokensThreshold: isSet(object.typoTokensThreshold)
        ? Number(object.typoTokensThreshold)
        : 0,
      pinnedHits: Array.isArray(object?.pinnedHits)
        ? object.pinnedHits.map((e: any) => String(e))
        : [],
      hiddenHits: Array.isArray(object?.hiddenHits)
        ? object.hiddenHits.map((e: any) => String(e))
        : [],
      limitHits: isSet(object.limitHits) ? Number(object.limitHits) : 0,
      preSegmentedQuery: isSet(object.preSegmentedQuery)
        ? Boolean(object.preSegmentedQuery)
        : false,
      enableOverrides: isSet(object.enableOverrides)
        ? Boolean(object.enableOverrides)
        : false,
      prioritizeExactMatch: isSet(object.prioritizeExactMatch)
        ? Boolean(object.prioritizeExactMatch)
        : false,
      prioritizeTokenPosition: isSet(object.prioritizeTokenPosition)
        ? Boolean(object.prioritizeTokenPosition)
        : false,
      searchCutoffMs: isSet(object.searchCutoffMs)
        ? Number(object.searchCutoffMs)
        : 0,
      useCache: isSet(object.useCache) ? Boolean(object.useCache) : false,
      maxCandidates: isSet(object.maxCandidates)
        ? Number(object.maxCandidates)
        : 0,
      infix: Array.isArray(object?.infix)
        ? object.infix.map((e: any) => operationModeFromJSON(e))
        : [],
      preset: isSet(object.preset) ? String(object.preset) : '',
      textMatchType: isSet(object.textMatchType)
        ? String(object.textMatchType)
        : '',
      vectorQuery: isSet(object.vectorQuery) ? String(object.vectorQuery) : '',
      xTypesenseApiKey: isSet(object.xTypesenseApiKey)
        ? String(object.xTypesenseApiKey)
        : '',
      xTypesenseUserId: isSet(object.xTypesenseUserId)
        ? String(object.xTypesenseUserId)
        : '',
      offset: isSet(object.offset) ? Number(object.offset) : 0,
      limit: isSet(object.limit) ? Number(object.limit) : 0,
    };
  },

  toJSON(message: SearchFiltersRequest): unknown {
    const obj: any = {};
    message.q !== undefined && (obj.q = message.q);
    if (message.queryBy) {
      obj.queryBy = message.queryBy.map(e => e);
    } else {
      obj.queryBy = [];
    }
    if (message.queryByWeights) {
      obj.queryByWeights = message.queryByWeights.map(e => e);
    } else {
      obj.queryByWeights = [];
    }
    if (message.prefix) {
      obj.prefix = message.prefix.map(e => e);
    } else {
      obj.prefix = [];
    }
    message.filterBy !== undefined && (obj.filterBy = message.filterBy);
    if (message.sortBy) {
      obj.sortBy = message.sortBy.map(e => e);
    } else {
      obj.sortBy = [];
    }
    if (message.facetBy) {
      obj.facetBy = message.facetBy.map(e => e);
    } else {
      obj.facetBy = [];
    }
    message.maxFacetValues !== undefined &&
      (obj.maxFacetValues = Math.round(message.maxFacetValues));
    message.facetQuery !== undefined && (obj.facetQuery = message.facetQuery);
    message.facetQueryNumTypos !== undefined &&
      (obj.facetQueryNumTypos = Math.round(message.facetQueryNumTypos));
    message.page !== undefined && (obj.page = Math.round(message.page));
    message.perPage !== undefined &&
      (obj.perPage = Math.round(message.perPage));
    if (message.groupBy) {
      obj.groupBy = message.groupBy.map(e => e);
    } else {
      obj.groupBy = [];
    }
    message.groupLimit !== undefined &&
      (obj.groupLimit = Math.round(message.groupLimit));
    if (message.includeFields) {
      obj.includeFields = message.includeFields.map(e => e);
    } else {
      obj.includeFields = [];
    }
    if (message.excludeFields) {
      obj.excludeFields = message.excludeFields.map(e => e);
    } else {
      obj.excludeFields = [];
    }
    if (message.highlightFields) {
      obj.highlightFields = message.highlightFields.map(e => e);
    } else {
      obj.highlightFields = [];
    }
    if (message.highlightFullFields) {
      obj.highlightFullFields = message.highlightFullFields.map(e => e);
    } else {
      obj.highlightFullFields = [];
    }
    message.highlightAffixNumTokens !== undefined &&
      (obj.highlightAffixNumTokens = Math.round(
        message.highlightAffixNumTokens
      ));
    message.highlightStartTag !== undefined &&
      (obj.highlightStartTag = message.highlightStartTag);
    message.highlightEndTag !== undefined &&
      (obj.highlightEndTag = message.highlightEndTag);
    message.snippetThreshold !== undefined &&
      (obj.snippetThreshold = Math.round(message.snippetThreshold));
    if (message.numTypos) {
      obj.numTypos = message.numTypos.map(e => Math.round(e));
    } else {
      obj.numTypos = [];
    }
    message.minLen1typo !== undefined &&
      (obj.minLen1typo = Math.round(message.minLen1typo));
    message.minLen2typo !== undefined &&
      (obj.minLen2typo = Math.round(message.minLen2typo));
    if (message.splitJoinTokens) {
      obj.splitJoinTokens = message.splitJoinTokens.map(e =>
        operationModeToJSON(e)
      );
    } else {
      obj.splitJoinTokens = [];
    }
    message.exhaustiveSearch !== undefined &&
      (obj.exhaustiveSearch = message.exhaustiveSearch);
    message.dropTokensThreshold !== undefined &&
      (obj.dropTokensThreshold = Math.round(message.dropTokensThreshold));
    message.typoTokensThreshold !== undefined &&
      (obj.typoTokensThreshold = Math.round(message.typoTokensThreshold));
    if (message.pinnedHits) {
      obj.pinnedHits = message.pinnedHits.map(e => e);
    } else {
      obj.pinnedHits = [];
    }
    if (message.hiddenHits) {
      obj.hiddenHits = message.hiddenHits.map(e => e);
    } else {
      obj.hiddenHits = [];
    }
    message.limitHits !== undefined &&
      (obj.limitHits = Math.round(message.limitHits));
    message.preSegmentedQuery !== undefined &&
      (obj.preSegmentedQuery = message.preSegmentedQuery);
    message.enableOverrides !== undefined &&
      (obj.enableOverrides = message.enableOverrides);
    message.prioritizeExactMatch !== undefined &&
      (obj.prioritizeExactMatch = message.prioritizeExactMatch);
    message.prioritizeTokenPosition !== undefined &&
      (obj.prioritizeTokenPosition = message.prioritizeTokenPosition);
    message.searchCutoffMs !== undefined &&
      (obj.searchCutoffMs = Math.round(message.searchCutoffMs));
    message.useCache !== undefined && (obj.useCache = message.useCache);
    message.maxCandidates !== undefined &&
      (obj.maxCandidates = Math.round(message.maxCandidates));
    if (message.infix) {
      obj.infix = message.infix.map(e => operationModeToJSON(e));
    } else {
      obj.infix = [];
    }
    message.preset !== undefined && (obj.preset = message.preset);
    message.textMatchType !== undefined &&
      (obj.textMatchType = message.textMatchType);
    message.vectorQuery !== undefined &&
      (obj.vectorQuery = message.vectorQuery);
    message.xTypesenseApiKey !== undefined &&
      (obj.xTypesenseApiKey = message.xTypesenseApiKey);
    message.xTypesenseUserId !== undefined &&
      (obj.xTypesenseUserId = message.xTypesenseUserId);
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    return obj;
  },

  create<I extends Exact<DeepPartial<SearchFiltersRequest>, I>>(
    base?: I
  ): SearchFiltersRequest {
    return SearchFiltersRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SearchFiltersRequest>, I>>(
    object: I
  ): SearchFiltersRequest {
    const message = createBaseSearchFiltersRequest();
    message.q = object.q ?? '';
    message.queryBy = object.queryBy?.map(e => e) || [];
    message.queryByWeights = object.queryByWeights?.map(e => e) || [];
    message.prefix = object.prefix?.map(e => e) || [];
    message.filterBy = object.filterBy ?? '';
    message.sortBy = object.sortBy?.map(e => e) || [];
    message.facetBy = object.facetBy?.map(e => e) || [];
    message.maxFacetValues = object.maxFacetValues ?? 0;
    message.facetQuery = object.facetQuery ?? '';
    message.facetQueryNumTypos = object.facetQueryNumTypos ?? 0;
    message.page = object.page ?? 0;
    message.perPage = object.perPage ?? 0;
    message.groupBy = object.groupBy?.map(e => e) || [];
    message.groupLimit = object.groupLimit ?? 0;
    message.includeFields = object.includeFields?.map(e => e) || [];
    message.excludeFields = object.excludeFields?.map(e => e) || [];
    message.highlightFields = object.highlightFields?.map(e => e) || [];
    message.highlightFullFields = object.highlightFullFields?.map(e => e) || [];
    message.highlightAffixNumTokens = object.highlightAffixNumTokens ?? 0;
    message.highlightStartTag = object.highlightStartTag ?? '';
    message.highlightEndTag = object.highlightEndTag ?? '';
    message.snippetThreshold = object.snippetThreshold ?? 0;
    message.numTypos = object.numTypos?.map(e => e) || [];
    message.minLen1typo = object.minLen1typo ?? 0;
    message.minLen2typo = object.minLen2typo ?? 0;
    message.splitJoinTokens = object.splitJoinTokens?.map(e => e) || [];
    message.exhaustiveSearch = object.exhaustiveSearch ?? false;
    message.dropTokensThreshold = object.dropTokensThreshold ?? 0;
    message.typoTokensThreshold = object.typoTokensThreshold ?? 0;
    message.pinnedHits = object.pinnedHits?.map(e => e) || [];
    message.hiddenHits = object.hiddenHits?.map(e => e) || [];
    message.limitHits = object.limitHits ?? 0;
    message.preSegmentedQuery = object.preSegmentedQuery ?? false;
    message.enableOverrides = object.enableOverrides ?? false;
    message.prioritizeExactMatch = object.prioritizeExactMatch ?? false;
    message.prioritizeTokenPosition = object.prioritizeTokenPosition ?? false;
    message.searchCutoffMs = object.searchCutoffMs ?? 0;
    message.useCache = object.useCache ?? false;
    message.maxCandidates = object.maxCandidates ?? 0;
    message.infix = object.infix?.map(e => e) || [];
    message.preset = object.preset ?? '';
    message.textMatchType = object.textMatchType ?? '';
    message.vectorQuery = object.vectorQuery ?? '';
    message.xTypesenseApiKey = object.xTypesenseApiKey ?? '';
    message.xTypesenseUserId = object.xTypesenseUserId ?? '';
    message.offset = object.offset ?? 0;
    message.limit = object.limit ?? 0;
    return message;
  },
};

function createBaseSaveOrderRequest(): SaveOrderRequest {
  return { orders: [] };
}

export const SaveOrderRequest = {
  encode(
    message: SaveOrderRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.orders) {
      Order.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SaveOrderRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSaveOrderRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orders.push(Order.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SaveOrderRequest {
    return {
      orders: Array.isArray(object?.orders)
        ? object.orders.map((e: any) => Order.fromJSON(e))
        : [],
    };
  },

  toJSON(message: SaveOrderRequest): unknown {
    const obj: any = {};
    if (message.orders) {
      obj.orders = message.orders.map(e => (e ? Order.toJSON(e) : undefined));
    } else {
      obj.orders = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SaveOrderRequest>, I>>(
    base?: I
  ): SaveOrderRequest {
    return SaveOrderRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SaveOrderRequest>, I>>(
    object: I
  ): SaveOrderRequest {
    const message = createBaseSaveOrderRequest();
    message.orders = object.orders?.map(e => Order.fromPartial(e)) || [];
    return message;
  },
};

function createBaseOrder(): Order {
  return {
    id: '',
    merchantId: '',
    orderId: '',
    orderNumber: '',
    dmOrderId: '',
    dmOrderStatus: '',
    paymentStatus: '',
    productId: '',
    productName: '',
    orderStatus: '',
    customerId: '',
    paymentId: '',
    salePrice: 0,
    grantTotal: 0,
    payoutAmount: 0,
    productNameAr: '',
    customerName: '',
    name: '',
    trackingNumber: '',
    variantId: '',
    createdAt: 0,
  };
}

export const Order = {
  encode(message: Order, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id);
    }
    if (message.merchantId !== '') {
      writer.uint32(18).string(message.merchantId);
    }
    if (message.orderId !== '') {
      writer.uint32(26).string(message.orderId);
    }
    if (message.orderNumber !== '') {
      writer.uint32(34).string(message.orderNumber);
    }
    if (message.dmOrderId !== '') {
      writer.uint32(42).string(message.dmOrderId);
    }
    if (message.dmOrderStatus !== '') {
      writer.uint32(50).string(message.dmOrderStatus);
    }
    if (message.paymentStatus !== '') {
      writer.uint32(58).string(message.paymentStatus);
    }
    if (message.productId !== '') {
      writer.uint32(66).string(message.productId);
    }
    if (message.productName !== '') {
      writer.uint32(74).string(message.productName);
    }
    if (message.orderStatus !== '') {
      writer.uint32(82).string(message.orderStatus);
    }
    if (message.customerId !== '') {
      writer.uint32(90).string(message.customerId);
    }
    if (message.paymentId !== '') {
      writer.uint32(98).string(message.paymentId);
    }
    if (message.salePrice !== 0) {
      writer.uint32(104).int32(message.salePrice);
    }
    if (message.grantTotal !== 0) {
      writer.uint32(112).int32(message.grantTotal);
    }
    if (message.payoutAmount !== 0) {
      writer.uint32(120).int32(message.payoutAmount);
    }
    if (message.productNameAr !== '') {
      writer.uint32(130).string(message.productNameAr);
    }
    if (message.customerName !== '') {
      writer.uint32(138).string(message.customerName);
    }
    if (message.name !== '') {
      writer.uint32(146).string(message.name);
    }
    if (message.trackingNumber !== '') {
      writer.uint32(154).string(message.trackingNumber);
    }
    if (message.variantId !== '') {
      writer.uint32(162).string(message.variantId);
    }
    if (message.createdAt !== 0) {
      writer.uint32(168).int32(message.createdAt);
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
        case 2:
          message.merchantId = reader.string();
          break;
        case 3:
          message.orderId = reader.string();
          break;
        case 4:
          message.orderNumber = reader.string();
          break;
        case 5:
          message.dmOrderId = reader.string();
          break;
        case 6:
          message.dmOrderStatus = reader.string();
          break;
        case 7:
          message.paymentStatus = reader.string();
          break;
        case 8:
          message.productId = reader.string();
          break;
        case 9:
          message.productName = reader.string();
          break;
        case 10:
          message.orderStatus = reader.string();
          break;
        case 11:
          message.customerId = reader.string();
          break;
        case 12:
          message.paymentId = reader.string();
          break;
        case 13:
          message.salePrice = reader.int32();
          break;
        case 14:
          message.grantTotal = reader.int32();
          break;
        case 15:
          message.payoutAmount = reader.int32();
          break;
        case 16:
          message.productNameAr = reader.string();
          break;
        case 17:
          message.customerName = reader.string();
          break;
        case 18:
          message.name = reader.string();
          break;
        case 19:
          message.trackingNumber = reader.string();
          break;
        case 20:
          message.variantId = reader.string();
          break;
        case 21:
          message.createdAt = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Order {
    return {
      id: isSet(object.id) ? String(object.id) : '',
      merchantId: isSet(object.merchantId) ? String(object.merchantId) : '',
      orderId: isSet(object.orderId) ? String(object.orderId) : '',
      orderNumber: isSet(object.orderNumber) ? String(object.orderNumber) : '',
      dmOrderId: isSet(object.dmOrderId) ? String(object.dmOrderId) : '',
      dmOrderStatus: isSet(object.dmOrderStatus)
        ? String(object.dmOrderStatus)
        : '',
      paymentStatus: isSet(object.paymentStatus)
        ? String(object.paymentStatus)
        : '',
      productId: isSet(object.productId) ? String(object.productId) : '',
      productName: isSet(object.productName) ? String(object.productName) : '',
      orderStatus: isSet(object.orderStatus) ? String(object.orderStatus) : '',
      customerId: isSet(object.customerId) ? String(object.customerId) : '',
      paymentId: isSet(object.paymentId) ? String(object.paymentId) : '',
      salePrice: isSet(object.salePrice) ? Number(object.salePrice) : 0,
      grantTotal: isSet(object.grantTotal) ? Number(object.grantTotal) : 0,
      payoutAmount: isSet(object.payoutAmount)
        ? Number(object.payoutAmount)
        : 0,
      productNameAr: isSet(object.productNameAr)
        ? String(object.productNameAr)
        : '',
      customerName: isSet(object.customerName)
        ? String(object.customerName)
        : '',
      name: isSet(object.name) ? String(object.name) : '',
      trackingNumber: isSet(object.trackingNumber)
        ? String(object.trackingNumber)
        : '',
      variantId: isSet(object.variantId) ? String(object.variantId) : '',
      createdAt: isSet(object.createdAt) ? Number(object.createdAt) : 0,
    };
  },

  toJSON(message: Order): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.merchantId !== undefined && (obj.merchantId = message.merchantId);
    message.orderId !== undefined && (obj.orderId = message.orderId);
    message.orderNumber !== undefined &&
      (obj.orderNumber = message.orderNumber);
    message.dmOrderId !== undefined && (obj.dmOrderId = message.dmOrderId);
    message.dmOrderStatus !== undefined &&
      (obj.dmOrderStatus = message.dmOrderStatus);
    message.paymentStatus !== undefined &&
      (obj.paymentStatus = message.paymentStatus);
    message.productId !== undefined && (obj.productId = message.productId);
    message.productName !== undefined &&
      (obj.productName = message.productName);
    message.orderStatus !== undefined &&
      (obj.orderStatus = message.orderStatus);
    message.customerId !== undefined && (obj.customerId = message.customerId);
    message.paymentId !== undefined && (obj.paymentId = message.paymentId);
    message.salePrice !== undefined &&
      (obj.salePrice = Math.round(message.salePrice));
    message.grantTotal !== undefined &&
      (obj.grantTotal = Math.round(message.grantTotal));
    message.payoutAmount !== undefined &&
      (obj.payoutAmount = Math.round(message.payoutAmount));
    message.productNameAr !== undefined &&
      (obj.productNameAr = message.productNameAr);
    message.customerName !== undefined &&
      (obj.customerName = message.customerName);
    message.name !== undefined && (obj.name = message.name);
    message.trackingNumber !== undefined &&
      (obj.trackingNumber = message.trackingNumber);
    message.variantId !== undefined && (obj.variantId = message.variantId);
    message.createdAt !== undefined &&
      (obj.createdAt = Math.round(message.createdAt));
    return obj;
  },

  create<I extends Exact<DeepPartial<Order>, I>>(base?: I): Order {
    return Order.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Order>, I>>(object: I): Order {
    const message = createBaseOrder();
    message.id = object.id ?? '';
    message.merchantId = object.merchantId ?? '';
    message.orderId = object.orderId ?? '';
    message.orderNumber = object.orderNumber ?? '';
    message.dmOrderId = object.dmOrderId ?? '';
    message.dmOrderStatus = object.dmOrderStatus ?? '';
    message.paymentStatus = object.paymentStatus ?? '';
    message.productId = object.productId ?? '';
    message.productName = object.productName ?? '';
    message.orderStatus = object.orderStatus ?? '';
    message.customerId = object.customerId ?? '';
    message.paymentId = object.paymentId ?? '';
    message.salePrice = object.salePrice ?? 0;
    message.grantTotal = object.grantTotal ?? 0;
    message.payoutAmount = object.payoutAmount ?? 0;
    message.productNameAr = object.productNameAr ?? '';
    message.customerName = object.customerName ?? '';
    message.name = object.name ?? '';
    message.trackingNumber = object.trackingNumber ?? '';
    message.variantId = object.variantId ?? '';
    message.createdAt = object.createdAt ?? 0;
    return message;
  },
};

function createBaseSaveOrderResponse(): SaveOrderResponse {
  return { message: '' };
}

export const SaveOrderResponse = {
  encode(
    message: SaveOrderResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.message !== '') {
      writer.uint32(10).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SaveOrderResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSaveOrderResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SaveOrderResponse {
    return { message: isSet(object.message) ? String(object.message) : '' };
  },

  toJSON(message: SaveOrderResponse): unknown {
    const obj: any = {};
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  create<I extends Exact<DeepPartial<SaveOrderResponse>, I>>(
    base?: I
  ): SaveOrderResponse {
    return SaveOrderResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SaveOrderResponse>, I>>(
    object: I
  ): SaveOrderResponse {
    const message = createBaseSaveOrderResponse();
    message.message = object.message ?? '';
    return message;
  },
};

export interface SearchService {
  GetProducts(request: SearchRequest): Promise<SearchResultsResponse>;
  SaveOrders(request: SaveOrderRequest): Promise<SaveOrderResponse>;
}

export class SearchServiceClientImpl implements SearchService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || 'search.SearchService';
    this.rpc = rpc;
    this.GetProducts = this.GetProducts.bind(this);
    this.SaveOrders = this.SaveOrders.bind(this);
  }
  GetProducts(request: SearchRequest): Promise<SearchResultsResponse> {
    const data = SearchRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, 'GetProducts', data);
    return promise.then(data =>
      SearchResultsResponse.decode(new _m0.Reader(data))
    );
  }

  SaveOrders(request: SaveOrderRequest): Promise<SaveOrderResponse> {
    const data = SaveOrderRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, 'SaveOrders', data);
    return promise.then(data => SaveOrderResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
