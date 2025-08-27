import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiClientV1, apiClientV2 } from '@/api/client';
import { User } from '@/models/User';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { ProductListing } from '@/models/ProductListing';
import { ProductQuestion } from '@/models/ProductQuestion';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Stack } from '@/components/Layouts';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ListingDetails } from '@/components/ListingDetails';

const breadcrumbRoutes = {
  listing: {
    title: BREADCRUMBS.LISTING,
  },
  '[listingId]': {
    title: '',
  },
};
function ListingDetailsPage() {
  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      <ListingDetails />
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
    query: { listingId },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  const listingIdString = String(listingId);

  const listingDetailQueryKey = [QUERY_KEYS.listingDetail, listingIdString];

  await queryClient.prefetchQuery(listingDetailQueryKey, () =>
    ProductListing.getListingDetailsById(listingIdString)
  );

  await queryClient.prefetchQuery(
    [QUERY_KEYS.listingResponses, listingIdString],
    () => ProductQuestion.getResponsesByListingId(listingIdString)
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

ListingDetailsPage.getLayout = WithShellLayout;

export default ListingDetailsPage;
