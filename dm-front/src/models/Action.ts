import isEmpty from 'lodash.isempty';
import { apiClientV2, apiGatewayClient } from '@/api';

type ObjectId = string;

interface IActionResponse {
  id: string;
  name: string;
  statusId: ObjectId;
}

export interface IAction {
  id: string;
  displayName: string;
  name: string;
  statusId: ObjectId;
}

export const ActionEndpoints = {
  assignLogisticVendor: 'ler/service/logistic',
  action(statusId: ObjectId) {
    return `rest/api/v1/dm-orders/actions?statusId=${statusId}`;
  },
  applyAction(dmOrderId: string, submodule: string) {
    return `rest/api/v1/dm-orders/${dmOrderId}/${submodule}-actions`;
  },
};

export class Action {
  static async assignLogisticVendor({
    vendorId,
    serviceId,
    dmoId,
  }: {
    vendorId: string;
    serviceId: string;
    dmoId: string;
  }) {
    const endpoint = ActionEndpoints.assignLogisticVendor;
    const result = await apiGatewayClient.client.put(endpoint, {
      vendorId,
      serviceId,
      dmoId,
    });
    return result;
  }

  static async applyAction(
    dmOrderId: string,
    submodule: string,
    actionId: IAction['id'],
    nctReasonId?: string,
    orderId?: string
  ) {
    const endpoint = ActionEndpoints.applyAction(dmOrderId, submodule);
    if (!isEmpty(nctReasonId) && !isEmpty(orderId)) {
      const result = await apiClientV2.client.put(endpoint, {
        nctReasonId,
        actionId,
        orderId,
      });
      return result;
    }

    const result = await apiClientV2.client.put(endpoint, {
      actionId,
    });
    return result;
  }
  static async getAction({ statusId }: { statusId?: ObjectId }) {
    if (!statusId) return [];

    const result = await apiClientV2.client.get(
      ActionEndpoints.action(statusId)
    );

    if (isEmpty(result)) return [];
    if (isEmpty(result.data.responseData)) return [];

    return Action.mapAction(result.data.responseData);
  }

  static mapAction(actions: IActionResponse[]): IAction[] {
    return actions.map(
      (action) =>
        new Action({
          id: action.id,
          name: action.name,
          statusId: action.statusId,
          displayName: action.name,
        })
    );
  }

  public id: string;
  public displayName: string;
  public statusId: ObjectId;
  public name: string;

  constructor({ id, displayName, statusId, name }: IAction) {
    this.id = id;
    this.displayName = displayName;
    this.statusId = statusId;
    this.name = name;
  }
}
