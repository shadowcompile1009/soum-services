import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Message } from '@/models/Message';

export function useProcessingTable() {
  const router = useRouter();
  const { limit = '30', offset = '0' } = router.query;

  return useQuery(
    [QUERY_KEYS.messageProcessing, String(limit), String(offset)],
    () =>
      Message.getProcessingMessages({
        limit: String(limit),
        offset: String(offset),
      }),
    {
      onError(error: any) {
        if (error?.response?.status === 403) {
          toast.error(toast.getMessage('onUnauthorizedAccessError'));
        }
      },
    }
  );
}
