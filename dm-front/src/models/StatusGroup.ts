import { instanceToPlain } from 'class-transformer';
import { apiClientV2 } from '@/api';
import isEmpty from 'lodash.isempty';

import { OrderStatusNameType } from './Order';

export const StatusGroups = {
  confirmation: 'Confirmation',
  delivery: 'Delivery',
  shipping: 'Shipping',
  dispute: 'Dispute',
  backlog: 'Backlog',
  financing: 'financing',
  reservation: 'reservation',
} as const;

export type StatusGroupType = keyof typeof StatusGroups;
export type StatusGroupValue = typeof StatusGroups[StatusGroupType];

interface IStatusGroupReponse {
  id: string;
  group: string;
  statusName: string;
  displayName: string;
}
interface IStatusGroup {
  id: string;
  displayName: string;
  group: StatusGroupValue;
  name: OrderStatusNameType;
}

export const StatusGroupEndpoints = {
  statusGroup(group: StatusGroupValue) {
    return `rest/api/v1/dm-orders/status-group?group=${group}`;
  },
} as const;

export class StatusGroup {
  static async getStatusGroup({ group }: { group: StatusGroupValue }) {
    const result = await apiClientV2.client.get(
      StatusGroupEndpoints.statusGroup(group)
    );

    if (isEmpty(result)) return [];
    if (isEmpty(result.data.responseData)) return [];

    const statusGroups = result.data.responseData;

    return instanceToPlain(
      StatusGroup.mapStatusGroup({ statusGroups })
    ) as StatusGroup[];
  }

  static mapStatusGroup({
    statusGroups,
  }: {
    statusGroups: IStatusGroupReponse[];
  }) {
    return statusGroups.map(
      (statusGroup: IStatusGroupReponse) =>
        new StatusGroup({
          id: statusGroup.id,
          displayName: statusGroup.displayName,
          name: statusGroup.statusName as OrderStatusNameType,
          group: statusGroup.group as StatusGroupValue,
        })
    );
  }

  public id: string;
  public displayName: string;
  public group: StatusGroupValue;
  public name: OrderStatusNameType;

  constructor({ id, displayName, name, group }: IStatusGroup) {
    this.id = id;
    this.displayName = displayName;
    this.name = name;
    this.group = group;
  }
}
