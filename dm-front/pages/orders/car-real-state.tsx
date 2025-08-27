import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { Stack } from '@/components/Layouts';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SearchFilter } from '@/components/Shared/SearchFilter';
import { CarRealStateTable } from '@/components/Order';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { User } from '@/models/User';
import { EOrderModules, FinanceOrder, Order } from '@/models/Order';
import { apiClientV1, apiClientV2 } from '@/api/client';
import { LogisticVendor } from '@/models/LogisticVendor';
import { StatusGroup } from '@/models/StatusGroup';

const breadcrumbRoutes = {
  orders: {
    title: BREADCRUMBS.ORDERSV2,
  },
  'car-real-state': {
    title: BREADCRUMBS.CAR_REAL_STATE,
  },
};

function CarRealStatePage() {
  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      <Stack direction="horizontal" gap="5" align="center">
        <SearchFilter />
      </Stack>
      <CarRealStateTable />
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
    query: { limit = '10', offset = '0', search = '', statusId = '' },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.listingCarRealState, limit, offset, search, statusId],
    () =>
      FinanceOrder.getFinanceOrders({
        limit: String(limit),
        offset: String(offset),
        search: String(search),
        submodule: EOrderModules.FINANCE,
        statusId: String(statusId),
      }),
  );

  await queryClient.prefetchQuery([QUERY_KEYS.orderStatuses], () =>
    Order.getOrderStatuses(),
  );

  await queryClient.prefetchQuery(
    [QUERY_KEYS.statusGroup, 'reservation'],
    () => StatusGroup.getStatusGroup({ group: 'reservation' })
  );

  await queryClient.prefetchQuery(
    [QUERY_KEYS.statusGroup, 'financing'],
    () => StatusGroup.getStatusGroup({ group: 'financing' })
  );

  await queryClient.prefetchQuery([QUERY_KEYS.logisticVendors], () =>
    LogisticVendor.getLogisticVendors(),
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

CarRealStatePage.getLayout = WithShellLayout;

export default CarRealStatePage;
