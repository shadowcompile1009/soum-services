import React from 'react';

import { useRouter } from 'next/router';

import { SearchInput } from '@src/components/Form';

interface SearchFilterProps {
  placeholder?: string;
  marginBottom?: string;
  queryParam?: string;
  limit?: number;
}

export function SearchFilter(props: SearchFilterProps) {
  const { placeholder, marginBottom, limit = 3, queryParam = 'search' } = props;
  const router = useRouter();
  const { query } = router;

  function handleSearch(searchString: string) {
    const updateQuery = (newQuery: Record<string, any>) => {
      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
    };

    const newQuery = { ...query };

    if (!searchString) {
      delete newQuery[queryParam];
      updateQuery(newQuery);
      return;
    }

    if (searchString.length > limit) {
      newQuery[queryParam] = searchString;
      updateQuery(newQuery);
    }
  }

  return (
    <>
      <SearchInput
        placeholder={placeholder}
        onChange={handleSearch}
        intialValue={(router.query.search as string) || ''}
        marginBottom={marginBottom}
      />
    </>
  );
}
