import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { Order, IOrderStatus, FinanceOrder } from '@/models/Order';

export function useChangeOrderStatus(
  orderId: string,
  queryKey: string[],
  order: Order | FinanceOrder
) {
  const queryClient = useQueryClient();

  const changeOrderMutation = useMutation(
    ({
      orderId,
      statusId,
    }: {
      orderId: string;
      statusId: string;
    }): Promise<void> => {
      return Order.changeOrderStatus(orderId, statusId);
    },
    {
      onError: () => {
        toast.error(
          toast.getMessage('onOrderStatusUpdateError', order.orderNumber)
        );
      },
      onSuccess: () => {
        toast.success(
          toast.getMessage('onOrderStatusUpdateSuccess', order.orderNumber)
        );
        queryClient.invalidateQueries(queryKey);

        if (window.location.href.includes('orders/car-real-state')) {
          window.location.reload();
        }
      },
    }
  );

  const handleSelect = useCallback(
    (newValue: IOrderStatus, clearValueOnError: () => void) => {
      return changeOrderMutation.mutate(
        {
          orderId,
          statusId: newValue.id,
        },
        {
          onError() {
            clearValueOnError();
          },
        }
      );
    },
    // we need only the first closure of handleSelect
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    handleSelect,
  };
}
