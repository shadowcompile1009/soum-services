import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';
import join from 'lodash.join';

import useOrderFilterStatuses from './hooks/useOrderFilterStatuses';
import FilterSelect from '../FilterSelect';

import { StatusOption } from '../types';

export const RefundStatusFilter = () => {
  const router = useRouter();

  const refundStatuses = useOrderFilterStatuses('refund') as StatusOption[];

  const handleOnSelect = (values: StatusOption[]) => {
    const queryValues = values.map((value: StatusOption) => value.id);

    if (isEmpty(queryValues)) {
      const newQuery = {
        ...router.query,
      };

      delete newQuery?.refundStatus;

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

    newQuery.refundStatus = join(queryValues, ',');

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
      options={refundStatuses}
      handleOnSelect={handleOnSelect}
      initialValues={[]}
      placeholder="Filter by Refund Status"
      width="17.1875rem"
    />
  );
};
