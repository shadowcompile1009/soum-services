import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { ActivityLog } from '@/models/ActivityLog';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useOrderActivityLog() {
  const router = useRouter();
  const { limit = '50', offset = '0', id } = router.query;
  return useQuery([QUERY_KEYS.orderActivityLog, id, limit, offset], () =>
    ActivityLog.getOrderActivityLogList({
      orderId: String(id),
      limit: String(limit),
      offset: String(offset),
    })
  );
}
