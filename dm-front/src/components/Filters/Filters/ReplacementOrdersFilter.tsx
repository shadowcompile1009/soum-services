import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';

import FilterSelect from '../FilterSelect';

import { Option } from '../types';

export const ReplacementOrdersFilter = () => {
  const router = useRouter();

  const replacementStatusFilterOptions: Option[] = [
    { name: 'replaced', displayName: 'Order Replaced' },
    { name: 'not-replaced', displayName: 'Order Not Replaced' },
  ];

  const handleOnSelect = (option: Option) => {
    const value = option?.name;

    if (isEmpty(value)) {
      const newQuery = {
        ...router.query,
      };

      delete newQuery?.replacementStatus;

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

    newQuery.replacementStatus = value;

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
      options={replacementStatusFilterOptions}
      handleOnSelect={handleOnSelect}
      initialValues={[]}
      placeholder="Filter by Order Status"
      width="15rem"
    />
  );
};
