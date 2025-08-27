import { OrderV3 } from '@src/models/Order';
import { useQuery } from '@tanstack/react-query';

const useFinanceReasons = () => {
  return useQuery({
    queryKey: ['finance-reasons'],
    queryFn: () => OrderV3.getFinanceReasons(),
  });
};

export default useFinanceReasons;
