import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  InvoiceServiceClient as _invoice_InvoiceServiceClient,
  InvoiceServiceDefinition as _invoice_InvoiceServiceDefinition,
} from './invoice/InvoiceService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  invoice: {
    CreateInvoiceRequest: MessageTypeDefinition;
    CreateInvoiceResponse: MessageTypeDefinition;
    InvoiceService: SubtypeConstructor<
      typeof grpc.Client,
      _invoice_InvoiceServiceClient
    > & { service: _invoice_InvoiceServiceDefinition };
  };
}
