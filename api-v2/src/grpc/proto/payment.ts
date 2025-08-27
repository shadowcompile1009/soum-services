import type * as grpc from '@grpc/grpc-js';
import type {
  EnumTypeDefinition,
  MessageTypeDefinition,
} from '@grpc/proto-loader';

import type {
  PaymentServiceClient as _payment_PaymentServiceClient,
  PaymentServiceDefinition as _payment_PaymentServiceDefinition,
} from './payment/PaymentService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  payment: {
    CaptureTransactionRequest: MessageTypeDefinition;
    CheckPayoutStatusRequest: MessageTypeDefinition;
    CheckPayoutStatusResponse: MessageTypeDefinition;
    CreatePayoutRequest: MessageTypeDefinition;
    CreatePayoutResponse: MessageTypeDefinition;
    CreateTransactionRequest: MessageTypeDefinition;
    CreateTransactionResponse: MessageTypeDefinition;
    GetPaymentOptionRequest: MessageTypeDefinition;
    GetPaymentOptionsRequest: MessageTypeDefinition;
    GetPaymentOptionsResponse: MessageTypeDefinition;
    GetTransactionBySoumTransactionNumberRequest: MessageTypeDefinition;
    GetTransactionRequest: MessageTypeDefinition;
    PaymentOption: MessageTypeDefinition;
    PaymentService: SubtypeConstructor<
      typeof grpc.Client,
      _payment_PaymentServiceClient
    > & { service: _payment_PaymentServiceDefinition };
    PayoutStatus: EnumTypeDefinition;
    ReturnUrl: MessageTypeDefinition;
    ReverseTransactionRequest: MessageTypeDefinition;
    TransactionResponse: MessageTypeDefinition;
    ValidateBNPLForUserRequest: MessageTypeDefinition;
    ValidateBNPLForUserResponse: MessageTypeDefinition;
  };
}
