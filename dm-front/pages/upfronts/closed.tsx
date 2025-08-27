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
  closed: {
    title: BREADCRUMBS.CLOSED_UPFRONT,
  },
};

function ClosedUpfrontPage() {
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
        subModule={ConsignmentStatus.CLOSED}
        keyQuary={QUERY_KEYS.closeUpfront}
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

  // Prefetch both closed-fulfilled and closed-unfulfilled data
  await queryClient.prefetchQuery(
    [
      QUERY_KEYS.closeUpfront,
      [QUERY_KEYS.closeFulfilledUpfront, QUERY_KEYS.closeUnfulfilledUpfront],
      limit,
      offset,
      search,
    ],
    async () => {
      const closedFulfilledData = await Upfronts.getUpfrontsList({
        submodule: ConsignmentStatus.CLOSED_FULFILLED,
        limit: String(limit),
        offset: String(offset),
        search: String(search),
      });

      const closedUnfulfilledData = await Upfronts.getUpfrontsList({
        submodule: ConsignmentStatus.CLOSED_UNFULFILLED,
        limit: String(limit),
        offset: String(offset),
        search: String(search),
      });

      return {
        items: [
          ...(closedFulfilledData?.items || []),
          ...(closedUnfulfilledData?.items || []),
        ],
        total:
          (closedFulfilledData?.total || 0) +
          (closedUnfulfilledData?.total || 0),
        limit: parseInt(String(limit)),
      };
    }
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

ClosedUpfrontPage.getLayout = WithShellLayout;

export default ClosedUpfrontPage;
