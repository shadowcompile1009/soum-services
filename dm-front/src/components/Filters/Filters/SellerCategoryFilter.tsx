import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';
import join from 'lodash.join';

import FilterSelect from '../FilterSelect';

import { Option } from '../types';

export const SellerCategoryFilter = () => {
  const router = useRouter();

  const sellerCategoryFilterOptions: Option[] = [
    { name: 'FBS Seller', displayName: 'FBS Seller' },
    { name: 'Merchant/Local Seller', displayName: 'Merchant/Local Seller' },
  ];

  const handleOnSelect = (values: Option[]) => {
    const queryValues = values.map((value: Option) => value.name);

    if (isEmpty(queryValues)) {
      const newQuery = {
        ...router.query,
      };
      delete newQuery?.sellerCategory;

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

    newQuery.sellerCategory = join(queryValues, ',');

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
      options={sellerCategoryFilterOptions}
      handleOnSelect={handleOnSelect}
      initialValues={[]}
      placeholder="Filter by Seller Category"
      width="16.5625rem"
    />
  );
};
