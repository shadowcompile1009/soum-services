// Original file: node_modules/soum-proto/proto/invoice.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  CreateInvoiceRequest as _invoice_CreateInvoiceRequest,
  CreateInvoiceRequest__Output as _invoice_CreateInvoiceRequest__Output,
} from '../invoice/CreateInvoiceRequest';
import type {
  CreateInvoiceResponse as _invoice_CreateInvoiceResponse,
  CreateInvoiceResponse__Output as _invoice_CreateInvoiceResponse__Output,
} from '../invoice/CreateInvoiceResponse';

export interface InvoiceServiceClient extends grpc.Client {
  createInvoice(
    argument: _invoice_CreateInvoiceRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_invoice_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
  createInvoice(
    argument: _invoice_CreateInvoiceRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_invoice_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
  createInvoice(
    argument: _invoice_CreateInvoiceRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_invoice_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
  createInvoice(
    argument: _invoice_CreateInvoiceRequest,
    callback: grpc.requestCallback<_invoice_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
  createInvoice(
    argument: _invoice_CreateInvoiceRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_invoice_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
  createInvoice(
    argument: _invoice_CreateInvoiceRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_invoice_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
  createInvoice(
    argument: _invoice_CreateInvoiceRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_invoice_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
  createInvoice(
    argument: _invoice_CreateInvoiceRequest,
    callback: grpc.requestCallback<_invoice_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface InvoiceServiceHandlers
  extends grpc.UntypedServiceImplementation {
  createInvoice: grpc.handleUnaryCall<
    _invoice_CreateInvoiceRequest__Output,
    _invoice_CreateInvoiceResponse
  >;
}

export interface InvoiceServiceDefinition extends grpc.ServiceDefinition {
  createInvoice: MethodDefinition<
    _invoice_CreateInvoiceRequest,
    _invoice_CreateInvoiceResponse,
    _invoice_CreateInvoiceRequest__Output,
    _invoice_CreateInvoiceResponse__Output
  >;
}
