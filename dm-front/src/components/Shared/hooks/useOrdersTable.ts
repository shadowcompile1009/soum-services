import { useRouter } from 'next/router';

import { EOrderModules } from '@/models/Order';
import { useOrdersData } from '@/components/Shared/hooks/useOrdersData';

interface useOrderTableProps {
  submodule: EOrderModules;
  search?: string;
}
export function useOrdersTable(props: useOrderTableProps) {
  const router = useRouter();
  const {
    limit = '10',
    offset = '0',
    search = '',
    capturestatus = '',
    replacementStatus = '',
  } = router.query;

  return useOrdersData({
    submodule: props.submodule,
    limit: String(limit),
    offset: String(offset),
    search: props.search || String(search),
    capturestatus: String(capturestatus),
    replacementStatus: String(replacementStatus),
  });
}
