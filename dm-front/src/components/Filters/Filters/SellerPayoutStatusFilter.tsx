import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';
import join from 'lodash.join';

import FilterSelect from '../FilterSelect';

import { Option } from '../types';

export const SellerPayoutStatusFilter = () => {
  const router = useRouter();

  const sellerPayoutStatusFilterOptions: Option[] = [
    { name: 'Key Seller', displayName: 'Key Seller' },
    { name: 'Merchant Seller', displayName: 'Merchant Seller' },
  ];

  const handleOnSelect = (values: Option[]) => {
    const queryValues = values.map((value: Option) => value.name);

    if (isEmpty(queryValues)) {
      const newQuery = {
        ...router.query,
      };
      delete newQuery?.sellerPayoutStatus;

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

    newQuery.sellerPayoutStatus = join(queryValues, '-');

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
      options={sellerPayoutStatusFilterOptions}
      handleOnSelect={handleOnSelect}
      initialValues={[]}
      placeholder="Filter by Payout Status"
      width="16.5625rem"
    />
  );
};
