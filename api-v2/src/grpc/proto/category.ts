import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  CategoryServiceClient as _category_CategoryServiceClient,
  CategoryServiceDefinition as _category_CategoryServiceDefinition,
} from './category/CategoryService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  category: {
    Attribute: MessageTypeDefinition;
    Banner: MessageTypeDefinition;
    Category: MessageTypeDefinition;
    CategoryIds: MessageTypeDefinition;
    CategoryService: SubtypeConstructor<
      typeof grpc.Client,
      _category_CategoryServiceClient
    > & { service: _category_CategoryServiceDefinition };
    Condition: MessageTypeDefinition;
    CreateAttributeRequest: MessageTypeDefinition;
    CreateAttributeResponse: MessageTypeDefinition;
    CreateCategoryRequest: MessageTypeDefinition;
    CreateCategoryResponse: MessageTypeDefinition;
    DeleteAttributeRequest: MessageTypeDefinition;
    DeleteAttributeResponse: MessageTypeDefinition;
    GetAttributeRequest: MessageTypeDefinition;
    GetAttributeResponse: MessageTypeDefinition;
    GetAttributesRequest: MessageTypeDefinition;
    GetAttributesResponse: MessageTypeDefinition;
    GetCatConPriceRangeRequest: MessageTypeDefinition;
    GetCatConPriceRangeResponse: MessageTypeDefinition;
    GetCategoriesByIdsRequest: MessageTypeDefinition;
    GetCategoriesByIdsResponse: MessageTypeDefinition;
    GetCategoriesRequest: MessageTypeDefinition;
    GetCategoriesResponse: MessageTypeDefinition;
    GetCategoryByNameRequest: MessageTypeDefinition;
    GetConditionsRequest: MessageTypeDefinition;
    GetConditionsResponse: MessageTypeDefinition;
    GetMultipleAttributeRequest: MessageTypeDefinition;
    GetMultipleAttributeResponse: MessageTypeDefinition;
    GetProductCatConRequest: MessageTypeDefinition;
    GetProductCatConResponse: MessageTypeDefinition;
    Icon: MessageTypeDefinition;
    Option: MessageTypeDefinition;
    PriceNudge: MessageTypeDefinition;
    PriceQuality: MessageTypeDefinition;
    UpdateAttributeRequest: MessageTypeDefinition;
    UpdateAttributeResponse: MessageTypeDefinition;
  };
}
