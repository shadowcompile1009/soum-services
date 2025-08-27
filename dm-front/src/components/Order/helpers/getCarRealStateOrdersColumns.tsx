import { DeepKeys, createColumnHelper } from '@tanstack/react-table';

import { TableDateView } from '@/components/Shared/TableComponents';
import { Text } from '@/components/Text';
import { OrderStatusSelect } from '@/components/Shared/OrderStatusSelect';

import { FinanceOrder, IOrderStatus } from '@/models/Order';

import { OrderDetailsLink } from '../OrderDetailsLink';
import { PayoutAction } from '@/components/Payout/PayoutAction';
import { CaptureLink } from '../CaptureLink';
const financeColumnHelper = createColumnHelper<FinanceOrder>();

export interface FinanceOrderColumn {
  accessor: DeepKeys<FinanceOrder>;
  header: string;
}

interface getFinanceOrderColumnsProps {
  columns: FinanceOrderColumn[];
  queryKey: string[];
  modalName?: string;
  financingOptions?: IOrderStatus[],
  reservationOptions?: IOrderStatus[],
  selectedStatus?: string[];
  setSelectedStatus?: (status: string[]) => void;
}

type ReservationStatus = 
| 'New order'
| 'Waiting for Approval'
| 'Approved'
| 'Rejected'
| 'Waiting for Visit'
| 'Cancelled Visit'
| 'Waiting for Full Amount'
| 'Full Amount Paid'
| 'Cancelled Reservation'
| 'Refund to Buyer'
| 'Refunded';
type FinancingStatus = 
| 'New order'
| 'Waiting for Visit'
| 'Cancelled Visit'
| 'Waiting for Full Amount'
| 'Full Amount Paid'
| 'Cancelled Reservation'
| 'Refund to Buyer'
| 'Refunded';
const financingActions = (currentStatus: IOrderStatus, statuses: IOrderStatus[]) => {
  const result = statuses.filter((item:IOrderStatus) => {
    const statusTransitions: Record<ReservationStatus, ReservationStatus[]> = {
      'New order': ['Waiting for Approval'],
      'Waiting for Approval': ['New order', 'Approved', 'Rejected'],
      'Approved': ['Waiting for Approval', 'Waiting for Visit'],
      'Rejected': ['Waiting for Approval'],
      'Waiting for Visit': ['Approved', 'Waiting for Full Amount', 'Cancelled Visit'],
      'Cancelled Visit': ['Waiting for Visit', 'Refund to Buyer'],
      'Waiting for Full Amount': ['Waiting for Visit', 'Full Amount Paid', 'Cancelled Reservation'],
      'Full Amount Paid': ['Waiting for Full Amount'],
      'Cancelled Reservation': ['Waiting for Full Amount', 'Refund to Buyer'],
      'Refund to Buyer': ['Cancelled Reservation', 'Refunded'],
      'Refunded': ['Refund to Buyer']
    };

    return statusTransitions[currentStatus.displayName as ReservationStatus]?.includes(item.displayName as ReservationStatus)
  });


  return result || statuses;
}

const cashActions = (currentStatus: IOrderStatus, statuses: IOrderStatus[]) => {
  const result = statuses.filter((item:IOrderStatus) => {
    const statusTransitions: Record<FinancingStatus, FinancingStatus[]> = {
        'New order': ['Waiting for Visit'],
        'Waiting for Visit': ['New order', 'Waiting for Full Amount', 'Cancelled Visit'],
        'Waiting for Full Amount': ['Waiting for Visit', 'Full Amount Paid', 'Cancelled Reservation'],
        'Cancelled Visit': ['Waiting for Visit', 'Refund to Buyer'],
        'Full Amount Paid': ['Waiting for Full Amount'],
        'Cancelled Reservation': ['Waiting for Full Amount', 'Refund to Buyer'],
        'Refund to Buyer': ['Cancelled Reservation', 'Refunded'],
        'Refunded': ['Refund to Buyer'],
    }

    return statusTransitions[currentStatus.displayName as FinancingStatus]?.includes(item.displayName as FinancingStatus);
  });


  return result || statuses;
}

