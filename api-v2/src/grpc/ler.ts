import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/ler';
import { CreatePickupRequest } from './proto/ler/CreatePickupRequest';
import { CreatePickupResponse } from './proto/ler/CreatePickupResponse';
import { GetCityTiersRequest } from './proto/ler/GetCityTiersRequest';
import { GetCityTiersResponse } from './proto/ler/GetCityTiersResponse';
import { GetLogisticServicesRequest } from './proto/ler/GetLogisticServicesRequest';
import { GetLogisticServicesResponse } from './proto/ler/GetLogisticServicesResponse';
import { MapLogisticsServicesRequest } from './proto/ler/MapLogisticsServicesRequest';
import { MapLogisticsServicesResponse } from './proto/ler/MapLogisticsServicesResponse';
import { GetPickupStatusRequest } from './proto/ler/GetPickupStatusRequest';
import { CreatePickupForAccessoriesRequest } from './proto/ler/CreatePickupForAccessoriesRequest';
import { CancelShipmentRequest } from './proto/ler/CancelShipmentRequest';
import { CancelShipmentResponse } from './proto/ler/CancelShipmentResponse';
import { CreateShipmentReq } from './proto/ler/CreateShipmentReq';
import { CreateShipmentResponse } from './proto/ler/CreateShipmentResponse';

let host = '0.0.0.0:50059';

if (process.env.NODE_ENV !== 'local') {
  host = `soum-${process.env.LER_SVC}-${process.env.PREFIX}-srv:50051`;
}

const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/ler.proto'
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const LerGrpcSvc = new proto.ler.LerService(
  host,
  grpc.credentials.createInsecure()
);

const metadata = new grpc.Metadata();

export const GetCityTiers = (
  data: GetCityTiersRequest
): Promise<GetCityTiersResponse> => {
  return new Promise((resolve, reject) => {
    LerGrpcSvc.GetCityTiers(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
};

export const CreatePickupForOrder = (
  data: CreatePickupRequest
): Promise<CreatePickupResponse> => {
  return new Promise((resolve, reject) => {
    LerGrpcSvc.CreatePickup(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
};

export const CreateShipment = (
  data: CreateShipmentReq
): Promise<CreateShipmentResponse> => {
  return new Promise((resolve, reject) => {
    LerGrpcSvc.CreateShipment(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
};

export const cancelPickupForOrder = (
  data: CancelShipmentRequest
): Promise<CancelShipmentResponse> => {
  return new Promise((resolve, reject) => {
    LerGrpcSvc.CancelShipment(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
};

export const createPickUpForAccessories = (
  data: CreatePickupForAccessoriesRequest
): Promise<CreatePickupResponse> => {
  return new Promise((resolve, reject) => {
    LerGrpcSvc.CreatePickUpForAccessories(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
};

export const MapLogisticsServices = (
  data: MapLogisticsServicesRequest
): Promise<MapLogisticsServicesResponse> => {
  return new Promise((resolve, reject) => {
    LerGrpcSvc.MapLogisticsServices(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
};

export const GetLogisticServices = (
  data: GetLogisticServicesRequest
): Promise<GetLogisticServicesResponse> => {
  return new Promise((resolve, reject) => {
    LerGrpcSvc.GetLogisticServices(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
};

export const GetPickupStatuses = (
  data: GetPickupStatusRequest
): Promise<GetPickupStatusRequest> => {
  return new Promise((resolve, reject) => {
    LerGrpcSvc.GetPickupStatus(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
};
