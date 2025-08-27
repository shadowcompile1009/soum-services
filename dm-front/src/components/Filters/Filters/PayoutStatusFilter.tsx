import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';
import join from 'lodash.join';

import useOrderFilterStatuses from './hooks/useOrderFilterStatuses';
import FilterSelect from '../FilterSelect';

import { StatusOption } from '../types';

export const PayoutStatusFilter = () => {
  const router = useRouter();

  const payoutStatuses = useOrderFilterStatuses('payout') as StatusOption[];

  const handleOnSelect = (values: StatusOption[]) => {
    const queryValues = values.map((value: StatusOption) => value.id);

    if (isEmpty(queryValues)) {
      const newQuery = {
        ...router.query,
      };

      delete newQuery?.payoutStatus;

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

    newQuery.payoutStatus = join(queryValues, ',');

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
      options={payoutStatuses}
      handleOnSelect={handleOnSelect}
      initialValues={[]}
      placeholder="Filter by Payout Status"
      width="17.1875rem"
    />
  );
};
