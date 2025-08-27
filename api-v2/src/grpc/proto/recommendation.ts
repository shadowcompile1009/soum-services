import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  RecommendationServiceClient as _recommendation_RecommendationServiceClient,
  RecommendationServiceDefinition as _recommendation_RecommendationServiceDefinition,
} from './recommendation/RecommendationService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  recommendation: {
    AddFeedbackRequest: MessageTypeDefinition;
    AddFeedbackResponse: MessageTypeDefinition;
    AddMultipleItemsRequest: MessageTypeDefinition;
    AddMultipleItemsResponse: MessageTypeDefinition;
    AddNewItemRequest: MessageTypeDefinition;
    AddNewItemResponse: MessageTypeDefinition;
    AddNewUserRequest: MessageTypeDefinition;
    AddNewUserResponse: MessageTypeDefinition;
    DeleteItemsRequest: MessageTypeDefinition;
    DeleteItemsResponse: MessageTypeDefinition;
    RecommendationService: SubtypeConstructor<
      typeof grpc.Client,
      _recommendation_RecommendationServiceClient
    > & { service: _recommendation_RecommendationServiceDefinition };
    RemoveFeedbackRequest: MessageTypeDefinition;
    RemoveFeedbackResponse: MessageTypeDefinition;
  };
}
