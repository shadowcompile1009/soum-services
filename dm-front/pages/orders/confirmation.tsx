import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { Stack } from '@/components/Layouts';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SearchFilter } from '@/components/Shared/SearchFilter';
import {
  V2FilterStatusSelect,
  ConfirmOrdersTable,
} from '@/components/Order';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { User } from '@/models/User';
import { OrderV2 } from '@/models/Order';
import { StatusGroup } from '@/models/StatusGroup';
import { apiClientV1, apiClientV2 } from '@/api/client';
import { LogisticVendor } from '@/models/LogisticVendor';

const breadcrumbRoutes = {
  orders: {
    title: BREADCRUMBS.ORDERSV2,
  },
  confirmation: {
    title: BREADCRUMBS.CONFIRMED_ORDERS,
  },
};

function ConfirmedOrdersPage() {
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
        <V2FilterStatusSelect submodule="Confirmation" />
      </Stack>
      <ConfirmOrdersTable />
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
    [QUERY_KEYS.confirmation, limit, offset, search, statusId],
    () =>
      OrderV2.getOrdersV2({
        limit: String(limit),
        offset: String(offset),
        search: String(search),
        submodule: 'confirmation',
        statusId: String(statusId),
      })
  );

  await queryClient.prefetchQuery(
    [QUERY_KEYS.statusGroup, 'Confirmation'],
    () => StatusGroup.getStatusGroup({ group: 'Confirmation' })
  );

  await queryClient.prefetchQuery([QUERY_KEYS.logisticVendors], () =>
    LogisticVendor.getLogisticVendors()
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

ConfirmedOrdersPage.getLayout = WithShellLayout;

export default ConfirmedOrdersPage;
