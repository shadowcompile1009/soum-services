import { NextPageContext } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@src/constants/queryKeys';
import { User } from '@src/models/User';
import { Order } from '@src/models/Order';
import { WithShellLayout } from '@src/components/Layouts/WithShellLayout';
import { apiClientV1, apiClientV2 } from '@src/api/client';
import { apiGatewayClient } from '@src/api/client';
import { Stack } from '@src/components/Layouts';
import { PayoutDetails } from '@src/components/Payout/payoutDetails/PayoutDetails';
import { SellerOrderDetails } from '@src/models/OrderDetails';

function SellerPayoutDetailsPage() {
  return (
    <>
      <Stack direction="vertical" gap="5" flex="1">
        <PayoutDetails />
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
    query: { id },
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

  await queryClient.prefetchQuery([QUERY_KEYS.orderDetails, id, 'seller'], () =>
    SellerOrderDetails.getSellerOrderDetailsV3(id as string)
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
}

SellerPayoutDetailsPage.getLayout = WithShellLayout;

export default SellerPayoutDetailsPage;
