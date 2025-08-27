import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  DmBackendServiceClient as _dmbackend_DmBackendServiceClient,
  DmBackendServiceDefinition as _dmbackend_DmBackendServiceDefinition,
} from './dmbackend/DmBackendService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  dmbackend: {
    CreateInvoiceRequest: MessageTypeDefinition;
    CreateInvoiceResponse: MessageTypeDefinition;
    DmBackendService: SubtypeConstructor<
      typeof grpc.Client,
      _dmbackend_DmBackendServiceClient
    > & { service: _dmbackend_DmBackendServiceDefinition };
    GetCancellationFeeRequest: MessageTypeDefinition;
    GetCancellationFeeResponse: MessageTypeDefinition;
    GetHoldingPenaltyBalanceRequest: MessageTypeDefinition;
    GetHoldingPenaltyBalanceResponse: MessageTypeDefinition;
    GetPenalizedOrdersMerchantRequest: MessageTypeDefinition;
    GetPenalizedOrdersMerchantResponse: MessageTypeDefinition;
    GetStandingPenaltyToDmoRequest: MessageTypeDefinition;
    GetStandingPenaltyToDmoResponse: MessageTypeDefinition;
    UpdateHoldingPenaltyRequest: MessageTypeDefinition;
    UpdateHoldingPenaltyResponse: MessageTypeDefinition;
  };
}
