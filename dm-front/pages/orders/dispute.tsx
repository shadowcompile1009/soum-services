import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { WithShellLayout } from '@src/components/Layouts/WithShellLayout';
import { Stack } from '@src/components/Layouts';
import { BREADCRUMBS } from '@src/constants/breadcrumbs';
import { Breadcrumb } from '@src/components/Breadcrumb';
import { SearchFilter } from '@src/components/Shared/SearchFilter';
import { V2FilterStatusSelect } from '@src/components/Order';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { User } from '@src/models/User';
import { OrderV2 } from '@src/models/Order';
import { StatusGroup } from '@src/models/StatusGroup';
import { apiClientV1, apiClientV2 } from '@src/api/client';
import { LogisticVendor } from '@src/models/LogisticVendor';
import { DisputeTable } from '@src/components/Order/DisputeTable';

const breadcrumbRoutes = {
  orders: {
    title: BREADCRUMBS.ORDERSV2,
  },
  dispute: {
    title: BREADCRUMBS.DISPUTE,
  },
};

function ShippingOrdersPage() {
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
        <V2FilterStatusSelect submodule="Dispute" />
      </Stack>
      <DisputeTable />
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
    [QUERY_KEYS.dispute, limit, offset, search, statusId],
    () =>
      OrderV2.getOrdersV2({
        limit: String(limit),
        offset: String(offset),
        search: String(search),
        submodule: 'dispute',
        statusId: String(statusId),
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

ShippingOrdersPage.getLayout = WithShellLayout;

export default ShippingOrdersPage;
