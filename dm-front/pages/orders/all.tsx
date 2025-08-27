import NextLink from 'next/link';
import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@src/constants/queryKeys';
import { User } from '@src/models/User';
import { WithShellLayout } from '@src/components/Layouts/WithShellLayout';
import { EOrderV3Modules, OrderV3 } from '@src/models/Order';
import { Stack } from '@src/components/Layouts';
import { apiClientV1, apiClientV2, apiGatewayClient } from '@src/api/client';
import { Text } from '@src/components/Text';
import { AllOrdersTable } from '@src/components/Order/AllOrdersTable';
import { BREADCRUMBS } from '@src/constants/breadcrumbs';
import { AllOrderFilters } from '@src/components/Filters/AllOrdersFilters';

function AllOrdersPage() {
  return (
    <>
      <Stack
        direction="horizontal"
        gap="2"
        align="center"
        style={{ marginBottom: 20 }}
      >
        <Text fontSize="baseText" fontWeight="baseText" color="static.grays.10">
          {BREADCRUMBS.HOME}
        </Text>
        <span> / </span>
        <NextLink href="/orders/all" passHref>
          <a>Order Management 2.0</a>
        </NextLink>
        <span> / </span>
        <NextLink href="/orders/all" passHref>
          <a>All Orders</a>
        </NextLink>
      </Stack>

      <AllOrderFilters />

      <AllOrdersTable />
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
    query: { limit = '30', offset = '0', search = '' },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);
  apiGatewayClient.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.allOrders, limit, offset, search],
    () =>
      OrderV3.getOrdersV3({
        submodule: EOrderV3Modules.ALL,
        limit: String(limit),
        offset: String(offset),
        search: String(search),
      })
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

AllOrdersPage.getLayout = WithShellLayout;

export default AllOrdersPage;
