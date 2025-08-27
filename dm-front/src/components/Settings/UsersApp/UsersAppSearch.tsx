import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { Box } from '@src/components/Box';

import { FormField, Input } from '../../Form';
import { SearchIcon } from '../../Form/SearchIcon';

export function UsersAppSearch() {
  const router = useRouter();
  const routerRef = useRef(router);

  const intialValue = router.query.search ?? '';
  const placeholder = 'search ...';

  const [inputValue, setInputValue] = useState(intialValue);

  routerRef.current = router;

  useEffect(() => {
    if (Object.keys(router.query).length > 0 && router.isReady) {
      router.replace(
        {
          pathname: router.pathname,
          query: {},
        },
        undefined,
        { shallow: false }
      );
      setInputValue('');
    }
  }, [routerRef]);

  function handleSearch(searchString: string | string[]) {
    if (!searchString) {
      const newQuery = {
        ...router.query,
      };
      delete newQuery?.page;
      delete newQuery?.search;
      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
    }

    if (searchString) {
      const newQuery = {
        ...router.query,
      };
      delete newQuery?.page;
      newQuery.search = searchString;
      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }

  const handleClick = () => {
    if (router.query.search && inputValue === '') {
      const newQuery = {
        ...router.query,
      };
      delete newQuery?.search;
      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: false }
      );

      setInputValue('');
      return;
    }

    handleSearch(inputValue);
  };

  function handleOnKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleSearch(inputValue);
    }
  }

  function handleOnInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setInputValue(value);
  }

  return (
    <Box cssProps={{ maxWidth: 300 }}>
      <FormField label="Search" htmlFor="search-input">
        <Box cssProps={{ position: 'relative' }}>
          <Input
            onChange={handleOnInputChange}
            onKeyUp={handleOnKeyUp}
            style={{ paddingRight: '44px' }}
            id="search-input"
            placeholder={placeholder}
            value={inputValue}
          />
          <Box
            onClick={handleClick}
            as="span"
            cssProps={{
              color: 'static.grays.10',
              position: 'absolute',
              display: 'flex',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              transition: 'color 200ms ease-in-out',
              '&:hover': {
                color: 'static.blue',
              },
            }}
          >
            <SearchIcon />
          </Box>
        </Box>
      </FormField>
    </Box>
  );
}
