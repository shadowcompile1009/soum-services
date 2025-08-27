import { NextPageContext } from 'next';
import NextLink from 'next/link';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { BuyerRefundTable2_0 } from '@src/components/Payout';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { EOrderModules, Order } from '@src/models/Order';
import { BREADCRUMBS } from '@src/constants/breadcrumbs';
import { apiClientV1, apiClientV2 } from '@src/api/client';
import { User } from '@src/models/User';
import { WithShellLayout } from '@src/components/Layouts/WithShellLayout';
import { Stack } from '@src/components/Layouts';
import { Text } from '@src/components/Text';
import { RefundFilters } from '@src/components/Filters';

function BuyerRefundPage2_0() {
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
        <NextLink href="/payouts2_0/buyer-refund" passHref>
          <a>Buyer Refund</a>
        </NextLink>
      </Stack>

      <RefundFilters />
      <BuyerRefundTable2_0 />
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

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.buyerRefunds, limit, offset, search],
    () =>
      Order.getCaptureOrders({
        submodule: EOrderModules.NEW_REFUND,
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

BuyerRefundPage2_0.getLayout = WithShellLayout;

export default BuyerRefundPage2_0;
