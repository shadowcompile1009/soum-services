import { useRouter } from 'next/router';

import { EOrderV2ModuleValues } from '@/models/Order';
import { useOrdersDataV2 } from '@/components/Shared/hooks';

interface useOrderTableProps {
  submodule: EOrderV2ModuleValues;
}
export function useOrdersTableV2(props: useOrderTableProps) {
  const router = useRouter();
  const {
    limit = '10',
    offset = '0',
    search = '',
    statusId = '',
    services = '',
  } = router.query;

  return useOrdersDataV2({
    submodule: props.submodule,
    limit: String(limit),
    offset: String(offset),
    search: String(search),
    statusId: String(statusId),
    services: String(services),
  });
}
