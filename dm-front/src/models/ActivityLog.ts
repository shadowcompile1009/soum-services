import { instanceToPlain } from 'class-transformer';

import { apiGatewayClient } from '@/api/client';

const ActivityLogEndpoints = {
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

export interface IActivityLog {
  time: Date;
  userName: string;
  eventType: string;
  action: string;
  updatedAt: Date;
}
export interface IResponseActivityLog {
  username: string;
  userId: string;
  orderId: string;
  eventType: string;
  module: string;
  topic: string;
  action: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ActivityLog {
  static async getActivityLogList({
    limit,
    offset,
    search,
  }: {
    limit: string;
    offset: string;
    search?: string;
  }) {
    const result = await apiGatewayClient.client.get(
      ActivityLogEndpoints.logsList(limit, offset, search)
    );

    return result.data;
  }

  static async getOrderActivityLogList({
    orderId,
    limit,
    offset,
  }: {
    orderId: string;
    limit: string;
    offset: string;
  }) {
    const result = await apiGatewayClient.client.get(
      ActivityLogEndpoints.ordersLogsList(orderId, limit, offset)
    );

    return result.data;
  }

  static mapActivityLog(users: IResponseActivityLog[]): IActivityLog[] {
    const mappedLogs = users?.map(
      (item: IResponseActivityLog) =>
        new ActivityLog({
          updatedAt: item?.updatedAt,
          time: item?.createdAt,
          userName: item?.username,
          eventType: item?.eventType,
          action: item?.action,
        })
    );

    return instanceToPlain(mappedLogs) as ActivityLog[];
  }

  public time: Date;
  public updatedAt: Date;
  public userName: string;
  public eventType: string;
  public action: string;

  constructor({ time, updatedAt, userName, eventType, action }: IActivityLog) {
    this.time = time;
    this.updatedAt = updatedAt;
    this.userName = userName;
    this.eventType = eventType;
    this.action = action;
  }
}
