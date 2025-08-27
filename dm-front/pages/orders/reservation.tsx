import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { SearchFilter } from '@/components/Shared/SearchFilter';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { User } from '@/models/User';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { ReservationOrdersTable } from '@/components/Order';
import { EOrderModules, Order } from '@/models/Order';
import { Stack } from '@/components/Layouts';
import { apiClientV1, apiClientV2 } from '@/api/client';

const breadcrumbRoutes = {
  orders: {
    title: BREADCRUMBS.ORDERS,
  },
  reservation: {
    title: BREADCRUMBS.RESERVATION_ORDERS,
  },
};
function ReservationOrdersPage() {
  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      <SearchFilter />
      <ReservationOrdersTable />
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
    query: { limit = '5', offset = '0', search = '' },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.reservationOrders, limit, offset, search],
    () =>
      Order.getOrders({
        submodule: EOrderModules.RESERVATION,
        limit: String(limit),
        offset: String(limit),
        search: String(limit),
      })
  );

  await queryClient.prefetchQuery([QUERY_KEYS.orderStatuses], () =>
    Order.getOrderStatuses()
  );

  console.log({ dehydratedState: dehydrate(queryClient) });
  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

ReservationOrdersPage.getLayout = WithShellLayout;

export default ReservationOrdersPage;
