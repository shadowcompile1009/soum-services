export class DailyPayoutSellerReportDto {
  order_id: string;
  hyper_splits_id: string;
  transaction_timestamp: string;
  made_by: string;
  product_id: string;
  product_name: string;
  variant: string;
  seller_name: string;
  seller_mobile: string;
  product_sell_price: number;
  commission: number;
  commission_amount: number;
  vat: number;
  shipping_charge: number;
  pay_amount: number;
  bank_name: string;
  iban: string;
}
