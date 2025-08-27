import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { User } from '@/models/User';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { apiClientV2, apiGatewayClient, apiClientV1 } from '@/api/client';
import { WalletManagementTable } from '@/components/Wallet/WalletManagementTable';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Wallet } from '@/models/Wallet';
import { Stack } from '@/components/Layouts';
import { WalletDetailsModal } from '@/components/Wallet';
import { SearchFilter } from '@/components/Shared/SearchFilter';

const breadcrumbRoutes = {
  wallet: {
    title: BREADCRUMBS.WALLET_MANAGEMENT,
  },
  list: {
    title: BREADCRUMBS.WALLET_LIST,
  },
};

function WalletManagementPage() {
  const router = useRouter();
  const { query } = router;
  const { modalName, walletId } = query;

  function handleModalClose() {
    const newQuery = {
      ...query,
    };
    delete newQuery?.modalName;
    delete newQuery?.walletId;
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
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      {/* disable search til implement it backend side */}
      <SearchFilter placeholder="Phone Number" />
      <WalletManagementTable />
      {modalName === 'walletDetails' && (
        <WalletDetailsModal
          walletId={walletId as unknown as string}
          onClose={handleModalClose}
          isOpen={modalName === 'walletDetails'}
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

  apiGatewayClient.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.walletList, limit, offset, search],
    () =>
      Wallet.getWalletManagementList({
        limit: String(limit),
        offset: String(offset),
        search: String(search),
      })
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

WalletManagementPage.getLayout = WithShellLayout;

export default WalletManagementPage;
