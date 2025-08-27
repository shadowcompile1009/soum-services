// Original file: node_modules/soum-proto/proto/product.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  GetPreSignURLProductImgsRequest as _product_GetPreSignURLProductImgsRequest,
  GetPreSignURLProductImgsRequest__Output as _product_GetPreSignURLProductImgsRequest__Output,
} from '../product/GetPreSignURLProductImgsRequest';
import type {
  GetPreSignURLProductImgsResponse as _product_GetPreSignURLProductImgsResponse,
  GetPreSignURLProductImgsResponse__Output as _product_GetPreSignURLProductImgsResponse__Output,
} from '../product/GetPreSignURLProductImgsResponse';
import type {
  MigrateImagesRequest as _product_MigrateImagesRequest,
  MigrateImagesRequest__Output as _product_MigrateImagesRequest__Output,
} from '../product/MigrateImagesRequest';
import type {
  MigrateImagesResponse as _product_MigrateImagesResponse,
  MigrateImagesResponse__Output as _product_MigrateImagesResponse__Output,
} from '../product/MigrateImagesResponse';
import type {
  UpdateConsignmentStatusRequest as _product_UpdateConsignmentStatusRequest,
  UpdateConsignmentStatusRequest__Output as _product_UpdateConsignmentStatusRequest__Output,
} from '../product/UpdateConsignmentStatusRequest';
import type {
  UpdateConsignmentStatusResponse as _product_UpdateConsignmentStatusResponse,
  UpdateConsignmentStatusResponse__Output as _product_UpdateConsignmentStatusResponse__Output,
} from '../product/UpdateConsignmentStatusResponse';
import type {
  UpdateProductRequest as _product_UpdateProductRequest,
  UpdateProductRequest__Output as _product_UpdateProductRequest__Output,
} from '../product/UpdateProductRequest';
import type {
  UpdateProductResponse as _product_UpdateProductResponse,
  UpdateProductResponse__Output as _product_UpdateProductResponse__Output,
} from '../product/UpdateProductResponse';
import type {
  getProductDataForFeedsReq as _product_getProductDataForFeedsReq,
  getProductDataForFeedsReq__Output as _product_getProductDataForFeedsReq__Output,
} from '../product/getProductDataForFeedsReq';
import type {
  getProductDataForFeedsRes as _product_getProductDataForFeedsRes,
  getProductDataForFeedsRes__Output as _product_getProductDataForFeedsRes__Output,
} from '../product/getProductDataForFeedsRes';

