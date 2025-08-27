import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  BidServiceClient as _bid_BidServiceClient,
  BidServiceDefinition as _bid_BidServiceDefinition,
} from './bid/BidService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  bid: {
    BidService: SubtypeConstructor<
      typeof grpc.Client,
      _bid_BidServiceClient
    > & { service: _bid_BidServiceDefinition };
    ClearExpiredProductBidsRequest: MessageTypeDefinition;
    ClearExpiredProductBidsResponse: MessageTypeDefinition;
    GetBidSettingsRequest: MessageTypeDefinition;
    GetBidSettingsResponse: MessageTypeDefinition;
    GetOfferCountOfUserRequest: MessageTypeDefinition;
    GetOfferForProductRequest: MessageTypeDefinition;
    OfferCountResponse: MessageTypeDefinition;
    OfferResponse: MessageTypeDefinition;
    OfferSummary: MessageTypeDefinition;
    TransactionUpdateRequest: MessageTypeDefinition;
    TransactionUpdateResponse: MessageTypeDefinition;
  };
}
