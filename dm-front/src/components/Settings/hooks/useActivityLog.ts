import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { ActivityLog } from '@/models/ActivityLog';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useActivityLog() {
  const router = useRouter();
  const { limit = '50', offset = '0', search = '' } = router.query;

  return useQuery([QUERY_KEYS.activityLog, limit, offset, search], () =>
    ActivityLog.getActivityLogList({
      limit: String(limit),
      offset: String(offset),
      search: String(search),
    })
  );
}
