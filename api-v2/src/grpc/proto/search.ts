import type * as grpc from '@grpc/grpc-js';
import type {
  EnumTypeDefinition,
  MessageTypeDefinition,
} from '@grpc/proto-loader';

import type {
  SearchServiceClient as _search_SearchServiceClient,
  SearchServiceDefinition as _search_SearchServiceDefinition,
} from './search/SearchService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  search: {
    Attribute: MessageTypeDefinition;
    GroupedHits: MessageTypeDefinition;
    OperationMode: EnumTypeDefinition;
    Order: MessageTypeDefinition;
    SaveOrderRequest: MessageTypeDefinition;
    SaveOrderResponse: MessageTypeDefinition;
    SearchFiltersRequest: MessageTypeDefinition;
    SearchRequest: MessageTypeDefinition;
    SearchResultsResponse: MessageTypeDefinition;
    SearchService: SubtypeConstructor<
      typeof grpc.Client,
      _search_SearchServiceClient
    > & { service: _search_SearchServiceDefinition };
    Title: MessageTypeDefinition;
    Value: MessageTypeDefinition;
  };
}
