// Original file: node_modules/soum-proto/proto/wallet.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  CreateTransactionRequest as _wallet_CreateTransactionRequest,
  CreateTransactionRequest__Output as _wallet_CreateTransactionRequest__Output,
} from '../wallet/CreateTransactionRequest';
import type {
  GetCreditsByOrderIdsRequest as _wallet_GetCreditsByOrderIdsRequest,
  GetCreditsByOrderIdsRequest__Output as _wallet_GetCreditsByOrderIdsRequest__Output,
} from '../wallet/GetCreditsByOrderIdsRequest';
import type {
  GetCreditsByOrderIdsResponse as _wallet_GetCreditsByOrderIdsResponse,
  GetCreditsByOrderIdsResponse__Output as _wallet_GetCreditsByOrderIdsResponse__Output,
} from '../wallet/GetCreditsByOrderIdsResponse';
import type {
  GetGlobalWalletToggleRequest as _wallet_GetGlobalWalletToggleRequest,
  GetGlobalWalletToggleRequest__Output as _wallet_GetGlobalWalletToggleRequest__Output,
} from '../wallet/GetGlobalWalletToggleRequest';
import type {
  GetGlobalWalletToggleResponse as _wallet_GetGlobalWalletToggleResponse,
  GetGlobalWalletToggleResponse__Output as _wallet_GetGlobalWalletToggleResponse__Output,
} from '../wallet/GetGlobalWalletToggleResponse';
import type {
  GetListingFeeRequest as _wallet_GetListingFeeRequest,
  GetListingFeeRequest__Output as _wallet_GetListingFeeRequest__Output,
} from '../wallet/GetListingFeeRequest';
import type {
  GetListingFeeResponse as _wallet_GetListingFeeResponse,
  GetListingFeeResponse__Output as _wallet_GetListingFeeResponse__Output,
} from '../wallet/GetListingFeeResponse';
import type {
  GetPayoutSettingsRequest as _wallet_GetPayoutSettingsRequest,
  GetPayoutSettingsRequest__Output as _wallet_GetPayoutSettingsRequest__Output,
} from '../wallet/GetPayoutSettingsRequest';
import type {
  GetPayoutSettingsResponse as _wallet_GetPayoutSettingsResponse,
  GetPayoutSettingsResponse__Output as _wallet_GetPayoutSettingsResponse__Output,
} from '../wallet/GetPayoutSettingsResponse';
import type {
  GetPermissionsRequest as _wallet_GetPermissionsRequest,
  GetPermissionsRequest__Output as _wallet_GetPermissionsRequest__Output,
} from '../wallet/GetPermissionsRequest';
import type {
  GetPermissionsResponse as _wallet_GetPermissionsResponse,
  GetPermissionsResponse__Output as _wallet_GetPermissionsResponse__Output,
} from '../wallet/GetPermissionsResponse';
import type {
  GetTransactionRequest as _wallet_GetTransactionRequest,
  GetTransactionRequest__Output as _wallet_GetTransactionRequest__Output,
} from '../wallet/GetTransactionRequest';
import type {
  GetTransactionsRequest as _wallet_GetTransactionsRequest,
  GetTransactionsRequest__Output as _wallet_GetTransactionsRequest__Output,
} from '../wallet/GetTransactionsRequest';
import type {
  GetTransactionsResponse as _wallet_GetTransactionsResponse,
  GetTransactionsResponse__Output as _wallet_GetTransactionsResponse__Output,
} from '../wallet/GetTransactionsResponse';
import type {
  GetWalletRequest as _wallet_GetWalletRequest,
  GetWalletRequest__Output as _wallet_GetWalletRequest__Output,
} from '../wallet/GetWalletRequest';
import type {
  GetWalletResponse as _wallet_GetWalletResponse,
  GetWalletResponse__Output as _wallet_GetWalletResponse__Output,
} from '../wallet/GetWalletResponse';
import type {
  TransactionResponse as _wallet_TransactionResponse,
  TransactionResponse__Output as _wallet_TransactionResponse__Output,
} from '../wallet/TransactionResponse';
import type {
  UpdateAmountTransactionRequest as _wallet_UpdateAmountTransactionRequest,
  UpdateAmountTransactionRequest__Output as _wallet_UpdateAmountTransactionRequest__Output,
} from '../wallet/UpdateAmountTransactionRequest';
import type {
  UpdateTransactionRequest as _wallet_UpdateTransactionRequest,
  UpdateTransactionRequest__Output as _wallet_UpdateTransactionRequest__Output,
} from '../wallet/UpdateTransactionRequest';
import type {
  UpdateWalletRequest as _wallet_UpdateWalletRequest,
  UpdateWalletRequest__Output as _wallet_UpdateWalletRequest__Output,
} from '../wallet/UpdateWalletRequest';

