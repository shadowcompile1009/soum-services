import { useRouter } from 'next/router';

import { EFinanceOrderModuleValues } from '@/models/Order';
import { useFinanceOrderData } from '@/components/Shared/hooks';

interface useFinanceOrderTableProps {
  submodule: EFinanceOrderModuleValues;
}
export function useFinanceOrdersTable(props: useFinanceOrderTableProps) {
  const router = useRouter();
  const {
    limit = '10',
    offset = '0',
    search = '',
    statusId = '',
    services = '',
  } = router.query;

  return useFinanceOrderData({
    submodule: props.submodule,
    limit: String(limit),
    offset: String(offset),
    search: String(search),
    statusId: String(statusId),
    services: String(services),
  });
}
