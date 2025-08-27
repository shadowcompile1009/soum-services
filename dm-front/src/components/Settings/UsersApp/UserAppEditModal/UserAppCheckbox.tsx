import React, { forwardRef } from 'react';

import { Box } from '@src/components/Box';
import { Text } from '@src/components/Text';

import { CheckboxElement, CheckboxLabel } from './styles';

interface ICheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactElement;
  id: string;
  isDisabled?: boolean;
}

export const UserAppCheckbox = forwardRef<HTMLInputElement, ICheckboxProps>(
  ({ id, label, isDisabled, ...props }, ref) => {
    return (
      <Box
        cssProps={{
          width: '100%',
          gap: '0.25rem',
        }}
      >
        <Text color="static.black" fontSize="15px" fontWeight="regular">
          {label}
        </Text>
        <Box
          cssProps={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <CheckboxElement
            ref={ref}
            id={id}
            name={id}
            type="checkbox"
            disabled={isDisabled}
            {...props}
          />
          <CheckboxLabel htmlFor={id}>Yes</CheckboxLabel>
        </Box>
      </Box>
    );
  }
);

UserAppCheckbox.displayName = 'Checkbox';
