import { useMemo } from 'react';

import { useRouter } from 'next/router';
import styled from 'styled-components';
import css from '@styled-system/css';

import { useOrderDetailV3 } from '@src/components/Order/hooks';
import { Text } from '@src/components/Text';
import { TableLoader } from '@src/components/TableLoader';
import { TableContainer } from '@src/components/Shared/TableComponents';
import { EOrderModules } from '@src/models/Order';
import { BuyerOrderDetails } from '@src/models/OrderDetails';
import { useOrdersTablePayout2_0 } from '@src/components/Shared/hooks';

import { OrderBillingDetails } from './cards/OrderBillingDetails';
import { RefundDetailsCard } from './cards/RefundDetails';
import { WalletTransactionsTable } from '../WalletTransactionsTable';
import { useBuyerOrderDetailsV3 } from '../hooks/useBuyerOrderDetailsV3';
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
  const { width = '342px' } = props;

  return css({
    width: width,
  });
});

export function ProcessBuyerRefund() {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, data: orderDetails } = useOrderDetailV3(id as string);

  const { data } = useBuyerOrderDetailsV3(id as string);

  const buyerOrderDetails = useMemo(
    () => BuyerOrderDetails.mapOrderDetails(data || {}),
    [data]
  );

  const { orders: payouts } = useOrdersTablePayout2_0({
    submodule: EOrderModules.NEW_REFUND,
    search: router.query.search as string,
  });

  const getMatchedOrder = useMemo(() => {
    if (payouts) {
      return payouts.find((payout) => payout.id === orderDetails?.orderId);
    }
  }, [orderDetails?.orderId, payouts]);

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
        <CardItem width="100.875rem">
          <RefundDetailsCard
            orderDetails={orderDetails}
            buyerOrderDetails={buyerOrderDetails}
            getMatchedOrder={getMatchedOrder}
          />
        </CardItem>

        <CardItem width="100.875rem">
          <OrderBillingDetails buyerOrderDetails={buyerOrderDetails} />
        </CardItem>
      </CardsGrid>
      <PaymentHistoryTableV2
        orderId={orderDetails?.orderId}
        orderNumber={orderDetails?.orderData?.orderNumber as string}
      />
      <WalletTransactionsTable orderId={orderDetails?.orderId} />
    </>
  );
}
