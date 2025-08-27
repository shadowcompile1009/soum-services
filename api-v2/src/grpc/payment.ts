import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/payment';
import {
  CaptureTransactionRequest,
  GetPaymentOptionRequest,
  PaymentOption,
  ReverseTransactionRequest,
} from './proto/payment.pb';
import { CreateTransactionRequest } from './proto/payment/CreateTransactionRequest';
import { CreateTransactionResponse } from './proto/payment/CreateTransactionResponse';
import { GetTransactionRequest } from './proto/payment/GetTransactionRequest';
import { TransactionResponse } from './proto/payment/TransactionResponse';
// eslint-disable-next-line max-len
import { GetTransactionBySoumTransactionNumberRequest } from './proto/payment/GetTransactionBySoumTransactionNumberRequest';
import { ValidateBNPLForUserRequest } from './proto/payment/ValidateBNPLForUserRequest';
import { ValidateBNPLForUserResponse } from './proto/payment/ValidateBNPLForUserResponse';

let host = '0.0.0.0:50055';
if (process.env.NODE_ENV !== 'local') {
  host = `soum-${process.env.PAYMENT_SVC}-${process.env.PREFIX}-srv:50051`;
}
const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/payment.proto'
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const PaymentGrpcSvc = new proto.payment.PaymentService(
  host,
  grpc.credentials.createInsecure()
);

const metadata = new grpc.Metadata();

export const getPaymentOption = (
  data: GetPaymentOptionRequest
): Promise<PaymentOption> =>
  new Promise(async (resolve, reject) => {
    PaymentGrpcSvc.getPaymentOption(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });

export const CreatePaymentTransaction = (
  data: CreateTransactionRequest
): Promise<CreateTransactionResponse> =>
  new Promise(async (resolve, reject) => {
    PaymentGrpcSvc.CreateTransaction(data, metadata, (error, reply) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(reply);
    });
  });

export const GetPaymentTransactionById = (
  data: GetTransactionRequest,
  returnNullOnError: boolean
): Promise<TransactionResponse> =>
  new Promise(async (resolve, reject) => {
    PaymentGrpcSvc.GetTransactionById(data, metadata, (error, reply) => {
      if (error) {
        console.log(error);
        if (returnNullOnError) {
          resolve(null);
        }
        reject(error);
      }
      resolve(reply);
    });
  });

export const GetPaymentTransactionBySoumTransactionNumber = (
  data: GetTransactionBySoumTransactionNumberRequest,
  returnNullOnError: boolean
): Promise<TransactionResponse> =>
  new Promise(async (resolve, reject) => {
    PaymentGrpcSvc.GetTransactionBySoumTransactionNumber(
      data,
      metadata,
      (error, reply) => {
        if (error) {
          if (returnNullOnError) {
            resolve(null);
          }
          reject(error);
        }
        resolve(reply);
      }
    );
  });

export const ReverseTransaction = (
  data: ReverseTransactionRequest
): Promise<TransactionResponse> =>
  new Promise(async (resolve, reject) => {
    PaymentGrpcSvc.ReverseTransaction(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });

export const CaptureTransaction = (
  data: CaptureTransactionRequest
): Promise<TransactionResponse> =>
  new Promise(async (resolve, reject) => {
    PaymentGrpcSvc.CaptureTransaction(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });

export const ValidateBNPLForUser = (
  data: ValidateBNPLForUserRequest
): Promise<ValidateBNPLForUserResponse> =>
  new Promise(async (resolve, reject) => {
    PaymentGrpcSvc.ValidateBNPLForUser(data, metadata, (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
