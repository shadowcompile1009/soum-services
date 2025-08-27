export enum TorodStatus {
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
  CREEATED = 'Created',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  FAILED = 'Failed',
  RTO = 'RTO',
  DAMAGED = 'Damage',
  LOST = 'Lost',
}

export class TorodKafkaMessage {
  orderId: string;
  trackingId: string;
  status: TorodStatus;
  dateTime: Date;
  description: string;
  torodDescription: string;
  torodDescriptionAr: string;
  prefix: string;
}
