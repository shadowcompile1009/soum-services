/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "bid";

export interface GetOfferForProductRequest {
  productId: string;
  userId: string;
}

export interface OfferResponse {
  id: string;
  status: string;
  sellPrice: number;
  buyerOfferSummary: OfferSummary | undefined;
}

export interface OfferSummary {
  commission: number;
  commissionVat: number;
  grandTotal: number;
}

export interface GetBidSettingsRequest {
}

export interface GetBidSettingsResponse {
  value: boolean;
  availablePayment: string;
  config: string;
}

export interface ClearExpiredProductBidsRequest {
  productIds: string[];
}

export interface ClearExpiredProductBidsResponse {
}

export interface TransactionUpdateRequest {
  transactionId: string;
  checkoutId: string;
  checkoutURL: string;
  soumTransactionNumber: string;
  transactionStatusId: string;
  transactionType: string;
  paymentOptionId: string;
}

export interface TransactionUpdateResponse {
}

export interface GetOfferCountOfUserRequest {
  userId: string;
}

export interface OfferCountResponse {
  count: number;
}

export const BID_PACKAGE_NAME = "bid";

export interface BidServiceClient {
  getBidSettings(request: GetBidSettingsRequest, metadata?: Metadata): Observable<GetBidSettingsResponse>;

  clearExpiredProductBids(
    request: ClearExpiredProductBidsRequest,
    metadata?: Metadata,
  ): Observable<ClearExpiredProductBidsResponse>;

  transactionUpdate(request: TransactionUpdateRequest, metadata?: Metadata): Observable<TransactionUpdateResponse>;

  getOfferForProduct(request: GetOfferForProductRequest, metadata?: Metadata): Observable<OfferResponse>;

  getOfferCountOfUser(request: GetOfferCountOfUserRequest, metadata?: Metadata): Observable<OfferCountResponse>;
}

export interface BidServiceController {
  getBidSettings(
    request: GetBidSettingsRequest,
    metadata?: Metadata,
  ): Promise<GetBidSettingsResponse> | Observable<GetBidSettingsResponse> | GetBidSettingsResponse;

  clearExpiredProductBids(
    request: ClearExpiredProductBidsRequest,
    metadata?: Metadata,
  ):
    | Promise<ClearExpiredProductBidsResponse>
    | Observable<ClearExpiredProductBidsResponse>
    | ClearExpiredProductBidsResponse;

  transactionUpdate(
    request: TransactionUpdateRequest,
    metadata?: Metadata,
  ): Promise<TransactionUpdateResponse> | Observable<TransactionUpdateResponse> | TransactionUpdateResponse;

  getOfferForProduct(
    request: GetOfferForProductRequest,
    metadata?: Metadata,
  ): Promise<OfferResponse> | Observable<OfferResponse> | OfferResponse;

  getOfferCountOfUser(
    request: GetOfferCountOfUserRequest,
    metadata?: Metadata,
  ): Promise<OfferCountResponse> | Observable<OfferCountResponse> | OfferCountResponse;
}

export function BidServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getBidSettings",
      "clearExpiredProductBids",
      "transactionUpdate",
      "getOfferForProduct",
      "getOfferCountOfUser",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("BidService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("BidService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const BID_SERVICE_NAME = "BidService";
