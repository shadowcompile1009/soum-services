import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { SellerPayoutTable } from '@src/components/Payout';
import { BREADCRUMBS } from '@src/constants/breadcrumbs';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { Breadcrumb } from '@src/components/Breadcrumb';
import { User } from '@src/models/User';
import { WithShellLayout } from '@src/components/Layouts/WithShellLayout';
import { EOrderModules, Order } from '@src/models/Order';
import { apiClientV1, apiClientV2 } from '@src/api/client';
import { Box } from '@src/components/Box';
import { SearchFilter } from '@src/components/Shared/SearchFilter';
import { SellerPayoutModal } from '@src/components/Payout/SellerPayoutModal';

const breadcrumbRoutes = {
  payouts: {
    title: BREADCRUMBS.PAYOUTS,
  },
  'seller-payout': {
    title: BREADCRUMBS.SELLER_PAYOUT,
  },
};
function SellerPayoutPage() {
  const router = useRouter();
  const { query } = router;
  const { modalName, orderId } = query;

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
      <SearchFilter placeholder="Order Id" />
      <SellerPayoutTable />
      {modalName === 'sellerPayout' && (
        <SellerPayoutModal
          orderId={orderId as unknown as string}
          onClose={handleModalClose}
          isOpen={modalName === 'sellerPayout'}
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

  const token = await User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.sellerPayouts, limit, offset, search],
    () =>
      Order.getOrders({
        submodule: EOrderModules.PAYOUT,
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

SellerPayoutPage.getLayout = WithShellLayout;

export default SellerPayoutPage;
