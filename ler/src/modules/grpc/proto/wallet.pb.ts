/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "wallet";

export interface GetWalletRequest {
  ownerId: string;
}

export interface GetTransactionRequest {
  id: string;
}

export interface UpdateAmountTransactionRequest {
  transactionId: string;
  amount: number;
}

export interface GetWalletResponse {
  id: string;
  ownerId: string;
  tag: string;
  balance: number;
  status: string;
  createdAt: number;
  updatedAt: number;
  pendingTransactions: number;
  onholdBalance: number;
  availableBalance: number;
  totalBalance: number;
}

export interface UpdateWalletRequest {
  walletId: string;
  amount: number;
  transactionType: string;
}

export interface UpdateTransactionRequest {
  transactionId: string;
  status: string;
}

export interface CreateTransactionRequest {
  ownerId: string;
  type: string;
  amount: number;
  orderId: string;
  description: string;
  status?: string | undefined;
  metadata?: CreateTransactionRequest_Metadata | undefined;
}

export interface CreateTransactionRequest_Metadata {
  creditType: string;
}

export interface TransactionResponse {
  id: string;
  ownerId: string;
  walletId: string;
  amount: number;
  status: string;
  type: string;
  createdAt: number;
  updatedAt: number;
  orderId: string;
}

export interface GetTransactionsRequest {
  orderId: string;
}

export interface GetTransactionsResponse {
  data: TransactionResponse[];
}

export interface GetCreditsByOrderIdsRequest {
  orderIds: string[];
}

export interface GetCreditsByOrderIdsResponse {
  data: TransactionResponse[];
}

export interface GetPayoutSettingsRequest {
}

export interface GetGlobalWalletToggleRequest {
}

export interface GetGlobalWalletToggleResponse {
  id: string;
  name: string;
  display: string;
  type: string;
  configurable: string;
  value: boolean;
}

export interface GetPayoutSettingsResponse {
  id: string;
  name: string;
  description: string;
  type: string;
  value: boolean;
}

export interface GetListingFeeRequest {
  settingKey: string;
}

export interface GetListingFeeResponse {
  id: string;
  walletSettingsId: string;
  listingFee: string;
}

export interface Permission {
  key: string;
  description: string;
}

export interface GetPermissionsRequest {
  serviceName: string;
}

export interface GetPermissionsResponse {
  permissions: Permission[];
}

export const WALLET_PACKAGE_NAME = "wallet";

export interface WalletServiceClient {
  getWallet(request: GetWalletRequest): Observable<GetWalletResponse>;

  createTransaction(request: CreateTransactionRequest): Observable<TransactionResponse>;

  getTransactions(request: GetTransactionsRequest): Observable<GetTransactionsResponse>;

  getCreditsByOrderIds(request: GetCreditsByOrderIdsRequest): Observable<GetCreditsByOrderIdsResponse>;

  getPayoutSettings(request: GetPayoutSettingsRequest): Observable<GetPayoutSettingsResponse>;

  getListingFee(request: GetListingFeeRequest): Observable<GetListingFeeResponse>;

  getGlobalWalletToggle(request: GetGlobalWalletToggleRequest): Observable<GetGlobalWalletToggleResponse>;

  updateWallet(request: UpdateWalletRequest): Observable<GetWalletResponse>;

  updateTransaction(request: UpdateTransactionRequest): Observable<TransactionResponse>;

  getTransactionById(request: GetTransactionRequest): Observable<TransactionResponse>;

  updatePendingAmountTransaction(request: UpdateAmountTransactionRequest): Observable<TransactionResponse>;

  getPermissions(request: GetPermissionsRequest): Observable<GetPermissionsResponse>;
}

export interface WalletServiceController {
  getWallet(request: GetWalletRequest): Promise<GetWalletResponse> | Observable<GetWalletResponse> | GetWalletResponse;

  createTransaction(
    request: CreateTransactionRequest,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;

  getTransactions(
    request: GetTransactionsRequest,
  ): Promise<GetTransactionsResponse> | Observable<GetTransactionsResponse> | GetTransactionsResponse;

  getCreditsByOrderIds(
    request: GetCreditsByOrderIdsRequest,
  ): Promise<GetCreditsByOrderIdsResponse> | Observable<GetCreditsByOrderIdsResponse> | GetCreditsByOrderIdsResponse;

  getPayoutSettings(
    request: GetPayoutSettingsRequest,
  ): Promise<GetPayoutSettingsResponse> | Observable<GetPayoutSettingsResponse> | GetPayoutSettingsResponse;

  getListingFee(
    request: GetListingFeeRequest,
  ): Promise<GetListingFeeResponse> | Observable<GetListingFeeResponse> | GetListingFeeResponse;

  getGlobalWalletToggle(
    request: GetGlobalWalletToggleRequest,
  ): Promise<GetGlobalWalletToggleResponse> | Observable<GetGlobalWalletToggleResponse> | GetGlobalWalletToggleResponse;

  updateWallet(
    request: UpdateWalletRequest,
  ): Promise<GetWalletResponse> | Observable<GetWalletResponse> | GetWalletResponse;

  updateTransaction(
    request: UpdateTransactionRequest,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;

  getTransactionById(
    request: GetTransactionRequest,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;

  updatePendingAmountTransaction(
    request: UpdateAmountTransactionRequest,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;

  getPermissions(
    request: GetPermissionsRequest,
  ): Promise<GetPermissionsResponse> | Observable<GetPermissionsResponse> | GetPermissionsResponse;
}

export function WalletServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getWallet",
      "createTransaction",
      "getTransactions",
      "getCreditsByOrderIds",
      "getPayoutSettings",
      "getListingFee",
      "getGlobalWalletToggle",
      "updateWallet",
      "updateTransaction",
      "getTransactionById",
      "updatePendingAmountTransaction",
      "getPermissions",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("WalletService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("WalletService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const WALLET_SERVICE_NAME = "WalletService";
