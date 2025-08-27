import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { User } from '@/models/User';
import { Wallet } from '@/models/Wallet';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { apiClientV2, apiGatewayClient, apiClientV1 } from '@/api/client';
import { WithdrawalTable } from '@/components/Wallet/WithdrawalTable';
import { WithdrawalRequestModal } from '@/components/Wallet/WithdrawalRequestModal';
import { Box } from '@/components/Box';
import { QUERY_KEYS } from '@/constants/queryKeys';

const breadcrumbRoutes = {
  wallet: {
    title: BREADCRUMBS.WALLET,
  },
  withdrawal: {
    title: BREADCRUMBS.WITHDRAWAL,
  },
};

function WithdrawalPage() {
  const router = useRouter();
  const { query } = router;
  const { modalName, walletID } = query;
  function handleModalClose() {
    const newQuery = {
      ...query,
    };
    delete newQuery?.modalName;
    delete newQuery?.walletID;
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
      <WithdrawalTable />
      {modalName === 'withdrawalRequest' && (
        <WithdrawalRequestModal
          onClose={handleModalClose}
          walledID={walletID as unknown as string}
          isOpen={modalName === 'withdrawalRequest'}
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
    query: { limit = '10', offset = '0', search = '', statuses = '' },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  apiGatewayClient.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.withdrawalRequests, limit, offset, search, statuses],
    () =>
      Wallet.getWalletList({
        limit: String(limit),
        offset: String(offset),
        search: String(search),
        statuses: String(statuses),
      })
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

WithdrawalPage.getLayout = WithShellLayout;

export default WithdrawalPage;
