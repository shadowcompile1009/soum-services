// @ts-nocheck
import { Document, model, Schema } from 'mongoose';

export type GetAllDMStatusGroup = {
  id?: any;
  statusName: string;
  group: string;
};

export enum DMStatusGroups {
  DYNAMIC_TIMER_STATUS_IDS = 'dynamicTimerStatusIds',
  NEED_ACTIONS_STATUS = 'needActionsStatus',
  DYNAMIC_TIMER_SHOWN_STATUS = 'dynamicTimerShownStatus',
  DONE_ORDER = 'doneOrder',
  REFUNDED_SALES_STATUS = 'refundedSalesStatus',
  SHOULD_SHOW_BANNER = 'shouldShowBanner',
  IN_TRANSIT = 'inTransit',
  SHIPMENT_DELIVERED_TO_BUYER = 'shipmentDeliveredToBuyer',
  PRODUCT_VERIFIED = 'productVerified',
}

export interface IDmStatusGroup extends Document {
  group: string;
  id: any;
}

const dmStatusGroup = new Schema<IDmStatusGroup>({
  group: { type: String, required: true },
  id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'DeltaMachineStatuses',
  },
});

export const DmStatusGroup = model<IDmStatusGroup>(
  'DmStatusGroup',
  dmStatusGroup,
  'DmStatusGroup'
);
