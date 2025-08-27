/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

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

export const REVIEW_PACKAGE_NAME = "review";

export interface ReviewServiceClient {
  dummy(request: DummyRequest): Observable<DummyResponse>;

  getRatingSeller(request: GetRatingSellerRequest): Observable<GetRatingSellerResponse>;

  getResponsesOfProduct(request: GetResponseOfProductRequest): Observable<GetResponseOfProductResponse>;
}

export interface ReviewServiceController {
  dummy(request: DummyRequest): Promise<DummyResponse> | Observable<DummyResponse> | DummyResponse;

  getRatingSeller(
    request: GetRatingSellerRequest,
  ): Promise<GetRatingSellerResponse> | Observable<GetRatingSellerResponse> | GetRatingSellerResponse;

  getResponsesOfProduct(
    request: GetResponseOfProductRequest,
  ): Promise<GetResponseOfProductResponse> | Observable<GetResponseOfProductResponse> | GetResponseOfProductResponse;
}

export function ReviewServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["dummy", "getRatingSeller", "getResponsesOfProduct"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ReviewService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ReviewService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const REVIEW_SERVICE_NAME = "ReviewService";
