import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { User } from '@/models/User';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { ActiveOrdersTable } from '@/components/Order';
import { Order } from '@/models/Order';
import { Stack } from '@/components/Layouts';
import { apiClientV1, apiClientV2 } from '@/api/client';

const breadcrumbRoutes = {
  orders: {
    title: BREADCRUMBS.ORDERS,
  },
  active: {
    title: BREADCRUMBS.ACTIVE_ORDERS,
  },
};
function ActiveOrdersPage() {
  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      <ActiveOrdersTable />
    </>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const result = await User.checkIfNotLoggedIn(ctx, {
    destination: '/',
    permanent: false,
  });

  if (result?.redirect) {
    return {
      redirect: result?.redirect,
    };
  }

  const {
    query: { limit = '10', offset = '0', search = '', statuses = '' },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.activeOrders, limit, offset, search, statuses],
    () =>
      Order.getActiveOrders({
        limit: String(limit),
        offset: String(offset),
        search: String(search),
        statuses: String(statuses),
      })
  );

  await queryClient.prefetchQuery([QUERY_KEYS.orderStatuses], () =>
    Order.getOrderStatuses()
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

ActiveOrdersPage.getLayout = WithShellLayout;

export default ActiveOrdersPage;
