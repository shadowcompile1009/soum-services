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
import { useRouter } from 'next/router';
import { PayoutToSellerModal } from '@/components/Upfronts/PayoutToSellerModal';

const breadcrumbRoutes = {
  upfronts: {
    title: BREADCRUMBS.UPFRONT_PAYMENTS,
  },
  payoutToSeller: {
    title: BREADCRUMBS.PAYOUT_TO_SELLER_UPFRONT,
  },
};

function PayoutToSellerUpfrontPage() {
  const router = useRouter();
  const { query } = router;
  const { modalName, orderId } = query;

  async function handleModalClose() {
    const newQuery = { ...query };
    delete newQuery.modalName;
    delete newQuery.orderId;
    delete newQuery.sellerId;
    await router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  }

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
        subModule={ConsignmentStatus.PAYOUT_TO_SELLER}
        keyQuary={QUERY_KEYS.payoutToSellerUpfront}
        isPayoutToSellerPage={true}
      />
      {modalName === 'payoutToSeller' && (
        <PayoutToSellerModal
          orderId={orderId as unknown as string}
          onClose={handleModalClose}
          isOpen={modalName === 'payoutToSeller'}
        />
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
    query: { limit = '10', offset = '0', search = '' },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiGatewayClient.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.payoutToSellerUpfront, limit, offset, search],
    () =>
      Upfronts.getUpfrontsList({
        submodule: ConsignmentStatus.PAYOUT_TO_SELLER,
        limit: String(limit),
        offset: String(offset),
        search: String(search),
      })
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

PayoutToSellerUpfrontPage.getLayout = WithShellLayout;

export default PayoutToSellerUpfrontPage;
