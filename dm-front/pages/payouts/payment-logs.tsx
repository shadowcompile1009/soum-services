import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/Breadcrumb';
import { User } from '@/models/User';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Stack } from '@/components/Layouts';
import { apiClientV1, apiClientV2 } from '@/api/client';
import { PaymentLogs } from '@/models/PaymentLogs';
import React from 'react';
import { SearchFilter } from '@/components/Shared/SearchFilter';
import { PaymentLogsTable } from '@/components/Payout';

const breadcrumbRoutes = {
  orders: {
    title: BREADCRUMBS.ORDERS,
  },
  'payment-logs': {
    title: BREADCRUMBS.PAYMENT_LOGS,
  },
};

function PaymentLogsPage() {
  return (
    <>
      <Stack
        direction="horizontal"
        justify="space-between"
        style={{ marginBottom: 20 }}
      >
        <Breadcrumb routes={breadcrumbRoutes} />
      </Stack>
      <Stack
        direction="horizontal"
        gap="5"
        justify="start"
        align="start"
        style={{ marginBottom: 20 }}
      >
        <SearchFilter
          placeholder={'Payment Error ID'}
          queryParam={'paymentErrorId'}
        />
        <SearchFilter
          placeholder={'Mobile Number'}
          queryParam={'mobileNumber'}
        />
        <SearchFilter placeholder={'Soum Number'} queryParam={'soumNumber'} />
      </Stack>
      <PaymentLogsTable />
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
      mobileNumber = '',
      paymentErrorId = '',
      soumNumber = '',
    },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [
      QUERY_KEYS.paymentLogs,
      limit,
      offset,
      mobileNumber,
      paymentErrorId,
      soumNumber,
    ],
    () =>
      PaymentLogs.getPaymentHistory({
        limit: String(limit),
        offset: String(limit),
        mobileNumber: String(mobileNumber),
        paymentErrorId: String(paymentErrorId),
        soumNumber: String(soumNumber),
      })
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

PaymentLogsPage.getLayout = WithShellLayout;

export default PaymentLogsPage;
