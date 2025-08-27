import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';
import join from 'lodash.join';

import FilterSelect from '../FilterSelect';

import { Option } from '../types';

export const LogisticServicesFilter = () => {
  const router = useRouter();

  const logisticServicesFilterOptions: Option[] = [
    { name: 'SMSA – Drop Off', displayName: 'SMSA – Drop Off' },
    { name: 'B1 – Pickup', displayName: 'B1 – Pickup' },
  ];

  const handleOnSelect = (values: Option[]) => {
    const queryValues = values.map((value: Option) => value.name);

    if (isEmpty(queryValues)) {
      const newQuery = {
        ...router.query,
      };

      delete newQuery?.logisticServices;

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

    newQuery.logisticServices = join(queryValues, ',');

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
      options={logisticServicesFilterOptions}
      handleOnSelect={handleOnSelect}
      initialValues={[]}
      placeholder="Filter by Logistic Services"
      width="17.375rem"
    />
  );
};
