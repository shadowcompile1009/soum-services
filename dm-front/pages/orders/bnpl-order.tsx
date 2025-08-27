import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { Breadcrumb } from '@/components/Breadcrumb';
import { User } from '@/models/User';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { BnplOrderTable } from '@/components/Order/BnplOrderTable';
import { EOrderModules, Order } from '@/models/Order';
import { Stack } from '@/components/Layouts';
import { apiClientV1, apiClientV2 } from '@/api/client';

const breadcrumbRoutes = {
  orders: {
    title: BREADCRUMBS.ORDERS,
  },
  'bnpl-order': {
    title: BREADCRUMBS.BNPL_ORDERS,
  },
};
function BNPLOrdersPage() {
  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      <BnplOrderTable />
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
    query: { limit = '10', offset = '0', search = '' },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.bnplOrders, limit, offset, search],
    () =>
      Order.getOrders({
        submodule: EOrderModules.BNPL,
        limit: String(limit),
        offset: String(limit),
        search: String(limit),
      })
  );

  await queryClient.prefetchQuery([QUERY_KEYS.orderStatuses], () =>
    Order.getOrderStatuses()
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

BNPLOrdersPage.getLayout = WithShellLayout;

export default BNPLOrdersPage;
