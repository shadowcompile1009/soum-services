import { Box } from '@src/components/Box';
import { Text } from '@src/components/Text';
import { SpanText } from '@src/components/Text/Text';
import React from 'react';

export const PaymentBreakdownItem = ({
  amount,
  text,
  final,
}: {
  amount: string;
  text: string;
  final?: boolean;
}) => {
  return (
    <Box
      cssProps={{
        backgroundColor: final ? 'static.black' : '#6c757d13',
        borderRadius: '0.4375rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '0.5rem 0.75rem 0.4375rem 0.75rem',
        width: '11.25rem',
      }}
    >
      <Text
        fontWeight="bold"
        fontSize="1.5rem"
        color={final ? 'static.white' : 'static.black'}
      >
        {amount}{' '}
        <SpanText
          fontWeight="bold"
          fontSize="baseText"
          color={final ? 'static.white' : 'static.black'}
          inline
        >
          SAR
        </SpanText>
      </Text>
      <Text
        fontWeight="regular"
        fontSize="smallestText"
        color={final ? 'static.white' : 'static.black'}
      >
        {text}
      </Text>
    </Box>
  );
};
