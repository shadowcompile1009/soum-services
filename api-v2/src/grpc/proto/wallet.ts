import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  WalletServiceClient as _wallet_WalletServiceClient,
  WalletServiceDefinition as _wallet_WalletServiceDefinition,
} from './wallet/WalletService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  wallet: {
    CreateTransactionRequest: MessageTypeDefinition;
    GetCreditsByOrderIdsRequest: MessageTypeDefinition;
    GetCreditsByOrderIdsResponse: MessageTypeDefinition;
    GetGlobalWalletToggleRequest: MessageTypeDefinition;
    GetGlobalWalletToggleResponse: MessageTypeDefinition;
    GetListingFeeRequest: MessageTypeDefinition;
    GetListingFeeResponse: MessageTypeDefinition;
    GetPayoutSettingsRequest: MessageTypeDefinition;
    GetPayoutSettingsResponse: MessageTypeDefinition;
    GetPermissionsRequest: MessageTypeDefinition;
    GetPermissionsResponse: MessageTypeDefinition;
    GetTransactionRequest: MessageTypeDefinition;
    GetTransactionsRequest: MessageTypeDefinition;
    GetTransactionsResponse: MessageTypeDefinition;
    GetWalletRequest: MessageTypeDefinition;
    GetWalletResponse: MessageTypeDefinition;
    Permission: MessageTypeDefinition;
    TransactionResponse: MessageTypeDefinition;
    UpdateAmountTransactionRequest: MessageTypeDefinition;
    UpdateTransactionRequest: MessageTypeDefinition;
    UpdateWalletRequest: MessageTypeDefinition;
    WalletService: SubtypeConstructor<
      typeof grpc.Client,
      _wallet_WalletServiceClient
    > & { service: _wallet_WalletServiceDefinition };
  };
}
