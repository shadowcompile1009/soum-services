/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "review";

export interface DummyRequest {
  id: string;
}

export interface GetRatingSellerRequest {
  sellerId: string;
}

export interface DummyResponse {
  id: string;
}

export interface GetRatingSellerResponse {
  stars: number;
}

export interface GetResponseOfProductRequest {
  productId: string;
}

export interface GetResponseOfProductResponse {
  id: string;
  userId: string;
  productId: string;
  score: number;
  responses: Response[];
}

export interface Response {
  questionId: string;
  questionAr: string;
  questionEn: string;
  answers: Answer[];
}

export interface Answer {
  optionEn: string;
  optionAr: string;
  attachmentUrl: string;
  text: string;
}

function createBaseDummyRequest(): DummyRequest {
  return { id: "" };
}

export const DummyRequest = {
  encode(message: DummyRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DummyRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDummyRequest();
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

  fromJSON(object: any): DummyRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: DummyRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<DummyRequest>, I>>(base?: I): DummyRequest {
    return DummyRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DummyRequest>, I>>(object: I): DummyRequest {
    const message = createBaseDummyRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseGetRatingSellerRequest(): GetRatingSellerRequest {
  return { sellerId: "" };
}

export const GetRatingSellerRequest = {
  encode(message: GetRatingSellerRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sellerId !== "") {
      writer.uint32(10).string(message.sellerId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRatingSellerRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRatingSellerRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sellerId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetRatingSellerRequest {
    return { sellerId: isSet(object.sellerId) ? String(object.sellerId) : "" };
  },

  toJSON(message: GetRatingSellerRequest): unknown {
    const obj: any = {};
    message.sellerId !== undefined && (obj.sellerId = message.sellerId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRatingSellerRequest>, I>>(base?: I): GetRatingSellerRequest {
    return GetRatingSellerRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRatingSellerRequest>, I>>(object: I): GetRatingSellerRequest {
    const message = createBaseGetRatingSellerRequest();
    message.sellerId = object.sellerId ?? "";
    return message;
  },
};

function createBaseDummyResponse(): DummyResponse {
  return { id: "" };
}

export const DummyResponse = {
  encode(message: DummyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DummyResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDummyResponse();
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

  fromJSON(object: any): DummyResponse {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: DummyResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<DummyResponse>, I>>(base?: I): DummyResponse {
    return DummyResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DummyResponse>, I>>(object: I): DummyResponse {
    const message = createBaseDummyResponse();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseGetRatingSellerResponse(): GetRatingSellerResponse {
  return { stars: 0 };
}

export const GetRatingSellerResponse = {
  encode(message: GetRatingSellerResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stars !== 0) {
      writer.uint32(9).double(message.stars);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRatingSellerResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRatingSellerResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.stars = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetRatingSellerResponse {
    return { stars: isSet(object.stars) ? Number(object.stars) : 0 };
  },

  toJSON(message: GetRatingSellerResponse): unknown {
    const obj: any = {};
    message.stars !== undefined && (obj.stars = message.stars);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRatingSellerResponse>, I>>(base?: I): GetRatingSellerResponse {
    return GetRatingSellerResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRatingSellerResponse>, I>>(object: I): GetRatingSellerResponse {
    const message = createBaseGetRatingSellerResponse();
    message.stars = object.stars ?? 0;
    return message;
  },
};

function createBaseGetResponseOfProductRequest(): GetResponseOfProductRequest {
  return { productId: "" };
}

export const GetResponseOfProductRequest = {
  encode(message: GetResponseOfProductRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productId !== "") {
      writer.uint32(10).string(message.productId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetResponseOfProductRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetResponseOfProductRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetResponseOfProductRequest {
    return { productId: isSet(object.productId) ? String(object.productId) : "" };
  },

  toJSON(message: GetResponseOfProductRequest): unknown {
    const obj: any = {};
    message.productId !== undefined && (obj.productId = message.productId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetResponseOfProductRequest>, I>>(base?: I): GetResponseOfProductRequest {
    return GetResponseOfProductRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetResponseOfProductRequest>, I>>(object: I): GetResponseOfProductRequest {
    const message = createBaseGetResponseOfProductRequest();
    message.productId = object.productId ?? "";
    return message;
  },
};

function createBaseGetResponseOfProductResponse(): GetResponseOfProductResponse {
  return { id: "", userId: "", productId: "", score: 0, responses: [] };
}

export const GetResponseOfProductResponse = {
  encode(message: GetResponseOfProductResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    if (message.productId !== "") {
      writer.uint32(26).string(message.productId);
    }
    if (message.score !== 0) {
      writer.uint32(32).int32(message.score);
    }
    for (const v of message.responses) {
      Response.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetResponseOfProductResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetResponseOfProductResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.userId = reader.string();
          break;
        case 3:
          message.productId = reader.string();
          break;
        case 4:
          message.score = reader.int32();
          break;
        case 5:
          message.responses.push(Response.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetResponseOfProductResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      productId: isSet(object.productId) ? String(object.productId) : "",
      score: isSet(object.score) ? Number(object.score) : 0,
      responses: Array.isArray(object?.responses) ? object.responses.map((e: any) => Response.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetResponseOfProductResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.userId !== undefined && (obj.userId = message.userId);
    message.productId !== undefined && (obj.productId = message.productId);
    message.score !== undefined && (obj.score = Math.round(message.score));
    if (message.responses) {
      obj.responses = message.responses.map((e) => e ? Response.toJSON(e) : undefined);
    } else {
      obj.responses = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetResponseOfProductResponse>, I>>(base?: I): GetResponseOfProductResponse {
    return GetResponseOfProductResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetResponseOfProductResponse>, I>>(object: I): GetResponseOfProductResponse {
    const message = createBaseGetResponseOfProductResponse();
    message.id = object.id ?? "";
    message.userId = object.userId ?? "";
    message.productId = object.productId ?? "";
    message.score = object.score ?? 0;
    message.responses = object.responses?.map((e) => Response.fromPartial(e)) || [];
    return message;
  },
};

function createBaseResponse(): Response {
  return { questionId: "", questionAr: "", questionEn: "", answers: [] };
}

export const Response = {
  encode(message: Response, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.questionId !== "") {
      writer.uint32(10).string(message.questionId);
    }
    if (message.questionAr !== "") {
      writer.uint32(18).string(message.questionAr);
    }
    if (message.questionEn !== "") {
      writer.uint32(26).string(message.questionEn);
    }
    for (const v of message.answers) {
      Answer.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Response {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.questionId = reader.string();
          break;
        case 2:
          message.questionAr = reader.string();
          break;
        case 3:
          message.questionEn = reader.string();
          break;
        case 4:
          message.answers.push(Answer.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Response {
    return {
      questionId: isSet(object.questionId) ? String(object.questionId) : "",
      questionAr: isSet(object.questionAr) ? String(object.questionAr) : "",
      questionEn: isSet(object.questionEn) ? String(object.questionEn) : "",
      answers: Array.isArray(object?.answers) ? object.answers.map((e: any) => Answer.fromJSON(e)) : [],
    };
  },

  toJSON(message: Response): unknown {
    const obj: any = {};
    message.questionId !== undefined && (obj.questionId = message.questionId);
    message.questionAr !== undefined && (obj.questionAr = message.questionAr);
    message.questionEn !== undefined && (obj.questionEn = message.questionEn);
    if (message.answers) {
      obj.answers = message.answers.map((e) => e ? Answer.toJSON(e) : undefined);
    } else {
      obj.answers = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Response>, I>>(base?: I): Response {
    return Response.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Response>, I>>(object: I): Response {
    const message = createBaseResponse();
    message.questionId = object.questionId ?? "";
    message.questionAr = object.questionAr ?? "";
    message.questionEn = object.questionEn ?? "";
    message.answers = object.answers?.map((e) => Answer.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAnswer(): Answer {
  return { optionEn: "", optionAr: "", attachmentUrl: "", text: "" };
}

export const Answer = {
  encode(message: Answer, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.optionEn !== "") {
      writer.uint32(10).string(message.optionEn);
    }
    if (message.optionAr !== "") {
      writer.uint32(18).string(message.optionAr);
    }
    if (message.attachmentUrl !== "") {
      writer.uint32(26).string(message.attachmentUrl);
    }
    if (message.text !== "") {
      writer.uint32(34).string(message.text);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Answer {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAnswer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.optionEn = reader.string();
          break;
        case 2:
          message.optionAr = reader.string();
          break;
        case 3:
          message.attachmentUrl = reader.string();
          break;
        case 4:
          message.text = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Answer {
    return {
      optionEn: isSet(object.optionEn) ? String(object.optionEn) : "",
      optionAr: isSet(object.optionAr) ? String(object.optionAr) : "",
      attachmentUrl: isSet(object.attachmentUrl) ? String(object.attachmentUrl) : "",
      text: isSet(object.text) ? String(object.text) : "",
    };
  },

  toJSON(message: Answer): unknown {
    const obj: any = {};
    message.optionEn !== undefined && (obj.optionEn = message.optionEn);
    message.optionAr !== undefined && (obj.optionAr = message.optionAr);
    message.attachmentUrl !== undefined && (obj.attachmentUrl = message.attachmentUrl);
    message.text !== undefined && (obj.text = message.text);
    return obj;
  },

  create<I extends Exact<DeepPartial<Answer>, I>>(base?: I): Answer {
    return Answer.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Answer>, I>>(object: I): Answer {
    const message = createBaseAnswer();
    message.optionEn = object.optionEn ?? "";
    message.optionAr = object.optionAr ?? "";
    message.attachmentUrl = object.attachmentUrl ?? "";
    message.text = object.text ?? "";
    return message;
  },
};

export interface ReviewService {
  Dummy(request: DummyRequest): Promise<DummyResponse>;
  GetRatingSeller(request: GetRatingSellerRequest): Promise<GetRatingSellerResponse>;
  GetResponsesOfProduct(request: GetResponseOfProductRequest): Promise<GetResponseOfProductResponse>;
}

export class ReviewServiceClientImpl implements ReviewService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "review.ReviewService";
    this.rpc = rpc;
    this.Dummy = this.Dummy.bind(this);
    this.GetRatingSeller = this.GetRatingSeller.bind(this);
    this.GetResponsesOfProduct = this.GetResponsesOfProduct.bind(this);
  }
  Dummy(request: DummyRequest): Promise<DummyResponse> {
    const data = DummyRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Dummy", data);
    return promise.then((data) => DummyResponse.decode(new _m0.Reader(data)));
  }

  GetRatingSeller(request: GetRatingSellerRequest): Promise<GetRatingSellerResponse> {
    const data = GetRatingSellerRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetRatingSeller", data);
    return promise.then((data) => GetRatingSellerResponse.decode(new _m0.Reader(data)));
  }

  GetResponsesOfProduct(request: GetResponseOfProductRequest): Promise<GetResponseOfProductResponse> {
    const data = GetResponseOfProductRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetResponsesOfProduct", data);
    return promise.then((data) => GetResponseOfProductResponse.decode(new _m0.Reader(data)));
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
