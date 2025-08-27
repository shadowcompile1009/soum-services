import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { Box } from '@/components/Box';

import { Input } from './Input';
import { SearchIcon } from './SearchIcon';

interface SearchInputProps {
  onChange: (value: any) => void;
  intialValue: string;
  placeholder?: string;
  marginBottom?: string;
}

export function SearchInput(props: SearchInputProps) {
  const {
    onChange,
    intialValue = '',
    placeholder = 'Order Id',
    marginBottom = '1.7188rem',
  } = props;
  const router = useRouter();
  const routerRef = useRef(router);

  routerRef.current = router;

  const [inputValue, setInputValue] = useState(intialValue);

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

  function handleOnChange() {
    onChange(inputValue);
  }

  function handleOnKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onChange(inputValue);
    }
  }

  function handleOnInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setInputValue(value);
  }

  return (
    <Box cssProps={{ maxWidth: 300, marginBottom }}>
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
          onClick={handleOnChange}
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
    </Box>
  );
}
