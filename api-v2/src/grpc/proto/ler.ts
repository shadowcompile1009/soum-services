import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  LerServiceClient as _ler_LerServiceClient,
  LerServiceDefinition as _ler_LerServiceDefinition,
} from './ler/LerService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  ler: {
    CancelShipmentRequest: MessageTypeDefinition;
    CancelShipmentResponse: MessageTypeDefinition;
    CreatePickupForAccessoriesRequest: MessageTypeDefinition;
    CreatePickupRequest: MessageTypeDefinition;
    CreatePickupResponse: MessageTypeDefinition;
    CreateShipmentReq: MessageTypeDefinition;
    CreateShipmentResponse: MessageTypeDefinition;
    GetCityTiersRequest: MessageTypeDefinition;
    GetCityTiersResponse: MessageTypeDefinition;
    GetLogisticServicesRequest: MessageTypeDefinition;
    GetLogisticServicesResponse: MessageTypeDefinition;
    GetPickupStatusRequest: MessageTypeDefinition;
    LerService: SubtypeConstructor<
      typeof grpc.Client,
      _ler_LerServiceClient
    > & { service: _ler_LerServiceDefinition };
    MapLogisticsServicesRequest: MessageTypeDefinition;
    MapLogisticsServicesResponse: MessageTypeDefinition;
    SkuDetails: MessageTypeDefinition;
    User: MessageTypeDefinition;
  };
}
