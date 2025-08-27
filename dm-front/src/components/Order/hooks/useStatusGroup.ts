import { useQuery } from '@tanstack/react-query';

import { StatusGroupValue, StatusGroup } from '@/models/StatusGroup';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useStatusGroup(group: StatusGroupValue) {
  return useQuery(
    [QUERY_KEYS.statusGroup, group],
    () => StatusGroup.getStatusGroup({ group }),
    {
      staleTime: Infinity,
    }
  );
}
