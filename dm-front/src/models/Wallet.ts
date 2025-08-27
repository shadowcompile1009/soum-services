import { apiGatewayClient } from '@/api/client';

import { ICustomer } from '@/models/Customer';
import { instanceToPlain } from 'class-transformer';

const WalletEndpoints = {
  walletList(limit: string, offset: string, search: string, status: string) {
    if (!search) {
      return `wallet/transactions?type=withdrawal&limit=${limit}&offset=${offset}&status=${status}`;
    }
    return `wallet/transactions?type=withdrawal&limit=${limit}&offset=${offset}&status=${status}&search=${search}`;
  },
  walletManagementList(limit: string, offset: string, search?: string) {
    if (!search) {
      return `wallet?limit=${limit}&offset=${offset}`;
    }
    return `wallet?limit=${limit}&offset=${offset}&phone=${search}`;
  },
  walletDetails(walletID: string) {
    return `wallet/${walletID}`;
  },
  withdrawalDetails(walletID: string) {
    return `wallet/transactions/${walletID}`;
  },
  withdrawalRequest(walletID: string) {
    return `wallet/transactions/${walletID}/complete`;
  },
  getTransaction({ ownerId, orderId }: { ownerId: string; orderId: string }) {
    return `wallet/transactions/owner/${ownerId}/order/${orderId}`;
  },
  deleteWalletTransaction(walletID: string) {
    return `wallet/transactions/${walletID}`;
  },
  OrderTransaction(orderID: string) {
    return `wallet/transactions/order/${orderID}`;
  },
};

export type WalletUser = Pick<ICustomer, 'name' | 'phone'>;

export type walletStatusNameType = 'pending' | 'success' | 'failed';

export enum EWalletStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum ERequestStatus {
  SUCCESS = 'Success',
  PENDING = 'Pending',
  FAILED = 'Failed',
}

export const walletStatusValues: IWalletStatus[] = [
  { id: 'pending', displayName: ERequestStatus.PENDING, name: 'pending' },
  { id: 'success', displayName: ERequestStatus.SUCCESS, name: 'success' },
  { id: 'failed', displayName: ERequestStatus.FAILED, name: 'failed' },
];

export interface IWalletStatus {
  id: string;
  name: walletStatusNameType;
  displayName: string;
}

export interface IWalletDTO {
  ownerId: string;
  tag: string;
  balance: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}
export interface IWallet {
  id: string;
  requestDate: Date;
  requestId: string;
  userName: string;
  userPhone: string;
  status: string;
  requestStatus: ERequestStatus;
  balance: string;
  withdrawalAmount: string;
}

export interface IResponseWallet {
  id: string;
  ownerId: string;
  walletId: string;
  wallet: IWalletDTO;
  amount: string;
  status: ERequestStatus;
  type: EWalletStatus;
  createdAt: Date;
  user: {
    name: string;
    phoneNumber: string;
  };
  updatedAt: Date;
}
export interface IResponseWalletOrderTransaction {
  agentId: string;
  agentName: string;
  createdAt: Date;
  status: ERequestStatus;
  transactionId: string;
  type: string;
  walletId: string;
  amount: number;
}

export interface IResponseWalletList {
  id: string;
  walletId: string;
  status: EWalletStatus;
  ownerId: string;
  userName: string;
  phoneNumber: string;
  balance: string;
}
export interface IResponseWalletDetails {
  transaction: IWalletDetailTransactions[];
  wallet: {
    userName: string;
    phoneNumber: string;
    pendingTransactions: string;
    totalBalance: string;
    onholdBalance: string;
    availableBalance: string;
    createdAt: Date;
    id: string;
    ownerId: string;
    status: ERequestStatus;
    tag: string;
    updatedAt: Date;
  };
}

