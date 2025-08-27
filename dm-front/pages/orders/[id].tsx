import NextLink from 'next/link';
import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@src/constants/queryKeys';
import { User } from '@src/models/User';
import { Order } from '@src/models/Order';
import { WithShellLayout } from '@src/components/Layouts/WithShellLayout';
import { OrderDetails } from '@src/components/Order';
import { apiClientV1, apiClientV2 } from '@src/api/client';
import { apiGatewayClient } from '@src/api/client';
import { Stack } from '@src/components/Layouts';
import { ActivityLog } from '@src/models/ActivityLog';
import { OrderActivityLogTable } from '@src/components/Order/OrderActivityLogTable';
import { BREADCRUMBS } from '@src/constants/breadcrumbs';
import { Text } from '@src/components/Text';

function OrderDetailsPage() {
  return (
    <>
      <Stack direction="vertical" gap="5" flex="1">
        {/* Breadcrumb */}
        <Stack direction="horizontal" gap="2" align="center">
          <Text
            fontSize="baseText"
            fontWeight="baseText"
            color="static.grays.10"
          >
            {BREADCRUMBS.HOME}
          </Text>
          <span> / </span>
          <NextLink href="/orders/all" passHref>
            <a>Order Management 2.0</a>
          </NextLink>
        </Stack>

        <OrderDetails />

        <OrderActivityLogTable />
      </Stack>
    </>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const result = await User.checkIfNotLoggedIn(ctx, {
    destination: '/',
    permanent: false,
  });

  const {
    query: { id, limit = '50', offset = '0' },
  } = ctx;

  if (result?.redirect) {
    return {
      redirect: result?.redirect,
    };
  }

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);
  apiGatewayClient.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([QUERY_KEYS.orderDetail, id], () =>
    Order.getOrderDetail(id as string)
  );

  await queryClient.prefetchQuery([QUERY_KEYS.NCTReasons], () =>
    Order.getNCTReasons()
  );

  await queryClient.prefetchQuery([QUERY_KEYS.orderPenalties], () =>
    Order.getPenalties()
  );

  await queryClient.prefetchQuery(
    [QUERY_KEYS.orderActivityLog, id, limit, offset],
    () =>
      ActivityLog.getOrderActivityLogList({
        orderId: String(id),
        limit: String(limit),
        offset: String(offset),
      })
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

OrderDetailsPage.getLayout = WithShellLayout;

export default OrderDetailsPage;
