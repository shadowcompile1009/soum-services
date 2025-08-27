import NextLink from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Order } from '@src/models/Order';
import { Card } from '@src/components/Card';
import { Stack } from '@src/components/Layouts';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { Box } from '@src/components/Box';
import { Text } from '@src/components/Text';
import { OrderDetailsIcon } from '@src/components/Shared/OrderDetailsIcon';

import { Button } from '../../../Button';

import { OrderDetailsProps } from '../types';
import toast from 'react-hot-toast';

const STATUS_FIELDS = [
  {
    label: 'Dispute Status',
    getStatus: (orderDetails: any) => orderDetails?.disputeStatus,
  },
  {
    label: 'Refund Status',
    getStatus: (orderDetails: any) => orderDetails?.refundStatus,
  },
  {
    label: 'Payout Status',
    getStatus: (orderDetails: any) => orderDetails?.payoutStatus,
  },
];

export function PaymentsAndDisputesCard({ orderDetails }: OrderDetailsProps) {
  const queryClient = useQueryClient();

  const isRefundEnabled = orderDetails?.orderData?.isRequestRefundEnabled;
  const isPayoutEnabled = orderDetails?.orderData?.isRequestPayoutEnabled;

  const requestRefundOrPayoutMutation = useMutation(
    ({
      id,
      type,
    }: {
      id: string;
      type: 'refund' | 'payout';
    }): Promise<void> => {
      return Order.requestRefundOrPayout(id, type);
    },
    {
      onSuccess: (_, { type }) => {
        toast.success(`${type} request created successfully`);
        queryClient.invalidateQueries([
          QUERY_KEYS.orderDetailV3,
          orderDetails?.orderId,
        ]);
      },
      onError: (error: any) => {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error('An error occurred while sending the request');
        }
      },
    }
  );

  const handleRequestRefundOrPayout = (type: 'refund' | 'payout') => {
    requestRefundOrPayoutMutation.mutate({
      id: orderDetails?.id,
      type,
    });
  };

  return (
    <Card
      heading="Payments & Disputes"
      icon={<OrderDetailsIcon />}
      paddingBottom="0"
      cardHeaderPadding="8px 1.0625rem"
    >
      <Stack direction="vertical" gap="0.75rem">
        {STATUS_FIELDS.map(({ label, getStatus }) => (
          <Stack
            key={label}
            direction="horizontal"
            borderBottom="0.66px solid #C2C2C2"
            margin="0 2.1875rem 0 58px"
            padding="0 0 0.25rem"
            justify="space-between"
          >
            <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
              <Text
                fontWeight="regular"
                fontSize="bigText"
                color="static.blues.500"
              >
                {label}
              </Text>
            </Box>
            <Box
              cssProps={{
                display: 'flex',
                alignItems: 'center',
                height: '2.125rem',
                width: '14.125rem',
                paddingLeft: '0.75rem',
              }}
            >
              <Text color="static.blue" fontSize="bigText" fontWeight="bold">
                {getStatus(orderDetails)}
              </Text>
            </Box>
          </Stack>
        ))}

        <Stack
          direction="horizontal"
          margin="2.5rem 2.1875rem 0 3.625rem"
          padding="0 0 0.25rem"
          justify="space-between"
        >
          <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
            <Text
              fontWeight="regular"
              fontSize="bigText"
              color="static.blues.500"
            >
              Actions
            </Text>
          </Box>
          <Box
            cssProps={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <NextLink shallow href="#" passHref>
              <Button
                type="button"
                variant="red_filled"
                fontWeight="bold"
                disabled={!isRefundEnabled}
                onClick={() => handleRequestRefundOrPayout('refund')}
              >
                Request Refund
              </Button>
            </NextLink>
            <NextLink shallow href="#" passHref>
              <Button
                type="button"
                variant="darkFilled"
                fontWeight="bold"
                disabled={!isPayoutEnabled}
                onClick={() => handleRequestRefundOrPayout('payout')}
              >
                Request Payout
              </Button>
            </NextLink>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}
