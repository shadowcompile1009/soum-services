export const PAYOUT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
];

export const PAYOUT_BREAKDOWN_ITEMS = (orderSellerDetails: any) => [
  {
    amount: orderSellerDetails?.basePrice,
    text: 'Base Buy Price (SellPrice)',
  },
  {
    amount: orderSellerDetails?.commissionAmount,
    text: 'Seller Commission Amount',
  },
  { amount: orderSellerDetails?.discount, text: 'Total Discount' },
  {
    amount: orderSellerDetails?.shippingCharges,
    text: 'Shipping Charges',
  },
  { amount: orderSellerDetails?.vat, text: 'VAT' },
  {
    amount: orderSellerDetails?.grandTotal,
    text: 'Grand Total for Seller',
  },
];

export const PAYOUT_DETAILS_DEFAULT_VALUES = (orderDetails: any) => ({
  orderStatus: {
    id: orderDetails?.statusId,
    displayName: orderDetails?.orderData?.status,
    name: orderDetails?.orderData?.status?.split(' ').join('-').toLowerCase(),
  },
  financeReasoning: {
    name: '',
    value: '',
  },
});
