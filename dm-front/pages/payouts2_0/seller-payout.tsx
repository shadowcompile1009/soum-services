import { NextPageContext } from 'next';
import NextLink from 'next/link';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { SellerPayoutTable2_0 } from '@src/components/Payout';
import { User } from '@src/models/User';
import { WithShellLayout } from '@src/components/Layouts/WithShellLayout';
import {
  EOrderModules,
  Order,
  SUBMODULE_QUERY_KEYS_MAP,
} from '@src/models/Order';
import { apiClientV1, apiClientV2 } from '@src/api/client';
import { Stack } from '@src/components/Layouts';
import { Text } from '@src/components/Text';
import { BREADCRUMBS } from '@src/constants/breadcrumbs';
import { PayoutFilters } from '@src/components/Filters';

function SellerPayoutPage2_0() {
  return (
    <>
      <Stack
        direction="horizontal"
        gap="2"
        align="center"
        style={{ marginBottom: 20 }}
      >
        <Text fontSize="baseText" fontWeight="baseText" color="static.grays.10">
          {BREADCRUMBS.HOME}
        </Text>
        <span> / </span>
        <NextLink href="/payouts2_0/seller-payout" passHref>
          <a>Payment Management 2.0</a>
        </NextLink>
        <span> / </span>
        <NextLink href="/payouts2_0/seller-payout" passHref>
          <a>Seller Payout</a>
        </NextLink>
      </Stack>

      <PayoutFilters />
      <SellerPayoutTable2_0 />
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
    query: {
      limit = '10',
      offset = '0',
      search = '',
      capturestatus = '',
      replacementStatus = '',
    },
  } = ctx;

  const token = await User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [
      SUBMODULE_QUERY_KEYS_MAP[EOrderModules.NEW_PAYOUT],
      limit,
      offset,
      search,
      capturestatus,
      replacementStatus,
    ],
    () =>
      Order.getCaptureOrders({
        submodule: EOrderModules.NEW_PAYOUT,
        limit: String(limit),
        offset: String(offset),
        search: String(search),
        capturestatus: String(capturestatus),
        replacementStatus: String(replacementStatus),
      })
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

SellerPayoutPage2_0.getLayout = WithShellLayout;

export default SellerPayoutPage2_0;
