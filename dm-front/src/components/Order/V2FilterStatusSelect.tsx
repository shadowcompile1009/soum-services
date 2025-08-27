import { useMemo } from 'react';
import isEmpty from 'lodash.isempty';
import { useRouter } from 'next/router';

import { StatusGroupSelect } from '@/components/Shared/StatusGroupSelect';
import { useStatusGroup } from '@/components/Order/hooks';
import { StatusGroup } from '@/models/StatusGroup';

export function V2FilterStatusSelect(props: any) {
  const { data: statusGroups } = useStatusGroup(props.submodule);
  const router = useRouter();

  function handleOnSelect(values: StatusGroup) {
    const { query } = router;

    if (isEmpty(values)) {
      const newQuery = {
        ...query,
      };
      delete newQuery?.statusId;
      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
      return;
    }

    const newQuery = {
      ...query,
    };
    newQuery.statusId = values.id;
    router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  }

  const initialFilterStatuses = useMemo(() => {
    const { query } = router;
    const { statusId = '' } = query;

    return statusGroups?.filter((statusGroup) => statusGroup.id === statusId);
  }, [router, statusGroups]);

  if (isEmpty(statusGroups)) return null;

  return (
    <StatusGroupSelect
      options={statusGroups!}
      handleOnSelect={handleOnSelect}
      placeholder="Filter by status group"
      initialValues={initialFilterStatuses}
    />
  );
}
