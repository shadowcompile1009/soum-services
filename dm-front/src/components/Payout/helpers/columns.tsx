import { Column } from '../../Order/helpers/getOrdersColumns';

export const refundColumns: Column[] = [
  {
    accessor: 'orderNumber',
    header: 'Order ID',
  },
  {
    accessor: 'date',
    header: 'Date',
  },
  {
    accessor: 'orderType',
    header: 'Order Type',
  },
  {
    accessor: 'orderStatus',
    header: 'Order Status',
  },
  {
    accessor: 'grandTotal',
    header: 'Grand Total',
  },
  {
    accessor: 'payment',
    header: 'Payment Type',
  },
  {
    accessor: 'buyer.refundAmount',
    header: 'Refund Amount',
  },
];

export const refundColumns2_0: Column[] = [
  {
    accessor: 'orderNumber',
    header: 'Order ID',
  },
  {
    accessor: 'date',
    header: 'Date',
  },
  {
    accessor: 'orderType',
    header: 'Order Type',
  },
  {
    accessor: 'orderStatus.displayName',
    header: 'Refund Status',
  },
  {
    accessor: 'payment',
    header: 'Payment Type',
  },
  {
    accessor: 'grandTotal',
    header: 'Grand Total',
  },
  {
    accessor: 'buyer.refundAmount',
    header: 'Refund Amount',
  },
];

export const payoutColumns: Column[] = [
  {
    accessor: 'orderNumber',
    header: 'Order ID',
  },
  {
    accessor: 'date',
    header: 'Date',
  },
  {
    accessor: 'orderType',
    header: 'Order Type',
  },
  {
    accessor: 'orderStatus',
    header: 'Order Status',
  },
  {
    accessor: 'grandTotal',
    header: 'Grand Total',
  },
  {
    accessor: 'seller.payoutAmount',
    header: 'Payout Amount',
  },
  {
    accessor: 'payoutType',
    header: 'Payout Type',
  },
  // {
  //   accessor: 'id',
  //   header: 'Payout',
  // },
];

export const payoutColumns2_0: Column[] = [
  {
    accessor: 'orderNumber',
    header: 'Order ID',
  },
  {
    accessor: 'date',
    header: 'Date',
  },
  {
    accessor: 'orderType',
    header: 'Order Type',
  },
  {
    accessor: 'payoutStatus',
    header: 'Payout Status',
  },
  {
    accessor: 'payoutType',
    header: 'Payout Type',
  },
  {
    accessor: 'grandTotal',
    header: 'Grand Total',
  },
  {
    accessor: 'seller.payoutAmount',
    header: 'Payout Amount',
  },

  // {
  //   accessor: 'id',
  //   header: 'Payout',
  // },
];
