import React from 'react';

import { Text } from '@/components/Text';

import { InputProps } from './Input';
import { Label } from './Label';

import { Box } from '@/components/Box';
import { Stack } from '@/components/Layouts';

interface FormFieldProps extends InputProps {
  htmlFor: string;
  label?: string;
  error?: string;
}

export function FormField(props: FormFieldProps): React.ReactElement {
  const { label, htmlFor, error } = props;

  return (
    <Stack direction="vertical" gap="4">
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {props.children}
      {error ? (
        <Text
          fontSize="smallText"
          fontWeight="smallText"
          color="static.red"
          as="span"
        >
          {' '}
          {error}
        </Text>
      ) : (
        <Box
          cssProps={{
            opacity: 0,
            fontSize: 'smallText',
            fontWeight: 'smallText',
          }}
        >
          spacer
        </Box>
      )}
    </Stack>
  );
}
