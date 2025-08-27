import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/dmbackend';
import { GetHoldingPenaltyBalanceRequest } from './proto/dmbackend/GetHoldingPenaltyBalanceRequest';
import { GetHoldingPenaltyBalanceResponse } from './proto/dmbackend/GetHoldingPenaltyBalanceResponse';
import { GetStandingPenaltyToDmoRequest } from './proto/dmbackend/GetStandingPenaltyToDmoRequest';
import { GetStandingPenaltyToDmoResponse } from './proto/dmbackend/GetStandingPenaltyToDmoResponse';
import { UpdateHoldingPenaltyRequest } from './proto/dmbackend/UpdateHoldingPenaltyRequest';
import { UpdateHoldingPenaltyResponse } from './proto/dmbackend/UpdateHoldingPenaltyResponse';
import { GetCancellationFeeRequest } from './proto/dmbackend/GetCancellationFeeRequest';
import { GetCancellationFeeResponse } from './proto/dmbackend/GetCancellationFeeResponse';
import { CreateInvoiceRequest } from './proto/dmbackend/CreateInvoiceRequest';
import { CreateInvoiceResponse } from './proto/dmbackend/CreateInvoiceResponse';

let host = '0.0.0.0:50059';

if (process.env.NODE_ENV !== 'local') {
  host = `soum-${process.env.DM_BACKEND_SVC}-${process.env.PREFIX}-srv:50051`;
}

const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/dmbackend.proto'
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const DmBackendGrpcSvc = new proto.dmbackend.DmBackendService(
  host,
  grpc.credentials.createInsecure()
);

const metadata = new grpc.Metadata();

export const GetHoldingPenaltyBalance = (
  data: GetHoldingPenaltyBalanceRequest
): Promise<GetHoldingPenaltyBalanceResponse> => {
  return new Promise((resolve, reject) => {
    DmBackendGrpcSvc.GetHoldingPenaltyBalance(
      data,
      metadata,
      (error, reply) => {
        if (error) {
          reject(new Error(`Failed to get holding penalty balance: ${error}`));
        }
        resolve(reply);
      }
    );
  });
};
export const GetStandingPenaltyToDmo = (
  data: GetStandingPenaltyToDmoRequest
): Promise<GetStandingPenaltyToDmoResponse> => {
  return new Promise((resolve, reject) => {
    DmBackendGrpcSvc.GetStandingPenaltyToDmo(data, metadata, (error, reply) => {
      if (error) {
        reject(new Error(`Failed to get standing penalty to dmo: ${error}`));
      }
      resolve(reply);
    });
  });
};

export const UpdateHoldingPenalty = (
  data: UpdateHoldingPenaltyRequest
): Promise<UpdateHoldingPenaltyResponse> => {
  return new Promise((resolve, reject) => {
    DmBackendGrpcSvc.UpdateHoldingPenalty(data, metadata, (error, reply) => {
      if (error) {
        reject(new Error(`Failed to update holding penalty: ${error}`));
      }
      resolve(reply);
    });
  });
};

export const GetCancellationFee = (
  data: GetCancellationFeeRequest
): Promise<GetCancellationFeeResponse> => {
  return new Promise((resolve, reject) => {
    DmBackendGrpcSvc.GetCancellationFee(data, metadata, (error, reply) => {
      if (error) {
        reject(new Error(`Failed to update holding penalty: ${error}`));
      }
      resolve(reply);
    });
  });
};

export const createInvoice = (
  data: CreateInvoiceRequest
): Promise<CreateInvoiceResponse> => {
  return new Promise((resolve, reject) => {
    DmBackendGrpcSvc.CreateInvoice(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
};
