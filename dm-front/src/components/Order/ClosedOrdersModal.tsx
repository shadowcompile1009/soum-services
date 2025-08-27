import { useMemo } from 'react';

import { Box } from '@/components/Box';
import { Stack } from '@/components/Layouts';
import { Loader } from '@/components/Loader';
import { CommonModal, FullBleedContainer } from '@/components/Modal';
import { useOrdersTable } from '@/components/Shared/hooks/useOrdersTable';
import { Text } from '@/components/Text';
import { EOrderModules } from '@/models/Order';

import { PaymentHistoryTable } from '@/components/Payout/PaymentHistoryTable';

interface ClosedOrdersModalProps {
  isOpen: boolean;
  orderId: string;
  onClose: () => void;
}
export function ClosedOrdersModal(props: ClosedOrdersModalProps) {
  const { isOpen, orderId, onClose } = props;

  const { orders: payouts, isLoading } = useOrdersTable({
    submodule: EOrderModules.CLOSED,
  });

  const getMatchedOrder = useMemo(() => {
    if (payouts) {
      return payouts.find((payout) => payout.id === orderId);
    }
  }, [orderId, payouts]);

  if (isLoading) {
    return (
      <CommonModal onClose={onClose} isOpen={isOpen}>
        <Box
          cssProps={{
            width: 580,
            height: 480,
            margin: -10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader size="48px" border="static.blue" marginRight="0" />
        </Box>
      </CommonModal>
    );
  }

  return (
    <CommonModal onClose={onClose} isOpen={isOpen}>
      <Stack direction="vertical" gap="15">
        {/* Heading - Start */}
        <FullBleedContainer>
          <Text color="static.black" fontSize="bigText" fontWeight="semibold">
            Payment History - Order:{' '}
            <Text
              as="span"
              fontSize="bigText"
              fontWeight="regular"
              color="static.blues.400"
            >
              {getMatchedOrder?.orderNumber}
            </Text>
          </Text>
        </FullBleedContainer>
        {/* Heading - End */}
        {/* Payment History - Start */}
        <PaymentHistoryTable
          orderId={orderId}
          orderNumber={getMatchedOrder?.orderNumber as string}
        />
        {/* Payment History - End */}
      </Stack>
    </CommonModal>
  );
}
