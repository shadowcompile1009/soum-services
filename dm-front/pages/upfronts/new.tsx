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
  new: {
    title: BREADCRUMBS.NEW_UPFRONT,
  },
};

function NewUpfrontPage() {
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
        subModule={ConsignmentStatus.NEW}
        keyQuary={QUERY_KEYS.newUpfront}
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
    [QUERY_KEYS.newUpfront, limit, offset, search],
    () =>
      Upfronts.getUpfrontsList({
        submodule: ConsignmentStatus.NEW,
        limit: String(limit),
        offset: String(offset),
        search: String(search),
      })
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

NewUpfrontPage.getLayout = WithShellLayout;

export default NewUpfrontPage;
