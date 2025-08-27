import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  ReviewServiceClient as _review_ReviewServiceClient,
  ReviewServiceDefinition as _review_ReviewServiceDefinition,
} from './review/ReviewService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  review: {
    Answer: MessageTypeDefinition;
    DummyRequest: MessageTypeDefinition;
    DummyResponse: MessageTypeDefinition;
    GetRatingSellerRequest: MessageTypeDefinition;
    GetRatingSellerResponse: MessageTypeDefinition;
    GetResponseOfProductRequest: MessageTypeDefinition;
    GetResponseOfProductResponse: MessageTypeDefinition;
    Response: MessageTypeDefinition;
    ReviewService: SubtypeConstructor<
      typeof grpc.Client,
      _review_ReviewServiceClient
    > & { service: _review_ReviewServiceDefinition };
  };
}
