// Original file: node_modules/soum-proto/proto/dmbackend.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  CreateInvoiceRequest as _dmbackend_CreateInvoiceRequest,
  CreateInvoiceRequest__Output as _dmbackend_CreateInvoiceRequest__Output,
} from '../dmbackend/CreateInvoiceRequest';
import type {
  CreateInvoiceResponse as _dmbackend_CreateInvoiceResponse,
  CreateInvoiceResponse__Output as _dmbackend_CreateInvoiceResponse__Output,
} from '../dmbackend/CreateInvoiceResponse';
import type {
  GetCancellationFeeRequest as _dmbackend_GetCancellationFeeRequest,
  GetCancellationFeeRequest__Output as _dmbackend_GetCancellationFeeRequest__Output,
} from '../dmbackend/GetCancellationFeeRequest';
import type {
  GetCancellationFeeResponse as _dmbackend_GetCancellationFeeResponse,
  GetCancellationFeeResponse__Output as _dmbackend_GetCancellationFeeResponse__Output,
} from '../dmbackend/GetCancellationFeeResponse';
import type {
  GetHoldingPenaltyBalanceRequest as _dmbackend_GetHoldingPenaltyBalanceRequest,
  GetHoldingPenaltyBalanceRequest__Output as _dmbackend_GetHoldingPenaltyBalanceRequest__Output,
} from '../dmbackend/GetHoldingPenaltyBalanceRequest';
import type {
  GetHoldingPenaltyBalanceResponse as _dmbackend_GetHoldingPenaltyBalanceResponse,
  GetHoldingPenaltyBalanceResponse__Output as _dmbackend_GetHoldingPenaltyBalanceResponse__Output,
} from '../dmbackend/GetHoldingPenaltyBalanceResponse';
import type {
  GetPenalizedOrdersMerchantRequest as _dmbackend_GetPenalizedOrdersMerchantRequest,
  GetPenalizedOrdersMerchantRequest__Output as _dmbackend_GetPenalizedOrdersMerchantRequest__Output,
} from '../dmbackend/GetPenalizedOrdersMerchantRequest';
import type {
  GetPenalizedOrdersMerchantResponse as _dmbackend_GetPenalizedOrdersMerchantResponse,
  GetPenalizedOrdersMerchantResponse__Output as _dmbackend_GetPenalizedOrdersMerchantResponse__Output,
} from '../dmbackend/GetPenalizedOrdersMerchantResponse';
import type {
  GetStandingPenaltyToDmoRequest as _dmbackend_GetStandingPenaltyToDmoRequest,
  GetStandingPenaltyToDmoRequest__Output as _dmbackend_GetStandingPenaltyToDmoRequest__Output,
} from '../dmbackend/GetStandingPenaltyToDmoRequest';
import type {
  GetStandingPenaltyToDmoResponse as _dmbackend_GetStandingPenaltyToDmoResponse,
  GetStandingPenaltyToDmoResponse__Output as _dmbackend_GetStandingPenaltyToDmoResponse__Output,
} from '../dmbackend/GetStandingPenaltyToDmoResponse';
import type {
  UpdateHoldingPenaltyRequest as _dmbackend_UpdateHoldingPenaltyRequest,
  UpdateHoldingPenaltyRequest__Output as _dmbackend_UpdateHoldingPenaltyRequest__Output,
} from '../dmbackend/UpdateHoldingPenaltyRequest';
import type {
  UpdateHoldingPenaltyResponse as _dmbackend_UpdateHoldingPenaltyResponse,
  UpdateHoldingPenaltyResponse__Output as _dmbackend_UpdateHoldingPenaltyResponse__Output,
} from '../dmbackend/UpdateHoldingPenaltyResponse';

