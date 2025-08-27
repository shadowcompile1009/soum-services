import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/Toast';
import { Upfronts } from '@/models/Upfronts';

export function useChangeUpfrontStatus(
  orderId: string,
  queryKey: string[],
  upfront: Upfronts,
  refetchUpfronts?: () => Promise<any>
) {
  const queryClient = useQueryClient();

  const changeOrderMutation = useMutation(
    ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }): Promise<void> => {
      return Upfronts.changeUpfrontStatus(orderId, status);
    },
    {
      onError: () => {
        toast.error(
          toast.getMessage('onUpfrontStatusUpdateError', upfront.orderNumber)
        );
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(queryKey);
        if (refetchUpfronts) {
          await refetchUpfronts();
        }
        toast.success(
          toast.getMessage('onUpfrontStatusUpdateSuccess', upfront.orderNumber)
        );
      },
    }
  );

  const handleSelect = useCallback(
    (newValue: string, clearValueOnError: () => void) => {
      return changeOrderMutation.mutate(
        {
          orderId,
          status: newValue,
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
