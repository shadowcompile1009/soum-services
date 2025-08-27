import { useRouter } from 'next/router';

import { EOrderV3ModuleValues } from '@src/models/Order';
import { useOrdersDataV3 } from '@src/components/Shared/hooks';

interface useOrderTableProps {
  submodule: EOrderV3ModuleValues;
}

export function useOrdersTableV3(props: useOrderTableProps) {
  const router = useRouter();
  const {
    limit = '30',
    offset = '0',
    search = '',
    statusId = '',
    services = '',
    start = '',
    end = '',
    operatingModel = '',
    orderType = '',
    sellerCategory = '',
    sellerType = '',
    orderStatus = '',
    disputeStatus = '',
  } = router.query;

  return useOrdersDataV3({
    submodule: props.submodule,
    limit: String(limit),
    offset: String(offset),
    search: String(search),
    statusId: String(statusId),
    services: String(services),
    start: String(start),
    end: String(end),
    operatingModel: String(operatingModel),
    orderType: String(orderType),
    sellerCategory: String(sellerCategory),
    sellerType: String(sellerType),
    orderStatus: String(orderStatus),
    disputeStatus: String(disputeStatus),
  });
}
