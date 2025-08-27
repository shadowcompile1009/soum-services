import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { Box } from '@src/components/Box';
import { Stack } from '@src/components/Layouts/Stack';
import { RefundCard } from '@src/components/Payout/RefundCard';
import { toast } from '@src/components/Toast';
import { RefundFormValues } from './types';
import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { BuyerOrderDetails, IPaymentMethod } from '@src/models/OrderDetails';
import { BuyerRefundDTOV2 } from '@src/types/dto';
import { Order } from '@src/models/Order';

import { PaymentDetails } from './PaymentDetails';
import { SellerPenalty } from './SellerPenalty';
import { RefundAction } from './RefundAction';

export const RefundDetailsCard = ({
  orderDetails,
  buyerOrderDetails,
  getMatchedOrder,
}: {
  orderDetails: any;
  buyerOrderDetails: any;
  getMatchedOrder: any;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<RefundFormValues>({
      defaultValues: {
        refundPaymentMethod: {
          label: buyerOrderDetails?.paymentMethods?.[0]?.label,
          displayName: buyerOrderDetails?.paymentMethods?.[0]?.displayName,
        },
        orderStatus: {
          id: orderDetails?.statusId,
          displayName: orderDetails?.orderData?.status,
          name: orderDetails?.orderData?.status
            ?.split(' ')
            .join('-')
            .toLowerCase(),
        },
        refundToPay: buyerOrderDetails?.grandTotal,
      },
    });

  useEffect(() => {
    if (buyerOrderDetails?.grandTotal) {
      setValue('refundToPay', buyerOrderDetails.grandTotal);
      setValue('refundPaymentMethod', buyerOrderDetails.paymentMethods[0]);
    }
  }, [buyerOrderDetails, setValue]);

  const ClosePaymentMutation = useMutation(
    (): Promise<void> => {
      return BuyerOrderDetails.postCloselPayment(orderDetails?.orderId);
    },
    {
      onSuccess() {
        toast.success(
          toast.getMessage(
            'onClosePaymentSuccess',
            getMatchedOrder?.orderNumber
          )
        );
        reset();
        router.push('/payouts2_0/buyer-refund');
      },
      onError(error: any) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      },
    }
  );

  const refundMutation = useMutation(
    ({
      orderId,
      amount,
      paymentMethod,
    }: {
      orderId: string;
      amount: number;
      paymentMethod: IPaymentMethod;
      formData: RefundFormValues;
    }): Promise<void> => {
      const values: BuyerRefundDTOV2 = {
        amount,
        paymentMethod,
        grandTotal: buyerOrderDetails?.grandTotal,
        bank: buyerOrderDetails?.bankDetails,
        iban: buyerOrderDetails?.iban,
        accountName: buyerOrderDetails?.accountName,
      };

      return BuyerOrderDetails.postBuyerRefundV3(orderId, values);
    },
    {
      mutationKey: [QUERY_KEYS.buyerRefunds, orderDetails?.orderId, 'Instant'],
      onSuccess(_, variables) {
        toast.success(
          toast.getMessage('onBuyerRefundSuccess', getMatchedOrder?.orderNumber)
        );
        queryClient.invalidateQueries([QUERY_KEYS.buyerRefunds]);

        if (
          variables.formData.orderStatus.displayName !==
          orderDetails?.orderData?.status
        ) {
          changeOrderDetailsMutation.mutate({
            id: orderDetails?.id,
            statusId:
              variables.formData.orderStatus.id === orderDetails?.statusId
                ? ''
                : variables.formData.orderStatus.id,
            dmoNctReasonId: '',
            penalty: '',
          });
        }
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

  const refundToWalletMutation = useMutation(
    ({
      orderId,
      walletId,
      refundAmount,
    }: {
      orderId: string;
      walletId: string;
      refundAmount: number;
      formData: RefundFormValues;
    }) => {
      return BuyerOrderDetails.refundToWallet(orderId, walletId, refundAmount);
    },
    {
      mutationKey: [QUERY_KEYS.buyerRefunds, orderDetails?.orderId, 'Wallet'],
      onSuccess(_, variables) {
        toast.success(
          toast.getMessage('onBuyerRefundSuccess', getMatchedOrder?.orderNumber)
        );
        queryClient.invalidateQueries([QUERY_KEYS.buyerRefunds]);

        if (
          variables.formData.orderStatus.displayName !==
          orderDetails?.orderData?.status
        ) {
          changeOrderDetailsMutation.mutate({
            id: orderDetails?.id,
            statusId:
              variables.formData.orderStatus.id === orderDetails?.statusId
                ? ''
                : variables.formData.orderStatus.id,
            dmoNctReasonId: '',
            penalty: '',
          });
        }
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

  const changeOrderDetailsMutation = useMutation(
    ({
      id,
      statusId,
      dmoNctReasonId,
      penalty,
    }: {
      id: string;
      statusId: string;
      dmoNctReasonId: string;
      penalty: string;
    }): Promise<void> => {
      return Order.changeOrderDetails({
        id,
        statusId,
        dmoNctReasonId,
        penalty,
      });
    },
    {
      mutationKey: [QUERY_KEYS.editOrderDetailStatuses, orderDetails?.orderId],
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.orderDetailV3],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.editOrderDetailStatuses],
        });
        toast.success('Order details updated successfully');
        reset();
        router.push('/payouts2_0/buyer-refund');
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

  const onSubmit = async (data: RefundFormValues) => {
    if (buyerOrderDetails?.isBNPL) {
      await ClosePaymentMutation.mutateAsync();
    }

    if (data.orderStatus.displayName === 'Refund Processed') {
      if (data.refundPaymentMethod.label === 'refundToWallet') {
        await refundToWalletMutation.mutateAsync({
          orderId: orderDetails?.orderId,
          walletId: buyerOrderDetails?.walletId,
          refundAmount: Number(data.refundToPay),
          formData: data,
        });

        return;
      }

      await refundMutation.mutateAsync({
        orderId: orderDetails?.orderId,
        amount: Number(data.refundToPay),
        paymentMethod: data?.refundPaymentMethod,
        formData: data,
      });

      return;
    }

    if (data.orderStatus.displayName !== orderDetails?.orderData?.status) {
      changeOrderDetailsMutation.mutate({
        id: orderDetails?.id,
        statusId:
          data.orderStatus.id === orderDetails?.statusId
            ? ''
            : data.orderStatus.id,
        dmoNctReasonId: '',
        penalty: '',
      });
    }

    return;
  };

  return (
    <RefundCard paddingBottom="0">
      <Stack direction="horizontal">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            cssProps={{
              display: 'flex',
              flexWrap: 'wrap',
              margin: '16px 17px',
              rowGap: '2.6875rem',
            }}
          >
            <PaymentDetails
              buyerOrderDetails={buyerOrderDetails}
              control={control}
              orderDetails={orderDetails}
              watch={watch}
            />
            <SellerPenalty buyerOrderDetails={buyerOrderDetails} />
            <RefundAction
              control={control}
              orderDetails={orderDetails}
              buyerOrderDetails={buyerOrderDetails}
              watch={watch}
            />
          </Box>
        </form>
      </Stack>
    </RefundCard>
  );
};
