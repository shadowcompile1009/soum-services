/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "dmbackend";

export interface GetHoldingPenaltyBalanceRequest {
  sellerId: string;
  range: string;
}

export interface GetHoldingPenaltyBalanceResponse {
  amount: number;
}

export interface GetStandingPenaltyToDmoRequest {
  dmoId: string;
}

export interface GetStandingPenaltyToDmoResponse {
  dmoId: string;
  userId: string;
  penalty: number;
}

export interface UpdateHoldingPenaltyRequest {
  sellerId: string;
  dmoId: string;
  isPayout: boolean;
}

export interface UpdateHoldingPenaltyResponse {
}

export interface GetCancellationFeeRequest {
}

export interface GetCancellationFeeResponse {
  cancelFee: number;
}

export interface GetPenalizedOrdersMerchantRequest {
  merchantId: string;
  page: number;
  size: number;
  range: string;
}

export interface GetPenalizedOrdersMerchantResponse {
  orders: GetPenalizedOrdersMerchantResponse_PenalizedOrders[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetPenalizedOrdersMerchantResponse_PenalizedOrders {
  productName: string;
  orderNumber: string;
  payoutAmount: number;
  penalty: number;
  finalPayout: number;
  nctReason: string;
  nctReasonAR: string;
}

export interface CreateInvoiceRequest {
  orderId: string;
  invoiceType: string;
  userType: string;
  eventName: string;
}

export interface CreateInvoiceResponse {
}

export const DMBACKEND_PACKAGE_NAME = "dmbackend";

export interface DmBackendServiceClient {
  getHoldingPenaltyBalance(request: GetHoldingPenaltyBalanceRequest): Observable<GetHoldingPenaltyBalanceResponse>;

  getStandingPenaltyToDmo(request: GetStandingPenaltyToDmoRequest): Observable<GetStandingPenaltyToDmoResponse>;

  updateHoldingPenalty(request: UpdateHoldingPenaltyRequest): Observable<UpdateHoldingPenaltyResponse>;

  getCancellationFee(request: GetCancellationFeeRequest): Observable<GetCancellationFeeResponse>;

  getPenalizedOrdersMerchant(
    request: GetPenalizedOrdersMerchantRequest,
  ): Observable<GetPenalizedOrdersMerchantResponse>;

  createInvoice(request: CreateInvoiceRequest): Observable<CreateInvoiceResponse>;
}

export interface DmBackendServiceController {
  getHoldingPenaltyBalance(
    request: GetHoldingPenaltyBalanceRequest,
  ):
    | Promise<GetHoldingPenaltyBalanceResponse>
    | Observable<GetHoldingPenaltyBalanceResponse>
    | GetHoldingPenaltyBalanceResponse;

  getStandingPenaltyToDmo(
    request: GetStandingPenaltyToDmoRequest,
  ):
    | Promise<GetStandingPenaltyToDmoResponse>
    | Observable<GetStandingPenaltyToDmoResponse>
    | GetStandingPenaltyToDmoResponse;

  updateHoldingPenalty(
    request: UpdateHoldingPenaltyRequest,
  ): Promise<UpdateHoldingPenaltyResponse> | Observable<UpdateHoldingPenaltyResponse> | UpdateHoldingPenaltyResponse;

  getCancellationFee(
    request: GetCancellationFeeRequest,
  ): Promise<GetCancellationFeeResponse> | Observable<GetCancellationFeeResponse> | GetCancellationFeeResponse;

  getPenalizedOrdersMerchant(
    request: GetPenalizedOrdersMerchantRequest,
  ):
    | Promise<GetPenalizedOrdersMerchantResponse>
    | Observable<GetPenalizedOrdersMerchantResponse>
    | GetPenalizedOrdersMerchantResponse;

  createInvoice(
    request: CreateInvoiceRequest,
  ): Promise<CreateInvoiceResponse> | Observable<CreateInvoiceResponse> | CreateInvoiceResponse;
}

export function DmBackendServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getHoldingPenaltyBalance",
      "getStandingPenaltyToDmo",
      "updateHoldingPenalty",
      "getCancellationFee",
      "getPenalizedOrdersMerchant",
      "createInvoice",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("DmBackendService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("DmBackendService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const DM_BACKEND_SERVICE_NAME = "DmBackendService";
