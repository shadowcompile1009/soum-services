import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { Stack } from '@/components/Layouts';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SearchFilter } from '@/components/Shared/SearchFilter';
import { V2FilterStatusSelect } from '@/components/Order';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { User } from '@/models/User';
import { OrderV2 } from '@/models/Order';
import { StatusGroup } from '@/models/StatusGroup';
import { apiClientV1, apiClientV2 } from '@/api/client';
import { LogisticVendor } from '@/models/LogisticVendor';
import { BacklogOrdersTable } from '@/components/Order/BacklogOrdersTable';

const breadcrumbRoutes = {
  orders: {
    title: BREADCRUMBS.ORDERSV2,
  },
  backlog: {
    title: BREADCRUMBS.BACKLOG,
  },
};

function BacklogOrdersPage() {
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
        <V2FilterStatusSelect submodule="Backlog" />
      </Stack>
      <BacklogOrdersTable />
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
    query: { limit = '30', offset = '0', search = '', statusId = '' },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.backlog, limit, offset, search, statusId],
    () =>
      OrderV2.getOrdersV2({
        limit: String(limit),
        offset: String(offset),
        search: String(search),
        submodule: 'backlog',
        statusId: String(statusId),
      })
  );

  await queryClient.prefetchQuery([QUERY_KEYS.statusGroup, 'Backlog'], () =>
    StatusGroup.getStatusGroup({ group: 'Backlog' })
  );

  await queryClient.prefetchQuery([QUERY_KEYS.logisticVendors], () =>
    LogisticVendor.getLogisticVendors()
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

BacklogOrdersPage.getLayout = WithShellLayout;

export default BacklogOrdersPage;
