import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { WithShellLayout } from '@src/components/Layouts/WithShellLayout';
import { Stack } from '@src/components/Layouts';
import { BREADCRUMBS } from '@src/constants/breadcrumbs';
import { Breadcrumb } from '@src/components/Breadcrumb';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { User } from '@src/models/User';
import { EOrderModules, Order } from '@src/models/Order';
import { StatusGroup } from '@src/models/StatusGroup';
import { apiClientV1, apiClientV2 } from '@src/api/client';
import { LogisticVendor } from '@src/models/LogisticVendor';
import { ReplacementOrdersTable } from '@src/components/Order/ReplacementOrders/ReplacementOrdersTable';
import { ReplacementOrdersFilter } from '@src/components/Filters/Filters/ReplacementOrdersFilter';
import { SearchFilter } from '@src/components/Shared/SearchFilter';

const breadcrumbRoutes = {
  orders: {
    title: BREADCRUMBS.ORDERS,
  },
  replacement: {
    title: BREADCRUMBS.REPLACEMENT,
  },
};

function ReplacementOrdersPage() {
  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      <Stack direction="horizontal" gap="5" align="start">
        <SearchFilter />
        <ReplacementOrdersFilter />
      </Stack>
      <ReplacementOrdersTable />
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
    query: { limit = '30', offset = '0', search = '', replacementStatus = '' },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.dispute, limit, offset, search, replacementStatus],
    () =>
      Order.getOrders({
        limit: String(limit),
        offset: String(offset),
        search: String(search),
        submodule: EOrderModules.REPLACEMENT,
        replacementStatus: String(replacementStatus),
      })
  );

  await queryClient.prefetchQuery([QUERY_KEYS.statusGroup, 'Dispute'], () =>
    StatusGroup.getStatusGroup({ group: 'Dispute' })
  );

  await queryClient.prefetchQuery([QUERY_KEYS.logisticVendors], () =>
    LogisticVendor.getLogisticVendors()
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

ReplacementOrdersPage.getLayout = WithShellLayout;

export default ReplacementOrdersPage;
