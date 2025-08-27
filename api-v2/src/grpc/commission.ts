import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/commission';
import { CommissionSummaryResponse } from './proto/commission/CommissionSummaryResponse';
import { ProductCommissionSummaryRequest } from './proto/commission/ProductCommissionSummaryRequest';
import { ProductCommissionSummaryResponse } from './proto/commission/ProductCommissionSummaryResponse';
import { UpdateSellerCommissionRequest } from './proto/commission/UpdateSellerCommissionRequest';
import { CalculateCommissionSummaryRequest } from './proto/commission/CalculateCommissionSummaryRequest';
import { BreakDownResponse } from './proto/commission/BreakDownResponse';
import { CreateCommissionSummaryRequest } from './proto/commission/CreateCommissionSummaryRequest';
import { MigrateCommissionSummaryRequest } from './proto/commission/MigrateCommissionSummaryRequest';
import { GetPromoDetailsRequest } from './proto/commission/GetPromoDetailsRequest';
import { DetailedPromoCode } from './proto/commission/DetailedPromoCode';
import { GetFeedPromosRequest } from './proto/commission/GetFeedPromosRequest';
import { GetFeedPromosResponse } from './proto/commission/GetFeedPromosResponse';
import { GetFeedPromoRequest } from './proto/commission/GetFeedPromoRequest';
import { GetPromosByIdsRequest } from './proto/commission/GetPromosByIdsRequest';
import { GetPromosByIdsResponse } from './proto/commission/GetPromosByIdsResponse';
import { UpdateUsageCountRequest } from './proto/commission/UpdateUsageCountRequest';
import { UpdateUsageCountResponse } from './proto/commission/UpdateUsageCountResponse';
import { ForceUpdateCommissionRequest } from './proto/commission/ForceUpdateCommissionRequest';

let host = '0.0.0.0:50053';
if (process.env.NODE_ENV !== 'local') {
  host = `soum-${process.env.COMMISSION_SVC}-${process.env.PREFIX}-srv:50051`;
}
const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/commission.proto'
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const CommissionGrpcSvc = new proto.commission.CommissionService(
  host,
  grpc.credentials.createInsecure()
);

const metadata = new grpc.Metadata();

export const createProductCommissionSummary = (
  data: CreateCommissionSummaryRequest
): Promise<CommissionSummaryResponse> =>
  new Promise(async (resolve, reject) => {
    CommissionGrpcSvc.createProductCommissionSummary(
      data,
      metadata,
      (error, reply) => {
        if (error) {
          reject(error);
        }
        resolve(reply);
      }
    );
  });

export const calculateProductCommissionSummary = (
  data: CalculateCommissionSummaryRequest
): Promise<BreakDownResponse[]> =>
  new Promise((resolve, reject) => {
    CommissionGrpcSvc.calculateProductCommissionSummary(
      data,
      metadata,
      (error, reply) => {
        if (error) {
          reject(error);
        }
        if (!reply?.commissionSummaries?.length)
          reject('No commissions was found');
        resolve(reply.commissionSummaries);
      }
    );
  });
export const migrateProductCommissionSummary = (
  data: MigrateCommissionSummaryRequest
): Promise<CommissionSummaryResponse> =>
  new Promise(async (resolve, reject) => {
    CommissionGrpcSvc.migrateProductCommissionSummary(
      data,
      metadata,
      (error, reply) => {
        if (error) {
          reject(error);
        }
        resolve(reply);
      }
    );
  });
export const getProductSummaryCommission = (
  data: ProductCommissionSummaryRequest
): Promise<ProductCommissionSummaryResponse> =>
  new Promise(async (resolve, reject) => {
    CommissionGrpcSvc.getProductCommissionSummary(
      data,
      metadata,
      (error, reply) => {
        if (error) {
          reject(error);
        }
        if (!reply.id) resolve(null);
        resolve(reply);
      }
    );
  });

