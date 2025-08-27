import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  AddonServiceClient as _addon_AddonServiceClient,
  AddonServiceDefinition as _addon_AddonServiceDefinition,
} from './addon/AddonService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  addon: {
    AddonItem: MessageTypeDefinition;
    AddonService: SubtypeConstructor<
      typeof grpc.Client,
      _addon_AddonServiceClient
    > & { service: _addon_AddonServiceDefinition };
    GetAddonsRequest: MessageTypeDefinition;
    GetAddonsResponse: MessageTypeDefinition;
  };
}
