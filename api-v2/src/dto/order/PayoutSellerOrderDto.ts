export class PayoutSellerOrderDto {
  order_id: string;
  product_id: string;
  product_name: string;
  variant: string;
  seller_name: string;
  seller_phone: string;
  duration_of_created_order: number;
  sell_price: number;
  commission: number;
  commission_amount: number;
  vat: number;
  shipping_charge: number;
  net_seller: number;
  bank_name: string;
  iban: string;
}
export interface PenalizedOrder {
  productName: string;
  orderNumber: string;
  payoutAmount: number;
  penalty: number;
  finalPayout: number;
  nctReason: string;
  nctReasonAR: string;
  dmoId: string;
}
