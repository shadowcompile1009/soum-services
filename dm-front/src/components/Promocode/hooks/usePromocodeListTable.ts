import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { Promocode } from '@/models/Promocode';

interface UsePromocodeListTableProps {
  id?: string | null;
  page?: number;
}

export function usePromocodeListTable(props: UsePromocodeListTableProps) {
  const router = useRouter();
  const { query } = router;
  const { search = '' } = query;
  const limit = 100;

  // Use provided page or default to 1
  const currentPage = props.page || Number(query.page) || 1;

  // Only pass id if it's a non-empty string
  const parentId = props.id && props.id.trim() ? props.id : undefined;

  return useQuery(
    [QUERY_KEYS.promocodeList, currentPage, limit, search, parentId],
    () =>
      Promocode.getPromocodeList(
        Number(limit),
        currentPage,
        String(search),
        parentId
      ),
    {
      keepPreviousData: true,
      staleTime: 30000,
    }
  );
}
