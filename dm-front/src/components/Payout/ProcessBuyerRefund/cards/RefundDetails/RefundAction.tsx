import { Control, UseFormWatch } from 'react-hook-form';
import { useIsMutating } from '@tanstack/react-query';

import { Stack } from '@src/components/Layouts';
import { Box } from '@src/components/Box';
import { Text } from '@src/components/Text';
import { Button } from '@src/components/Button';
import { Loader } from '@src/components/Loader/Loader';
import { SelectOrderStatus } from '@src/components/Order/EditOrderDetails/Select/SelectOrderStatus';

import { RefundToPay } from './RefundToPay';
import { formatDistanceToNow } from 'date-fns';
import { selectStyles } from './styles';

import { RefundFormValues } from './types';

export const RefundAction = ({
  control,
  buyerOrderDetails,
  orderDetails,
  watch,
}: {
  control: Control<RefundFormValues>;
  buyerOrderDetails: any;
  orderDetails: any;
  watch: UseFormWatch<RefundFormValues>;
}) => {
  const isMutating = useIsMutating();

  const refundStatus = watch('orderStatus');

  const isRefundRequested =
    refundStatus?.name === 'refund-requested' &&
    buyerOrderDetails?.refundStatus !== 'Cannot be Processed' &&
    orderDetails?.orderData?.status !== 'Refund Failed';

  const disableButton = buyerOrderDetails?.isBNPL
    ? buyerOrderDetails?.captureStatus !== 'Not Captured' || !!isMutating
    : isRefundRequested ||
      buyerOrderDetails?.isRefundSuccess ||
      buyerOrderDetails?.isReversalSuccess ||
      buyerOrderDetails?.isSuccessRefundToWallet ||
      !!isMutating;

  return (
    <Stack
      direction="vertical"
      align="left"
      gap="0.5rem"
      style={{ marginLeft: '2.6875rem' }}
    >
      <Stack direction="horizontal" align="center" gap="6">
        <Text fontSize="1.5rem" fontWeight="semibold" color="static.black">
          Refund Action
        </Text>
      </Stack>
      <Box
        cssProps={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <Stack direction="vertical" padding="0 0 0.25rem">
          <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
            <Text fontWeight="bold" fontSize="baseText" color="static.black">
              Time Since Order
            </Text>
          </Box>
          <Box
            cssProps={{
              borderRadius: '0.25rem',
              backgroundColor: '#6c757d13',
              display: 'flex',
              alignItems: 'center',
              height: '2.125rem',
              marginTop: '0.5469rem',
              width: '14.125rem',
              paddingLeft: '0.75rem',
            }}
          >
            {orderDetails?.createdAt
              ? formatDistanceToNow(new Date(orderDetails?.createdAt))
              : ''}
          </Box>
        </Stack>
        {buyerOrderDetails?.isBNPL ? (
          <Stack direction="vertical" padding="0 0 0.25rem">
            <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
              <Text fontWeight="bold" fontSize="baseText" color="static.black">
                Refund To Pay
              </Text>
            </Box>
            <Box
              cssProps={{
                borderRadius: '0.25rem',
                backgroundColor: '#6c757d13',
                display: 'flex',
                alignItems: 'center',
                height: '2.125rem',
                marginTop: '0.5469rem',
                width: '14.125rem',
                paddingLeft: '0.75rem',
              }}
            >
              {buyerOrderDetails?.grandTotal}
            </Box>
          </Stack>
        ) : (
          <RefundToPay
            control={control}
            defaultValue={buyerOrderDetails?.grandTotal}
          />
        )}
        <Stack direction="vertical" padding="0 0 0.25rem">
          <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
            <Text fontWeight="bold" fontSize="baseText" color="static.black">
              Grand Total For Buyer
            </Text>
          </Box>
          <Box
            cssProps={{
              borderRadius: '0.25rem',
              backgroundColor: '#6c757d13',
              display: 'flex',
              alignItems: 'center',
              height: '2.125rem',
              marginTop: '0.5469rem',
              width: '14.125rem',
              paddingLeft: '0.75rem',
            }}
          >
            {buyerOrderDetails?.grandTotal}
          </Box>
        </Stack>

        {buyerOrderDetails?.isBNPL ? (
          <Stack direction="vertical" padding="0 0 0.25rem">
            <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
              <Text fontWeight="bold" fontSize="baseText" color="static.black">
                Refund Status
              </Text>
            </Box>
            <Box
              cssProps={{
                borderRadius: '0.25rem',
                backgroundColor: '#6c757d13',
                display: 'flex',
                alignItems: 'center',
                height: '2.125rem',
                marginTop: '0.5469rem',
                width: '14.125rem',
                paddingLeft: '0.75rem',
              }}
            >
              {buyerOrderDetails?.refundStatus}
            </Box>
          </Stack>
        ) : (
          <Stack
            direction="vertical"
            align="flex-start"
            style={{ paddingBottom: '4px' }}
          >
            <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
              <Text fontWeight="bold" fontSize="baseText" color="static.black">
                Refund Status
              </Text>
            </Box>
            <Box cssProps={{ position: 'relative', marginTop: '0.5469rem' }}>
              <SelectOrderStatus
                submodule="refund"
                orderDetails={orderDetails}
                control={control}
                styles={selectStyles}
              />
            </Box>
          </Stack>
        )}

        <div></div>
        <Stack direction="horizontal" align="flex-end" justify="flex-end">
          <Button variant="filled" type="submit" disabled={disableButton}>
            {!!isMutating ? (
              <Loader size="24px" marginRight="0" border="static.blue" />
            ) : buyerOrderDetails?.isBNPL ? (
              'Close Payment'
            ) : (
              'Submit '
            )}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};
