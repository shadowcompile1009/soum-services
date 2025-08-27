import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { apiClientV1, apiClientV2 } from '@/api/client';
import { User } from '@/models/User';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { ProductQuestion } from '@/models/ProductQuestion';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Stack } from '@/components/Layouts';
import SpecificationReport from '@/components/Frontliners/SpecificationReport';
import { useRouter } from 'next/router';
import RealEstateReport from '@/components/Frontliners/RealEstateReport';

const breadcrumbRoutes = {
  frontliners: {
    title: BREADCRUMBS.FLAGGED_LISTINGS,
  },
  discount: {
    title: BREADCRUMBS.DISCOUNT,
  },
};

function SpecificationPage() {
  const router = useRouter();
  const { query } = router;
  const { listingId, categoryName } = query;

  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      {categoryName === 'Cars' ? (
        <SpecificationReport
          listingId={listingId}
          categoryName={categoryName}
        />
      ) : (
        <RealEstateReport listingId={listingId} />
      )}
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

  await queryClient.prefetchQuery(
    [QUERY_KEYS.listingResponses, listingIdString],
    () => ProductQuestion.getResponsesByListingId(listingIdString)
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

SpecificationPage.getLayout = WithShellLayout;

export default SpecificationPage;
