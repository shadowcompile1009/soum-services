import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';
import join from 'lodash.join';

import FilterSelect from '../FilterSelect';

import { Option } from '../types';

export const OrderTypeFilter = () => {
  const router = useRouter();

  const orderTypeFilterOptions: Option[] = [
    { name: 'R-R', displayName: 'R-R' },
    { name: 'R-O', displayName: 'R-O' },
    { name: 'S-O', displayName: 'S-O' },
    { name: 'S-R', displayName: 'S-R' },
    { name: 'CROSS', displayName: 'CROSS' },
    { name: 'SAME CITY', displayName: 'SAME CITY' },
  ];

  const handleOnSelect = (values: Option[]) => {
    const queryValues = values.map((value: Option) => value.name);

    if (isEmpty(queryValues)) {
      const newQuery = {
        ...router.query,
      };
      delete newQuery?.orderType;

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

    newQuery.orderType = join(queryValues, ',');

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
      options={orderTypeFilterOptions}
      handleOnSelect={handleOnSelect}
      initialValues={[]}
      placeholder="Filter by Order Type"
      width="14.375rem"
    />
  );
};
