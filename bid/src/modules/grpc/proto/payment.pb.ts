/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "payment";

export interface GetPaymentOptionsRequest {
  moduleName: string;
  isEnabled: boolean;
}

export interface GetPaymentOptionRequest {
  id: string;
}

export interface GetPaymentOptionsResponse {
  paymentOptions: PaymentOption[];
}

export interface PaymentOption {
  id: string;
  paymentProvider: string;
  paymentCardType: string;
  displayName: string;
}

export interface ReturnUrl {
  url: string;
  urlType: string;
}

export interface CreateTransactionRequest {
  userId: string;
  productId: string;
  amount: number;
  paymentOptionId: string;
  soumTransactionNumber: string;
  transactionType: string;
  items: CreateTransactionRequest_TransactionItem[];
  nationalId?: string | undefined;
  orderId: string;
  returnUrls: ReturnUrl[];
}

export interface CreateTransactionRequest_TransactionItem {
  title: string;
  description: string;
  unitPrice: string;
  vatAmount: string;
  quantity?: number | undefined;
  category?: string | undefined;
  productImage?: string | undefined;
  productId?: string | undefined;
}

export interface CreateTransactionResponse {
  transactionId: string;
  checkoutId: string;
  checkoutURL: string;
  soumTransactionNumber: string;
  transactionStatusId: string;
  transactionType: string;
}

export interface GetTransactionRequest {
  transactionId: string;
}

export interface TransactionResponse {
  transactionId: string;
  checkoutId: string;
  checkoutURL: string;
  soumTransactionNumber: string;
  transactionStatusId: string;
  transactionType: string;
  paymentOptionId: string;
  operationId?: string | undefined;
  totalAmount: number;
  paymentOption: PaymentOption | undefined;
}

export interface CaptureTransactionRequest {
  transactionId: string;
}

export interface ReverseTransactionRequest {
  transactionId: string;
}

export interface GetTransactionBySoumTransactionNumberRequest {
  soumTransactionNumber: string;
}

export interface ValidateBNPLForUserRequest {
  userId: string;
  productId: string;
  amount: number;
  paymentOption: PaymentOption | undefined;
  soumTransactionNumber: string;
  transactionType: string;
  items: ValidateBNPLForUserRequest_TransactionItem[];
  nationalId?: string | undefined;
}

export interface ValidateBNPLForUserRequest_TransactionItem {
  title: string;
  description: string;
  unitPrice: string;
  vatAmount: string;
}

export interface ValidateBNPLForUserResponse {
  isValid: boolean;
  reason?: string | undefined;
}

export const PAYMENT_PACKAGE_NAME = "payment";

export interface PaymentServiceClient {
  createTransaction(request: CreateTransactionRequest, metadata?: Metadata): Observable<CreateTransactionResponse>;

  getTransactionById(request: GetTransactionRequest, metadata?: Metadata): Observable<TransactionResponse>;

  captureTransaction(request: CaptureTransactionRequest, metadata?: Metadata): Observable<TransactionResponse>;

  reverseTransaction(request: ReverseTransactionRequest, metadata?: Metadata): Observable<TransactionResponse>;

  getPaymentOptions(request: GetPaymentOptionsRequest, metadata?: Metadata): Observable<GetPaymentOptionsResponse>;

  getPaymentOption(request: GetPaymentOptionRequest, metadata?: Metadata): Observable<PaymentOption>;

  getTransactionBySoumTransactionNumber(
    request: GetTransactionBySoumTransactionNumberRequest,
    metadata?: Metadata,
  ): Observable<TransactionResponse>;

  validateBnplForUser(
    request: ValidateBNPLForUserRequest,
    metadata?: Metadata,
  ): Observable<ValidateBNPLForUserResponse>;
}

export interface PaymentServiceController {
  createTransaction(
    request: CreateTransactionRequest,
    metadata?: Metadata,
  ): Promise<CreateTransactionResponse> | Observable<CreateTransactionResponse> | CreateTransactionResponse;

  getTransactionById(
    request: GetTransactionRequest,
    metadata?: Metadata,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;

  captureTransaction(
    request: CaptureTransactionRequest,
    metadata?: Metadata,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;

  reverseTransaction(
    request: ReverseTransactionRequest,
    metadata?: Metadata,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;

  getPaymentOptions(
    request: GetPaymentOptionsRequest,
    metadata?: Metadata,
  ): Promise<GetPaymentOptionsResponse> | Observable<GetPaymentOptionsResponse> | GetPaymentOptionsResponse;

  getPaymentOption(
    request: GetPaymentOptionRequest,
    metadata?: Metadata,
  ): Promise<PaymentOption> | Observable<PaymentOption> | PaymentOption;

  getTransactionBySoumTransactionNumber(
    request: GetTransactionBySoumTransactionNumberRequest,
    metadata?: Metadata,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;

  validateBnplForUser(
    request: ValidateBNPLForUserRequest,
    metadata?: Metadata,
  ): Promise<ValidateBNPLForUserResponse> | Observable<ValidateBNPLForUserResponse> | ValidateBNPLForUserResponse;
}

export function PaymentServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createTransaction",
      "getTransactionById",
      "captureTransaction",
      "reverseTransaction",
      "getPaymentOptions",
      "getPaymentOption",
      "getTransactionBySoumTransactionNumber",
      "validateBnplForUser",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("PaymentService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("PaymentService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PAYMENT_SERVICE_NAME = "PaymentService";
