import { useRouter } from 'next/router';
import { useUpfrontData } from './useUpfrontData';
import { ConsignmentStatus } from '@/models/Upfronts';

interface useOrderTableProps {
  submodule: ConsignmentStatus;
}
export function useUpfrontTable(props: useOrderTableProps) {
  const router = useRouter();
  const { limit = '10', offset = '0', search = '' } = router.query;

  return useUpfrontData({
    submodule: props.submodule,
    limit: String(limit),
    offset: String(offset),
    search: String(search),
  });
}
