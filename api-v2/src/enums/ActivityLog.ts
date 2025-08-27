export enum ActivityLogEvent {
  STATUS_CHANGE = 'Status Change',
}

export enum ActivityLogAction {
  IN_TRANSIT = 'to In-transit',
  BACKLOG_IN_TRANSIT = 'to Backlog - In-transit',
  LOST_SHIPMENT = 'to Lost shipment',
  DELIVERED_SOUM_PRODUCT = 'to Delivered - Soum Product',
  ITEM_DELIVERED = 'to Item Delivered',
  DISPUTE = 'to Dispute',
  TO_RESTRICTED = 'to to Restricted',
  PAYOUT_TO_SELLER = 'to Payout to Seller',
  BACKLOG_PAYOUT = 'to Backlog - Payout',
  TRANSFERRED = 'to Transferred',
}
