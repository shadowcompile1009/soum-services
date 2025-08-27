import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  ActivityServiceClient as _activity_ActivityServiceClient,
  ActivityServiceDefinition as _activity_ActivityServiceDefinition,
} from './activity/ActivityService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  activity: {
    ActivityService: SubtypeConstructor<
      typeof grpc.Client,
      _activity_ActivityServiceClient
    > & { service: _activity_ActivityServiceDefinition };
    GetUserActivityRequest: MessageTypeDefinition;
    GetUserActivityResponse: MessageTypeDefinition;
  };
}
