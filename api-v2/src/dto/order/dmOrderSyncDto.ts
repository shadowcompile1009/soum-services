export class OrderDetail {
  eventType: string;

  sellerId: string;

  sellerName: string;

  sellerImage: string;

  dmOrderId: string;

  productId: string;

  productGroupId: string;

  productName: string;

  productNameAr: string;

  description: string;

  orderNumber: string;

  orderStatus: string;

  grandTotal: number;

  module: string;

  topic: string;

  buyerId: string;

  buyerName: string;

  paymentId: string;

  sellPrice: string;

  grantTotal: string;

  payoutAmount: string;

  customerName: string;

  trackingNumber: string;

  variantId: string;

  createdAt: string;
}
export class OrderSyncDto {
  orderId: string;

  order_id: string;

  statusId: string;

  dmOrderId: string;

  dmStatus: string;

  createdAt: Date;

  updatedAt: Date;

  orderData: OrderDetail;

  paymentStatus: string;
}
