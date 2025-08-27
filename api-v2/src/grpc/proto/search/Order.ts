// Original file: node_modules/soum-proto/proto/search.proto

export interface Order {
  id?: string;
  merchantId?: string;
  orderId?: string;
  orderNumber?: string;
  dmOrderId?: string;
  dmOrderStatus?: string;
  paymentStatus?: string;
  productId?: string;
  productName?: string;
  orderStatus?: string;
  customerId?: string;
  paymentId?: string;
  salePrice?: number;
  grantTotal?: number;
  payoutAmount?: number;
  productNameAr?: string;
  customerName?: string;
  name?: string;
  trackingNumber?: string;
  variantId?: string;
  createdAt?: number;
}

export interface Order__Output {
  id: string;
  merchantId: string;
  orderId: string;
  orderNumber: string;
  dmOrderId: string;
  dmOrderStatus: string;
  paymentStatus: string;
  productId: string;
  productName: string;
  orderStatus: string;
  customerId: string;
  paymentId: string;
  salePrice: number;
  grantTotal: number;
  payoutAmount: number;
  productNameAr: string;
  customerName: string;
  name: string;
  trackingNumber: string;
  variantId: string;
  createdAt: number;
}
