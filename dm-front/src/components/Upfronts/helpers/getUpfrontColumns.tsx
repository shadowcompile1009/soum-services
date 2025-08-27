import { PayoutAction } from '@/components/Payout/PayoutAction';
import { TableDateView } from '@/components/Shared/TableComponents';
import { UpfrontStatusSelect } from '@/components/Shared/UpfrontStatusSelect';
import { ConsignmentStatus, Upfronts } from '@/models/Upfronts';
import { DeepKeys, createColumnHelper } from '@tanstack/react-table';
import { PayoutStatusCheck } from '../PayoutStatusCheck';

const columnHelper = createColumnHelper<Upfronts>();

export interface Column {
  accessor: DeepKeys<Upfronts>;
  header: string;
}

interface getUpfrontColumnsProps {
  columns: Column[];
  modalName?: string;
  queryKey: string[];
  refetchUpfronts?: () => Promise<any>;
  isPayoutToSellerPage?: boolean;
}

export function getUpfrontColumns(props: getUpfrontColumnsProps) {
  const {
    columns,
    modalName = 'payoutToSeller',
    queryKey,
    refetchUpfronts,
    isPayoutToSellerPage = false,
  } = props;

  return columns.map((column) => {
    const { accessor, header } = column;
    if (accessor === 'createdAt') {
      return columnHelper.accessor(accessor, {
        cell: (info) => {
          const dateValue = new Date(info.getValue());
          return <TableDateView date={dateValue} />;
        },
        header,
      });
    }

    if (accessor === 'trackingNumber') {
      return columnHelper.accessor(accessor, {
        cell: (value) => {
          const trackingNumber = value.getValue();
          const shippingLabel = value.row.original.shippingLabel;
          return (
            <a
              href={shippingLabel || ''}
              target="_blank"
              aria-label="Shipping Label"
              rel="noreferrer"
            >
              {trackingNumber || ''}
            </a>
          );
        },
        header,
      });
    }

    if (accessor === 'status') {
      return columnHelper.accessor(accessor, {
        cell: (info) =>
          isPayoutToSellerPage ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <UpfrontStatusSelect
                upfront={info.row.original}
                orderId={info.row.original.id}
                value={info.getValue()}
                queryKey={queryKey}
                refetchUpfronts={refetchUpfronts}
                isPayoutToSellerPage={isPayoutToSellerPage}
              />
              {info.getValue() !== ConsignmentStatus.PAYOUT_PROCESSING &&
                info.getValue() !== ConsignmentStatus.TRANSFERRED && (
                  <PayoutAction
                    orderId={info.row.original.id}
                    modalName={modalName}
                    sellerId={info.row.original.userId}
                  />
                )}
              {info.getValue() === ConsignmentStatus.PAYOUT_PROCESSING && (
                <PayoutStatusCheck
                  orderId={info.row.original.id}
                  refetchUpfronts={refetchUpfronts}
                />
              )}
            </div>
          ) : (
            <UpfrontStatusSelect
              upfront={info.row.original}
              orderId={info.row.original.id}
              value={info.getValue()}
              queryKey={queryKey}
              refetchUpfronts={refetchUpfronts}
            />
          ),
        header: isPayoutToSellerPage ? 'Status & Action' : header,
      });
    }

    return columnHelper.accessor(accessor, {
      cell: (info) => info.getValue(),
      header,
    });
  });
}
