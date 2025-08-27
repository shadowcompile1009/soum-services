import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  ProductServiceClient as _product_ProductServiceClient,
  ProductServiceDefinition as _product_ProductServiceDefinition,
} from './product/ProductService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  product: {
    Banner: MessageTypeDefinition;
    BreakDownResponse: MessageTypeDefinition;
    Category: MessageTypeDefinition;
    CommissionSummaryResponse: MessageTypeDefinition;
    Condition: MessageTypeDefinition;
    GetPreSignURLProductImgsRequest: MessageTypeDefinition;
    GetPreSignURLProductImgsResponse: MessageTypeDefinition;
    MigrateImagesRequest: MessageTypeDefinition;
    MigrateImagesResponse: MessageTypeDefinition;
    OrderUpdateProductRequest: MessageTypeDefinition;
    Product: MessageTypeDefinition;
    ProductDeepLoad: MessageTypeDefinition;
    ProductImgSections: MessageTypeDefinition;
    ProductService: SubtypeConstructor<
      typeof grpc.Client,
      _product_ProductServiceClient
    > & { service: _product_ProductServiceDefinition };
    PromoCode: MessageTypeDefinition;
    StatusSummary: MessageTypeDefinition;
    URLData: MessageTypeDefinition;
    UpdateConsignmentStatusRequest: MessageTypeDefinition;
    UpdateConsignmentStatusResponse: MessageTypeDefinition;
    UpdateProductRequest: MessageTypeDefinition;
    UpdateProductResponse: MessageTypeDefinition;
    getProductDataForFeedsReq: MessageTypeDefinition;
    getProductDataForFeedsRes: MessageTypeDefinition;
  };
}
