import { Column } from '@src/components/Order/helpers/getAllOrdersColumns';

export const allOrderColumns: Column[] = [
  {
    accessor: 'orderId',
    header: 'Order ID',
  },
  {
    accessor: 'dateCreatedAt',
    header: 'Date',
  },
  {
    accessor: 'orderType',
    header: 'Order Type',
  },
  {
    accessor: 'logisticService',
    header: 'Logistic Services',
  },
  {
    accessor: 'operatingModel',
    header: 'Operating Model',
  },
  {
    accessor: 'sellerType',
    header: 'Seller Type',
  },
  {
    accessor: 'sellerCategory',
    header: 'Seller Category',
  },
  {
    accessor: 'orderStatus',
    header: 'Order Status',
  },
  {
    accessor: 'actions',
    header: 'Actions',
  },
];
