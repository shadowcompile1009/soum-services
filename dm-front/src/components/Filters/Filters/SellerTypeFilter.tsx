import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';
import join from 'lodash.join';

import FilterSelect from '../FilterSelect';

import { Option } from '../types';

export const SellerTypeFilter = () => {
  const router = useRouter();

  const SellerTypeFilterOptions: Option[] = [
    { name: 'corporate-partnership', displayName: 'Corporate Partnership' },
    { name: 'soum-uae', displayName: 'Soum UAE' },
    { name: 'soum-ksa', displayName: 'Soum KSA' },
    { name: 'local-stores', displayName: 'Local Stores' },
  ];

  const handleOnSelect = (values: Option[]) => {
    const queryValues = values.map((value: Option) => value.name);

    if (isEmpty(queryValues)) {
      const newQuery = {
        ...router.query,
      };

      delete newQuery?.sellerType;

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

    newQuery.sellerType = join(queryValues, ',');

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
      options={SellerTypeFilterOptions}
      handleOnSelect={handleOnSelect}
      initialValues={[]}
      placeholder="Filter by Seller Type"
      width="14.375rem"
    />
  );
};
