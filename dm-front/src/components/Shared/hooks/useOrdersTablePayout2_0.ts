import { useRouter } from 'next/router';

import { EOrderModules } from '@src/models/Order';
import { useOrdersDataPayout2_0 } from '@src/components/Shared/hooks';

interface useOrderTablePayout2_0Props {
  submodule: EOrderModules;
  search?: string;
}
export function useOrdersTablePayout2_0(props: useOrderTablePayout2_0Props) {
  const router = useRouter();
  const {
    limit = '10',
    offset = '0',
    search = '',
    capturestatus = '',
    replacementStatus = '',
    orderType = '',
    payoutStatus = '',
    refundStatus = '',
  } = router.query;

  return useOrdersDataPayout2_0({
    submodule: props.submodule,
    limit: String(limit),
    offset: String(offset),
    search: props.search || String(search),
    capturestatus: String(capturestatus),
    replacementStatus: String(replacementStatus),
    orderType: String(orderType),
    payoutStatus: String(payoutStatus),
    refundStatus: String(refundStatus),
  });
}
