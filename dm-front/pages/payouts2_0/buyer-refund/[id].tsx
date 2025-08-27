import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@src/constants/queryKeys';
import { User } from '@src/models/User';
import { EOrderModules, Order } from '@src/models/Order';
import { WithShellLayout } from '@src/components/Layouts/WithShellLayout';
import { apiClientV1, apiClientV2 } from '@src/api/client';
import { apiGatewayClient } from '@src/api/client';
import { Stack } from '@src/components/Layouts';
import { ProcessBuyerRefund } from '@src/components/Payout/ProcessBuyerRefund/ProcessBuyerRefund';
import { BuyerOrderDetails } from '@src/models/OrderDetails';

function BuyerRefundDetailsPage() {
  return (
    <>
      <Stack direction="vertical" gap="5" flex="1">
        <ProcessBuyerRefund />
      </Stack>
    </>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const result = await User.checkIfNotLoggedIn(ctx, {
    destination: '/',
    permanent: false,
  });

  const {
    query: { id, limit, offset, search, capturestatus, replacementStatus },
  } = ctx;

  if (result?.redirect) {
    return {
      redirect: result?.redirect,
    };
  }

  const token = User.getUserToken(ctx);

  apiClientV2.addAuthTokens(token);
  apiClientV1.addAuthTokens(token);
  apiGatewayClient.addAuthTokens(token);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery([QUERY_KEYS.orderDetail, id], () =>
    Order.getOrderDetail(id as string)
  );

  await queryClient.prefetchQuery([QUERY_KEYS.orderDetails, id, 'buyer'], () =>
    BuyerOrderDetails.getBuyerOrderDetails(id as string)
  );

  await queryClient.prefetchQuery([QUERY_KEYS.orderStatuses], () =>
    Order.getCaptureOrders({
      submodule: EOrderModules.REFUND,
      limit: limit as string,
      offset: offset as string,
      search: search as string,
      capturestatus: capturestatus as string,
      replacementStatus: replacementStatus as string,
    })
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

BuyerRefundDetailsPage.getLayout = WithShellLayout;

export default BuyerRefundDetailsPage;
