export type PoConfirmationRequest = {
  items: {
    sku: string;
    quantity: number;
    item_display_name: string;
    unit_price: number;
    vat_amount: number;
    item_desc: string;
  };
  po_id: string;
  merchant_id: string;
  order_id: string;
  transaction_id: string;
  total_amount: number;
  total_vat_amount: number;
  po_created_at: Date;
};

export type PoConfirmationResponse = {
  po_id: string;
  merchant_id: string;
  order_id: string;
  transaction_id: string;
  accepted_at: Date;
  accept: boolean;
};

export type StatusCallbackRequest = {
  transaction_id: string;
  order_id: string;
  status_code: string;
  message: string;
  message_ar: string;
  hold_period: Date;
  order_status: string;
};

export type StatusCallbackResponse = {
  accept: boolean;
  accepted_at: Date;
};
