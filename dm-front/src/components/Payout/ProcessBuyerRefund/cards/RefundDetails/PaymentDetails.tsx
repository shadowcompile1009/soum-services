import { Control, UseFormWatch } from 'react-hook-form';

import { Stack } from '@src/components/Layouts';
import { Box } from '@src/components/Box';
import { Text } from '@src/components/Text';
import { PayoutDetailsIcon } from '@src/components/Shared/PayoutDetailsIcon';
import { IBuyerOrderDetails } from '@src/models/OrderDetails';

import { SelectRefundPaymentMethod } from './SelectRefundPaymentMethod';

import { RefundFormValues } from './types';

export const PaymentDetails = ({
  buyerOrderDetails,
  control,
  orderDetails,
  watch,
}: {
  buyerOrderDetails: IBuyerOrderDetails;
  control: Control<RefundFormValues>;
  orderDetails: any;
  watch: UseFormWatch<RefundFormValues>;
}) => {
  const refundPaymentMethod = watch('refundPaymentMethod');

  return (
    <Stack direction="vertical" align="left" gap="0.5rem">
      <Stack direction="horizontal" align="center" gap="6">
        <PayoutDetailsIcon />
        <Text fontSize="1.5rem" fontWeight="semibold" color="static.black">
          Payment Details
        </Text>
      </Stack>
      <Box
        cssProps={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          alignItems: 'center',
          gap: '1.25rem',
          marginLeft: '2.6875rem',
        }}
      >
        <Stack direction="vertical" padding="0 0 0.25rem">
          <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
            <Text fontWeight="bold" fontSize="baseText" color="static.black">
              Buyer Payment Method
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
              width: '16.125rem',
              paddingLeft: '0.75rem',
            }}
          >
            {buyerOrderDetails?.paymentMethod}
          </Box>
        </Stack>
        <Stack direction="vertical" padding="0 0 0.25rem">
          <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
            <Text fontWeight="bold" fontSize="baseText" color="static.black">
              {buyerOrderDetails?.isBNPL
                ? 'Credit Amount'
                : refundPaymentMethod?.label === 'refundToWallet'
                ? 'Wallet Status'
                : 'IBAN'}
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
              width: '17.125rem',
              paddingLeft: '0.75rem',
            }}
          >
            {buyerOrderDetails?.isBNPL
              ? ''
              : refundPaymentMethod?.label === 'refundToWallet'
              ? buyerOrderDetails?.walletStatus
              : buyerOrderDetails?.iban}
          </Box>
        </Stack>

        {buyerOrderDetails?.isBNPL ? (
          <Stack direction="vertical" padding="0 0 0.25rem">
            <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
              <Text fontWeight="bold" fontSize="baseText" color="static.black">
                Refund Payment Method
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
                width: '16.125rem',
                paddingLeft: '0.75rem',
              }}
            >
              {buyerOrderDetails?.paymentMethod}
            </Box>
          </Stack>
        ) : (
          <Stack
            direction="horizontal"
            padding="0 0 0.25rem"
            justify="space-between"
          >
            <Stack direction="vertical" padding="0 0 0.25rem" gap="6.7504px">
              <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
                <Text
                  fontWeight="bold"
                  fontSize="baseText"
                  color="static.black"
                >
                  Refund Payment Method
                </Text>
              </Box>
              <SelectRefundPaymentMethod
                orderDetails={orderDetails}
                control={control}
                buyerOrderDetails={buyerOrderDetails}
              />
            </Stack>
          </Stack>
        )}
        <Stack direction="vertical" padding="0 0 0.25rem">
          <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
            <Text fontWeight="bold" fontSize="baseText" color="static.black">
              {buyerOrderDetails?.isBNPL
                ? 'Credit Status'
                : refundPaymentMethod?.label === 'refundToWallet'
                ? 'Wallet Balance'
                : 'Beneficiary Name'}
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
              width: '17.125rem',
              paddingLeft: '0.75rem',
            }}
          >
            {buyerOrderDetails?.isBNPL
              ? ''
              : refundPaymentMethod?.label === 'refundToWallet'
              ? buyerOrderDetails?.walletBalance
              : buyerOrderDetails?.accountName}
          </Box>
        </Stack>
        <Stack direction="vertical" padding="0 0 0.25rem">
          <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
            <Text fontWeight="bold" fontSize="baseText" color="static.black">
              {buyerOrderDetails?.isBNPL
                ? 'Captured Status'
                : refundPaymentMethod?.label === 'refundToWallet'
                ? 'Wallet ID'
                : 'Bank Name'}
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
              width: '16.125rem',
              paddingLeft: '0.75rem',
            }}
          >
            {buyerOrderDetails?.isBNPL
              ? buyerOrderDetails?.captureStatus
              : refundPaymentMethod?.label === 'refundToWallet'
              ? buyerOrderDetails?.walletId
              : buyerOrderDetails?.bankName}
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};
