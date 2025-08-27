import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/category';
import {
  Condition,
  GetProductCatConRequest,
  GetProductCatConResponse,
} from './proto/category.pb';
import { Category as CategoryGrpc } from './proto/category/Category';
import { CreateAttributeRequest } from './proto/category/CreateAttributeRequest';
import { CreateAttributeResponse } from './proto/category/CreateAttributeResponse';
import { CreateCategoryRequest } from './proto/category/CreateCategoryRequest';
import { CreateCategoryResponse } from './proto/category/CreateCategoryResponse';
import { GetAttributeRequest } from './proto/category/GetAttributeRequest';
import { GetAttributeResponse } from './proto/category/GetAttributeResponse';
import { GetAttributesRequest } from './proto/category/GetAttributesRequest';
import { GetAttributesResponse } from './proto/category/GetAttributesResponse';
import { GetCategoryByNameRequest } from './proto/category/GetCategoryByNameRequest';
import { GetConditionsRequest } from './proto/category/GetConditionsRequest';
import { UpdateAttributeRequest } from './proto/category/UpdateAttributeRequest';
import { UpdateAttributeResponse } from './proto/category/UpdateAttributeResponse';
import { GetMultipleAttributeRequest } from './proto/category/GetMultipleAttributeRequest';
import { GetMultipleAttributeResponse } from './proto/category/GetMultipleAttributeResponse';

let host = '0.0.0.0:50054';
if (process.env.NODE_ENV !== 'local') {
  host = `soum-${process.env.CATEGORY_SVC}-${process.env.PREFIX}-srv:50051`;
}
const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/category.proto'
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const CategoryGrpcSvc = new proto.category.CategoryService(
  host,
  grpc.credentials.createInsecure()
);
const metadata = new grpc.Metadata();

export const getProductCondition = (
  data: GetProductCatConRequest
): Promise<GetProductCatConResponse> =>
  new Promise(async (resolve, reject) => {
    if (!data.id) {
      return resolve({
        condition: null,
        priceQuality: null,
      });
    }
    CategoryGrpcSvc.getProductCatCon(data, (error, reply) => {
      if (error) {
        reject(error);
      }
      return resolve(reply);
    });
  });

export const getConditions = (
  data: GetConditionsRequest
): Promise<Condition[]> =>
  new Promise(async resolve => {
    const callOptions = {
      deadline: Date.now() + 5000,
    };

    CategoryGrpcSvc.getConditions(data, callOptions, (error, reply) => {
      if (error) {
        resolve([]);
      }
      return resolve(reply?.conditions || []);
    });
  });

export const createCategory = (
  data: CreateCategoryRequest
): Promise<CreateCategoryResponse> =>
  new Promise(async (resolve, reject) => {
    CategoryGrpcSvc.CreateCategory(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
export const getCategoryByName = (
  data: GetCategoryByNameRequest
): Promise<CategoryGrpc> =>
  new Promise(async (resolve, reject) => {
    CategoryGrpcSvc.GetCategoryByName(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });

export const getAttributes = (
  data: GetAttributesRequest
): Promise<GetAttributesResponse> =>
  new Promise(async (resolve, reject) => {
    CategoryGrpcSvc.GetAttributes(data, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });

export const getAttribute = (
  data: GetAttributeRequest
): Promise<GetAttributeResponse> =>
  new Promise(async (resolve, reject) => {
    CategoryGrpcSvc.GetAttribute(data, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });

export const getMultipleAttribute = (
  data: GetMultipleAttributeRequest
): Promise<GetMultipleAttributeResponse> =>
  new Promise(async (resolve, reject) => {
    CategoryGrpcSvc.GetMultipleAttribute(data, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });

export const createAttribute = (
  data: CreateAttributeRequest
): Promise<CreateAttributeResponse> =>
  new Promise(async (resolve, reject) => {
    CategoryGrpcSvc.CreateAttribute(data, (error, reply) => {
      if (error) {
        reject(error);
      }

      resolve(reply);
    });
  });

export const updateAttribute = (
  data: UpdateAttributeRequest
): Promise<UpdateAttributeResponse> =>
  new Promise(async (resolve, reject) => {
    CategoryGrpcSvc.UpdateAttribute(data, (error, reply) => {
      if (error) {
        reject(error);
      }

      resolve(reply);
    });
  });

export const deleteAttribute = (
  data: UpdateAttributeRequest
): Promise<UpdateAttributeResponse> =>
  new Promise(async (resolve, reject) => {
    CategoryGrpcSvc.DeleteAttribute(data, (error, reply) => {
      if (error) {
        reject(error);
      }

      resolve(reply);
    });
  });
