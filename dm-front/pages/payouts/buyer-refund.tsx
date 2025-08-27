import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { BuyerRefundTable } from '@/components/Payout';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { EOrderModules, Order } from '@/models/Order';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { User } from '@/models/User';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { BuyerRefundModal } from '@/components/Payout';
import { apiClientV1, apiClientV2 } from '@/api/client';
import { SearchFilter } from '@/components/Shared/SearchFilter';
import { Box } from '@/components/Box';

const breadcrumbRoutes = {
  payouts: {
    title: BREADCRUMBS.PAYOUTS,
  },
  'buyer-refund': {
    title: BREADCRUMBS.BUYER_REFUND,
  },
};
function BuyerRefundPage() {
  const router = useRouter();
  const { query } = router;
  const { modalName, orderId, sellerId } = query;

  function handleModalClose() {
    const newQuery = {
      ...query,
    };
    delete newQuery?.modalName;
    delete newQuery?.orderId;
    delete newQuery?.sellerId;
    router.replace(
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
      <Box marginBottom={20}>
        <Breadcrumb routes={breadcrumbRoutes} />
      </Box>
      <SearchFilter />
      <BuyerRefundTable />
      {modalName === 'buyerRefund' && (
        <BuyerRefundModal
          orderId={orderId as unknown as string}
          sellerId={sellerId as unknown as string}
          onClose={handleModalClose}
          isOpen={modalName === 'buyerRefund'}
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

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.buyerRefunds, limit, offset, search],
    () =>
      Order.getOrders({
        submodule: EOrderModules.REFUND,
        limit: String(limit),
        offset: String(offset),
        search: String(search),
      })
  );

  await queryClient.prefetchQuery([QUERY_KEYS.orderStatuses], () =>
    Order.getOrderStatuses()
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

BuyerRefundPage.getLayout = WithShellLayout;

export default BuyerRefundPage;
