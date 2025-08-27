import { DeepKeys } from '@tanstack/react-table';

import { Column } from '@src/components/Order/helpers/getOrdersColumns';
import { PaymentLogs } from '@src/models/PaymentLogs';

import { OrderColumnShippingV2 } from './getShippingOrderColumns';
import { OrderColumnDeliveryV2 } from './getDeliveryOrderColumns';
import { OrderColumnDisputeV3 } from './getDisputeOrdersColumns';
import { OrderColumnV2 } from './getConfirmOrderColumns';
import { OrderColumnBacklogV2 } from './getBacklogOrderColumns';
import { FinanceOrderColumn } from './getCarRealStateOrdersColumns';
import { OrderColumnReplacement } from './getReplacementOrdersColumns';
import { OrderColumnDisputeV2 } from './getDisputeColumns';

export interface ColumnPaymentLogs {
  accessor: DeepKeys<PaymentLogs>;
  header: string;
}

export const newOrdersColumn: Column[] = [
  {
    accessor: 'orderNumber',
    header: 'Order ID',
  },
  {
    accessor: 'date',
    header: 'Date',
  },
  {
    accessor: 'productId',
    header: 'Product ID',
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
    accessor: 'productName',
    header: 'Product Name',
  },
  {
    accessor: 'grandTotal',
    header: 'Grand Total',
  },
  {
    accessor: 'payment',
    header: 'Payment Status',
  },
  {
    accessor: 'trackingNumber',
    header: 'Tracking Number',
  },
];

export const activeOrdersColumn: Column[] = [
  {
    accessor: 'orderNumber',
    header: 'Order ID',
  },
  {
    accessor: 'date',
    header: 'Date',
  },
  {
    accessor: 'productId',
    header: 'Product ID',
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
    accessor: 'productName',
    header: 'Product Name',
  },
  {
    accessor: 'grandTotal',
    header: 'Grand Total',
  },
  {
    accessor: 'payment',
    header: 'Payment Status',
  },
  {
    accessor: 'trackingNumber',
    header: 'Tracking Number',
  },
];

export const closedOrdersColumn: Column[] = [
  {
    accessor: 'orderNumber',
    header: 'Order ID',
  },
  {
    accessor: 'date',
    header: 'Date',
  },
  {
    accessor: 'productId',
    header: 'Product ID',
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
    accessor: 'productName',
    header: 'Product Name',
  },
  {
    accessor: 'grandTotal',
    header: 'Grand Total',
  },
  {
    accessor: 'trackingNumber',
    header: 'Tracking Number',
  },
  // {
  //   accessor: 'id',
  //   header: 'Payment History',
  // },
];
export const BnplOrderColumn: Column[] = [
  { accessor: 'orderNumber', header: 'Order ID' },
  { accessor: 'date', header: 'Date' },
  { accessor: 'orderType', header: 'Order Type' },
  { accessor: 'orderStatus', header: 'Order Status' },
  { accessor: 'productName', header: 'Product Name' },
  { accessor: 'grandTotal', header: 'Grand Total' },
  { accessor: 'paymentType', header: 'Payment Type' },
  { accessor: 'payment', header: 'Payment Status' },
  { accessor: 'captureOrder', header: 'Capture Status' },
  { accessor: 'captureTransaction', header: 'Capture Transaction' },
];

export const PaymentLogsColumn: ColumnPaymentLogs[] = [
  { accessor: 'orderId', header: 'Order ID' },
  { accessor: 'productId', header: 'Product ID' },
  { accessor: 'mobileNumber', header: 'Mobile Number' },
  { accessor: 'soumNumber', header: 'Soum Number' },
  { accessor: 'paymentErrorId', header: 'Payment Error ID' },
  { accessor: 'paymentProvidor', header: 'Payment Provider' },
  { accessor: 'actionDate', header: 'Action Date' },
];

export const OrdersV2Column: OrderColumnV2[] = [
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
    accessor: 'logisticService',
    header: 'Logistic service',
  },
  {
    accessor: 'orderStatus',
    header: 'Order Status',
  },
];

export const shippingOrdersColumn: OrderColumnShippingV2[] = [
  ...OrdersV2Column,
  {
    accessor: 'updatedAt',
    header: 'Time Since Confirmation',
  },
  {
    accessor: 'actions',
    header: 'Actions',
  },
];

