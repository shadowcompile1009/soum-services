import { SharedActivityLogTable } from '../Shared/SharedActivityLogTable';
import { useOrderActivityLog } from './hooks/useOrderActivityLog';

export function OrderActivityLogTable() {
  const { isLoading, data, isError, isSuccess } = useOrderActivityLog();

  return (
    <SharedActivityLogTable
      data={data}
      isError={isError}
      isLoading={isLoading}
      isSuccess={isSuccess}
    />
  );
}
