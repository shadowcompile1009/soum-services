import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import css from '@styled-system/css';
import { useIsMutating, useMutation } from '@tanstack/react-query';

import { Text } from '@src/components/Text';
import { TableLoader } from '@src/components/TableLoader';
import { TableContainer } from '@src/components/Shared/TableComponents';
import { Stack } from '@src/components/Layouts';
import { useQueryClient } from '@tanstack/react-query';
import { Order } from '@src/models/Order';
import { QUERY_KEYS } from '@src/constants/queryKeys';

import { useOrderDetailV3 } from '../Order/hooks';
import { Button } from '../Button';
import { toast } from '../Toast';
import { Loader } from '../Loader';
import {
  DisputeEventsCard,
  PaymentsAndDisputesCard,
  DisputeActionsCard,
} from './Cards';

import { ButtonProps, DisputeFormValues } from './types';

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

export function ProcessDispute() {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, data: orderDetails } = useOrderDetailV3(id as string);

  const isMutating = useIsMutating();

  const queryClient = useQueryClient();

  const { control, handleSubmit, setValue, reset, watch } =
    useForm<DisputeFormValues>({
      defaultValues: {
        disputeStatus: {
          id: orderDetails?.statusId,
          displayName: orderDetails?.orderData?.status,
          name: orderDetails?.orderData?.status
            ?.split(' ')
            .join('-')
            .toLowerCase(),
        },
      },
    });

  const changeDisputeOrderDetailsMutation = useMutation(
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
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.orderDetail],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.disputeStatuses],
        });
        toast.success('Dispute details updated successfully');
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

  const disputeStatus = watch('disputeStatus');

  const onSubmit = (data: DisputeFormValues) => {
    changeDisputeOrderDetailsMutation.mutate({
      id: orderDetails?.id,
      statusId:
        data.disputeStatus.id === orderDetails?.statusId
          ? ''
          : data.disputeStatus.id,
      dmoNctReasonId: '',
      penalty: '',
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
          <DisputeEventsCard orderDetails={orderDetails} />
        </CardItem>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="vertical" gap="1.125rem">
            <CardItem width="50rem">
              <PaymentsAndDisputesCard orderDetails={orderDetails} />
            </CardItem>
            <CardItem width="50rem">
              <DisputeActionsCard
                orderDetails={orderDetails}
                control={control}
                setValue={setValue}
              />
            </CardItem>
            <Button
              type="submit"
              variant="filled"
              disabled={
                !!isMutating ||
                disputeStatus.id === orderDetails?.statusId ||
                !disputeStatus.id
              }
            >
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
