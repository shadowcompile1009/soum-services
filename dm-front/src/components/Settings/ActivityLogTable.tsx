import { SharedActivityLogTable } from '../Shared/SharedActivityLogTable';
import { useActivityLog } from './hooks/useActivityLog';

export function ActivityLogTable() {
  const { isLoading, data, isError, isSuccess } = useActivityLog();

  return (
    <SharedActivityLogTable
      data={data}
      isError={isError}
      isLoading={isLoading}
      isSuccess={isSuccess}
    />
  );
}
