// Original file: node_modules/soum-proto/proto/bid.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  ClearExpiredProductBidsRequest as _bid_ClearExpiredProductBidsRequest,
  ClearExpiredProductBidsRequest__Output as _bid_ClearExpiredProductBidsRequest__Output,
} from '../bid/ClearExpiredProductBidsRequest';
import type {
  ClearExpiredProductBidsResponse as _bid_ClearExpiredProductBidsResponse,
  ClearExpiredProductBidsResponse__Output as _bid_ClearExpiredProductBidsResponse__Output,
} from '../bid/ClearExpiredProductBidsResponse';
import type {
  GetBidSettingsRequest as _bid_GetBidSettingsRequest,
  GetBidSettingsRequest__Output as _bid_GetBidSettingsRequest__Output,
} from '../bid/GetBidSettingsRequest';
import type {
  GetBidSettingsResponse as _bid_GetBidSettingsResponse,
  GetBidSettingsResponse__Output as _bid_GetBidSettingsResponse__Output,
} from '../bid/GetBidSettingsResponse';
import type {
  GetOfferCountOfUserRequest as _bid_GetOfferCountOfUserRequest,
  GetOfferCountOfUserRequest__Output as _bid_GetOfferCountOfUserRequest__Output,
} from '../bid/GetOfferCountOfUserRequest';
import type {
  GetOfferForProductRequest as _bid_GetOfferForProductRequest,
  GetOfferForProductRequest__Output as _bid_GetOfferForProductRequest__Output,
} from '../bid/GetOfferForProductRequest';
import type {
  OfferCountResponse as _bid_OfferCountResponse,
  OfferCountResponse__Output as _bid_OfferCountResponse__Output,
} from '../bid/OfferCountResponse';
import type {
  OfferResponse as _bid_OfferResponse,
  OfferResponse__Output as _bid_OfferResponse__Output,
} from '../bid/OfferResponse';
import type {
  TransactionUpdateRequest as _bid_TransactionUpdateRequest,
  TransactionUpdateRequest__Output as _bid_TransactionUpdateRequest__Output,
} from '../bid/TransactionUpdateRequest';
import type {
  TransactionUpdateResponse as _bid_TransactionUpdateResponse,
  TransactionUpdateResponse__Output as _bid_TransactionUpdateResponse__Output,
} from '../bid/TransactionUpdateResponse';

export interface BidServiceClient extends grpc.Client {
  ClearExpiredProductBids(
    argument: _bid_ClearExpiredProductBidsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_ClearExpiredProductBidsResponse__Output>
  ): grpc.ClientUnaryCall;
  ClearExpiredProductBids(
    argument: _bid_ClearExpiredProductBidsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_bid_ClearExpiredProductBidsResponse__Output>
  ): grpc.ClientUnaryCall;
  ClearExpiredProductBids(
    argument: _bid_ClearExpiredProductBidsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_ClearExpiredProductBidsResponse__Output>
  ): grpc.ClientUnaryCall;
  ClearExpiredProductBids(
    argument: _bid_ClearExpiredProductBidsRequest,
    callback: grpc.requestCallback<_bid_ClearExpiredProductBidsResponse__Output>
  ): grpc.ClientUnaryCall;
  clearExpiredProductBids(
    argument: _bid_ClearExpiredProductBidsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_ClearExpiredProductBidsResponse__Output>
  ): grpc.ClientUnaryCall;
  clearExpiredProductBids(
    argument: _bid_ClearExpiredProductBidsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_bid_ClearExpiredProductBidsResponse__Output>
  ): grpc.ClientUnaryCall;
  clearExpiredProductBids(
    argument: _bid_ClearExpiredProductBidsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_ClearExpiredProductBidsResponse__Output>
  ): grpc.ClientUnaryCall;
  clearExpiredProductBids(
    argument: _bid_ClearExpiredProductBidsRequest,
    callback: grpc.requestCallback<_bid_ClearExpiredProductBidsResponse__Output>
  ): grpc.ClientUnaryCall;

