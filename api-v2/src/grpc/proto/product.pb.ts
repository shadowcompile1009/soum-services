/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "product";

export interface UpdateProductResponse {
  status: string;
}

export interface UpdateProductRequest {
  productAction: string;
  productId: string;
  order?: OrderUpdateProductRequest | undefined;
  status?: string | undefined;
}

export interface OrderUpdateProductRequest {
  soumNumber: string;
}

export interface URLData {
  relativePath: string;
}

export interface ProductImgSections {
  sectionId: string;
  urls: URLData[];
}

export interface MigrateImagesRequest {
  productId: string;
  imagesUrl: string[];
  categoryId: string;
  productImgSections: ProductImgSections[];
}

export interface MigrateImagesResponse {
}

export interface getProductDataForFeedsReq {
  products: Product[];
  promoCode: PromoCode | undefined;
}

export interface getProductDataForFeedsRes {
  products: ProductDeepLoad[];
}

/** helper message/classes */
export interface Product {
  id: string;
  description: string;
  categories: Category[];
  imagesUrl: string[];
  score: number;
  sellPrice: number;
  status: string;
  sellType: string;
  userId: string;
  groupListingId: string;
  statusSummary: StatusSummary | undefined;
}

export interface ProductDeepLoad {
  id: string;
  commissionSummary: BreakDownResponse | undefined;
  condition: Condition | undefined;
}

export interface BreakDownResponse {
  withPromo: CommissionSummaryResponse | undefined;
  withoutPromo: CommissionSummaryResponse | undefined;
}

export interface CommissionSummaryResponse {
  id: string;
  commission: number;
  commissionVat: number;
  deliveryFee: number;
  deliveryFeeVat: number;
  totalVat: number;
  discount: number;
  grandTotal: number;
  commissionDiscount: number;
  sellPrice: number;
  /** CommissionAnalysis commissionAnalysis = 11; */
  paymentId: string;
  /** Reservation reservation = 13; */
  addOnsTotal: number;
  addOnsVat: number;
  addOnsGrandTotal: number;
  /** FinancingRequest financingRequest = 18; */
  realEstateVat: number;
}

export interface Category {
  id: string;
  type: string;
}

export interface Condition {
  id: string;
  name: string;
  nameAr: string;
  labelColor: string;
  textColor: string;
  banners: Banner[];
}

export interface PromoCode {
  promoLimit: number;
  type: string;
  generator: string;
  discount: number;
  percentage: number;
}

export interface StatusSummary {
  isApproved: boolean;
  isExpired: boolean;
  isDeleted: boolean;
  isReported: boolean;
  isVerifiedByAdmin: boolean;
  isFraudDetected: boolean;
  isSearchSync: boolean;
}

export interface Banner {
  lang: string;
  url: string;
  source: string;
}

export interface GetPreSignURLProductImgsRequest {
  categoryId: string;
  productImages: ProductImgSections[];
}

export interface GetPreSignURLProductImgsResponse {
  imgURLs: string[];
}

export interface UpdateConsignmentStatusRequest {
  status: string;
  id?: string | undefined;
  orderNumber?: string | undefined;
}

export interface UpdateConsignmentStatusResponse {
}

function createBaseUpdateProductResponse(): UpdateProductResponse {
  return { status: "" };
}