export interface IWalletDetailTransactions {
  amount: number;
  createdAt: string;
  description: string;
  id: string;
  orderId: string;
  ownerId: string;
  status: ERequestStatus;
  type: string;
  updatedAt: string;
  walletId: string;
}
export interface IResponseWalletTransaction {
  id: string;
  ownerId: string;
  walletId: string;
  amount: string;
  status: ERequestStatus;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Wallet {
  static async getTransaction({
    ownerId,
    orderId,
  }: {
    ownerId: string;
    orderId: string;
  }) {
    const result = await apiGatewayClient.client.get(
      WalletEndpoints.getTransaction({ ownerId, orderId })
    );
    return result.data;
  }
  static async getWalletList({
    limit,
    offset,
    search,
    statuses,
  }: {
    limit: string;
    offset: string;
    search: string;
    statuses: string;
  }) {
    const result = await apiGatewayClient.client.get(
      WalletEndpoints.walletList(limit, offset, search, statuses)
    );

    return result.data;
  }

  static async getWalletDetails(walletId: string) {
    const result = await apiGatewayClient.client.get(
      WalletEndpoints.walletDetails(walletId)
    );

    return result;
  }

  static async getWalletManagementList({
    limit,
    offset,
    search,
  }: {
    limit: string;
    offset: string;
    search: string;
  }) {
    const result = await apiGatewayClient.client.get(
      WalletEndpoints.walletManagementList(limit, offset, search)
    );

    return result.data;
  }

  static async getWithdrawalRequestDetails(walletID: string) {
    const result = await apiGatewayClient.client.get(
      WalletEndpoints.withdrawalDetails(walletID)
    );

    return result.data;
  }

  static async submitWithdrawalRequest(walletID: string) {
    const result = await apiGatewayClient.client.post(
      WalletEndpoints.withdrawalRequest(walletID)
    );

    return result.data;
  }

  static async deleteWalletTransaction(walletId: string) {
    const result = await apiGatewayClient.client.delete(
      WalletEndpoints.deleteWalletTransaction(walletId)
    );
    return result.data;
  }

  static async getOrderTransaction(orderID: string) {
    const result = await apiGatewayClient.client.get(
      WalletEndpoints.OrderTransaction(orderID)
    );

    return result?.data;
  }

  static mapWallet(users: IResponseWallet[]): IWallet[] {
    const mappedUsers = users?.map(
      (item: IResponseWallet) =>
        new Wallet({
          id: item?.walletId,
          requestDate: item?.createdAt,
          requestId: item?.id,
          userName: item?.user?.name,
          userPhone: item?.user?.phoneNumber,
          status: item?.wallet?.status,
          requestStatus: item?.status,
          balance: item?.wallet?.balance,
          withdrawalAmount: item?.amount,
        })
    );

    return instanceToPlain(mappedUsers) as Wallet[];
  }
  static mapWalletList(wallets: IResponseWalletList[]) {
    const mappedWallets = wallets?.map((item: IResponseWalletList) => ({
      id: item?.id,
      walletId: item?.id,
      userName: item?.userName,
      status: item?.status,
      balance: item?.balance,
      ownerId: item?.ownerId,
      phoneNumber: item?.phoneNumber,
    }));

    return instanceToPlain(mappedWallets) as Wallet[];
  }

  static mapWalletDetails(walletDetail: IResponseWalletDetails) {
    const details = {
      userName: walletDetail?.wallet?.userName,
      id: walletDetail?.wallet?.id,
      userPhone: walletDetail?.wallet?.phoneNumber,
      status: walletDetail?.wallet?.status,
      totalBalance: walletDetail?.wallet?.totalBalance,
      onholdBalance: walletDetail?.wallet?.onholdBalance,
      availableBalance: walletDetail?.wallet?.availableBalance,
      pendingTransactions: walletDetail?.wallet?.pendingTransactions,
    };

    return details;
  }

  static mapTransaction(walletTransaction: IResponseWalletTransaction[]) {
    const mappedWalletTransactions = walletTransaction.map((transaction) => ({
      id: transaction?.id,
      ownerId: transaction?.ownerId,
      status: transaction?.status,
      walletId: transaction?.walletId,
      amount: transaction?.amount,
      type: transaction?.type,
      createdAt: transaction?.createdAt,
      updatedAt: transaction?.updatedAt,
    }));

    return instanceToPlain(mappedWalletTransactions) as [];
  }

  static mapOrderTransactions(items: IResponseWalletOrderTransaction[]) {
    const mappedTransactions = items.map(
      (item: IResponseWalletOrderTransaction) => ({
        agentId: item?.agentId,
        createdAt: item?.createdAt,
        status: item?.status,
        transactionId: item?.transactionId,
        type: item?.type,
        walletId: item?.walletId,
        agentName: item?.agentName,
        amount: item?.amount,
      })
    );

    return instanceToPlain(
      mappedTransactions
    ) as IResponseWalletOrderTransaction[];
  }

  public id: string;
  public requestDate: Date;
  public requestId: string;
  public userName: string;
  public userPhone: string;
  public status: string;
  public requestStatus: ERequestStatus;
  public balance: string;
  public withdrawalAmount: string;
  constructor({
    id,
    requestDate,
    requestId,
    userName,
    userPhone,
    status,
    requestStatus,
    balance,
    withdrawalAmount,
  }: IWallet) {
    this.id = id;
    this.requestDate = requestDate;
    this.requestId = requestId;
    this.userName = userName;
    this.userPhone = userPhone;
    this.status = status;
    this.requestStatus = requestStatus;
    this.balance = balance;
    this.withdrawalAmount = withdrawalAmount;
  }
}
