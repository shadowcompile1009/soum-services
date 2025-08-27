import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';
import join from 'lodash.join';

import useOrderFilterStatuses from './hooks/useOrderFilterStatuses';
import FilterSelect from '../FilterSelect';

import { Option, StatusOption } from '../types';

export const DisputeStatusFilter = () => {
  const router = useRouter();

  const statuses = useOrderFilterStatuses('dispute') as StatusOption[];

  const handleOnSelect = (values: Option[]) => {
    const queryValues = values.map((value: Option) => value.name);

    if (isEmpty(queryValues)) {
      const newQuery = {
        ...router.query,
      };
      delete newQuery?.disputeStatus;

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
      ...router.query,
    };

    newQuery.disputeStatus = join(queryValues, ',');

    router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <FilterSelect
      isMulti
      options={statuses}
      handleOnSelect={handleOnSelect}
      initialValues={[]}
      placeholder="Filter by Dispute Status"
      width="16.5625rem"
    />
  );
};
