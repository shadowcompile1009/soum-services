import { colors } from '@src/tokens/colors';

export const selectStyles = {
  container: (provided: Record<string, unknown>) => ({
    ...provided,
    minWidth: '18.75rem',
    textAlign: 'left',
    paddingLeft: '0.75rem',
  }),
  control: (
    provided: Record<string, unknown>,
    { isDisabled }: { isDisabled: boolean }
  ) => ({
    ...provided,
    backgroundColor: isDisabled ? colors.static.grays[50] : '#6C757D',
    cursor: 'pointer',

    '&:hover': {
      borderColor: colors.static.blue,
    },
  }),
  input: (provided: Record<string, unknown>) => ({
    ...provided,
    cursor: 'pointer',

    '&:disabled': {
      backgroundColor: 'red',
      color: 'red',
    },
  }),
  dropdownIndicator: (
    provided: Record<string, unknown>,
    { isDisabled }: { isDisabled: boolean }
  ) => ({
    ...provided,
    color: isDisabled ? colors.static.gray : colors.static.white,
    cursor: 'pointer',
  }),
  placeholder: (
    provided: Record<string, unknown>,
    { isDisabled }: { isDisabled: boolean }
  ) => ({
    ...provided,
    color: isDisabled ? colors.static.gray : colors.static.white,
  }),
  option: (provided: Record<string, unknown>) => ({
    ...provided,
    backgroundColor: '#6C757D',
    color: colors.static.white,
    cursor: 'pointer',
  }),
  singleValue: (
    provided: Record<string, unknown>,
    { isDisabled }: { isDisabled: boolean }
  ) => ({
    ...provided,
    color: isDisabled ? colors.static.gray : colors.static.white,
  }),
};
