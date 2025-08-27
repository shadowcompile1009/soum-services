import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Order } from '@/models/Order';

export function useRelistProductMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { query } = router;
  const { id: orderId } = query;
  const queryKey = [QUERY_KEYS.orderDetail, orderId];

  return useMutation(
    ({ dmoId }: { dmoId: string }): Promise<void> =>
      Order.updateProductStatusForRelisting(dmoId),
    {
      onMutate: async () => {
        const previousData = queryClient.getQueryData(queryKey) as {
          isProductRelisted: boolean;
        };

        let updatedData = { ...previousData };

        updatedData['isProductRelisted'] = true;

        queryClient.setQueryData(queryKey, () => updatedData);

        return { previousData };
      },
      onSuccess: () => {
        toast.success(toast.getMessage('onUpdateProductRelistingSuccess'));
      },
      onError: (error: any) => {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error(toast.getMessage('onUpdateProductRelistingError'));
        }
      },
    }
  );
}
