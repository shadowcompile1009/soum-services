// Original file: node_modules/soum-proto/proto/ler.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  CancelShipmentRequest as _ler_CancelShipmentRequest,
  CancelShipmentRequest__Output as _ler_CancelShipmentRequest__Output,
} from '../ler/CancelShipmentRequest';
import type {
  CancelShipmentResponse as _ler_CancelShipmentResponse,
  CancelShipmentResponse__Output as _ler_CancelShipmentResponse__Output,
} from '../ler/CancelShipmentResponse';
import type {
  CreatePickupForAccessoriesRequest as _ler_CreatePickupForAccessoriesRequest,
  CreatePickupForAccessoriesRequest__Output as _ler_CreatePickupForAccessoriesRequest__Output,
} from '../ler/CreatePickupForAccessoriesRequest';
import type {
  CreatePickupRequest as _ler_CreatePickupRequest,
  CreatePickupRequest__Output as _ler_CreatePickupRequest__Output,
} from '../ler/CreatePickupRequest';
import type {
  CreatePickupResponse as _ler_CreatePickupResponse,
  CreatePickupResponse__Output as _ler_CreatePickupResponse__Output,
} from '../ler/CreatePickupResponse';
import type {
  CreateShipmentReq as _ler_CreateShipmentReq,
  CreateShipmentReq__Output as _ler_CreateShipmentReq__Output,
} from '../ler/CreateShipmentReq';
import type {
  CreateShipmentResponse as _ler_CreateShipmentResponse,
  CreateShipmentResponse__Output as _ler_CreateShipmentResponse__Output,
} from '../ler/CreateShipmentResponse';
import type {
  GetCityTiersRequest as _ler_GetCityTiersRequest,
  GetCityTiersRequest__Output as _ler_GetCityTiersRequest__Output,
} from '../ler/GetCityTiersRequest';
import type {
  GetCityTiersResponse as _ler_GetCityTiersResponse,
  GetCityTiersResponse__Output as _ler_GetCityTiersResponse__Output,
} from '../ler/GetCityTiersResponse';
import type {
  GetLogisticServicesRequest as _ler_GetLogisticServicesRequest,
  GetLogisticServicesRequest__Output as _ler_GetLogisticServicesRequest__Output,
} from '../ler/GetLogisticServicesRequest';
import type {
  GetLogisticServicesResponse as _ler_GetLogisticServicesResponse,
  GetLogisticServicesResponse__Output as _ler_GetLogisticServicesResponse__Output,
} from '../ler/GetLogisticServicesResponse';
import type {
  GetPickupStatusRequest as _ler_GetPickupStatusRequest,
  GetPickupStatusRequest__Output as _ler_GetPickupStatusRequest__Output,
} from '../ler/GetPickupStatusRequest';
import type {
  MapLogisticsServicesRequest as _ler_MapLogisticsServicesRequest,
  MapLogisticsServicesRequest__Output as _ler_MapLogisticsServicesRequest__Output,
} from '../ler/MapLogisticsServicesRequest';
import type {
  MapLogisticsServicesResponse as _ler_MapLogisticsServicesResponse,
  MapLogisticsServicesResponse__Output as _ler_MapLogisticsServicesResponse__Output,
} from '../ler/MapLogisticsServicesResponse';

export interface LerServiceClient extends grpc.Client {
  CancelShipment(
    argument: _ler_CancelShipmentRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CancelShipmentResponse__Output>
  ): grpc.ClientUnaryCall;
  CancelShipment(
    argument: _ler_CancelShipmentRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_CancelShipmentResponse__Output>
  ): grpc.ClientUnaryCall;
  CancelShipment(
    argument: _ler_CancelShipmentRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CancelShipmentResponse__Output>
  ): grpc.ClientUnaryCall;
  CancelShipment(
    argument: _ler_CancelShipmentRequest,
    callback: grpc.requestCallback<_ler_CancelShipmentResponse__Output>
  ): grpc.ClientUnaryCall;
  cancelShipment(
    argument: _ler_CancelShipmentRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CancelShipmentResponse__Output>
  ): grpc.ClientUnaryCall;
  cancelShipment(
    argument: _ler_CancelShipmentRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_CancelShipmentResponse__Output>
  ): grpc.ClientUnaryCall;
  cancelShipment(
    argument: _ler_CancelShipmentRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CancelShipmentResponse__Output>
  ): grpc.ClientUnaryCall;
  cancelShipment(
    argument: _ler_CancelShipmentRequest,
    callback: grpc.requestCallback<_ler_CancelShipmentResponse__Output>
  ): grpc.ClientUnaryCall;

