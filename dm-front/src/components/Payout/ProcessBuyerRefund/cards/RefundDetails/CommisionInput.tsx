import { forwardRef } from 'react';

import { Box } from '@src/components/Box';
import { Text } from '@src/components/Text';

import { Input } from './Input';

export const CommisionInput = forwardRef<HTMLInputElement>((_, ref) => {
  return (
    <Box cssProps={{ maxWidth: 300, marginBottom: '1.7188rem' }}>
      <Text fontSize="baseText" fontWeight="bold" color="static.black">
        Seller Commission %
      </Text>
      <Box cssProps={{ position: 'relative' }}>
        <Input
          style={{ paddingRight: '44px' }}
          id="search-input"
          type="number"
          ref={ref}
          pattern="/^$|^100$|^[0-9]{1,2}$/"
        />
        <Box
          as="span"
          cssProps={{
            backgroundColor: '#6C757D',
            color: 'static.white',
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
          %
        </Box>
      </Box>
    </Box>
  );
});

CommisionInput.displayName = 'CommisionInput';
