import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { User } from '@/models/User';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { Stack } from '@/components/Layouts';
import { apiGatewayClient } from '@/api/client';
import { SearchFilter } from '@/components/Shared/SearchFilter';
import { ConsignmentStatus, Upfronts } from '@/models/Upfronts';
import { UpfrontTableContainer } from '@/components/Upfronts';

const breadcrumbRoutes = {
  upfronts: {
    title: BREADCRUMBS.UPFRONT_PAYMENTS,
  },
  rejected: {
    title: BREADCRUMBS.REJECTED_UPFRONT,
  },
};

function RejectedUpfrontPage() {
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
      <UpfrontTableContainer
        subModule={ConsignmentStatus.REJECTED}
        keyQuary={QUERY_KEYS.rejectedUpfront}
      />
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

  apiGatewayClient.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.rejectedUpfront, limit, offset, search],
    () =>
      Upfronts.getUpfrontsList({
        submodule: ConsignmentStatus.REJECTED,
        limit: String(limit),
        offset: String(offset),
        search: String(search),
      })
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

RejectedUpfrontPage.getLayout = WithShellLayout;

export default RejectedUpfrontPage;
