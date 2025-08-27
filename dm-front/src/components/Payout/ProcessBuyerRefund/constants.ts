export const PAYOUT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
];

export const PAYOUT_BREAKDOWN_FIRST_GROUP_ITEMS = (buyerOrderDetails: any) => [
  { amount: buyerOrderDetails?.shippingCharges, text: 'Shipping Charges' },
  { amount: buyerOrderDetails?.sellPrice, text: 'Sell Price' },
  { amount: buyerOrderDetails?.buyerCommision, text: 'Buyer Commission' },
  { amount: buyerOrderDetails?.discountTotal, text: 'Discount Total' },
  { amount: buyerOrderDetails?.vat, text: 'VAT' },
  { amount: buyerOrderDetails?.grandTotal, text: 'Grand Total for Seller' },
];

export const PAYOUT_BREAKDOWN_SECOND_GROUP_ITEMS = (buyerOrderDetails: any) => [
  {
    amount: buyerOrderDetails?.cancellationFee,
    text: 'Buyer Cancellation Fee',
  },
  {
    amount: buyerOrderDetails?.refundAmount,
    text: 'Refund Amount to Pay for Buyer',
  },
  {
    amount: buyerOrderDetails?.reservationAmount,
    text: 'Reservation amount to be refunded from DM',
  },
  {
    amount: buyerOrderDetails?.reservationRemainingAmount,
    text: 'Remaining amount to be refunded offline',
  },
];
