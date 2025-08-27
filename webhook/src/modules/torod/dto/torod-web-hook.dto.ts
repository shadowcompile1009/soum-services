export class TorodWebHookDto {
  order_id: string;
  tracking_id: string;
  status: TorodStatus;
  date_time: Date;
  description: string;
  torod_description: string;
  torod_description_ar: string;
}

export enum TorodStatus {
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
  CREEATED = 'Created',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  FAILED = 'Failed',
  RTO = 'RTO',
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