  GetBidSettings(
    argument: _bid_GetBidSettingsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_GetBidSettingsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetBidSettings(
    argument: _bid_GetBidSettingsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_bid_GetBidSettingsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetBidSettings(
    argument: _bid_GetBidSettingsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_GetBidSettingsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetBidSettings(
    argument: _bid_GetBidSettingsRequest,
    callback: grpc.requestCallback<_bid_GetBidSettingsResponse__Output>
  ): grpc.ClientUnaryCall;
  getBidSettings(
    argument: _bid_GetBidSettingsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_GetBidSettingsResponse__Output>
  ): grpc.ClientUnaryCall;
  getBidSettings(
    argument: _bid_GetBidSettingsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_bid_GetBidSettingsResponse__Output>
  ): grpc.ClientUnaryCall;
  getBidSettings(
    argument: _bid_GetBidSettingsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_GetBidSettingsResponse__Output>
  ): grpc.ClientUnaryCall;
  getBidSettings(
    argument: _bid_GetBidSettingsRequest,
    callback: grpc.requestCallback<_bid_GetBidSettingsResponse__Output>
  ): grpc.ClientUnaryCall;

  GetOfferCountOfUser(
    argument: _bid_GetOfferCountOfUserRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_OfferCountResponse__Output>
  ): grpc.ClientUnaryCall;
  GetOfferCountOfUser(
    argument: _bid_GetOfferCountOfUserRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_bid_OfferCountResponse__Output>
  ): grpc.ClientUnaryCall;
  GetOfferCountOfUser(
    argument: _bid_GetOfferCountOfUserRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_OfferCountResponse__Output>
  ): grpc.ClientUnaryCall;
  GetOfferCountOfUser(
    argument: _bid_GetOfferCountOfUserRequest,
    callback: grpc.requestCallback<_bid_OfferCountResponse__Output>
  ): grpc.ClientUnaryCall;
  getOfferCountOfUser(
    argument: _bid_GetOfferCountOfUserRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_OfferCountResponse__Output>
  ): grpc.ClientUnaryCall;
  getOfferCountOfUser(
    argument: _bid_GetOfferCountOfUserRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_bid_OfferCountResponse__Output>
  ): grpc.ClientUnaryCall;
  getOfferCountOfUser(
    argument: _bid_GetOfferCountOfUserRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_OfferCountResponse__Output>
  ): grpc.ClientUnaryCall;
  getOfferCountOfUser(
    argument: _bid_GetOfferCountOfUserRequest,
    callback: grpc.requestCallback<_bid_OfferCountResponse__Output>
  ): grpc.ClientUnaryCall;

  GetOfferForProduct(
    argument: _bid_GetOfferForProductRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_OfferResponse__Output>
  ): grpc.ClientUnaryCall;
  GetOfferForProduct(
    argument: _bid_GetOfferForProductRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_bid_OfferResponse__Output>
  ): grpc.ClientUnaryCall;
  GetOfferForProduct(
    argument: _bid_GetOfferForProductRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_OfferResponse__Output>
  ): grpc.ClientUnaryCall;
  GetOfferForProduct(
    argument: _bid_GetOfferForProductRequest,
    callback: grpc.requestCallback<_bid_OfferResponse__Output>
  ): grpc.ClientUnaryCall;
  getOfferForProduct(
    argument: _bid_GetOfferForProductRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_OfferResponse__Output>
  ): grpc.ClientUnaryCall;
  getOfferForProduct(
    argument: _bid_GetOfferForProductRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_bid_OfferResponse__Output>
  ): grpc.ClientUnaryCall;
  getOfferForProduct(
    argument: _bid_GetOfferForProductRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_OfferResponse__Output>
  ): grpc.ClientUnaryCall;
  getOfferForProduct(
    argument: _bid_GetOfferForProductRequest,
    callback: grpc.requestCallback<_bid_OfferResponse__Output>
  ): grpc.ClientUnaryCall;

  TransactionUpdate(
    argument: _bid_TransactionUpdateRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_TransactionUpdateResponse__Output>
  ): grpc.ClientUnaryCall;
  TransactionUpdate(
    argument: _bid_TransactionUpdateRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_bid_TransactionUpdateResponse__Output>
  ): grpc.ClientUnaryCall;
  TransactionUpdate(
    argument: _bid_TransactionUpdateRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_TransactionUpdateResponse__Output>
  ): grpc.ClientUnaryCall;
  TransactionUpdate(
    argument: _bid_TransactionUpdateRequest,
    callback: grpc.requestCallback<_bid_TransactionUpdateResponse__Output>
  ): grpc.ClientUnaryCall;
  transactionUpdate(
    argument: _bid_TransactionUpdateRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_TransactionUpdateResponse__Output>
  ): grpc.ClientUnaryCall;
  transactionUpdate(
    argument: _bid_TransactionUpdateRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_bid_TransactionUpdateResponse__Output>
  ): grpc.ClientUnaryCall;
  transactionUpdate(
    argument: _bid_TransactionUpdateRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_bid_TransactionUpdateResponse__Output>
  ): grpc.ClientUnaryCall;
  transactionUpdate(
    argument: _bid_TransactionUpdateRequest,
    callback: grpc.requestCallback<_bid_TransactionUpdateResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface BidServiceHandlers extends grpc.UntypedServiceImplementation {
  ClearExpiredProductBids: grpc.handleUnaryCall<
    _bid_ClearExpiredProductBidsRequest__Output,
    _bid_ClearExpiredProductBidsResponse
  >;

  GetBidSettings: grpc.handleUnaryCall<
    _bid_GetBidSettingsRequest__Output,
    _bid_GetBidSettingsResponse
  >;

  GetOfferCountOfUser: grpc.handleUnaryCall<
    _bid_GetOfferCountOfUserRequest__Output,
    _bid_OfferCountResponse
  >;

  GetOfferForProduct: grpc.handleUnaryCall<
    _bid_GetOfferForProductRequest__Output,
    _bid_OfferResponse
  >;

  TransactionUpdate: grpc.handleUnaryCall<
    _bid_TransactionUpdateRequest__Output,
    _bid_TransactionUpdateResponse
  >;
}

export interface BidServiceDefinition extends grpc.ServiceDefinition {
  ClearExpiredProductBids: MethodDefinition<
    _bid_ClearExpiredProductBidsRequest,
    _bid_ClearExpiredProductBidsResponse,
    _bid_ClearExpiredProductBidsRequest__Output,
    _bid_ClearExpiredProductBidsResponse__Output
  >;
  GetBidSettings: MethodDefinition<
    _bid_GetBidSettingsRequest,
    _bid_GetBidSettingsResponse,
    _bid_GetBidSettingsRequest__Output,
    _bid_GetBidSettingsResponse__Output
  >;
  GetOfferCountOfUser: MethodDefinition<
    _bid_GetOfferCountOfUserRequest,
    _bid_OfferCountResponse,
    _bid_GetOfferCountOfUserRequest__Output,
    _bid_OfferCountResponse__Output
  >;
  GetOfferForProduct: MethodDefinition<
    _bid_GetOfferForProductRequest,
    _bid_OfferResponse,
    _bid_GetOfferForProductRequest__Output,
    _bid_OfferResponse__Output
  >;
  TransactionUpdate: MethodDefinition<
    _bid_TransactionUpdateRequest,
    _bid_TransactionUpdateResponse,
    _bid_TransactionUpdateRequest__Output,
    _bid_TransactionUpdateResponse__Output
  >;
}
