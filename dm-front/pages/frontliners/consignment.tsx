import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiClientV1, apiClientV2 } from '@/api/client';
import { User } from '@/models/User';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Stack } from '@/components/Layouts';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { FlaggedListing } from '@/models/FlaggedListings';
import { ConsignmentListingTable } from '@/components/Frontliners';

const breadcrumbRoutes = {
  frontliners: {
    title: BREADCRUMBS.FLAGGED_LISTINGS,
  },
  consignment: {
    title: BREADCRUMBS.CONSIGNMENT,
  },
};

function FrontlinerOnHoldPage() {
  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      <ConsignmentListingTable />
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
    query: { page = '1' },
  } = ctx;

  const size = '50';

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.flaggedListingRecent, String(page), String(size)],
    () =>
      FlaggedListing.getFlaggedListingByType(
        'consignment',
        Number(page),
        Number(size)
      )
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

FrontlinerOnHoldPage.getLayout = WithShellLayout;

export default FrontlinerOnHoldPage;
