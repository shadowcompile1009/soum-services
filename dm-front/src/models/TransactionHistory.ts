import { instanceToPlain } from 'class-transformer';

import { apiGatewayClient } from '@src/api/client';

const TransactionHistoryEndpoints = {
  logsList(limit: string, offset: string, search?: string) {
    if (!search) {
      return `activity-log/activity?limit=${limit}&offset=${offset}`;
    }
    return `activity-log/activity/${search}?limit=${limit}&offset=${offset}`;
  },
  ordersLogsList(orderId: string, limit: string, offset: string) {
    return `activity-log/activity/${orderId}?limit=${limit}&offset=${offset}`;
  },
};

export interface ITransactionHistory {
  time: Date;
  userName: string;
  eventType: string;
  action: string;
}
export interface IResponseTransactionHistory {
  username: string;
  userId: string;
  orderId: string;
  eventType: string;
  module: string;
  topic: string;
  action: string;
  version: string;
  createdAt: Date;
  updatedAt: string;
}

export class TransactionHistory {
  static async getTransactionHistoryList({
    limit,
    offset,
    search,
  }: {
    limit: string;
    offset: string;
    search?: string;
  }) {
    const result = await apiGatewayClient.client.get(
      TransactionHistoryEndpoints.logsList(limit, offset, search)
    );

    return result.data;
  }

  static async getOrderTransactionHistoryList({
    orderId,
    limit,
    offset,
  }: {
    orderId: string;
    limit: string;
    offset: string;
  }) {
    const result = await apiGatewayClient.client.get(
      TransactionHistoryEndpoints.ordersLogsList(orderId, limit, offset)
    );

    return result.data;
  }

  static mapTransactionHistory(
    users: IResponseTransactionHistory[]
  ): ITransactionHistory[] {
    const mappedLogs = users?.map(
      (item: IResponseTransactionHistory) =>
        new TransactionHistory({
          time: item?.createdAt,
          userName: item?.username,
          eventType: item?.eventType,
          action: item?.action,
        })
    );

    return instanceToPlain(mappedLogs) as TransactionHistory[];
  }

  public time: Date;
  public userName: string;
  public eventType: string;
  public action: string;

  constructor({ time, userName, eventType, action }: ITransactionHistory) {
    this.time = time;
    this.userName = userName;
    this.eventType = eventType;
    this.action = action;
  }
}
