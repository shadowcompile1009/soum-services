import { useRouter } from 'next/router';
import {
  useQueryClient,
  useMutation,
  useIsMutating,
} from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { Box } from '@src/components/Box';
import { Card } from '@src/components/Card';
import { Stack } from '@src/components/Layouts';
import { ProcessPayoutIcon } from '@src/components/Shared/ProcessPayoutIcon';
import { Text } from '@src/components/Text';
import { Button } from '@src/components/Button';
import { SelectOrderStatus } from '@src/components/Order/EditOrderDetails/Select/SelectOrderStatus';
import { Order, OrderV3 } from '@src/models/Order';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { toast } from '@src/components/Toast';
import { SellerOrderDetails } from '@src/models/OrderDetails';
import { Loader } from '@src/components/Loader';

import { PAYOUT_DETAILS_DEFAULT_VALUES } from '../../constants';
import { SelectFinanceReasoning } from './FinanceReasoningSelect';

import { PayoutFormValues } from '../../types';

export const ProcessPayout = ({
  orderDetails,
  orderSellerDetails,
  getMatchedOrder,
  isWalletCreditRelease,
}: {
  orderDetails: any;
  orderSellerDetails: any;
  getMatchedOrder: any;
  isWalletCreditRelease: boolean;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const isMutating = useIsMutating();

  const { control, handleSubmit, reset, watch } = useForm<PayoutFormValues>({
    defaultValues: PAYOUT_DETAILS_DEFAULT_VALUES(orderDetails),
  });

  const payoutMutation = useMutation(
    ({
      orderId,
      grandTotal,
      isQuickPayout,
    }: {
      orderId: string;
      grandTotal: string;
      isQuickPayout: boolean;
    }): Promise<void> => {
      return SellerOrderDetails.postSellerPayout(orderId, {
        amount: grandTotal,
        isQuickPayout,
      });
    },
    {
      onSuccess() {
        toast.success(
          toast.getMessage(
            'onSellerPayoutSuccess',
            getMatchedOrder?.orderNumber
          )
        );
        queryClient.invalidateQueries([QUERY_KEYS.sellerPayouts]);
        router.push('/payouts2_0/seller-payout');
      },
      onError(error: any) {
        queryClient.invalidateQueries([
          QUERY_KEYS.paymentHistory,
          orderDetails?.orderId,
        ]);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(
            toast.getMessage('onBuyerRefundError', getMatchedOrder?.orderNumber)
          );
        }
      },
    }
  );

  const payoutToWalletMutation = useMutation(
    ({
      orderId,
      walletId,
      releaseAmount,
    }: {
      orderId: string;
      walletId: string;
      releaseAmount: number;
    }): Promise<void> => {
      return SellerOrderDetails.payoutToWallet({
        orderId,
        walletId,
        releaseAmount,
      });
    },
    {
      onSuccess() {
        toast.success(
          toast.getMessage(
            'onSellerToWalletPayoutSuccess',
            getMatchedOrder?.orderNumber
          )
        );
        queryClient.invalidateQueries([QUERY_KEYS.sellerToWalletPayouts]);
      },
      onError(error: any) {
        queryClient.invalidateQueries([
          QUERY_KEYS.paymentHistory,
          orderDetails?.orderId,
        ]);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(toast.getMessage('onToWalletRefundError'));
        }
      },
    }
  );

  const changeOrderDetailsMutation = useMutation(
    async ({
      id,
      statusId,
      dmoNctReasonId,
      penalty,
      financeReasonId,
    }: {
      id: string;
      statusId: string;
      dmoNctReasonId: string;
      penalty: string;
      financeReasonId: string;
    }): Promise<[void, void]> => {
      // Update return type to match Promise.all result
      return Promise.all([
        Order.changeOrderDetails({
          id,
          statusId,
          dmoNctReasonId,
          penalty,
        }),
        OrderV3.changeFinanceReason(id, financeReasonId),
      ]);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.orderDetailV3],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.editOrderDetailStatuses],
        });
        toast.success('Order details updated successfully');
        reset();
        router.push('/payouts2_0/seller-payout');
      },
      onError: (error: any) => {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error('An error occurred while sending the request');
        }
      },
    }
  );

  const onSubmit = async (data: PayoutFormValues) => {
    if (data.orderStatus.displayName === 'Payout Processed') {
      if (isWalletCreditRelease) {
        await payoutToWalletMutation.mutateAsync({
          orderId: orderDetails?.orderId,
          walletId: orderDetails?.walletId,
          releaseAmount: orderSellerDetails?.payoutAmount,
        });

        return;
      }

      await payoutMutation.mutateAsync({
        orderId: orderDetails?.orderId,
        grandTotal: orderSellerDetails?.payoutAmount,
        isQuickPayout: orderSellerDetails?.isQuickPayout,
      });

      return;
    }

    changeOrderDetailsMutation.mutate({
      id: orderDetails?.id,
      statusId:
        data.orderStatus.id === orderDetails?.statusId
          ? ''
          : data.orderStatus.id,
      dmoNctReasonId: '',
      penalty: '',
      financeReasonId: data.financeReasoning.value,
    });

    return;
  };

  const payoutStatus = watch('orderStatus');

  const isPayoutRequested = payoutStatus?.name === 'payout-requested';

  const disableButton =
    isPayoutRequested ||
    orderSellerDetails?.isPayoutSuccess ||
    orderSellerDetails?.isSuccessPayoutToWallet ||
    !!isMutating;

  return (
    <Card
      heading="Process Payout"
      icon={<ProcessPayoutIcon />}
      paddingBottom="0"
      fontSize="1.5rem"
      paddingBodyX="0"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="vertical" gap="0.75rem">
          <Stack
            direction="horizontal"
            borderBottom="0.66px solid #C2C2C2"
            margin="0 2.1875rem 0 58px"
            padding="0 0 0.25rem"
            justify="space-between"
          >
            <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
              <Text
                fontWeight="regular"
                fontSize="bigText"
                color="static.blues.500"
              >
                Payout Status
              </Text>
            </Box>
            <SelectOrderStatus
              orderDetails={orderDetails}
              control={control}
              submodule="payout"
            />
          </Stack>

          <Stack direction="vertical" gap="0.75rem">
            <Stack
              direction="horizontal"
              borderBottom="0.66px solid #C2C2C2"
              margin="0 2.1875rem 0 58px"
              padding="0 0 0.25rem"
              justify="space-between"
            >
              <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
                <Text
                  fontWeight="regular"
                  fontSize="bigText"
                  color="static.blues.500"
                >
                  Finance Reasoning
                </Text>
              </Box>
              <SelectFinanceReasoning control={control} />
            </Stack>
          </Stack>

          <Stack
            direction="horizontal"
            margin="0 2.1875rem 0 58px"
            padding="0 0 0.25rem"
            justify="space-between"
          >
            <Box cssProps={{ display: 'flex', alignItems: 'center' }}>
              <Text
                fontWeight="regular"
                fontSize="bigText"
                color="static.blues.500"
              >
                Payout amount to pay
              </Text>
            </Box>
            <Box
              cssProps={{
                borderRadius: '0.25rem',
                backgroundColor: '#6c757d13',
                display: 'flex',
                alignItems: 'center',
                height: '2.125rem',
                width: '18rem',
                paddingLeft: '0.75rem',
              }}
            >
              {orderSellerDetails?.payoutAmount}
            </Box>
          </Stack>
          <Stack
            direction="horizontal"
            margin="0 35px 0 58px"
            padding="0 0 0.25rem"
            justify="right"
          >
            <Button type="submit" variant="filled" disabled={disableButton}>
              {!!isMutating ? (
                <Loader size="24px" marginRight="0" border="static.blue" />
              ) : (
                'Submit'
              )}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Card>
  );
};