export interface ProductServiceClient extends grpc.Client {
  GetPreSignURLProductImgs(
    argument: _product_GetPreSignURLProductImgsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_GetPreSignURLProductImgsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPreSignURLProductImgs(
    argument: _product_GetPreSignURLProductImgsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_product_GetPreSignURLProductImgsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPreSignURLProductImgs(
    argument: _product_GetPreSignURLProductImgsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_GetPreSignURLProductImgsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPreSignURLProductImgs(
    argument: _product_GetPreSignURLProductImgsRequest,
    callback: grpc.requestCallback<_product_GetPreSignURLProductImgsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPreSignUrlProductImgs(
    argument: _product_GetPreSignURLProductImgsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_GetPreSignURLProductImgsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPreSignUrlProductImgs(
    argument: _product_GetPreSignURLProductImgsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_product_GetPreSignURLProductImgsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPreSignUrlProductImgs(
    argument: _product_GetPreSignURLProductImgsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_GetPreSignURLProductImgsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPreSignUrlProductImgs(
    argument: _product_GetPreSignURLProductImgsRequest,
    callback: grpc.requestCallback<_product_GetPreSignURLProductImgsResponse__Output>
  ): grpc.ClientUnaryCall;

  GetProductDataForFeeds(
    argument: _product_getProductDataForFeedsReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_getProductDataForFeedsRes__Output>
  ): grpc.ClientUnaryCall;
  GetProductDataForFeeds(
    argument: _product_getProductDataForFeedsReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_product_getProductDataForFeedsRes__Output>
  ): grpc.ClientUnaryCall;
  GetProductDataForFeeds(
    argument: _product_getProductDataForFeedsReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_getProductDataForFeedsRes__Output>
  ): grpc.ClientUnaryCall;
  GetProductDataForFeeds(
    argument: _product_getProductDataForFeedsReq,
    callback: grpc.requestCallback<_product_getProductDataForFeedsRes__Output>
  ): grpc.ClientUnaryCall;
  getProductDataForFeeds(
    argument: _product_getProductDataForFeedsReq,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_getProductDataForFeedsRes__Output>
  ): grpc.ClientUnaryCall;
  getProductDataForFeeds(
    argument: _product_getProductDataForFeedsReq,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_product_getProductDataForFeedsRes__Output>
  ): grpc.ClientUnaryCall;
  getProductDataForFeeds(
    argument: _product_getProductDataForFeedsReq,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_getProductDataForFeedsRes__Output>
  ): grpc.ClientUnaryCall;
  getProductDataForFeeds(
    argument: _product_getProductDataForFeedsReq,
    callback: grpc.requestCallback<_product_getProductDataForFeedsRes__Output>
  ): grpc.ClientUnaryCall;

  MigrateImages(
    argument: _product_MigrateImagesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_MigrateImagesResponse__Output>
  ): grpc.ClientUnaryCall;
  MigrateImages(
    argument: _product_MigrateImagesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_product_MigrateImagesResponse__Output>
  ): grpc.ClientUnaryCall;
  MigrateImages(
    argument: _product_MigrateImagesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_MigrateImagesResponse__Output>
  ): grpc.ClientUnaryCall;
  MigrateImages(
    argument: _product_MigrateImagesRequest,
    callback: grpc.requestCallback<_product_MigrateImagesResponse__Output>
  ): grpc.ClientUnaryCall;
  migrateImages(
    argument: _product_MigrateImagesRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_MigrateImagesResponse__Output>
  ): grpc.ClientUnaryCall;
  migrateImages(
    argument: _product_MigrateImagesRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_product_MigrateImagesResponse__Output>
  ): grpc.ClientUnaryCall;
  migrateImages(
    argument: _product_MigrateImagesRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_MigrateImagesResponse__Output>
  ): grpc.ClientUnaryCall;
  migrateImages(
    argument: _product_MigrateImagesRequest,
    callback: grpc.requestCallback<_product_MigrateImagesResponse__Output>
  ): grpc.ClientUnaryCall;

  UpdateConsignmentStatus(
    argument: _product_UpdateConsignmentStatusRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_UpdateConsignmentStatusResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateConsignmentStatus(
    argument: _product_UpdateConsignmentStatusRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_product_UpdateConsignmentStatusResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateConsignmentStatus(
    argument: _product_UpdateConsignmentStatusRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_UpdateConsignmentStatusResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateConsignmentStatus(
    argument: _product_UpdateConsignmentStatusRequest,
    callback: grpc.requestCallback<_product_UpdateConsignmentStatusResponse__Output>
  ): grpc.ClientUnaryCall;
  updateConsignmentStatus(
    argument: _product_UpdateConsignmentStatusRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_UpdateConsignmentStatusResponse__Output>
  ): grpc.ClientUnaryCall;
  updateConsignmentStatus(
    argument: _product_UpdateConsignmentStatusRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_product_UpdateConsignmentStatusResponse__Output>
  ): grpc.ClientUnaryCall;
  updateConsignmentStatus(
    argument: _product_UpdateConsignmentStatusRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_UpdateConsignmentStatusResponse__Output>
  ): grpc.ClientUnaryCall;
  updateConsignmentStatus(
    argument: _product_UpdateConsignmentStatusRequest,
    callback: grpc.requestCallback<_product_UpdateConsignmentStatusResponse__Output>
  ): grpc.ClientUnaryCall;

  UpdateProduct(
    argument: _product_UpdateProductRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_UpdateProductResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateProduct(
    argument: _product_UpdateProductRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_product_UpdateProductResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateProduct(
    argument: _product_UpdateProductRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_UpdateProductResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateProduct(
    argument: _product_UpdateProductRequest,
    callback: grpc.requestCallback<_product_UpdateProductResponse__Output>
  ): grpc.ClientUnaryCall;
  updateProduct(
    argument: _product_UpdateProductRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_UpdateProductResponse__Output>
  ): grpc.ClientUnaryCall;
  updateProduct(
    argument: _product_UpdateProductRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_product_UpdateProductResponse__Output>
  ): grpc.ClientUnaryCall;
  updateProduct(
    argument: _product_UpdateProductRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_product_UpdateProductResponse__Output>
  ): grpc.ClientUnaryCall;
  updateProduct(
    argument: _product_UpdateProductRequest,
    callback: grpc.requestCallback<_product_UpdateProductResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface ProductServiceHandlers
  extends grpc.UntypedServiceImplementation {
  GetPreSignURLProductImgs: grpc.handleUnaryCall<
    _product_GetPreSignURLProductImgsRequest__Output,
    _product_GetPreSignURLProductImgsResponse
  >;

  GetProductDataForFeeds: grpc.handleUnaryCall<
    _product_getProductDataForFeedsReq__Output,
    _product_getProductDataForFeedsRes
  >;

  MigrateImages: grpc.handleUnaryCall<
    _product_MigrateImagesRequest__Output,
    _product_MigrateImagesResponse
  >;

  UpdateConsignmentStatus: grpc.handleUnaryCall<
    _product_UpdateConsignmentStatusRequest__Output,
    _product_UpdateConsignmentStatusResponse
  >;

  UpdateProduct: grpc.handleUnaryCall<
    _product_UpdateProductRequest__Output,
    _product_UpdateProductResponse
  >;
}

export interface ProductServiceDefinition extends grpc.ServiceDefinition {
  GetPreSignURLProductImgs: MethodDefinition<
    _product_GetPreSignURLProductImgsRequest,
    _product_GetPreSignURLProductImgsResponse,
    _product_GetPreSignURLProductImgsRequest__Output,
    _product_GetPreSignURLProductImgsResponse__Output
  >;
  GetProductDataForFeeds: MethodDefinition<
    _product_getProductDataForFeedsReq,
    _product_getProductDataForFeedsRes,
    _product_getProductDataForFeedsReq__Output,
    _product_getProductDataForFeedsRes__Output
  >;
  MigrateImages: MethodDefinition<
    _product_MigrateImagesRequest,
    _product_MigrateImagesResponse,
    _product_MigrateImagesRequest__Output,
    _product_MigrateImagesResponse__Output
  >;
  UpdateConsignmentStatus: MethodDefinition<
    _product_UpdateConsignmentStatusRequest,
    _product_UpdateConsignmentStatusResponse,
    _product_UpdateConsignmentStatusRequest__Output,
    _product_UpdateConsignmentStatusResponse__Output
  >;
  UpdateProduct: MethodDefinition<
    _product_UpdateProductRequest,
    _product_UpdateProductResponse,
    _product_UpdateProductRequest__Output,
    _product_UpdateProductResponse__Output
  >;
}
