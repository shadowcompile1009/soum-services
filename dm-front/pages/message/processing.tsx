// import { useMemo } from 'react';
import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
// import { useRouter } from 'next/router';
// import isEmpty from 'lodash.isempty';
// import { MultiValue } from 'react-select';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { BREADCRUMBS } from '@/constants/breadcrumbs';
import { Breadcrumb } from '@/components/Breadcrumb';
import { User } from '@/models/User';
import { WithShellLayout } from '@/components/Layouts/WithShellLayout';
import { apiClientV1, apiClientV2 } from '@/api/client';
import { MessageProcessingTable } from '@/components/Messaging';
import { Order } from '@/models/Order';
import { Message } from '@/models/Message';
import { Box } from '@/components/Box';
// import {
//   MessageStatusSelect,
//   IMessageStatus,
// } from '@/components/Shared/MessageStatusSelect';

const breadcrumbRoutes = {
  message: {
    title: BREADCRUMBS.MESSAGE,
  },
  processing: {
    title: BREADCRUMBS.PROCESSING,
  },
};

function ProcessingPage() {
  // const router = useRouter();
  // const { query } = router;
  // const { statuses = '' } = query;

  // const initialFilterStatuses = useMemo(() => {
  //   const statusesId = String(statuses).split(',')!;

  //   return statusesId.filter(Boolean).map((status) => ({
  //     id: status,
  //     status,
  //   }));
  // }, [statuses]);

  // function handleFilterStatus(values: MultiValue<IMessageStatus>) {
  //   const { query } = router;

  //   if (isEmpty(values)) {
  //     const newQuery = {
  //       ...query,
  //     };
  //     delete newQuery?.statuses;
  //     router.replace(
  //       {
  //         pathname: router.pathname,
  //         query: newQuery,
  //       },
  //       undefined,
  //       { shallow: true }
  //     );
  //     return;
  //   }

  //   const statuses = values.map((value) => value.id).join(',');

  //   const newQuery = {
  //     ...query,
  //   };
  //   newQuery.statuses = statuses;
  //   router.replace(
  //     {
  //       pathname: router.pathname,
  //       query: newQuery,
  //     },
  //     undefined,
  //     { shallow: true }
  //   );
  // }

  return (
    <>
      <Box marginBottom={20}>
        <Breadcrumb routes={breadcrumbRoutes} />
      </Box>
      {/* <MessageStatusSelect
        handleOnSelect={handleFilterStatus}
        initialValues={initialFilterStatuses as IMessageStatus[]}
      /> */}
      <MessageProcessingTable />
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
    query: { limit = '30', offset = '0' },
  } = ctx;

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [QUERY_KEYS.messageProcessing, limit, offset],
    () =>
      Message.getProcessingMessages({
        limit: String(limit),
        offset: String(offset),
      })
  );

  await queryClient.prefetchQuery([QUERY_KEYS.orderStatuses], () =>
    Order.getOrderStatuses()
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

ProcessingPage.getLayout = WithShellLayout;

export default ProcessingPage;