export const confirmOrdersColumn: OrderColumnV2[] = [
  ...OrdersV2Column,
  {
    accessor: 'date',
    header: 'Time since order',
  },
  {
    accessor: 'actions',
    header: 'Actions',
  },
];
export const deliveryOrdersColumn: OrderColumnDeliveryV2[] = [
  ...OrdersV2Column,
  {
    accessor: 'shippingDate',
    header: 'Time since Shipping',
  },
  {
    accessor: 'actions',
    header: 'Actions',
  },
];
export const backlogOrdersColumn: OrderColumnBacklogV2[] = [
  ...OrdersV2Column,
  {
    accessor: 'shippingDate',
    header: 'Time Since Shipping',
  },
  {
    accessor: 'deliveryDate',
    header: 'Time Since Delivery',
  },

  {
    accessor: 'actions',
    header: 'Actions',
  },
];
export const reservationOrdersColumn: Column[] = [
  {
    accessor: 'orderNumber',
    header: 'Order ID',
  },
  {
    accessor: 'date',
    header: 'Date',
  },
  {
    accessor: 'productId',
    header: 'Product ID',
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
    accessor: 'productName',
    header: 'Product Name',
  },
  {
    accessor: 'grandTotal',
    header: 'Grand Total',
  },
  {
    accessor: 'paidAmount',
    header: 'Paid Amount',
  },
  {
    accessor: 'remainingAmount',
    header: 'Remaining Amount',
  },
  {
    accessor: 'trackingNumber',
    header: 'Tracking Number',
  },
];

export const disputeColumn: OrderColumnDisputeV2[] = [
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
    accessor: 'deliveryDate',
    header: 'Time since Delivery',
  },
  {
    accessor: 'disputeDate',
    header: 'Time since Dispute',
  },
  {
    accessor: 'actions',
    header: 'Actions',
  },
];
export const disputeOrdersColumn: OrderColumnDisputeV3[] = [
  {
    accessor: 'orderId',
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
    accessor: 'operatingModel',
    header: 'Operating Model',
  },
  {
    accessor: 'disputeStatus',
    header: 'Dispute Status',
  },
  {
    accessor: 'deliveryDate',
    header: 'Time since Delivery',
  },
  {
    accessor: 'disputeDate',
    header: 'Time since Dispute',
  },
];

export const replacementOrdersColumn: OrderColumnReplacement[] = [
  {
    accessor: 'orderNumber',
    header: 'Order ID',
  },
  {
    accessor: 'replacedOrderId',
    header: 'Replaced Order ID',
  },
  {
    accessor: 'productId',
    header: 'Product ID',
  },
  {
    accessor: 'orderType',
    header: 'Order Type',
  },
  {
    accessor: 'orderStatus.displayName',
    header: 'Order Status',
  },
  {
    accessor: 'productName',
    header: 'Product Name',
  },
  { accessor: 'replacedProductId', header: 'Replaced Product ID' },
  { accessor: 'issueReplacement', header: 'Issue Replacement' },
];

export const financeOrderColumn: FinanceOrderColumn[] = [
  {
    accessor: 'orderNumber',
    header: 'Order ID',
  },
  {
    accessor: 'date',
    header: 'Date',
  },
  {
    accessor: 'productId',
    header: 'Product ID',
  },
  {
    accessor: 'orderType',
    header: 'Order Type',
  },
  {
    accessor: 'paymentType',
    header: 'Payment Type',
  },
  {
    accessor: 'orderStatus',
    header: 'Order Status',
  },
  {
    accessor: 'productName',
    header: 'Product Name',
  },
  {
    accessor: 'grandTotal',
    header: 'Grand Total',
  },
  {
    accessor: 'paidAmount',
    header: 'Paid Amount',
  },
  {
    accessor: 'remainingAmount',
    header: 'Remaining Amount',
  },
  {
    accessor: 'reservationAmount',
    header: 'Reservation Fee',
  },
  {
    accessor: 'financingFee',
    header: 'Financing Fee',
  },
  {
    accessor: 'actions',
    header: 'Actions',
  },
];