export interface DmBackendServiceClient extends grpc.Client {
  CreateInvoice(
    argument: _dmbackend_CreateInvoiceRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateInvoice(
    argument: _dmbackend_CreateInvoiceRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_dmbackend_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateInvoice(
    argument: _dmbackend_CreateInvoiceRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateInvoice(
    argument: _dmbackend_CreateInvoiceRequest,
    callback: grpc.requestCallback<_dmbackend_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
  createInvoice(
    argument: _dmbackend_CreateInvoiceRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
  createInvoice(
    argument: _dmbackend_CreateInvoiceRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_dmbackend_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
  createInvoice(
    argument: _dmbackend_CreateInvoiceRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;
  createInvoice(
    argument: _dmbackend_CreateInvoiceRequest,
    callback: grpc.requestCallback<_dmbackend_CreateInvoiceResponse__Output>
  ): grpc.ClientUnaryCall;

  GetCancellationFee(
    argument: _dmbackend_GetCancellationFeeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetCancellationFeeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCancellationFee(
    argument: _dmbackend_GetCancellationFeeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_dmbackend_GetCancellationFeeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCancellationFee(
    argument: _dmbackend_GetCancellationFeeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetCancellationFeeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetCancellationFee(
    argument: _dmbackend_GetCancellationFeeRequest,
    callback: grpc.requestCallback<_dmbackend_GetCancellationFeeResponse__Output>
  ): grpc.ClientUnaryCall;
  getCancellationFee(
    argument: _dmbackend_GetCancellationFeeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetCancellationFeeResponse__Output>
  ): grpc.ClientUnaryCall;
  getCancellationFee(
    argument: _dmbackend_GetCancellationFeeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_dmbackend_GetCancellationFeeResponse__Output>
  ): grpc.ClientUnaryCall;
  getCancellationFee(
    argument: _dmbackend_GetCancellationFeeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetCancellationFeeResponse__Output>
  ): grpc.ClientUnaryCall;
  getCancellationFee(
    argument: _dmbackend_GetCancellationFeeRequest,
    callback: grpc.requestCallback<_dmbackend_GetCancellationFeeResponse__Output>
  ): grpc.ClientUnaryCall;

  GetHoldingPenaltyBalance(
    argument: _dmbackend_GetHoldingPenaltyBalanceRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetHoldingPenaltyBalanceResponse__Output>
  ): grpc.ClientUnaryCall;
  GetHoldingPenaltyBalance(
    argument: _dmbackend_GetHoldingPenaltyBalanceRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_dmbackend_GetHoldingPenaltyBalanceResponse__Output>
  ): grpc.ClientUnaryCall;
  GetHoldingPenaltyBalance(
    argument: _dmbackend_GetHoldingPenaltyBalanceRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetHoldingPenaltyBalanceResponse__Output>
  ): grpc.ClientUnaryCall;
  GetHoldingPenaltyBalance(
    argument: _dmbackend_GetHoldingPenaltyBalanceRequest,
    callback: grpc.requestCallback<_dmbackend_GetHoldingPenaltyBalanceResponse__Output>
  ): grpc.ClientUnaryCall;
  getHoldingPenaltyBalance(
    argument: _dmbackend_GetHoldingPenaltyBalanceRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetHoldingPenaltyBalanceResponse__Output>
  ): grpc.ClientUnaryCall;
  getHoldingPenaltyBalance(
    argument: _dmbackend_GetHoldingPenaltyBalanceRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_dmbackend_GetHoldingPenaltyBalanceResponse__Output>
  ): grpc.ClientUnaryCall;
  getHoldingPenaltyBalance(
    argument: _dmbackend_GetHoldingPenaltyBalanceRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetHoldingPenaltyBalanceResponse__Output>
  ): grpc.ClientUnaryCall;
  getHoldingPenaltyBalance(
    argument: _dmbackend_GetHoldingPenaltyBalanceRequest,
    callback: grpc.requestCallback<_dmbackend_GetHoldingPenaltyBalanceResponse__Output>
  ): grpc.ClientUnaryCall;

  GetPenalizedOrdersMerchant(
    argument: _dmbackend_GetPenalizedOrdersMerchantRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetPenalizedOrdersMerchantResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPenalizedOrdersMerchant(
    argument: _dmbackend_GetPenalizedOrdersMerchantRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_dmbackend_GetPenalizedOrdersMerchantResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPenalizedOrdersMerchant(
    argument: _dmbackend_GetPenalizedOrdersMerchantRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetPenalizedOrdersMerchantResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPenalizedOrdersMerchant(
    argument: _dmbackend_GetPenalizedOrdersMerchantRequest,
    callback: grpc.requestCallback<_dmbackend_GetPenalizedOrdersMerchantResponse__Output>
  ): grpc.ClientUnaryCall;
  getPenalizedOrdersMerchant(
    argument: _dmbackend_GetPenalizedOrdersMerchantRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetPenalizedOrdersMerchantResponse__Output>
  ): grpc.ClientUnaryCall;
  getPenalizedOrdersMerchant(
    argument: _dmbackend_GetPenalizedOrdersMerchantRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_dmbackend_GetPenalizedOrdersMerchantResponse__Output>
  ): grpc.ClientUnaryCall;
  getPenalizedOrdersMerchant(
    argument: _dmbackend_GetPenalizedOrdersMerchantRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetPenalizedOrdersMerchantResponse__Output>
  ): grpc.ClientUnaryCall;
  getPenalizedOrdersMerchant(
    argument: _dmbackend_GetPenalizedOrdersMerchantRequest,
    callback: grpc.requestCallback<_dmbackend_GetPenalizedOrdersMerchantResponse__Output>
  ): grpc.ClientUnaryCall;

  GetStandingPenaltyToDmo(
    argument: _dmbackend_GetStandingPenaltyToDmoRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetStandingPenaltyToDmoResponse__Output>
  ): grpc.ClientUnaryCall;
  GetStandingPenaltyToDmo(
    argument: _dmbackend_GetStandingPenaltyToDmoRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_dmbackend_GetStandingPenaltyToDmoResponse__Output>
  ): grpc.ClientUnaryCall;
  GetStandingPenaltyToDmo(
    argument: _dmbackend_GetStandingPenaltyToDmoRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetStandingPenaltyToDmoResponse__Output>
  ): grpc.ClientUnaryCall;
  GetStandingPenaltyToDmo(
    argument: _dmbackend_GetStandingPenaltyToDmoRequest,
    callback: grpc.requestCallback<_dmbackend_GetStandingPenaltyToDmoResponse__Output>
  ): grpc.ClientUnaryCall;
  getStandingPenaltyToDmo(
    argument: _dmbackend_GetStandingPenaltyToDmoRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetStandingPenaltyToDmoResponse__Output>
  ): grpc.ClientUnaryCall;
  getStandingPenaltyToDmo(
    argument: _dmbackend_GetStandingPenaltyToDmoRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_dmbackend_GetStandingPenaltyToDmoResponse__Output>
  ): grpc.ClientUnaryCall;
  getStandingPenaltyToDmo(
    argument: _dmbackend_GetStandingPenaltyToDmoRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_GetStandingPenaltyToDmoResponse__Output>
  ): grpc.ClientUnaryCall;
  getStandingPenaltyToDmo(
    argument: _dmbackend_GetStandingPenaltyToDmoRequest,
    callback: grpc.requestCallback<_dmbackend_GetStandingPenaltyToDmoResponse__Output>
  ): grpc.ClientUnaryCall;

  UpdateHoldingPenalty(
    argument: _dmbackend_UpdateHoldingPenaltyRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_UpdateHoldingPenaltyResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateHoldingPenalty(
    argument: _dmbackend_UpdateHoldingPenaltyRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_dmbackend_UpdateHoldingPenaltyResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateHoldingPenalty(
    argument: _dmbackend_UpdateHoldingPenaltyRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_UpdateHoldingPenaltyResponse__Output>
  ): grpc.ClientUnaryCall;
  UpdateHoldingPenalty(
    argument: _dmbackend_UpdateHoldingPenaltyRequest,
    callback: grpc.requestCallback<_dmbackend_UpdateHoldingPenaltyResponse__Output>
  ): grpc.ClientUnaryCall;
  updateHoldingPenalty(
    argument: _dmbackend_UpdateHoldingPenaltyRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_UpdateHoldingPenaltyResponse__Output>
  ): grpc.ClientUnaryCall;
  updateHoldingPenalty(
    argument: _dmbackend_UpdateHoldingPenaltyRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_dmbackend_UpdateHoldingPenaltyResponse__Output>
  ): grpc.ClientUnaryCall;
  updateHoldingPenalty(
    argument: _dmbackend_UpdateHoldingPenaltyRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_dmbackend_UpdateHoldingPenaltyResponse__Output>
  ): grpc.ClientUnaryCall;
  updateHoldingPenalty(
    argument: _dmbackend_UpdateHoldingPenaltyRequest,
    callback: grpc.requestCallback<_dmbackend_UpdateHoldingPenaltyResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface DmBackendServiceHandlers
  extends grpc.UntypedServiceImplementation {
  CreateInvoice: grpc.handleUnaryCall<
    _dmbackend_CreateInvoiceRequest__Output,
    _dmbackend_CreateInvoiceResponse
  >;

  GetCancellationFee: grpc.handleUnaryCall<
    _dmbackend_GetCancellationFeeRequest__Output,
    _dmbackend_GetCancellationFeeResponse
  >;

  GetHoldingPenaltyBalance: grpc.handleUnaryCall<
    _dmbackend_GetHoldingPenaltyBalanceRequest__Output,
    _dmbackend_GetHoldingPenaltyBalanceResponse
  >;

  GetPenalizedOrdersMerchant: grpc.handleUnaryCall<
    _dmbackend_GetPenalizedOrdersMerchantRequest__Output,
    _dmbackend_GetPenalizedOrdersMerchantResponse
  >;

  GetStandingPenaltyToDmo: grpc.handleUnaryCall<
    _dmbackend_GetStandingPenaltyToDmoRequest__Output,
    _dmbackend_GetStandingPenaltyToDmoResponse
  >;

  UpdateHoldingPenalty: grpc.handleUnaryCall<
    _dmbackend_UpdateHoldingPenaltyRequest__Output,
    _dmbackend_UpdateHoldingPenaltyResponse
  >;
}

export interface DmBackendServiceDefinition extends grpc.ServiceDefinition {
  CreateInvoice: MethodDefinition<
    _dmbackend_CreateInvoiceRequest,
    _dmbackend_CreateInvoiceResponse,
    _dmbackend_CreateInvoiceRequest__Output,
    _dmbackend_CreateInvoiceResponse__Output
  >;
  GetCancellationFee: MethodDefinition<
    _dmbackend_GetCancellationFeeRequest,
    _dmbackend_GetCancellationFeeResponse,
    _dmbackend_GetCancellationFeeRequest__Output,
    _dmbackend_GetCancellationFeeResponse__Output
  >;
  GetHoldingPenaltyBalance: MethodDefinition<
    _dmbackend_GetHoldingPenaltyBalanceRequest,
    _dmbackend_GetHoldingPenaltyBalanceResponse,
    _dmbackend_GetHoldingPenaltyBalanceRequest__Output,
    _dmbackend_GetHoldingPenaltyBalanceResponse__Output
  >;
  GetPenalizedOrdersMerchant: MethodDefinition<
    _dmbackend_GetPenalizedOrdersMerchantRequest,
    _dmbackend_GetPenalizedOrdersMerchantResponse,
    _dmbackend_GetPenalizedOrdersMerchantRequest__Output,
    _dmbackend_GetPenalizedOrdersMerchantResponse__Output
  >;
  GetStandingPenaltyToDmo: MethodDefinition<
    _dmbackend_GetStandingPenaltyToDmoRequest,
    _dmbackend_GetStandingPenaltyToDmoResponse,
    _dmbackend_GetStandingPenaltyToDmoRequest__Output,
    _dmbackend_GetStandingPenaltyToDmoResponse__Output
  >;
  UpdateHoldingPenalty: MethodDefinition<
    _dmbackend_UpdateHoldingPenaltyRequest,
    _dmbackend_UpdateHoldingPenaltyResponse,
    _dmbackend_UpdateHoldingPenaltyRequest__Output,
    _dmbackend_UpdateHoldingPenaltyResponse__Output
  >;
}
