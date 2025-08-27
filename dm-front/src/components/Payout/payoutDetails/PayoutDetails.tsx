import { useMemo } from 'react';

import { useRouter } from 'next/router';
import styled from 'styled-components';
import css from '@styled-system/css';

import { useOrderDetailV3 } from '@src/components/Order/hooks';
import { Text } from '@src/components/Text';
import { TableLoader } from '@src/components/TableLoader';
import { TableContainer } from '@src/components/Shared/TableComponents';
import { EOrderModules } from '@src/models/Order';
import { Order } from '@src/models/Order';
import { SellerOrderDetails } from '@src/models/OrderDetails';
import { useOrdersTablePayout2_0 } from '@src/components/Shared/hooks';

import { ProcessPayout } from './cards/ProcessPayout';
import { PaymentBreakdown } from './cards/PaymentBreakdown';
import { PayoutDetailsCard } from './cards/PayoutDetailsCard';
import { useSellerOrderDetailsV3 } from '../hooks/useSellerOrderDetailsV3';
import { PaymentHistoryTableV2 } from '../PaymentHistoryTableV2';

import { ButtonProps } from './types';

const CardsGrid = styled('div')(() => {
  return css({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.875rem',
  });
});

const CardItem = styled('div')<ButtonProps>((props) => {
  const { width = '21.375rem' } = props;

  return css({
    width: width,
  });
});

export function PayoutDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, data: orderDetails } = useOrderDetailV3(id as string);
  const { data: sellerOrderDetailsData } = useSellerOrderDetailsV3(
    id as string
  );

  const { orders: payouts } = useOrdersTablePayout2_0({
    submodule: EOrderModules.NEW_PAYOUT,
  });

  const getMatchedOrder: Order | undefined = useMemo(() => {
    if (payouts) {
      return payouts.find((payout) => payout.id === id);
    }

    return undefined;
  }, [id, payouts]);

  const isWalletCreditRelease = getMatchedOrder?.payoutType === 'Wallet Credit';

  const orderSellerDetails = useMemo(
    () => SellerOrderDetails.mapOrderDetails(sellerOrderDetailsData || {}),
    [sellerOrderDetailsData]
  );

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  return (
    <>
      <Text
        fontWeight="bigSubtitle"
        fontSize="headingThree"
        color="static.black"
      >
        {orderDetails?.orderData?.orderNumber}
      </Text>
      <CardsGrid>
        <CardItem width="50rem">
          <ProcessPayout
            orderDetails={orderDetails}
            orderSellerDetails={orderSellerDetails}
            getMatchedOrder={getMatchedOrder}
            isWalletCreditRelease={isWalletCreditRelease}
          />
        </CardItem>

        <CardItem width="50rem">
          <PaymentBreakdown orderSellerDetails={orderSellerDetails} />
        </CardItem>

        <CardItem width="100.875rem">
          <PayoutDetailsCard
            orderDetails={orderDetails}
            orderSellerDetails={orderSellerDetails}
            getMatchedOrder={getMatchedOrder}
          />
        </CardItem>
      </CardsGrid>
      {!isWalletCreditRelease && (
        <PaymentHistoryTableV2
          orderId={id as string}
          orderNumber={getMatchedOrder?.orderNumber as string}
        />
      )}
    </>
  );
}
