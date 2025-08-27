import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { Breadcrumb } from '@src/components/Breadcrumb';
import { User } from '@src/models/User';
import { Order } from '@src/models/Order';
import { WithShellLayout } from '@src/components/Layouts/WithShellLayout';
import { apiClientV1, apiClientV2 } from '@src/api/client';
import { apiGatewayClient } from '@src/api/client';
import { Stack } from '@src/components/Layouts';
import { ActivityLog } from '@src/models/ActivityLog';
import { ProcessDispute } from '@src/components/Dispute';

import { BREADCRUMBS } from '../../src/constants/breadcrumbs';
import { QUERY_KEYS } from '../../src/constants/queryKeys';

const breadcrumbRoutes = {
  orders: {
    title: BREADCRUMBS.ORDERS,
  },
  details: {
    title: BREADCRUMBS.ORDER_PAGE,
  },
};
function OrderDetailsPage() {
  return (
    <>
      <Stack direction="vertical" gap="5" flex="1">
        <Breadcrumb routes={breadcrumbRoutes} />
        <ProcessDispute />
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
