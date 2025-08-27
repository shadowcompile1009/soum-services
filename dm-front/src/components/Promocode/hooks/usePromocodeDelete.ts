import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { Promocode } from '@/models/Promocode';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function usePromocodeDelete() {
  const queryClient = useQueryClient();

  return useMutation(Promocode.deletePromocode, {
    onMutate: async (id) => {
      queryClient.setQueryData([QUERY_KEYS.deletePromocode], () => id);
    },
    onSuccess() {
      toast.success(toast.getMessage('onDeletePromocodeSuccess'));
      queryClient.invalidateQueries([QUERY_KEYS.promocodeList]);
    },
    onError() {
      toast.error(toast.getMessage('onDeletePromocodeError'));
    },
    onSettled() {
      queryClient.invalidateQueries([QUERY_KEYS.deletePromocode]);
    },
  });
}
