// Original file: node_modules/soum-proto/proto/payment.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  CaptureTransactionRequest as _payment_CaptureTransactionRequest,
  CaptureTransactionRequest__Output as _payment_CaptureTransactionRequest__Output,
} from '../payment/CaptureTransactionRequest';
import type {
  CheckPayoutStatusRequest as _payment_CheckPayoutStatusRequest,
  CheckPayoutStatusRequest__Output as _payment_CheckPayoutStatusRequest__Output,
} from '../payment/CheckPayoutStatusRequest';
import type {
  CheckPayoutStatusResponse as _payment_CheckPayoutStatusResponse,
  CheckPayoutStatusResponse__Output as _payment_CheckPayoutStatusResponse__Output,
} from '../payment/CheckPayoutStatusResponse';
import type {
  CreatePayoutRequest as _payment_CreatePayoutRequest,
  CreatePayoutRequest__Output as _payment_CreatePayoutRequest__Output,
} from '../payment/CreatePayoutRequest';
import type {
  CreatePayoutResponse as _payment_CreatePayoutResponse,
  CreatePayoutResponse__Output as _payment_CreatePayoutResponse__Output,
} from '../payment/CreatePayoutResponse';
import type {
  CreateTransactionRequest as _payment_CreateTransactionRequest,
  CreateTransactionRequest__Output as _payment_CreateTransactionRequest__Output,
} from '../payment/CreateTransactionRequest';
import type {
  CreateTransactionResponse as _payment_CreateTransactionResponse,
  CreateTransactionResponse__Output as _payment_CreateTransactionResponse__Output,
} from '../payment/CreateTransactionResponse';
import type {
  GetPaymentOptionRequest as _payment_GetPaymentOptionRequest,
  GetPaymentOptionRequest__Output as _payment_GetPaymentOptionRequest__Output,
} from '../payment/GetPaymentOptionRequest';
import type {
  GetPaymentOptionsRequest as _payment_GetPaymentOptionsRequest,
  GetPaymentOptionsRequest__Output as _payment_GetPaymentOptionsRequest__Output,
} from '../payment/GetPaymentOptionsRequest';
import type {
  GetPaymentOptionsResponse as _payment_GetPaymentOptionsResponse,
  GetPaymentOptionsResponse__Output as _payment_GetPaymentOptionsResponse__Output,
} from '../payment/GetPaymentOptionsResponse';
import type {
  GetTransactionBySoumTransactionNumberRequest as _payment_GetTransactionBySoumTransactionNumberRequest,
  GetTransactionBySoumTransactionNumberRequest__Output as _payment_GetTransactionBySoumTransactionNumberRequest__Output,
} from '../payment/GetTransactionBySoumTransactionNumberRequest';
import type {
  GetTransactionRequest as _payment_GetTransactionRequest,
  GetTransactionRequest__Output as _payment_GetTransactionRequest__Output,
} from '../payment/GetTransactionRequest';
import type {
  PaymentOption as _payment_PaymentOption,
  PaymentOption__Output as _payment_PaymentOption__Output,
} from '../payment/PaymentOption';
import type {
  ReverseTransactionRequest as _payment_ReverseTransactionRequest,
  ReverseTransactionRequest__Output as _payment_ReverseTransactionRequest__Output,
} from '../payment/ReverseTransactionRequest';
import type {
  TransactionResponse as _payment_TransactionResponse,
  TransactionResponse__Output as _payment_TransactionResponse__Output,
} from '../payment/TransactionResponse';
import type {
  ValidateBNPLForUserRequest as _payment_ValidateBNPLForUserRequest,
  ValidateBNPLForUserRequest__Output as _payment_ValidateBNPLForUserRequest__Output,
} from '../payment/ValidateBNPLForUserRequest';
import type {
  ValidateBNPLForUserResponse as _payment_ValidateBNPLForUserResponse,
  ValidateBNPLForUserResponse__Output as _payment_ValidateBNPLForUserResponse__Output,
} from '../payment/ValidateBNPLForUserResponse';