export const updateSellerCommission = (
  data: UpdateSellerCommissionRequest
): Promise<ProductCommissionSummaryResponse> =>
  new Promise(async (resolve, reject) => {
    CommissionGrpcSvc.updateSellerCommission(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      if (!reply.id) resolve(null);
      resolve(reply);
    });
  });

export const forceUpdateCommission = (
  data: ForceUpdateCommissionRequest
): Promise<ProductCommissionSummaryResponse> =>
  new Promise(async (resolve, reject) => {
    CommissionGrpcSvc.forceUpdateCommission(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      if (!reply.id) resolve(null);
      resolve(reply);
    });
  });

export const updateSellPriceInCommissionSummary = (
  data: UpdateSellerCommissionRequest
): Promise<ProductCommissionSummaryResponse> =>
  new Promise(async (resolve, reject) => {
    CommissionGrpcSvc.updateSellPrice(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      if (!reply.id) resolve(null);
      resolve(reply);
    });
  });
export const addSellerCommissionPenalty = (
  data: UpdateSellerCommissionRequest
): Promise<ProductCommissionSummaryResponse> =>
  new Promise(async (resolve, reject) => {
    CommissionGrpcSvc.addSellerCommissionPenalty(
      data,
      metadata,
      (error, reply) => {
        if (error) {
          reject(error);
        }
        if (!reply.id) resolve(null);
        resolve(reply);
      }
    );
  });

export const updatePromoCodeUsageCount = (
  data: UpdateUsageCountRequest
): Promise<UpdateUsageCountResponse> =>
  new Promise(async (resolve, reject) => {
    CommissionGrpcSvc.updateUsageCount(data, metadata, (error, reply) => {
      if (error) {
        console.log({ error });
        reject(error);
      }
      resolve(reply);
    });
  });

export const getPromoCodeDetails = (
  data: GetPromoDetailsRequest,
  returnNullOnError = true
): Promise<DetailedPromoCode> =>
  new Promise(async (resolve, reject) => {
    CommissionGrpcSvc.getPromoDetails(data, metadata, (error, reply) => {
      if (error) {
        if (returnNullOnError) {
          resolve(null);
        }
        reject(error);
      }
      resolve(reply);
    });
  });

export const getPromoCodeDetailsById = async (
  promoCodeId: string
): Promise<DetailedPromoCode> => {
  try {
    return await getPromoCodeDetails({
      filterField: '_id',
      filterFieldValue: promoCodeId,
    });
  } catch (error) {
    return null;
  }
};

export const getDefaultPromoCode = (
  returnNullOnError = true
): Promise<DetailedPromoCode> =>
  new Promise(async (resolve, reject) => {
    CommissionGrpcSvc.getDefaultPromoCode({}, metadata, (error, reply) => {
      if (error) {
        if (returnNullOnError) {
          resolve(null);
        }
        reject(error);
      }
      resolve(reply);
    });
  });

export const getFeedPromos = (
  data: GetFeedPromosRequest,
  returnNullOnError = true
): Promise<GetFeedPromosResponse> =>
  new Promise(async (resolve, reject) => {
    CommissionGrpcSvc.getFeedPromos(data, metadata, (error, reply) => {
      if (error) {
        if (returnNullOnError) {
          resolve(null);
        }
        reject(error);
      }
      resolve(reply);
    });
  });

export const getFeedPromo = (
  data: GetFeedPromoRequest,
  returnNullOnError = true
): Promise<DetailedPromoCode> =>
  new Promise(async (resolve, reject) => {
    CommissionGrpcSvc.getFeedPromo(data, metadata, (error, reply) => {
      if (error) {
        if (returnNullOnError) {
          resolve(null);
        }
        reject(error);
      }
      resolve(reply);
    });
  });

export const getPromosByIds = (
  data: GetPromosByIdsRequest,
  returnNullOnError = true
): Promise<GetPromosByIdsResponse> =>
  new Promise(async (resolve, reject) => {
    CommissionGrpcSvc.getPromosByIds(data, metadata, (error, reply) => {
      if (error) {
        if (returnNullOnError) {
          resolve({ promos: [] });
        }
        reject(error);
      }
      resolve(reply);
    });
  });
