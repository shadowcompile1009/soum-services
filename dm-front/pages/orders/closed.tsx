import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { User } from '@/models/User';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { ClosedOrdersTable } from '@/components/Order';
import { EOrderModules, Order } from '@/models/Order';
import { Stack } from '@/components/Layouts';
import { apiClientV1, apiClientV2 } from '@/api/client';
import { ClosedOrdersModal } from '@/components/Order/ClosedOrdersModal';
import { SearchFilter } from '@/components/Shared/SearchFilter';

const breadcrumbRoutes = {
  orders: {
    title: BREADCRUMBS.ORDERS,
  },
  closed: {
    title: BREADCRUMBS.CLOSED_ORDERS,
  },
};
function ClosedOrdersPage() {
  const router = useRouter();
  const { query } = router;
  const { modalName, orderId } = query;

  function handleModalClose() {
    const newQuery = {
      ...query,
    };
    delete newQuery?.modalName;
    delete newQuery?.orderId;
    router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  }

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
      <ClosedOrdersTable />
      {modalName === 'closedOrders' && (
        <ClosedOrdersModal
          orderId={orderId as unknown as string}
          onClose={handleModalClose}
          isOpen={modalName === 'closedOrders'}
        />
      )}
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
    [QUERY_KEYS.closedOrders, limit, offset, search],
    () =>
      Order.getOrders({
        submodule: EOrderModules.CLOSED,
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

ClosedOrdersPage.getLayout = WithShellLayout;

export default ClosedOrdersPage;