export interface PaymentServiceClient extends grpc.Client {
  CaptureTransaction(
    argument: _payment_CaptureTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  CaptureTransaction(
    argument: _payment_CaptureTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  CaptureTransaction(
    argument: _payment_CaptureTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  CaptureTransaction(
    argument: _payment_CaptureTransactionRequest,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  captureTransaction(
    argument: _payment_CaptureTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  captureTransaction(
    argument: _payment_CaptureTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  captureTransaction(
    argument: _payment_CaptureTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  captureTransaction(
    argument: _payment_CaptureTransactionRequest,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;

  CheckPayoutStatus(
    argument: _payment_CheckPayoutStatusRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_CheckPayoutStatusResponse__Output>
  ): grpc.ClientUnaryCall;
  CheckPayoutStatus(
    argument: _payment_CheckPayoutStatusRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_CheckPayoutStatusResponse__Output>
  ): grpc.ClientUnaryCall;
  CheckPayoutStatus(
    argument: _payment_CheckPayoutStatusRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_CheckPayoutStatusResponse__Output>
  ): grpc.ClientUnaryCall;
  CheckPayoutStatus(
    argument: _payment_CheckPayoutStatusRequest,
    callback: grpc.requestCallback<_payment_CheckPayoutStatusResponse__Output>
  ): grpc.ClientUnaryCall;
  checkPayoutStatus(
    argument: _payment_CheckPayoutStatusRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_CheckPayoutStatusResponse__Output>
  ): grpc.ClientUnaryCall;
  checkPayoutStatus(
    argument: _payment_CheckPayoutStatusRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_CheckPayoutStatusResponse__Output>
  ): grpc.ClientUnaryCall;
  checkPayoutStatus(
    argument: _payment_CheckPayoutStatusRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_CheckPayoutStatusResponse__Output>
  ): grpc.ClientUnaryCall;
  checkPayoutStatus(
    argument: _payment_CheckPayoutStatusRequest,
    callback: grpc.requestCallback<_payment_CheckPayoutStatusResponse__Output>
  ): grpc.ClientUnaryCall;

  CreatePayout(
    argument: _payment_CreatePayoutRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_CreatePayoutResponse__Output>
  ): grpc.ClientUnaryCall;
  CreatePayout(
    argument: _payment_CreatePayoutRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_CreatePayoutResponse__Output>
  ): grpc.ClientUnaryCall;
  CreatePayout(
    argument: _payment_CreatePayoutRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_CreatePayoutResponse__Output>
  ): grpc.ClientUnaryCall;
  CreatePayout(
    argument: _payment_CreatePayoutRequest,
    callback: grpc.requestCallback<_payment_CreatePayoutResponse__Output>
  ): grpc.ClientUnaryCall;
  createPayout(
    argument: _payment_CreatePayoutRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_CreatePayoutResponse__Output>
  ): grpc.ClientUnaryCall;
  createPayout(
    argument: _payment_CreatePayoutRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_CreatePayoutResponse__Output>
  ): grpc.ClientUnaryCall;
  createPayout(
    argument: _payment_CreatePayoutRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_CreatePayoutResponse__Output>
  ): grpc.ClientUnaryCall;
  createPayout(
    argument: _payment_CreatePayoutRequest,
    callback: grpc.requestCallback<_payment_CreatePayoutResponse__Output>
  ): grpc.ClientUnaryCall;

  CreateTransaction(
    argument: _payment_CreateTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_CreateTransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateTransaction(
    argument: _payment_CreateTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_CreateTransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateTransaction(
    argument: _payment_CreateTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_CreateTransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  CreateTransaction(
    argument: _payment_CreateTransactionRequest,
    callback: grpc.requestCallback<_payment_CreateTransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  createTransaction(
    argument: _payment_CreateTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_CreateTransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  createTransaction(
    argument: _payment_CreateTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_CreateTransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  createTransaction(
    argument: _payment_CreateTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_CreateTransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  createTransaction(
    argument: _payment_CreateTransactionRequest,
    callback: grpc.requestCallback<_payment_CreateTransactionResponse__Output>
  ): grpc.ClientUnaryCall;

  GetPaymentOption(
    argument: _payment_GetPaymentOptionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_PaymentOption__Output>
  ): grpc.ClientUnaryCall;
  GetPaymentOption(
    argument: _payment_GetPaymentOptionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_PaymentOption__Output>
  ): grpc.ClientUnaryCall;
  GetPaymentOption(
    argument: _payment_GetPaymentOptionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_PaymentOption__Output>
  ): grpc.ClientUnaryCall;
  GetPaymentOption(
    argument: _payment_GetPaymentOptionRequest,
    callback: grpc.requestCallback<_payment_PaymentOption__Output>
  ): grpc.ClientUnaryCall;
  getPaymentOption(
    argument: _payment_GetPaymentOptionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_PaymentOption__Output>
  ): grpc.ClientUnaryCall;
  getPaymentOption(
    argument: _payment_GetPaymentOptionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_PaymentOption__Output>
  ): grpc.ClientUnaryCall;
  getPaymentOption(
    argument: _payment_GetPaymentOptionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_PaymentOption__Output>
  ): grpc.ClientUnaryCall;
  getPaymentOption(
    argument: _payment_GetPaymentOptionRequest,
    callback: grpc.requestCallback<_payment_PaymentOption__Output>
  ): grpc.ClientUnaryCall;

  GetPaymentOptions(
    argument: _payment_GetPaymentOptionsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_GetPaymentOptionsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPaymentOptions(
    argument: _payment_GetPaymentOptionsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_GetPaymentOptionsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPaymentOptions(
    argument: _payment_GetPaymentOptionsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_GetPaymentOptionsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPaymentOptions(
    argument: _payment_GetPaymentOptionsRequest,
    callback: grpc.requestCallback<_payment_GetPaymentOptionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPaymentOptions(
    argument: _payment_GetPaymentOptionsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_GetPaymentOptionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPaymentOptions(
    argument: _payment_GetPaymentOptionsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_GetPaymentOptionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPaymentOptions(
    argument: _payment_GetPaymentOptionsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_GetPaymentOptionsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPaymentOptions(
    argument: _payment_GetPaymentOptionsRequest,
    callback: grpc.requestCallback<_payment_GetPaymentOptionsResponse__Output>
  ): grpc.ClientUnaryCall;

  GetTransactionById(
    argument: _payment_GetTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  GetTransactionById(
    argument: _payment_GetTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  GetTransactionById(
    argument: _payment_GetTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  GetTransactionById(
    argument: _payment_GetTransactionRequest,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactionById(
    argument: _payment_GetTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactionById(
    argument: _payment_GetTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactionById(
    argument: _payment_GetTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactionById(
    argument: _payment_GetTransactionRequest,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;

  GetTransactionBySoumTransactionNumber(
    argument: _payment_GetTransactionBySoumTransactionNumberRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  GetTransactionBySoumTransactionNumber(
    argument: _payment_GetTransactionBySoumTransactionNumberRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  GetTransactionBySoumTransactionNumber(
    argument: _payment_GetTransactionBySoumTransactionNumberRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  GetTransactionBySoumTransactionNumber(
    argument: _payment_GetTransactionBySoumTransactionNumberRequest,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactionBySoumTransactionNumber(
    argument: _payment_GetTransactionBySoumTransactionNumberRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactionBySoumTransactionNumber(
    argument: _payment_GetTransactionBySoumTransactionNumberRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactionBySoumTransactionNumber(
    argument: _payment_GetTransactionBySoumTransactionNumberRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  getTransactionBySoumTransactionNumber(
    argument: _payment_GetTransactionBySoumTransactionNumberRequest,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;

  ReverseTransaction(
    argument: _payment_ReverseTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  ReverseTransaction(
    argument: _payment_ReverseTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  ReverseTransaction(
    argument: _payment_ReverseTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  ReverseTransaction(
    argument: _payment_ReverseTransactionRequest,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  reverseTransaction(
    argument: _payment_ReverseTransactionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  reverseTransaction(
    argument: _payment_ReverseTransactionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  reverseTransaction(
    argument: _payment_ReverseTransactionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;
  reverseTransaction(
    argument: _payment_ReverseTransactionRequest,
    callback: grpc.requestCallback<_payment_TransactionResponse__Output>
  ): grpc.ClientUnaryCall;

  ValidateBNPLForUser(
    argument: _payment_ValidateBNPLForUserRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_ValidateBNPLForUserResponse__Output>
  ): grpc.ClientUnaryCall;
  ValidateBNPLForUser(
    argument: _payment_ValidateBNPLForUserRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_ValidateBNPLForUserResponse__Output>
  ): grpc.ClientUnaryCall;
  ValidateBNPLForUser(
    argument: _payment_ValidateBNPLForUserRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_ValidateBNPLForUserResponse__Output>
  ): grpc.ClientUnaryCall;
  ValidateBNPLForUser(
    argument: _payment_ValidateBNPLForUserRequest,
    callback: grpc.requestCallback<_payment_ValidateBNPLForUserResponse__Output>
  ): grpc.ClientUnaryCall;
  validateBnplForUser(
    argument: _payment_ValidateBNPLForUserRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_ValidateBNPLForUserResponse__Output>
  ): grpc.ClientUnaryCall;
  validateBnplForUser(
    argument: _payment_ValidateBNPLForUserRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_payment_ValidateBNPLForUserResponse__Output>
  ): grpc.ClientUnaryCall;
  validateBnplForUser(
    argument: _payment_ValidateBNPLForUserRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_payment_ValidateBNPLForUserResponse__Output>
  ): grpc.ClientUnaryCall;
  validateBnplForUser(
    argument: _payment_ValidateBNPLForUserRequest,
    callback: grpc.requestCallback<_payment_ValidateBNPLForUserResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface PaymentServiceHandlers
  extends grpc.UntypedServiceImplementation {
  CaptureTransaction: grpc.handleUnaryCall<
    _payment_CaptureTransactionRequest__Output,
    _payment_TransactionResponse
  >;

  CheckPayoutStatus: grpc.handleUnaryCall<
    _payment_CheckPayoutStatusRequest__Output,
    _payment_CheckPayoutStatusResponse
  >;

  CreatePayout: grpc.handleUnaryCall<
    _payment_CreatePayoutRequest__Output,
    _payment_CreatePayoutResponse
  >;

  CreateTransaction: grpc.handleUnaryCall<
    _payment_CreateTransactionRequest__Output,
    _payment_CreateTransactionResponse
  >;

  GetPaymentOption: grpc.handleUnaryCall<
    _payment_GetPaymentOptionRequest__Output,
    _payment_PaymentOption
  >;

  GetPaymentOptions: grpc.handleUnaryCall<
    _payment_GetPaymentOptionsRequest__Output,
    _payment_GetPaymentOptionsResponse
  >;

  GetTransactionById: grpc.handleUnaryCall<
    _payment_GetTransactionRequest__Output,
    _payment_TransactionResponse
  >;

  GetTransactionBySoumTransactionNumber: grpc.handleUnaryCall<
    _payment_GetTransactionBySoumTransactionNumberRequest__Output,
    _payment_TransactionResponse
  >;

  ReverseTransaction: grpc.handleUnaryCall<
    _payment_ReverseTransactionRequest__Output,
    _payment_TransactionResponse
  >;

  ValidateBNPLForUser: grpc.handleUnaryCall<
    _payment_ValidateBNPLForUserRequest__Output,
    _payment_ValidateBNPLForUserResponse
  >;
}

export interface PaymentServiceDefinition extends grpc.ServiceDefinition {
  CaptureTransaction: MethodDefinition<
    _payment_CaptureTransactionRequest,
    _payment_TransactionResponse,
    _payment_CaptureTransactionRequest__Output,
    _payment_TransactionResponse__Output
  >;
  CheckPayoutStatus: MethodDefinition<
    _payment_CheckPayoutStatusRequest,
    _payment_CheckPayoutStatusResponse,
    _payment_CheckPayoutStatusRequest__Output,
    _payment_CheckPayoutStatusResponse__Output
  >;
  CreatePayout: MethodDefinition<
    _payment_CreatePayoutRequest,
    _payment_CreatePayoutResponse,
    _payment_CreatePayoutRequest__Output,
    _payment_CreatePayoutResponse__Output
  >;
  CreateTransaction: MethodDefinition<
    _payment_CreateTransactionRequest,
    _payment_CreateTransactionResponse,
    _payment_CreateTransactionRequest__Output,
    _payment_CreateTransactionResponse__Output
  >;
  GetPaymentOption: MethodDefinition<
    _payment_GetPaymentOptionRequest,
    _payment_PaymentOption,
    _payment_GetPaymentOptionRequest__Output,
    _payment_PaymentOption__Output
  >;
  GetPaymentOptions: MethodDefinition<
    _payment_GetPaymentOptionsRequest,
    _payment_GetPaymentOptionsResponse,
    _payment_GetPaymentOptionsRequest__Output,
    _payment_GetPaymentOptionsResponse__Output
  >;
  GetTransactionById: MethodDefinition<
    _payment_GetTransactionRequest,
    _payment_TransactionResponse,
    _payment_GetTransactionRequest__Output,
    _payment_TransactionResponse__Output
  >;
  GetTransactionBySoumTransactionNumber: MethodDefinition<
    _payment_GetTransactionBySoumTransactionNumberRequest,
    _payment_TransactionResponse,
    _payment_GetTransactionBySoumTransactionNumberRequest__Output,
    _payment_TransactionResponse__Output
  >;
  ReverseTransaction: MethodDefinition<
    _payment_ReverseTransactionRequest,
    _payment_TransactionResponse,
    _payment_ReverseTransactionRequest__Output,
    _payment_TransactionResponse__Output
  >;
  ValidateBNPLForUser: MethodDefinition<
    _payment_ValidateBNPLForUserRequest,
    _payment_ValidateBNPLForUserResponse,
    _payment_ValidateBNPLForUserRequest__Output,
    _payment_ValidateBNPLForUserResponse__Output
  >;
}
