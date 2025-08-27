import React from 'react';
import { Box } from '@src/components/Box';
import { Text } from '@src/components/Text';
import { Input } from './Input';

interface UserAppInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: string;
  placeholder?: string;
  isDisabled?: boolean;
}

export const UserAppInput = React.forwardRef<
  HTMLInputElement,
  UserAppInputProps
>(({ label, type, placeholder, isDisabled, ...props }, ref) => {
  return (
    <Box
      cssProps={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        width: '100%',
      }}
    >
      <Text color="static.black" fontSize="15px" fontWeight="regular">
        {label}
      </Text>
      <Input
        ref={ref}
        type={type}
        placeholder={placeholder}
        {...props}
        disabled={isDisabled}
      />
    </Box>
  );
});

UserAppInput.displayName = 'UserAppInput';
