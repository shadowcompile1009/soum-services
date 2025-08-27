import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { Promocode } from '@/models/Promocode';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useStatusMutation(queryString: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { query } = router;
  const { page = 1 } = query;
  const size = 100;
  const queryKey = [queryString, String(page), String(size)];

  return useMutation(Promocode.updateStatus, {
    onMutate: async ({ promocode }) => {
      let updatedData = {
        ...promocode,
        status: promocode.status,
      };

      queryClient.setQueryData(queryKey, () => updatedData);

      return { previousData: promocode };
    },
    onSuccess() {
      toast.success(toast.getMessage('onUpdatePromocodeSuccess'));
      queryClient.invalidateQueries([QUERY_KEYS.promocodeList]);
    },
    onError() {
      toast.error(toast.getMessage('onUpdatePromocodeError'));
    },
    onSettled() {
      queryClient.invalidateQueries(queryKey);
    },
  });
}