export const UpdateProductResponse = {
  encode(message: UpdateProductResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status !== "") {
      writer.uint32(10).string(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateProductResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateProductResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateProductResponse {
    return { status: isSet(object.status) ? String(object.status) : "" };
  },

  toJSON(message: UpdateProductResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateProductResponse>, I>>(base?: I): UpdateProductResponse {
    return UpdateProductResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateProductResponse>, I>>(object: I): UpdateProductResponse {
    const message = createBaseUpdateProductResponse();
    message.status = object.status ?? "";
    return message;
  },
};

function createBaseUpdateProductRequest(): UpdateProductRequest {
  return { productAction: "", productId: "", order: undefined, status: undefined };
}

export const UpdateProductRequest = {
  encode(message: UpdateProductRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productAction !== "") {
      writer.uint32(10).string(message.productAction);
    }
    if (message.productId !== "") {
      writer.uint32(18).string(message.productId);
    }
    if (message.order !== undefined) {
      OrderUpdateProductRequest.encode(message.order, writer.uint32(26).fork()).ldelim();
    }
    if (message.status !== undefined) {
      writer.uint32(34).string(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateProductRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateProductRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productAction = reader.string();
          break;
        case 2:
          message.productId = reader.string();
          break;
        case 3:
          message.order = OrderUpdateProductRequest.decode(reader, reader.uint32());
          break;
        case 4:
          message.status = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateProductRequest {
    return {
      productAction: isSet(object.productAction) ? String(object.productAction) : "",
      productId: isSet(object.productId) ? String(object.productId) : "",
      order: isSet(object.order) ? OrderUpdateProductRequest.fromJSON(object.order) : undefined,
      status: isSet(object.status) ? String(object.status) : undefined,
    };
  },

  toJSON(message: UpdateProductRequest): unknown {
    const obj: any = {};
    message.productAction !== undefined && (obj.productAction = message.productAction);
    message.productId !== undefined && (obj.productId = message.productId);
    message.order !== undefined &&
      (obj.order = message.order ? OrderUpdateProductRequest.toJSON(message.order) : undefined);
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateProductRequest>, I>>(base?: I): UpdateProductRequest {
    return UpdateProductRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateProductRequest>, I>>(object: I): UpdateProductRequest {
    const message = createBaseUpdateProductRequest();
    message.productAction = object.productAction ?? "";
    message.productId = object.productId ?? "";
    message.order = (object.order !== undefined && object.order !== null)
      ? OrderUpdateProductRequest.fromPartial(object.order)
      : undefined;
    message.status = object.status ?? undefined;
    return message;
  },
};

function createBaseOrderUpdateProductRequest(): OrderUpdateProductRequest {
  return { soumNumber: "" };
}

export const OrderUpdateProductRequest = {
  encode(message: OrderUpdateProductRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.soumNumber !== "") {
      writer.uint32(10).string(message.soumNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OrderUpdateProductRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOrderUpdateProductRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.soumNumber = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OrderUpdateProductRequest {
    return { soumNumber: isSet(object.soumNumber) ? String(object.soumNumber) : "" };
  },

  toJSON(message: OrderUpdateProductRequest): unknown {
    const obj: any = {};
    message.soumNumber !== undefined && (obj.soumNumber = message.soumNumber);
    return obj;
  },

  create<I extends Exact<DeepPartial<OrderUpdateProductRequest>, I>>(base?: I): OrderUpdateProductRequest {
    return OrderUpdateProductRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<OrderUpdateProductRequest>, I>>(object: I): OrderUpdateProductRequest {
    const message = createBaseOrderUpdateProductRequest();
    message.soumNumber = object.soumNumber ?? "";
    return message;
  },
};

function createBaseURLData(): URLData {
  return { relativePath: "" };
}

export const URLData = {
  encode(message: URLData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.relativePath !== "") {
      writer.uint32(10).string(message.relativePath);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): URLData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseURLData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.relativePath = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): URLData {
    return { relativePath: isSet(object.relativePath) ? String(object.relativePath) : "" };
  },

  toJSON(message: URLData): unknown {
    const obj: any = {};
    message.relativePath !== undefined && (obj.relativePath = message.relativePath);
    return obj;
  },

  create<I extends Exact<DeepPartial<URLData>, I>>(base?: I): URLData {
    return URLData.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<URLData>, I>>(object: I): URLData {
    const message = createBaseURLData();
    message.relativePath = object.relativePath ?? "";
    return message;
  },
};

function createBaseProductImgSections(): ProductImgSections {
  return { sectionId: "", urls: [] };
}

export const ProductImgSections = {
  encode(message: ProductImgSections, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sectionId !== "") {
      writer.uint32(10).string(message.sectionId);
    }
    for (const v of message.urls) {
      URLData.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProductImgSections {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProductImgSections();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sectionId = reader.string();
          break;
        case 2:
          message.urls.push(URLData.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProductImgSections {
    return {
      sectionId: isSet(object.sectionId) ? String(object.sectionId) : "",
      urls: Array.isArray(object?.urls) ? object.urls.map((e: any) => URLData.fromJSON(e)) : [],
    };
  },

  toJSON(message: ProductImgSections): unknown {
    const obj: any = {};
    message.sectionId !== undefined && (obj.sectionId = message.sectionId);
    if (message.urls) {
      obj.urls = message.urls.map((e) => e ? URLData.toJSON(e) : undefined);
    } else {
      obj.urls = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ProductImgSections>, I>>(base?: I): ProductImgSections {
    return ProductImgSections.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ProductImgSections>, I>>(object: I): ProductImgSections {
    const message = createBaseProductImgSections();
    message.sectionId = object.sectionId ?? "";
    message.urls = object.urls?.map((e) => URLData.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMigrateImagesRequest(): MigrateImagesRequest {
  return { productId: "", imagesUrl: [], categoryId: "", productImgSections: [] };
}

export const MigrateImagesRequest = {
  encode(message: MigrateImagesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productId !== "") {
      writer.uint32(10).string(message.productId);
    }
    for (const v of message.imagesUrl) {
      writer.uint32(18).string(v!);
    }
    if (message.categoryId !== "") {
      writer.uint32(26).string(message.categoryId);
    }
    for (const v of message.productImgSections) {
      ProductImgSections.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MigrateImagesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMigrateImagesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        case 2:
          message.imagesUrl.push(reader.string());
          break;
        case 3:
          message.categoryId = reader.string();
          break;
        case 4:
          message.productImgSections.push(ProductImgSections.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MigrateImagesRequest {
    return {
      productId: isSet(object.productId) ? String(object.productId) : "",
      imagesUrl: Array.isArray(object?.imagesUrl) ? object.imagesUrl.map((e: any) => String(e)) : [],
      categoryId: isSet(object.categoryId) ? String(object.categoryId) : "",
      productImgSections: Array.isArray(object?.productImgSections)
        ? object.productImgSections.map((e: any) => ProductImgSections.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MigrateImagesRequest): unknown {
    const obj: any = {};
    message.productId !== undefined && (obj.productId = message.productId);
    if (message.imagesUrl) {
      obj.imagesUrl = message.imagesUrl.map((e) => e);
    } else {
      obj.imagesUrl = [];
    }
    message.categoryId !== undefined && (obj.categoryId = message.categoryId);
    if (message.productImgSections) {
      obj.productImgSections = message.productImgSections.map((e) => e ? ProductImgSections.toJSON(e) : undefined);
    } else {
      obj.productImgSections = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MigrateImagesRequest>, I>>(base?: I): MigrateImagesRequest {
    return MigrateImagesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MigrateImagesRequest>, I>>(object: I): MigrateImagesRequest {
    const message = createBaseMigrateImagesRequest();
    message.productId = object.productId ?? "";
    message.imagesUrl = object.imagesUrl?.map((e) => e) || [];
    message.categoryId = object.categoryId ?? "";
    message.productImgSections = object.productImgSections?.map((e) => ProductImgSections.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMigrateImagesResponse(): MigrateImagesResponse {
  return {};
}

export const MigrateImagesResponse = {
  encode(_: MigrateImagesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MigrateImagesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMigrateImagesResponse();
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

  fromJSON(_: any): MigrateImagesResponse {
    return {};
  },

  toJSON(_: MigrateImagesResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MigrateImagesResponse>, I>>(base?: I): MigrateImagesResponse {
    return MigrateImagesResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MigrateImagesResponse>, I>>(_: I): MigrateImagesResponse {
    const message = createBaseMigrateImagesResponse();
    return message;
  },
};

function createBasegetProductDataForFeedsReq(): getProductDataForFeedsReq {
  return { products: [], promoCode: undefined };
}

export const getProductDataForFeedsReq = {
  encode(message: getProductDataForFeedsReq, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.products) {
      Product.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.promoCode !== undefined) {
      PromoCode.encode(message.promoCode, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): getProductDataForFeedsReq {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasegetProductDataForFeedsReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.products.push(Product.decode(reader, reader.uint32()));
          break;
        case 2:
          message.promoCode = PromoCode.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): getProductDataForFeedsReq {
    return {
      products: Array.isArray(object?.products) ? object.products.map((e: any) => Product.fromJSON(e)) : [],
      promoCode: isSet(object.promoCode) ? PromoCode.fromJSON(object.promoCode) : undefined,
    };
  },

  toJSON(message: getProductDataForFeedsReq): unknown {
    const obj: any = {};
    if (message.products) {
      obj.products = message.products.map((e) => e ? Product.toJSON(e) : undefined);
    } else {
      obj.products = [];
    }
    message.promoCode !== undefined &&
      (obj.promoCode = message.promoCode ? PromoCode.toJSON(message.promoCode) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<getProductDataForFeedsReq>, I>>(base?: I): getProductDataForFeedsReq {
    return getProductDataForFeedsReq.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<getProductDataForFeedsReq>, I>>(object: I): getProductDataForFeedsReq {
    const message = createBasegetProductDataForFeedsReq();
    message.products = object.products?.map((e) => Product.fromPartial(e)) || [];
    message.promoCode = (object.promoCode !== undefined && object.promoCode !== null)
      ? PromoCode.fromPartial(object.promoCode)
      : undefined;
    return message;
  },
};

function createBasegetProductDataForFeedsRes(): getProductDataForFeedsRes {
  return { products: [] };
}

export const getProductDataForFeedsRes = {
  encode(message: getProductDataForFeedsRes, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.products) {
      ProductDeepLoad.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): getProductDataForFeedsRes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasegetProductDataForFeedsRes();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.products.push(ProductDeepLoad.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): getProductDataForFeedsRes {
    return {
      products: Array.isArray(object?.products) ? object.products.map((e: any) => ProductDeepLoad.fromJSON(e)) : [],
    };
  },

  toJSON(message: getProductDataForFeedsRes): unknown {
    const obj: any = {};
    if (message.products) {
      obj.products = message.products.map((e) => e ? ProductDeepLoad.toJSON(e) : undefined);
    } else {
      obj.products = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<getProductDataForFeedsRes>, I>>(base?: I): getProductDataForFeedsRes {
    return getProductDataForFeedsRes.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<getProductDataForFeedsRes>, I>>(object: I): getProductDataForFeedsRes {
    const message = createBasegetProductDataForFeedsRes();
    message.products = object.products?.map((e) => ProductDeepLoad.fromPartial(e)) || [];
    return message;
  },
};

function createBaseProduct(): Product {
  return {
    id: "",
    description: "",
    categories: [],
    imagesUrl: [],
    score: 0,
    sellPrice: 0,
    status: "",
    sellType: "",
    userId: "",
    groupListingId: "",
    statusSummary: undefined,
  };
}

export const Product = {
  encode(message: Product, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    for (const v of message.categories) {
      Category.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.imagesUrl) {
      writer.uint32(34).string(v!);
    }
    if (message.score !== 0) {
      writer.uint32(41).double(message.score);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(49).double(message.sellPrice);
    }
    if (message.status !== "") {
      writer.uint32(58).string(message.status);
    }
    if (message.sellType !== "") {
      writer.uint32(66).string(message.sellType);
    }
    if (message.userId !== "") {
      writer.uint32(74).string(message.userId);
    }
    if (message.groupListingId !== "") {
      writer.uint32(82).string(message.groupListingId);
    }
    if (message.statusSummary !== undefined) {
      StatusSummary.encode(message.statusSummary, writer.uint32(90).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Product {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProduct();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.categories.push(Category.decode(reader, reader.uint32()));
          break;
        case 4:
          message.imagesUrl.push(reader.string());
          break;
        case 5:
          message.score = reader.double();
          break;
        case 6:
          message.sellPrice = reader.double();
          break;
        case 7:
          message.status = reader.string();
          break;
        case 8:
          message.sellType = reader.string();
          break;
        case 9:
          message.userId = reader.string();
          break;
        case 10:
          message.groupListingId = reader.string();
          break;
        case 11:
          message.statusSummary = StatusSummary.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Product {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      description: isSet(object.description) ? String(object.description) : "",
      categories: Array.isArray(object?.categories) ? object.categories.map((e: any) => Category.fromJSON(e)) : [],
      imagesUrl: Array.isArray(object?.imagesUrl) ? object.imagesUrl.map((e: any) => String(e)) : [],
      score: isSet(object.score) ? Number(object.score) : 0,
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
      status: isSet(object.status) ? String(object.status) : "",
      sellType: isSet(object.sellType) ? String(object.sellType) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      groupListingId: isSet(object.groupListingId) ? String(object.groupListingId) : "",
      statusSummary: isSet(object.statusSummary) ? StatusSummary.fromJSON(object.statusSummary) : undefined,
    };
  },

  toJSON(message: Product): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.description !== undefined && (obj.description = message.description);
    if (message.categories) {
      obj.categories = message.categories.map((e) => e ? Category.toJSON(e) : undefined);
    } else {
      obj.categories = [];
    }
    if (message.imagesUrl) {
      obj.imagesUrl = message.imagesUrl.map((e) => e);
    } else {
      obj.imagesUrl = [];
    }
    message.score !== undefined && (obj.score = message.score);
    message.sellPrice !== undefined && (obj.sellPrice = message.sellPrice);
    message.status !== undefined && (obj.status = message.status);
    message.sellType !== undefined && (obj.sellType = message.sellType);
    message.userId !== undefined && (obj.userId = message.userId);
    message.groupListingId !== undefined && (obj.groupListingId = message.groupListingId);
    message.statusSummary !== undefined &&
      (obj.statusSummary = message.statusSummary ? StatusSummary.toJSON(message.statusSummary) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<Product>, I>>(base?: I): Product {
    return Product.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Product>, I>>(object: I): Product {
    const message = createBaseProduct();
    message.id = object.id ?? "";
    message.description = object.description ?? "";
    message.categories = object.categories?.map((e) => Category.fromPartial(e)) || [];
    message.imagesUrl = object.imagesUrl?.map((e) => e) || [];
    message.score = object.score ?? 0;
    message.sellPrice = object.sellPrice ?? 0;
    message.status = object.status ?? "";
    message.sellType = object.sellType ?? "";
    message.userId = object.userId ?? "";
    message.groupListingId = object.groupListingId ?? "";
    message.statusSummary = (object.statusSummary !== undefined && object.statusSummary !== null)
      ? StatusSummary.fromPartial(object.statusSummary)
      : undefined;
    return message;
  },
};

function createBaseProductDeepLoad(): ProductDeepLoad {
  return { id: "", commissionSummary: undefined, condition: undefined };
}

export const ProductDeepLoad = {
  encode(message: ProductDeepLoad, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.commissionSummary !== undefined) {
      BreakDownResponse.encode(message.commissionSummary, writer.uint32(18).fork()).ldelim();
    }
    if (message.condition !== undefined) {
      Condition.encode(message.condition, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProductDeepLoad {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProductDeepLoad();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.commissionSummary = BreakDownResponse.decode(reader, reader.uint32());
          break;
        case 3:
          message.condition = Condition.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProductDeepLoad {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      commissionSummary: isSet(object.commissionSummary)
        ? BreakDownResponse.fromJSON(object.commissionSummary)
        : undefined,
      condition: isSet(object.condition) ? Condition.fromJSON(object.condition) : undefined,
    };
  },

  toJSON(message: ProductDeepLoad): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.commissionSummary !== undefined && (obj.commissionSummary = message.commissionSummary
      ? BreakDownResponse.toJSON(message.commissionSummary)
      : undefined);
    message.condition !== undefined &&
      (obj.condition = message.condition ? Condition.toJSON(message.condition) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<ProductDeepLoad>, I>>(base?: I): ProductDeepLoad {
    return ProductDeepLoad.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ProductDeepLoad>, I>>(object: I): ProductDeepLoad {
    const message = createBaseProductDeepLoad();
    message.id = object.id ?? "";
    message.commissionSummary = (object.commissionSummary !== undefined && object.commissionSummary !== null)
      ? BreakDownResponse.fromPartial(object.commissionSummary)
      : undefined;
    message.condition = (object.condition !== undefined && object.condition !== null)
      ? Condition.fromPartial(object.condition)
      : undefined;
    return message;
  },
};

function createBaseBreakDownResponse(): BreakDownResponse {
  return { withPromo: undefined, withoutPromo: undefined };
}

export const BreakDownResponse = {
  encode(message: BreakDownResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.withPromo !== undefined) {
      CommissionSummaryResponse.encode(message.withPromo, writer.uint32(10).fork()).ldelim();
    }
    if (message.withoutPromo !== undefined) {
      CommissionSummaryResponse.encode(message.withoutPromo, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BreakDownResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBreakDownResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withPromo = CommissionSummaryResponse.decode(reader, reader.uint32());
          break;
        case 2:
          message.withoutPromo = CommissionSummaryResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BreakDownResponse {
    return {
      withPromo: isSet(object.withPromo) ? CommissionSummaryResponse.fromJSON(object.withPromo) : undefined,
      withoutPromo: isSet(object.withoutPromo) ? CommissionSummaryResponse.fromJSON(object.withoutPromo) : undefined,
    };
  },

  toJSON(message: BreakDownResponse): unknown {
    const obj: any = {};
    message.withPromo !== undefined &&
      (obj.withPromo = message.withPromo ? CommissionSummaryResponse.toJSON(message.withPromo) : undefined);
    message.withoutPromo !== undefined &&
      (obj.withoutPromo = message.withoutPromo ? CommissionSummaryResponse.toJSON(message.withoutPromo) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<BreakDownResponse>, I>>(base?: I): BreakDownResponse {
    return BreakDownResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BreakDownResponse>, I>>(object: I): BreakDownResponse {
    const message = createBaseBreakDownResponse();
    message.withPromo = (object.withPromo !== undefined && object.withPromo !== null)
      ? CommissionSummaryResponse.fromPartial(object.withPromo)
      : undefined;
    message.withoutPromo = (object.withoutPromo !== undefined && object.withoutPromo !== null)
      ? CommissionSummaryResponse.fromPartial(object.withoutPromo)
      : undefined;
    return message;
  },
};

function createBaseCommissionSummaryResponse(): CommissionSummaryResponse {
  return {
    id: "",
    commission: 0,
    commissionVat: 0,
    deliveryFee: 0,
    deliveryFeeVat: 0,
    totalVat: 0,
    discount: 0,
    grandTotal: 0,
    commissionDiscount: 0,
    sellPrice: 0,
    paymentId: "",
    addOnsTotal: 0,
    addOnsVat: 0,
    addOnsGrandTotal: 0,
    realEstateVat: 0,
  };
}

export const CommissionSummaryResponse = {
  encode(message: CommissionSummaryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.commission !== 0) {
      writer.uint32(17).double(message.commission);
    }
    if (message.commissionVat !== 0) {
      writer.uint32(25).double(message.commissionVat);
    }
    if (message.deliveryFee !== 0) {
      writer.uint32(33).double(message.deliveryFee);
    }
    if (message.deliveryFeeVat !== 0) {
      writer.uint32(41).double(message.deliveryFeeVat);
    }
    if (message.totalVat !== 0) {
      writer.uint32(49).double(message.totalVat);
    }
    if (message.discount !== 0) {
      writer.uint32(57).double(message.discount);
    }
    if (message.grandTotal !== 0) {
      writer.uint32(65).double(message.grandTotal);
    }
    if (message.commissionDiscount !== 0) {
      writer.uint32(73).double(message.commissionDiscount);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(81).double(message.sellPrice);
    }
    if (message.paymentId !== "") {
      writer.uint32(98).string(message.paymentId);
    }
    if (message.addOnsTotal !== 0) {
      writer.uint32(113).double(message.addOnsTotal);
    }
    if (message.addOnsVat !== 0) {
      writer.uint32(121).double(message.addOnsVat);
    }
    if (message.addOnsGrandTotal !== 0) {
      writer.uint32(129).double(message.addOnsGrandTotal);
    }
    if (message.realEstateVat !== 0) {
      writer.uint32(137).double(message.realEstateVat);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommissionSummaryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommissionSummaryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.commission = reader.double();
          break;
        case 3:
          message.commissionVat = reader.double();
          break;
        case 4:
          message.deliveryFee = reader.double();
          break;
        case 5:
          message.deliveryFeeVat = reader.double();
          break;
        case 6:
          message.totalVat = reader.double();
          break;
        case 7:
          message.discount = reader.double();
          break;
        case 8:
          message.grandTotal = reader.double();
          break;
        case 9:
          message.commissionDiscount = reader.double();
          break;
        case 10:
          message.sellPrice = reader.double();
          break;
        case 12:
          message.paymentId = reader.string();
          break;
        case 14:
          message.addOnsTotal = reader.double();
          break;
        case 15:
          message.addOnsVat = reader.double();
          break;
        case 16:
          message.addOnsGrandTotal = reader.double();
          break;
        case 17:
          message.realEstateVat = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CommissionSummaryResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      commission: isSet(object.commission) ? Number(object.commission) : 0,
      commissionVat: isSet(object.commissionVat) ? Number(object.commissionVat) : 0,
      deliveryFee: isSet(object.deliveryFee) ? Number(object.deliveryFee) : 0,
      deliveryFeeVat: isSet(object.deliveryFeeVat) ? Number(object.deliveryFeeVat) : 0,
      totalVat: isSet(object.totalVat) ? Number(object.totalVat) : 0,
      discount: isSet(object.discount) ? Number(object.discount) : 0,
      grandTotal: isSet(object.grandTotal) ? Number(object.grandTotal) : 0,
      commissionDiscount: isSet(object.commissionDiscount) ? Number(object.commissionDiscount) : 0,
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
      paymentId: isSet(object.paymentId) ? String(object.paymentId) : "",
      addOnsTotal: isSet(object.addOnsTotal) ? Number(object.addOnsTotal) : 0,
      addOnsVat: isSet(object.addOnsVat) ? Number(object.addOnsVat) : 0,
      addOnsGrandTotal: isSet(object.addOnsGrandTotal) ? Number(object.addOnsGrandTotal) : 0,
      realEstateVat: isSet(object.realEstateVat) ? Number(object.realEstateVat) : 0,
    };
  },

  toJSON(message: CommissionSummaryResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.commission !== undefined && (obj.commission = message.commission);
    message.commissionVat !== undefined && (obj.commissionVat = message.commissionVat);
    message.deliveryFee !== undefined && (obj.deliveryFee = message.deliveryFee);
    message.deliveryFeeVat !== undefined && (obj.deliveryFeeVat = message.deliveryFeeVat);
    message.totalVat !== undefined && (obj.totalVat = message.totalVat);
    message.discount !== undefined && (obj.discount = message.discount);
    message.grandTotal !== undefined && (obj.grandTotal = message.grandTotal);
    message.commissionDiscount !== undefined && (obj.commissionDiscount = message.commissionDiscount);
    message.sellPrice !== undefined && (obj.sellPrice = message.sellPrice);
    message.paymentId !== undefined && (obj.paymentId = message.paymentId);
    message.addOnsTotal !== undefined && (obj.addOnsTotal = message.addOnsTotal);
    message.addOnsVat !== undefined && (obj.addOnsVat = message.addOnsVat);
    message.addOnsGrandTotal !== undefined && (obj.addOnsGrandTotal = message.addOnsGrandTotal);
    message.realEstateVat !== undefined && (obj.realEstateVat = message.realEstateVat);
    return obj;
  },

  create<I extends Exact<DeepPartial<CommissionSummaryResponse>, I>>(base?: I): CommissionSummaryResponse {
    return CommissionSummaryResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CommissionSummaryResponse>, I>>(object: I): CommissionSummaryResponse {
    const message = createBaseCommissionSummaryResponse();
    message.id = object.id ?? "";
    message.commission = object.commission ?? 0;
    message.commissionVat = object.commissionVat ?? 0;
    message.deliveryFee = object.deliveryFee ?? 0;
    message.deliveryFeeVat = object.deliveryFeeVat ?? 0;
    message.totalVat = object.totalVat ?? 0;
    message.discount = object.discount ?? 0;
    message.grandTotal = object.grandTotal ?? 0;
    message.commissionDiscount = object.commissionDiscount ?? 0;
    message.sellPrice = object.sellPrice ?? 0;
    message.paymentId = object.paymentId ?? "";
    message.addOnsTotal = object.addOnsTotal ?? 0;
    message.addOnsVat = object.addOnsVat ?? 0;
    message.addOnsGrandTotal = object.addOnsGrandTotal ?? 0;
    message.realEstateVat = object.realEstateVat ?? 0;
    return message;
  },
};

function createBaseCategory(): Category {
  return { id: "", type: "" };
}

export const Category = {
  encode(message: Category, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
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
          message.type = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Category {
    return { id: isSet(object.id) ? String(object.id) : "", type: isSet(object.type) ? String(object.type) : "" };
  },

  toJSON(message: Category): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.type !== undefined && (obj.type = message.type);
    return obj;
  },

  create<I extends Exact<DeepPartial<Category>, I>>(base?: I): Category {
    return Category.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Category>, I>>(object: I): Category {
    const message = createBaseCategory();
    message.id = object.id ?? "";
    message.type = object.type ?? "";
    return message;
  },
};

function createBaseCondition(): Condition {
  return { id: "", name: "", nameAr: "", labelColor: "", textColor: "", banners: [] };
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
    return message;
  },
};

function createBasePromoCode(): PromoCode {
  return { promoLimit: 0, type: "", generator: "", discount: 0, percentage: 0 };
}

export const PromoCode = {
  encode(message: PromoCode, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.promoLimit !== 0) {
      writer.uint32(8).int32(message.promoLimit);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.generator !== "") {
      writer.uint32(26).string(message.generator);
    }
    if (message.discount !== 0) {
      writer.uint32(32).int32(message.discount);
    }
    if (message.percentage !== 0) {
      writer.uint32(40).int32(message.percentage);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PromoCode {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePromoCode();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.promoLimit = reader.int32();
          break;
        case 2:
          message.type = reader.string();
          break;
        case 3:
          message.generator = reader.string();
          break;
        case 4:
          message.discount = reader.int32();
          break;
        case 5:
          message.percentage = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PromoCode {
    return {
      promoLimit: isSet(object.promoLimit) ? Number(object.promoLimit) : 0,
      type: isSet(object.type) ? String(object.type) : "",
      generator: isSet(object.generator) ? String(object.generator) : "",
      discount: isSet(object.discount) ? Number(object.discount) : 0,
      percentage: isSet(object.percentage) ? Number(object.percentage) : 0,
    };
  },

  toJSON(message: PromoCode): unknown {
    const obj: any = {};
    message.promoLimit !== undefined && (obj.promoLimit = Math.round(message.promoLimit));
    message.type !== undefined && (obj.type = message.type);
    message.generator !== undefined && (obj.generator = message.generator);
    message.discount !== undefined && (obj.discount = Math.round(message.discount));
    message.percentage !== undefined && (obj.percentage = Math.round(message.percentage));
    return obj;
  },

  create<I extends Exact<DeepPartial<PromoCode>, I>>(base?: I): PromoCode {
    return PromoCode.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PromoCode>, I>>(object: I): PromoCode {
    const message = createBasePromoCode();
    message.promoLimit = object.promoLimit ?? 0;
    message.type = object.type ?? "";
    message.generator = object.generator ?? "";
    message.discount = object.discount ?? 0;
    message.percentage = object.percentage ?? 0;
    return message;
  },
};

function createBaseStatusSummary(): StatusSummary {
  return {
    isApproved: false,
    isExpired: false,
    isDeleted: false,
    isReported: false,
    isVerifiedByAdmin: false,
    isFraudDetected: false,
    isSearchSync: false,
  };
}

export const StatusSummary = {
  encode(message: StatusSummary, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isApproved === true) {
      writer.uint32(8).bool(message.isApproved);
    }
    if (message.isExpired === true) {
      writer.uint32(16).bool(message.isExpired);
    }
    if (message.isDeleted === true) {
      writer.uint32(24).bool(message.isDeleted);
    }
    if (message.isReported === true) {
      writer.uint32(32).bool(message.isReported);
    }
    if (message.isVerifiedByAdmin === true) {
      writer.uint32(40).bool(message.isVerifiedByAdmin);
    }
    if (message.isFraudDetected === true) {
      writer.uint32(48).bool(message.isFraudDetected);
    }
    if (message.isSearchSync === true) {
      writer.uint32(56).bool(message.isSearchSync);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StatusSummary {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStatusSummary();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.isApproved = reader.bool();
          break;
        case 2:
          message.isExpired = reader.bool();
          break;
        case 3:
          message.isDeleted = reader.bool();
          break;
        case 4:
          message.isReported = reader.bool();
          break;
        case 5:
          message.isVerifiedByAdmin = reader.bool();
          break;
        case 6:
          message.isFraudDetected = reader.bool();
          break;
        case 7:
          message.isSearchSync = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StatusSummary {
    return {
      isApproved: isSet(object.isApproved) ? Boolean(object.isApproved) : false,
      isExpired: isSet(object.isExpired) ? Boolean(object.isExpired) : false,
      isDeleted: isSet(object.isDeleted) ? Boolean(object.isDeleted) : false,
      isReported: isSet(object.isReported) ? Boolean(object.isReported) : false,
      isVerifiedByAdmin: isSet(object.isVerifiedByAdmin) ? Boolean(object.isVerifiedByAdmin) : false,
      isFraudDetected: isSet(object.isFraudDetected) ? Boolean(object.isFraudDetected) : false,
      isSearchSync: isSet(object.isSearchSync) ? Boolean(object.isSearchSync) : false,
    };
  },

  toJSON(message: StatusSummary): unknown {
    const obj: any = {};
    message.isApproved !== undefined && (obj.isApproved = message.isApproved);
    message.isExpired !== undefined && (obj.isExpired = message.isExpired);
    message.isDeleted !== undefined && (obj.isDeleted = message.isDeleted);
    message.isReported !== undefined && (obj.isReported = message.isReported);
    message.isVerifiedByAdmin !== undefined && (obj.isVerifiedByAdmin = message.isVerifiedByAdmin);
    message.isFraudDetected !== undefined && (obj.isFraudDetected = message.isFraudDetected);
    message.isSearchSync !== undefined && (obj.isSearchSync = message.isSearchSync);
    return obj;
  },

  create<I extends Exact<DeepPartial<StatusSummary>, I>>(base?: I): StatusSummary {
    return StatusSummary.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<StatusSummary>, I>>(object: I): StatusSummary {
    const message = createBaseStatusSummary();
    message.isApproved = object.isApproved ?? false;
    message.isExpired = object.isExpired ?? false;
    message.isDeleted = object.isDeleted ?? false;
    message.isReported = object.isReported ?? false;
    message.isVerifiedByAdmin = object.isVerifiedByAdmin ?? false;
    message.isFraudDetected = object.isFraudDetected ?? false;
    message.isSearchSync = object.isSearchSync ?? false;
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

function createBaseGetPreSignURLProductImgsRequest(): GetPreSignURLProductImgsRequest {
  return { categoryId: "", productImages: [] };
}

export const GetPreSignURLProductImgsRequest = {
  encode(message: GetPreSignURLProductImgsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.categoryId !== "") {
      writer.uint32(10).string(message.categoryId);
    }
    for (const v of message.productImages) {
      ProductImgSections.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPreSignURLProductImgsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPreSignURLProductImgsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.categoryId = reader.string();
          break;
        case 2:
          message.productImages.push(ProductImgSections.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPreSignURLProductImgsRequest {
    return {
      categoryId: isSet(object.categoryId) ? String(object.categoryId) : "",
      productImages: Array.isArray(object?.productImages)
        ? object.productImages.map((e: any) => ProductImgSections.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetPreSignURLProductImgsRequest): unknown {
    const obj: any = {};
    message.categoryId !== undefined && (obj.categoryId = message.categoryId);
    if (message.productImages) {
      obj.productImages = message.productImages.map((e) => e ? ProductImgSections.toJSON(e) : undefined);
    } else {
      obj.productImages = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPreSignURLProductImgsRequest>, I>>(base?: I): GetPreSignURLProductImgsRequest {
    return GetPreSignURLProductImgsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPreSignURLProductImgsRequest>, I>>(
    object: I,
  ): GetPreSignURLProductImgsRequest {
    const message = createBaseGetPreSignURLProductImgsRequest();
    message.categoryId = object.categoryId ?? "";
    message.productImages = object.productImages?.map((e) => ProductImgSections.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetPreSignURLProductImgsResponse(): GetPreSignURLProductImgsResponse {
  return { imgURLs: [] };
}

export const GetPreSignURLProductImgsResponse = {
  encode(message: GetPreSignURLProductImgsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.imgURLs) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPreSignURLProductImgsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPreSignURLProductImgsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.imgURLs.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPreSignURLProductImgsResponse {
    return { imgURLs: Array.isArray(object?.imgURLs) ? object.imgURLs.map((e: any) => String(e)) : [] };
  },

  toJSON(message: GetPreSignURLProductImgsResponse): unknown {
    const obj: any = {};
    if (message.imgURLs) {
      obj.imgURLs = message.imgURLs.map((e) => e);
    } else {
      obj.imgURLs = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPreSignURLProductImgsResponse>, I>>(
    base?: I,
  ): GetPreSignURLProductImgsResponse {
    return GetPreSignURLProductImgsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPreSignURLProductImgsResponse>, I>>(
    object: I,
  ): GetPreSignURLProductImgsResponse {
    const message = createBaseGetPreSignURLProductImgsResponse();
    message.imgURLs = object.imgURLs?.map((e) => e) || [];
    return message;
  },
};

function createBaseUpdateConsignmentStatusRequest(): UpdateConsignmentStatusRequest {
  return { status: "", id: undefined, orderNumber: undefined };
}

export const UpdateConsignmentStatusRequest = {
  encode(message: UpdateConsignmentStatusRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status !== "") {
      writer.uint32(10).string(message.status);
    }
    if (message.id !== undefined) {
      writer.uint32(18).string(message.id);
    }
    if (message.orderNumber !== undefined) {
      writer.uint32(26).string(message.orderNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateConsignmentStatusRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateConsignmentStatusRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.string();
          break;
        case 2:
          message.id = reader.string();
          break;
        case 3:
          message.orderNumber = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateConsignmentStatusRequest {
    return {
      status: isSet(object.status) ? String(object.status) : "",
      id: isSet(object.id) ? String(object.id) : undefined,
      orderNumber: isSet(object.orderNumber) ? String(object.orderNumber) : undefined,
    };
  },

  toJSON(message: UpdateConsignmentStatusRequest): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    message.id !== undefined && (obj.id = message.id);
    message.orderNumber !== undefined && (obj.orderNumber = message.orderNumber);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateConsignmentStatusRequest>, I>>(base?: I): UpdateConsignmentStatusRequest {
    return UpdateConsignmentStatusRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateConsignmentStatusRequest>, I>>(
    object: I,
  ): UpdateConsignmentStatusRequest {
    const message = createBaseUpdateConsignmentStatusRequest();
    message.status = object.status ?? "";
    message.id = object.id ?? undefined;
    message.orderNumber = object.orderNumber ?? undefined;
    return message;
  },
};

function createBaseUpdateConsignmentStatusResponse(): UpdateConsignmentStatusResponse {
  return {};
}

export const UpdateConsignmentStatusResponse = {
  encode(_: UpdateConsignmentStatusResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateConsignmentStatusResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateConsignmentStatusResponse();
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

  fromJSON(_: any): UpdateConsignmentStatusResponse {
    return {};
  },

  toJSON(_: UpdateConsignmentStatusResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateConsignmentStatusResponse>, I>>(base?: I): UpdateConsignmentStatusResponse {
    return UpdateConsignmentStatusResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateConsignmentStatusResponse>, I>>(_: I): UpdateConsignmentStatusResponse {
    const message = createBaseUpdateConsignmentStatusResponse();
    return message;
  },
};

export interface ProductService {
  MigrateImages(request: MigrateImagesRequest): Promise<MigrateImagesResponse>;
  GetProductDataForFeeds(request: getProductDataForFeedsReq): Promise<getProductDataForFeedsRes>;
  GetPreSignURLProductImgs(request: GetPreSignURLProductImgsRequest): Promise<GetPreSignURLProductImgsResponse>;
  UpdateConsignmentStatus(request: UpdateConsignmentStatusRequest): Promise<UpdateConsignmentStatusResponse>;
  UpdateProduct(request: UpdateProductRequest): Promise<UpdateProductResponse>;
}

export class ProductServiceClientImpl implements ProductService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "product.ProductService";
    this.rpc = rpc;
    this.MigrateImages = this.MigrateImages.bind(this);
    this.GetProductDataForFeeds = this.GetProductDataForFeeds.bind(this);
    this.GetPreSignURLProductImgs = this.GetPreSignURLProductImgs.bind(this);
    this.UpdateConsignmentStatus = this.UpdateConsignmentStatus.bind(this);
    this.UpdateProduct = this.UpdateProduct.bind(this);
  }
  MigrateImages(request: MigrateImagesRequest): Promise<MigrateImagesResponse> {
    const data = MigrateImagesRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "MigrateImages", data);
    return promise.then((data) => MigrateImagesResponse.decode(new _m0.Reader(data)));
  }

  GetProductDataForFeeds(request: getProductDataForFeedsReq): Promise<getProductDataForFeedsRes> {
    const data = getProductDataForFeedsReq.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetProductDataForFeeds", data);
    return promise.then((data) => getProductDataForFeedsRes.decode(new _m0.Reader(data)));
  }

  GetPreSignURLProductImgs(request: GetPreSignURLProductImgsRequest): Promise<GetPreSignURLProductImgsResponse> {
    const data = GetPreSignURLProductImgsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetPreSignURLProductImgs", data);
    return promise.then((data) => GetPreSignURLProductImgsResponse.decode(new _m0.Reader(data)));
  }

  UpdateConsignmentStatus(request: UpdateConsignmentStatusRequest): Promise<UpdateConsignmentStatusResponse> {
    const data = UpdateConsignmentStatusRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateConsignmentStatus", data);
    return promise.then((data) => UpdateConsignmentStatusResponse.decode(new _m0.Reader(data)));
  }

  UpdateProduct(request: UpdateProductRequest): Promise<UpdateProductResponse> {
    const data = UpdateProductRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateProduct", data);
    return promise.then((data) => UpdateProductResponse.decode(new _m0.Reader(data)));
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
