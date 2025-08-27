import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';
import join from 'lodash.join';

import FilterSelect from '../FilterSelect';

import useOrderFilterStatuses from './hooks/useOrderFilterStatuses';

import { StatusOption } from '../types';

export const OrderStatusFilter = () => {
  const router = useRouter();
  const orderStatuses = useOrderFilterStatuses('order') as StatusOption[];

  const handleOnSelect = (values: StatusOption[]) => {
    const queryValues = values.map((value: StatusOption) => value.id);

    if (isEmpty(queryValues)) {
      const newQuery = {
        ...router.query,
      };
      delete newQuery?.orderStatus;

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

    newQuery.orderStatus = join(queryValues, ',');

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
      options={orderStatuses}
      handleOnSelect={handleOnSelect}
      placeholder="Filter by Order Status"
      width="16.5625rem"
    />
  );
};
