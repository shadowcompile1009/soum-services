import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { CreateTransactionRequest } from './proto/wallet/CreateTransactionRequest';
import { GetCreditsByOrderIdsRequest } from './proto/wallet/GetCreditsByOrderIdsRequest';
import { ProtoGrpcType } from './proto/wallet';
import { GetWalletRequest } from './proto/wallet/GetWalletRequest';
import { GetWalletResponse } from '../grpc/proto/wallet/GetWalletResponse';
import { GetPayoutSettingsResponse } from './proto/wallet/GetPayoutSettingsResponse';
import { GetListingFeeResponse } from './proto/wallet/GetListingFeeResponse';
import { GetListingFeeRequest } from './proto/wallet/GetListingFeeRequest';
import { GetGlobalWalletToggleResponse } from './proto/wallet/GetGlobalWalletToggleResponse';
import { GetTransactionsRequest } from './proto/wallet/GetTransactionsRequest';
import { GetTransactionsResponse } from './proto/wallet/GetTransactionsResponse';
import { UpdateAmountTransactionRequest } from './proto/wallet/UpdateAmountTransactionRequest';
import { TransactionResponse } from './proto/wallet/TransactionResponse';
import { UpdateTransactionRequest } from './proto/wallet/UpdateTransactionRequest';
import { UpdateWalletRequest } from './proto/wallet/UpdateWalletRequest';
import { GetTransactionRequest } from './proto/wallet/GetTransactionRequest';

let host = '0.0.0.0:50052';
if (process.env.NODE_ENV !== 'local') {
  host = `soum-${process.env.WALLET_SVC}-${process.env.PREFIX}-srv:50051`;
}
const packageDefinition = protoLoader.loadSync(
  __dirname + '/../../node_modules/soum-proto/proto/wallet.proto'
);
const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const WalletGrpcSvc = new proto.wallet.WalletService(
  host,
  grpc.credentials.createInsecure()
);

const metadata = new grpc.Metadata();
// metadata.set('header1', 'headerValue1');

export const GetWallet = (data: GetWalletRequest): Promise<GetWalletResponse> =>
  new Promise(async (resolve, reject) => {
    WalletGrpcSvc.GetWallet(data, metadata, (error, reply) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(reply);
    });
  });

export const CreateTransaction = (data: CreateTransactionRequest) =>
  new Promise(async (resolve, reject) => {
    WalletGrpcSvc.CreateTransaction(data, metadata, (error, reply) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(reply);
    });
  });

export const GetCreditsByOrderIds = (orderIds: GetCreditsByOrderIdsRequest) =>
  new Promise(async (resolve, reject) => {
    WalletGrpcSvc.GetCreditsByOrderIds(orderIds, metadata, (error, reply) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(reply);
    });
  });

export const GetWalletPayoutSettings = (): Promise<GetPayoutSettingsResponse> =>
  new Promise(async (resolve, reject) => {
    WalletGrpcSvc.getPayoutSettings(null, metadata, (error, reply) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(reply);
    });
  });
export const GetListingFee = (
  settingKey: GetListingFeeRequest
): Promise<GetListingFeeResponse> =>
  new Promise(async (resolve, reject) => {
    WalletGrpcSvc.GetListingFee(settingKey, metadata, (error, reply) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(reply);
    });
  });

export const GetGlobalWalletToggle =
  (): Promise<GetGlobalWalletToggleResponse> =>
    new Promise(async (resolve, reject) => {
      WalletGrpcSvc.getGlobalWalletToggle(null, metadata, (error, reply) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(reply);
      });
    });
export const GetTransactions = (
  data: GetTransactionsRequest
): Promise<GetTransactionsResponse> =>
  new Promise(async (resolve, reject) => {
    WalletGrpcSvc.getTransactions(data, metadata, (error, reply) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(reply);
    });
  });
export const UpdatePendingAmountTransaction = (
  data: UpdateAmountTransactionRequest
): Promise<TransactionResponse> =>
  new Promise(async (resolve, reject) => {
    WalletGrpcSvc.updatePendingAmountTransaction(
      data,
      metadata,
      (error, reply) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(reply);
      }
    );
  });
export const UpdateTransaction = (
  payload: UpdateTransactionRequest
): Promise<TransactionResponse> =>
  new Promise(async (resolve, reject) => {
    WalletGrpcSvc.updateTransaction(payload, metadata, (error, reply) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(reply);
    });
  });

export const GetTransactionById = (
  payload: GetTransactionRequest
): Promise<TransactionResponse> =>
  new Promise(async (resolve, reject) => {
    WalletGrpcSvc.getTransactionById(payload, metadata, (error, reply) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(reply);
    });
  });

export const UpdateWallet = (
  payload: UpdateWalletRequest
): Promise<GetWalletResponse> =>
  new Promise(async (resolve, reject) => {
    WalletGrpcSvc.updateWallet(payload, metadata, (error, reply) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(reply);
    });
  });