export function getFinanceOrderColumns(
  props: getFinanceOrderColumnsProps
) {
  const { columns, queryKey, financingOptions, reservationOptions, modalName = 'closedOrders' } = props;
  return columns.map((column) => {
    const { accessor, header } = column;
    if (accessor === 'date') {
      return financeColumnHelper.accessor(accessor, {
        cell: (info) => <TableDateView date={info.getValue()} />,
        header,
      });
    }

    if (accessor === 'orderStatus') {
      return financeColumnHelper.accessor(accessor, {
        cell: (info) => {
          const selectedStatus = props?.selectedStatus?.find((value: string) => value.includes(info?.row?.original?.dmOrderId));
          const displayStatus = selectedStatus && selectedStatus.split('-')[1] ? selectedStatus.split('-')[1] : info.row.original.orderStatus.displayName;

          return (
            <Text
              as="span"
              fontWeight="regular"
              fontSize="smallestText"
              color="static.black"
            >
              {displayStatus}
            </Text>
          );
        },
        header,
      });
    }

    if (accessor === 'actions') {
      return financeColumnHelper.accessor(accessor, {
        cell: (info) => {
            let options = Array<IOrderStatus>();
            let rules = undefined;
            if (info.row.original.isReservation) {
                options = reservationOptions as IOrderStatus[];
                rules = cashActions
            } else if (info.row.original.isFinancing) {
                options = financingOptions as IOrderStatus[];
                rules = financingActions
            } 
            return (
          <OrderStatusSelect
            order={info.row.original}
            value={info.row.original.orderStatus}
            orderId={info.row.original.dmOrderId}
            queryKey={queryKey}
            loadOptions={options}
            selectRules={rules}
            selectedStatus={props.selectedStatus}
            setSelectedStatus={props.setSelectedStatus}
          />
        )},
        header,
      });
    }

    if (accessor === 'payment') {
      return financeColumnHelper.accessor(accessor, {
        cell: (info) => (
          <Text
            as="span"
            fontWeight="semibold"
            color={info?.getValue()?.textColor || 'static.grays.10'}
            fontSize="smallestText"
          >
            {info?.getValue()?.status}
          </Text>
        ),
        header,
      });
    }
    if (accessor === 'captureOrder') {
      return financeColumnHelper.accessor(accessor, {
        cell: (info) => (
          <Text
            as="span"
            color={info?.getValue()?.textColor || 'static.grays.10'}
            fontSize="smallestText"
            fontWeight="semibold"
          >
            {info?.getValue()?.captureStatus}
          </Text>
        ),
        header,
      });
    }

    if (accessor === 'orderNumber') {
      return financeColumnHelper.accessor(accessor, {
        cell: (info) => (
          <OrderDetailsLink orderId={info.row.original.id}>
            {info.row.original.orderNumber}
          </OrderDetailsLink>
        ),
        header,
      });
    }

    if (accessor === 'id' && modalName === 'closedOrders') {
      return financeColumnHelper.accessor(accessor, {
        cell: (info) => (
          <PayoutAction
            orderId={info.row.original.id}
            sellerId={info.row.original.seller?.id}
            modalName={modalName}
          />
        ),
        header,
      });
    }

    if (accessor === 'captureTransaction') {
      return financeColumnHelper.accessor(accessor, {
        cell: (info) => (
          <CaptureLink
            orderId={info.row.original.id}
            captureOrderDetails={info.row.original?.captureOrder || { captureStatus: 'N/A' }}
          >
            {info.row.original.orderNumber}
          </CaptureLink>
        ),
        header,
      });
    }

    return financeColumnHelper.accessor(accessor, {
      cell: (info) => info.getValue(),
      header,
    });
  });
}
