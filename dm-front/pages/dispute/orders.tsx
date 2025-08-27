import NextLink from 'next/link';
import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { WithShellLayout } from '@src/components/Layouts/WithShellLayout';
import { Stack } from '@src/components/Layouts';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { User } from '@src/models/User';
import { apiClientV1, apiClientV2 } from '@src/api/client';
import { DisputeOrdersTable } from '@src/components/Order/DisputeOrdersTable';
import { DisputeFilters } from '@src/components/Filters/DisputeFilters';
import { OrderV3, EOrderV3Modules } from '@src/models/Order';

function DisputeOrdersPage() {
  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Stack direction="horizontal" gap="2" align="center">
          <NextLink href="/dispute/orders" passHref>
            <a>Disputes</a>
          </NextLink>
        </Stack>
      </Stack>
      <DisputeFilters />
      <DisputeOrdersTable />
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
      OrderV3.getOrdersV3({
        submodule: EOrderV3Modules.DISPUTE,
        limit: String(limit),
        offset: String(offset),
        search: String(search),
        statusId: String(statusId),
      })
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

DisputeOrdersPage.getLayout = WithShellLayout;

export default DisputeOrdersPage;