  CreatePickUpForAccessories(
    argument: _ler_CreatePickupForAccessoriesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;
  CreatePickUpForAccessories(
    argument: _ler_CreatePickupForAccessoriesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;
  CreatePickUpForAccessories(
    argument: _ler_CreatePickupForAccessoriesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;
  CreatePickUpForAccessories(
    argument: _ler_CreatePickupForAccessoriesRequest,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;
  createPickUpForAccessories(
    argument: _ler_CreatePickupForAccessoriesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;
  createPickUpForAccessories(
    argument: _ler_CreatePickupForAccessoriesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;
  createPickUpForAccessories(
    argument: _ler_CreatePickupForAccessoriesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;
  createPickUpForAccessories(
    argument: _ler_CreatePickupForAccessoriesRequest,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;

  CreatePickup(
    argument: _ler_CreatePickupRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;
  CreatePickup(
    argument: _ler_CreatePickupRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;
  CreatePickup(
    argument: _ler_CreatePickupRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;
  CreatePickup(
    argument: _ler_CreatePickupRequest,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;
  createPickup(
    argument: _ler_CreatePickupRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;
  createPickup(
    argument: _ler_CreatePickupRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;
  createPickup(
    argument: _ler_CreatePickupRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;
  createPickup(
    argument: _ler_CreatePickupRequest,
    callback: grpc.requestCallback<_ler_CreatePickupResponse__Output>
  ): grpc.ClientUnaryCall;

  CreateShipment(
    argument: _ler_CreateShipmentReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CreateShipmentResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateShipment(
    argument: _ler_CreateShipmentReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_CreateShipmentResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateShipment(
    argument: _ler_CreateShipmentReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CreateShipmentResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateShipment(
    argument: _ler_CreateShipmentReq,
    callback: grpc.requestCallback<_ler_CreateShipmentResponse__Output>
  ): grpc.ClientUnaryCall;
  createShipment(
    argument: _ler_CreateShipmentReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CreateShipmentResponse__Output>
  ): grpc.ClientUnaryCall;
  createShipment(
    argument: _ler_CreateShipmentReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_CreateShipmentResponse__Output>
  ): grpc.ClientUnaryCall;
  createShipment(
    argument: _ler_CreateShipmentReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_CreateShipmentResponse__Output>
  ): grpc.ClientUnaryCall;
  createShipment(
    argument: _ler_CreateShipmentReq,
    callback: grpc.requestCallback<_ler_CreateShipmentResponse__Output>
  ): grpc.ClientUnaryCall;

  GetCityTiers(
    argument: _ler_GetCityTiersRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_GetCityTiersResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCityTiers(
    argument: _ler_GetCityTiersRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_GetCityTiersResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCityTiers(
    argument: _ler_GetCityTiersRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_GetCityTiersResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCityTiers(
    argument: _ler_GetCityTiersRequest,
    callback: grpc.requestCallback<_ler_GetCityTiersResponse__Output>
  ): grpc.ClientUnaryCall;
  getCityTiers(
    argument: _ler_GetCityTiersRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_GetCityTiersResponse__Output>
  ): grpc.ClientUnaryCall;
  getCityTiers(
    argument: _ler_GetCityTiersRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_GetCityTiersResponse__Output>
  ): grpc.ClientUnaryCall;
  getCityTiers(
    argument: _ler_GetCityTiersRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_GetCityTiersResponse__Output>
  ): grpc.ClientUnaryCall;
  getCityTiers(
    argument: _ler_GetCityTiersRequest,
    callback: grpc.requestCallback<_ler_GetCityTiersResponse__Output>
  ): grpc.ClientUnaryCall;

  GetLogisticServices(
    argument: _ler_GetLogisticServicesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_GetLogisticServicesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetLogisticServices(
    argument: _ler_GetLogisticServicesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_GetLogisticServicesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetLogisticServices(
    argument: _ler_GetLogisticServicesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_GetLogisticServicesResponse__Output>
  ): grpc.ClientUnaryCall;
  GetLogisticServices(
    argument: _ler_GetLogisticServicesRequest,
    callback: grpc.requestCallback<_ler_GetLogisticServicesResponse__Output>
  ): grpc.ClientUnaryCall;
  getLogisticServices(
    argument: _ler_GetLogisticServicesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_GetLogisticServicesResponse__Output>
  ): grpc.ClientUnaryCall;
  getLogisticServices(
    argument: _ler_GetLogisticServicesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_GetLogisticServicesResponse__Output>
  ): grpc.ClientUnaryCall;
  getLogisticServices(
    argument: _ler_GetLogisticServicesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_GetLogisticServicesResponse__Output>
  ): grpc.ClientUnaryCall;
  getLogisticServices(
    argument: _ler_GetLogisticServicesRequest,
    callback: grpc.requestCallback<_ler_GetLogisticServicesResponse__Output>
  ): grpc.ClientUnaryCall;

  GetPickupStatus(
    argument: _ler_GetPickupStatusRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_GetPickupStatusRequest__Output>
  ): grpc.ClientUnaryCall;
  GetPickupStatus(
    argument: _ler_GetPickupStatusRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_GetPickupStatusRequest__Output>
  ): grpc.ClientUnaryCall;
  GetPickupStatus(
    argument: _ler_GetPickupStatusRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_GetPickupStatusRequest__Output>
  ): grpc.ClientUnaryCall;
  GetPickupStatus(
    argument: _ler_GetPickupStatusRequest,
    callback: grpc.requestCallback<_ler_GetPickupStatusRequest__Output>
  ): grpc.ClientUnaryCall;
  getPickupStatus(
    argument: _ler_GetPickupStatusRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_GetPickupStatusRequest__Output>
  ): grpc.ClientUnaryCall;
  getPickupStatus(
    argument: _ler_GetPickupStatusRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_GetPickupStatusRequest__Output>
  ): grpc.ClientUnaryCall;
  getPickupStatus(
    argument: _ler_GetPickupStatusRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_GetPickupStatusRequest__Output>
  ): grpc.ClientUnaryCall;
  getPickupStatus(
    argument: _ler_GetPickupStatusRequest,
    callback: grpc.requestCallback<_ler_GetPickupStatusRequest__Output>
  ): grpc.ClientUnaryCall;

  MapLogisticsServices(
    argument: _ler_MapLogisticsServicesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_MapLogisticsServicesResponse__Output>
  ): grpc.ClientUnaryCall;
  MapLogisticsServices(
    argument: _ler_MapLogisticsServicesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_MapLogisticsServicesResponse__Output>
  ): grpc.ClientUnaryCall;
  MapLogisticsServices(
    argument: _ler_MapLogisticsServicesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_MapLogisticsServicesResponse__Output>
  ): grpc.ClientUnaryCall;
  MapLogisticsServices(
    argument: _ler_MapLogisticsServicesRequest,
    callback: grpc.requestCallback<_ler_MapLogisticsServicesResponse__Output>
  ): grpc.ClientUnaryCall;
  mapLogisticsServices(
    argument: _ler_MapLogisticsServicesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_MapLogisticsServicesResponse__Output>
  ): grpc.ClientUnaryCall;
  mapLogisticsServices(
    argument: _ler_MapLogisticsServicesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ler_MapLogisticsServicesResponse__Output>
  ): grpc.ClientUnaryCall;
  mapLogisticsServices(
    argument: _ler_MapLogisticsServicesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ler_MapLogisticsServicesResponse__Output>
  ): grpc.ClientUnaryCall;
  mapLogisticsServices(
    argument: _ler_MapLogisticsServicesRequest,
    callback: grpc.requestCallback<_ler_MapLogisticsServicesResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface LerServiceHandlers extends grpc.UntypedServiceImplementation {
  CancelShipment: grpc.handleUnaryCall<
    _ler_CancelShipmentRequest__Output,
    _ler_CancelShipmentResponse
  >;

  CreatePickUpForAccessories: grpc.handleUnaryCall<
    _ler_CreatePickupForAccessoriesRequest__Output,
    _ler_CreatePickupResponse
  >;

  CreatePickup: grpc.handleUnaryCall<
    _ler_CreatePickupRequest__Output,
    _ler_CreatePickupResponse
  >;

  CreateShipment: grpc.handleUnaryCall<
    _ler_CreateShipmentReq__Output,
    _ler_CreateShipmentResponse
  >;

  GetCityTiers: grpc.handleUnaryCall<
    _ler_GetCityTiersRequest__Output,
    _ler_GetCityTiersResponse
  >;

  GetLogisticServices: grpc.handleUnaryCall<
    _ler_GetLogisticServicesRequest__Output,
    _ler_GetLogisticServicesResponse
  >;

  GetPickupStatus: grpc.handleUnaryCall<
    _ler_GetPickupStatusRequest__Output,
    _ler_GetPickupStatusRequest
  >;

  MapLogisticsServices: grpc.handleUnaryCall<
    _ler_MapLogisticsServicesRequest__Output,
    _ler_MapLogisticsServicesResponse
  >;
}

export interface LerServiceDefinition extends grpc.ServiceDefinition {
  CancelShipment: MethodDefinition<
    _ler_CancelShipmentRequest,
    _ler_CancelShipmentResponse,
    _ler_CancelShipmentRequest__Output,
    _ler_CancelShipmentResponse__Output
  >;
  CreatePickUpForAccessories: MethodDefinition<
    _ler_CreatePickupForAccessoriesRequest,
    _ler_CreatePickupResponse,
    _ler_CreatePickupForAccessoriesRequest__Output,
    _ler_CreatePickupResponse__Output
  >;
  CreatePickup: MethodDefinition<
    _ler_CreatePickupRequest,
    _ler_CreatePickupResponse,
    _ler_CreatePickupRequest__Output,
    _ler_CreatePickupResponse__Output
  >;
  CreateShipment: MethodDefinition<
    _ler_CreateShipmentReq,
    _ler_CreateShipmentResponse,
    _ler_CreateShipmentReq__Output,
    _ler_CreateShipmentResponse__Output
  >;
  GetCityTiers: MethodDefinition<
    _ler_GetCityTiersRequest,
    _ler_GetCityTiersResponse,
    _ler_GetCityTiersRequest__Output,
    _ler_GetCityTiersResponse__Output
  >;
  GetLogisticServices: MethodDefinition<
    _ler_GetLogisticServicesRequest,
    _ler_GetLogisticServicesResponse,
    _ler_GetLogisticServicesRequest__Output,
    _ler_GetLogisticServicesResponse__Output
  >;
  GetPickupStatus: MethodDefinition<
    _ler_GetPickupStatusRequest,
    _ler_GetPickupStatusRequest,
    _ler_GetPickupStatusRequest__Output,
    _ler_GetPickupStatusRequest__Output
  >;
  MapLogisticsServices: MethodDefinition<
    _ler_MapLogisticsServicesRequest,
    _ler_MapLogisticsServicesResponse,
    _ler_MapLogisticsServicesRequest__Output,
    _ler_MapLogisticsServicesResponse__Output
  >;
}
