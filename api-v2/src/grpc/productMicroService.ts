import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/product';
import { getProductDataForFeedsRes } from './proto/product/getProductDataForFeedsRes';
import { getProductDataForFeedsReq } from './proto/product/getProductDataForFeedsReq';
import { GetPreSignURLProductImgsRequest } from './proto/product/GetPreSignURLProductImgsRequest';
import { GetPreSignURLProductImgsResponse } from './proto/product/GetPreSignURLProductImgsResponse';
import { MigrateImagesRequest } from './proto/product/MigrateImagesRequest';
import { MigrateImagesResponse } from './proto/product/MigrateImagesResponse';
import {
  UpdateConsignmentStatusRequest,
  UpdateConsignmentStatusResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from './proto/product.pb';

let host = '0.0.0.0:50059';

if (process.env.NODE_ENV !== 'local') {
  host = `soum-${process.env.PRODUCT_SVC}-${process.env.PREFIX}-srv:50051`;
}
const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/product.proto'
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const ProductGrpcSvc = new proto.product.ProductService(
  host,
  grpc.credentials.createInsecure()
);

export const migrateImages = (
  data: MigrateImagesRequest
): Promise<MigrateImagesResponse> => {
  return new Promise(async (resolve, reject) => {
    ProductGrpcSvc.MigrateImages(data, (error, reply) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(reply);
    });
  });
};

export const getProductDataForFeeds = (
  data: getProductDataForFeedsReq
): Promise<getProductDataForFeedsRes> => {
  return new Promise(async (resolve, reject) => {
    ProductGrpcSvc.getProductDataForFeeds(data, (error, reply) => {
      if (error) {
        reject({ products: [] } as getProductDataForFeedsRes);
      }
      resolve(reply);
    });
  });
};

export const getPreSignURLProductImgs = (
  data: GetPreSignURLProductImgsRequest
): Promise<GetPreSignURLProductImgsResponse> => {
  return new Promise(async (resolve, reject) => {
    ProductGrpcSvc.GetPreSignURLProductImgs(data, (error, reply) => {
      if (error) {
        reject({ imgURLs: [] } as GetPreSignURLProductImgsResponse);
      }
      resolve(reply);
    });
  });
};

export const syncProduct = (
  data: UpdateProductRequest
): Promise<UpdateProductResponse> => {
  return new Promise(async (resolve, reject) => {
    ProductGrpcSvc.updateProduct(data, (error, reply) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(reply);
    });
  });
};

export const updateConsignmentStatus = (
  data: UpdateConsignmentStatusRequest
): Promise<UpdateConsignmentStatusResponse> => {
  return new Promise(async (resolve, reject) => {
    ProductGrpcSvc.UpdateConsignmentStatus(data, (error, reply) => {
      if (error) {
        reject({});
      }
      resolve(reply);
    });
  });
};