export interface WalletServiceClient extends grpc.Client {
  CreateTransaction(
    argument: _wallet_CreateTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateTransaction(
    argument: _wallet_CreateTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateTransaction(
    argument: _wallet_CreateTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateTransaction(
    argument: _wallet_CreateTransactionRequest,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  createTransaction(
    argument: _wallet_CreateTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  createTransaction(
    argument: _wallet_CreateTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  createTransaction(
    argument: _wallet_CreateTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  createTransaction(
    argument: _wallet_CreateTransactionRequest,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;

  GetCreditsByOrderIds(
    argument: _wallet_GetCreditsByOrderIdsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetCreditsByOrderIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCreditsByOrderIds(
    argument: _wallet_GetCreditsByOrderIdsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetCreditsByOrderIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCreditsByOrderIds(
    argument: _wallet_GetCreditsByOrderIdsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetCreditsByOrderIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCreditsByOrderIds(
    argument: _wallet_GetCreditsByOrderIdsRequest,
    callback: grpc.requestCallback<_wallet_GetCreditsByOrderIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCreditsByOrderIds(
    argument: _wallet_GetCreditsByOrderIdsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetCreditsByOrderIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCreditsByOrderIds(
    argument: _wallet_GetCreditsByOrderIdsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetCreditsByOrderIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCreditsByOrderIds(
    argument: _wallet_GetCreditsByOrderIdsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetCreditsByOrderIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  getCreditsByOrderIds(
    argument: _wallet_GetCreditsByOrderIdsRequest,
    callback: grpc.requestCallback<_wallet_GetCreditsByOrderIdsResponse__Output>
  ): grpc.ClientUnaryCall;

  GetGlobalWalletToggle(
    argument: _wallet_GetGlobalWalletToggleRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetGlobalWalletToggleResponse__Output>
  ): grpc.ClientUnaryCall;
  GetGlobalWalletToggle(
    argument: _wallet_GetGlobalWalletToggleRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetGlobalWalletToggleResponse__Output>
  ): grpc.ClientUnaryCall;
  GetGlobalWalletToggle(
    argument: _wallet_GetGlobalWalletToggleRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetGlobalWalletToggleResponse__Output>
  ): grpc.ClientUnaryCall;
  GetGlobalWalletToggle(
    argument: _wallet_GetGlobalWalletToggleRequest,
    callback: grpc.requestCallback<_wallet_GetGlobalWalletToggleResponse__Output>
  ): grpc.ClientUnaryCall;
  getGlobalWalletToggle(
    argument: _wallet_GetGlobalWalletToggleRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetGlobalWalletToggleResponse__Output>
  ): grpc.ClientUnaryCall;
  getGlobalWalletToggle(
    argument: _wallet_GetGlobalWalletToggleRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetGlobalWalletToggleResponse__Output>
  ): grpc.ClientUnaryCall;
  getGlobalWalletToggle(
    argument: _wallet_GetGlobalWalletToggleRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetGlobalWalletToggleResponse__Output>
  ): grpc.ClientUnaryCall;
  getGlobalWalletToggle(
    argument: _wallet_GetGlobalWalletToggleRequest,
    callback: grpc.requestCallback<_wallet_GetGlobalWalletToggleResponse__Output>
  ): grpc.ClientUnaryCall;

  GetListingFee(
    argument: _wallet_GetListingFeeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetListingFeeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetListingFee(
    argument: _wallet_GetListingFeeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetListingFeeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetListingFee(
    argument: _wallet_GetListingFeeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetListingFeeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetListingFee(
    argument: _wallet_GetListingFeeRequest,
    callback: grpc.requestCallback<_wallet_GetListingFeeResponse__Output>
  ): grpc.ClientUnaryCall;
  getListingFee(
    argument: _wallet_GetListingFeeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetListingFeeResponse__Output>
  ): grpc.ClientUnaryCall;
  getListingFee(
    argument: _wallet_GetListingFeeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetListingFeeResponse__Output>
  ): grpc.ClientUnaryCall;
  getListingFee(
    argument: _wallet_GetListingFeeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetListingFeeResponse__Output>
  ): grpc.ClientUnaryCall;
  getListingFee(
    argument: _wallet_GetListingFeeRequest,
    callback: grpc.requestCallback<_wallet_GetListingFeeResponse__Output>
  ): grpc.ClientUnaryCall;

  GetPayoutSettings(
    argument: _wallet_GetPayoutSettingsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetPayoutSettingsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPayoutSettings(
    argument: _wallet_GetPayoutSettingsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetPayoutSettingsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPayoutSettings(
    argument: _wallet_GetPayoutSettingsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetPayoutSettingsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPayoutSettings(
    argument: _wallet_GetPayoutSettingsRequest,
    callback: grpc.requestCallback<_wallet_GetPayoutSettingsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPayoutSettings(
    argument: _wallet_GetPayoutSettingsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetPayoutSettingsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPayoutSettings(
    argument: _wallet_GetPayoutSettingsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetPayoutSettingsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPayoutSettings(
    argument: _wallet_GetPayoutSettingsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetPayoutSettingsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPayoutSettings(
    argument: _wallet_GetPayoutSettingsRequest,
    callback: grpc.requestCallback<_wallet_GetPayoutSettingsResponse__Output>
  ): grpc.ClientUnaryCall;

  GetPermissions(
    argument: _wallet_GetPermissionsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetPermissionsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPermissions(
    argument: _wallet_GetPermissionsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetPermissionsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPermissions(
    argument: _wallet_GetPermissionsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetPermissionsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPermissions(
    argument: _wallet_GetPermissionsRequest,
    callback: grpc.requestCallback<_wallet_GetPermissionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPermissions(
    argument: _wallet_GetPermissionsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetPermissionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPermissions(
    argument: _wallet_GetPermissionsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetPermissionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPermissions(
    argument: _wallet_GetPermissionsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetPermissionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPermissions(
    argument: _wallet_GetPermissionsRequest,
    callback: grpc.requestCallback<_wallet_GetPermissionsResponse__Output>
  ): grpc.ClientUnaryCall;

  GetTransactionById(
    argument: _wallet_GetTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  GetTransactionById(
    argument: _wallet_GetTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  GetTransactionById(
    argument: _wallet_GetTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  GetTransactionById(
    argument: _wallet_GetTransactionRequest,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactionById(
    argument: _wallet_GetTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactionById(
    argument: _wallet_GetTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactionById(
    argument: _wallet_GetTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactionById(
    argument: _wallet_GetTransactionRequest,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;

  GetTransactions(
    argument: _wallet_GetTransactionsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetTransactionsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetTransactions(
    argument: _wallet_GetTransactionsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetTransactionsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetTransactions(
    argument: _wallet_GetTransactionsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetTransactionsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetTransactions(
    argument: _wallet_GetTransactionsRequest,
    callback: grpc.requestCallback<_wallet_GetTransactionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactions(
    argument: _wallet_GetTransactionsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetTransactionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactions(
    argument: _wallet_GetTransactionsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetTransactionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactions(
    argument: _wallet_GetTransactionsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetTransactionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactions(
    argument: _wallet_GetTransactionsRequest,
    callback: grpc.requestCallback<_wallet_GetTransactionsResponse__Output>
  ): grpc.ClientUnaryCall;

  GetWallet(
    argument: _wallet_GetWalletRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
  GetWallet(
    argument: _wallet_GetWalletRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
  GetWallet(
    argument: _wallet_GetWalletRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
  GetWallet(
    argument: _wallet_GetWalletRequest,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
  getWallet(
    argument: _wallet_GetWalletRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
  getWallet(
    argument: _wallet_GetWalletRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
  getWallet(
    argument: _wallet_GetWalletRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
  getWallet(
    argument: _wallet_GetWalletRequest,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;

  UpdatePendingAmountTransaction(
    argument: _wallet_UpdateAmountTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdatePendingAmountTransaction(
    argument: _wallet_UpdateAmountTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdatePendingAmountTransaction(
    argument: _wallet_UpdateAmountTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdatePendingAmountTransaction(
    argument: _wallet_UpdateAmountTransactionRequest,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  updatePendingAmountTransaction(
    argument: _wallet_UpdateAmountTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  updatePendingAmountTransaction(
    argument: _wallet_UpdateAmountTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  updatePendingAmountTransaction(
    argument: _wallet_UpdateAmountTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  updatePendingAmountTransaction(
    argument: _wallet_UpdateAmountTransactionRequest,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;

  UpdateTransaction(
    argument: _wallet_UpdateTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateTransaction(
    argument: _wallet_UpdateTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateTransaction(
    argument: _wallet_UpdateTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateTransaction(
    argument: _wallet_UpdateTransactionRequest,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  updateTransaction(
    argument: _wallet_UpdateTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  updateTransaction(
    argument: _wallet_UpdateTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  updateTransaction(
    argument: _wallet_UpdateTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  updateTransaction(
    argument: _wallet_UpdateTransactionRequest,
    callback: grpc.requestCallback<_wallet_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;

  UpdateWallet(
    argument: _wallet_UpdateWalletRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateWallet(
    argument: _wallet_UpdateWalletRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateWallet(
    argument: _wallet_UpdateWalletRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateWallet(
    argument: _wallet_UpdateWalletRequest,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
  updateWallet(
    argument: _wallet_UpdateWalletRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
  updateWallet(
    argument: _wallet_UpdateWalletRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
  updateWallet(
    argument: _wallet_UpdateWalletRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
  updateWallet(
    argument: _wallet_UpdateWalletRequest,
    callback: grpc.requestCallback<_wallet_GetWalletResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface WalletServiceHandlers
  extends grpc.UntypedServiceImplementation {
  CreateTransaction: grpc.handleUnaryCall<
    _wallet_CreateTransactionRequest__Output,
    _wallet_TransactionResponse
  >;

  GetCreditsByOrderIds: grpc.handleUnaryCall<
    _wallet_GetCreditsByOrderIdsRequest__Output,
    _wallet_GetCreditsByOrderIdsResponse
  >;

  GetGlobalWalletToggle: grpc.handleUnaryCall<
    _wallet_GetGlobalWalletToggleRequest__Output,
    _wallet_GetGlobalWalletToggleResponse
  >;

  GetListingFee: grpc.handleUnaryCall<
    _wallet_GetListingFeeRequest__Output,
    _wallet_GetListingFeeResponse
  >;

  GetPayoutSettings: grpc.handleUnaryCall<
    _wallet_GetPayoutSettingsRequest__Output,
    _wallet_GetPayoutSettingsResponse
  >;

  GetPermissions: grpc.handleUnaryCall<
    _wallet_GetPermissionsRequest__Output,
    _wallet_GetPermissionsResponse
  >;

  GetTransactionById: grpc.handleUnaryCall<
    _wallet_GetTransactionRequest__Output,
    _wallet_TransactionResponse
  >;

  GetTransactions: grpc.handleUnaryCall<
    _wallet_GetTransactionsRequest__Output,
    _wallet_GetTransactionsResponse
  >;

  GetWallet: grpc.handleUnaryCall<
    _wallet_GetWalletRequest__Output,
    _wallet_GetWalletResponse
  >;

  UpdatePendingAmountTransaction: grpc.handleUnaryCall<
    _wallet_UpdateAmountTransactionRequest__Output,
    _wallet_TransactionResponse
  >;

  UpdateTransaction: grpc.handleUnaryCall<
    _wallet_UpdateTransactionRequest__Output,
    _wallet_TransactionResponse
  >;

  UpdateWallet: grpc.handleUnaryCall<
    _wallet_UpdateWalletRequest__Output,
    _wallet_GetWalletResponse
  >;
}

export interface WalletServiceDefinition extends grpc.ServiceDefinition {
  CreateTransaction: MethodDefinition<
    _wallet_CreateTransactionRequest,
    _wallet_TransactionResponse,
    _wallet_CreateTransactionRequest__Output,
    _wallet_TransactionResponse__Output
  >;
  GetCreditsByOrderIds: MethodDefinition<
    _wallet_GetCreditsByOrderIdsRequest,
    _wallet_GetCreditsByOrderIdsResponse,
    _wallet_GetCreditsByOrderIdsRequest__Output,
    _wallet_GetCreditsByOrderIdsResponse__Output
  >;
  GetGlobalWalletToggle: MethodDefinition<
    _wallet_GetGlobalWalletToggleRequest,
    _wallet_GetGlobalWalletToggleResponse,
    _wallet_GetGlobalWalletToggleRequest__Output,
    _wallet_GetGlobalWalletToggleResponse__Output
  >;
  GetListingFee: MethodDefinition<
    _wallet_GetListingFeeRequest,
    _wallet_GetListingFeeResponse,
    _wallet_GetListingFeeRequest__Output,
    _wallet_GetListingFeeResponse__Output
  >;
  GetPayoutSettings: MethodDefinition<
    _wallet_GetPayoutSettingsRequest,
    _wallet_GetPayoutSettingsResponse,
    _wallet_GetPayoutSettingsRequest__Output,
    _wallet_GetPayoutSettingsResponse__Output
  >;
  GetPermissions: MethodDefinition<
    _wallet_GetPermissionsRequest,
    _wallet_GetPermissionsResponse,
    _wallet_GetPermissionsRequest__Output,
    _wallet_GetPermissionsResponse__Output
  >;
  GetTransactionById: MethodDefinition<
    _wallet_GetTransactionRequest,
    _wallet_TransactionResponse,
    _wallet_GetTransactionRequest__Output,
    _wallet_TransactionResponse__Output
  >;
  GetTransactions: MethodDefinition<
    _wallet_GetTransactionsRequest,
    _wallet_GetTransactionsResponse,
    _wallet_GetTransactionsRequest__Output,
    _wallet_GetTransactionsResponse__Output
  >;
  GetWallet: MethodDefinition<
    _wallet_GetWalletRequest,
    _wallet_GetWalletResponse,
    _wallet_GetWalletRequest__Output,
    _wallet_GetWalletResponse__Output
  >;
  UpdatePendingAmountTransaction: MethodDefinition<
    _wallet_UpdateAmountTransactionRequest,
    _wallet_TransactionResponse,
    _wallet_UpdateAmountTransactionRequest__Output,
    _wallet_TransactionResponse__Output
  >;
  UpdateTransaction: MethodDefinition<
    _wallet_UpdateTransactionRequest,
    _wallet_TransactionResponse,
    _wallet_UpdateTransactionRequest__Output,
    _wallet_TransactionResponse__Output
  >;
  UpdateWallet: MethodDefinition<
    _wallet_UpdateWalletRequest,
    _wallet_GetWalletResponse,
    _wallet_UpdateWalletRequest__Output,
    _wallet_GetWalletResponse__Output
  >;
}
