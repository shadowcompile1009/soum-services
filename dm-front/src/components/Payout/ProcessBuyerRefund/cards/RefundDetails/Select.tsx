import { forwardRef } from 'react';

import Select from 'react-select';

import { Text } from '@src/components/Text';
import { Box } from '@src/components/Box';

import { selectStyles } from './styles';

type FilterSelectProps = {
  initialValues?: string[];
  placeholder?: string;
  isDisabled?: boolean;
  label: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  error?: string;
};

export const UserAppEditSelect = forwardRef<any, FilterSelectProps>(
  (props, ref) => {
    const {
      options,
      label,
      isDisabled,
      placeholder,
      value,
      onChange,
      name,
      error,
    } = props;

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
        <Select
          ref={ref}
          name={name}
          key={`${name}-${value}`}
          options={options}
          placeholder={placeholder}
          styles={selectStyles as any}
          isDisabled={isDisabled}
          classNamePrefix="select"
          value={options.find((option) => option.value === value)}
          onChange={(selectedOption) =>
            onChange && onChange(selectedOption?.value ?? '')
          }
        />
        {error && (
          <Text color="static.red" fontSize="small" fontWeight="regular">
            {error}
          </Text>
        )}
      </Box>
    );
  }
);

UserAppEditSelect.displayName = 'UserAppEditSelect';
