import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';
import join from 'lodash.join';

import FilterSelect from '../FilterSelect';

import { Option } from '../types';

export const OperatingModelFilter = () => {
  const router = useRouter();

  const operatingModelFilterOptions: Option[] = [
    { name: 'normal-payout', displayName: 'Normal Payout' },
    { name: 'soum-payout', displayName: 'Soum Payout' },
    { name: 'early-payout', displayName: 'Early Payout' },
  ];

  const handleOnSelect = (values: Option[]) => {
    const queryValues = values.map((value: Option) => value.name);

    if (isEmpty(queryValues)) {
      const newQuery = {
        ...router.query,
      };

      delete newQuery?.operatingModel;

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

    newQuery.operatingModel = join(queryValues, ',');

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
      options={operatingModelFilterOptions}
      handleOnSelect={handleOnSelect}
      initialValues={[]}
      placeholder="Filter by Operating Model"
      width="17.1875rem"
    />
  );
};
