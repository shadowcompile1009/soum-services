import { useRouter } from 'next/router';
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import css from '@styled-system/css';

import { Order } from '@src/models/Order';
import { QUERY_KEYS } from '@src/constants/queryKeys';
import { Text } from '@src/components/Text';
import { TableLoader } from '@src/components/TableLoader';
import { TableContainer } from '@src/components/Shared/TableComponents';
import { Stack } from '@src/components/Layouts';
import { toast } from '@src/components/Toast';
import { Loader } from '@src/components/Loader';

import { Button } from '../../Button';
import { useNCTReasonByOrderId, useOrderDetailV3 } from '../hooks';
import { OrderActionsCard } from './Cards/OrderActionCard';
import { OrderEventsCard } from './Cards/OrderEventsCard';
import { PaymentsAndDisputesCard } from './Cards';

import { ButtonProps, OrderFormValues } from './types';
import { EDIT_ORDER_DETAILS_DEFAULT_VALUES } from './constants';

const CardsGrid = styled('div')(() => {
  return css({
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '0.875rem',
    rowGap: '1.8125rem',
  });
});

const CardItem = styled('div')<ButtonProps>((props) => {
  const { width = '21.375rem' } = props;

  return css({
    width: width,
  });
});

export function EditOrderDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, data: orderDetails } = useOrderDetailV3(id as string);
  const { data: mappedNCTReasonById } = useNCTReasonByOrderId(id as string);

  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<OrderFormValues>({
      defaultValues: EDIT_ORDER_DETAILS_DEFAULT_VALUES(
        orderDetails,
        mappedNCTReasonById
      ),
    });

  const isMutating = useIsMutating({
    mutationKey: [QUERY_KEYS.editOrderDetails, orderDetails?.id],
  });

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
      mutationKey: [QUERY_KEYS.editOrderDetails, orderDetails?.id],
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.orderDetailV3],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.editOrderDetailStatuses],
        });
        toast.success('Order details updated successfully');
        reset();
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

  const watchedNCTReason = watch('nctReason');

  const onSubmit = (data: OrderFormValues) => {
    changeOrderDetailsMutation.mutate({
      id: orderDetails?.id,
      statusId:
        data.orderStatus.id === orderDetails?.statusId
          ? ''
          : data.orderStatus.id,
      dmoNctReasonId:
        data?.nctReason?.id === mappedNCTReasonById?.id
          ? ''
          : data?.nctReason?.id,
      penalty:
        data.nctPenalty.id === orderDetails?.penalty ? '' : data.nctPenalty.id,
    });
  };

  if (isLoading)
    return (
      <TableContainer>
        <TableLoader />
      </TableContainer>
    );

  return (
    <>
      <Text
        fontWeight="bigSubtitle"
        fontSize="headingThree"
        color="static.black"
      >
        {orderDetails?.orderData?.orderNumber}
      </Text>
      <CardsGrid>
        <CardItem width="50rem">
          <OrderEventsCard orderDetails={orderDetails} />
        </CardItem>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="vertical" gap="1.125rem">
            <CardItem width="50rem">
              <PaymentsAndDisputesCard orderDetails={orderDetails} />
            </CardItem>
            <CardItem width="50rem">
              <OrderActionsCard
                orderDetails={orderDetails}
                control={control}
                watchedNCTReason={watchedNCTReason}
                setValue={setValue}
              />
            </CardItem>
            <Button type="submit" variant="filled" disabled={!!isMutating}>
              {!!isMutating ? (
                <Loader size="24px" marginRight="0" border="static.blue" />
              ) : (
                'Save the new changes'
              )}
            </Button>
          </Stack>
        </form>
      </CardsGrid>
    </>
  );
}
