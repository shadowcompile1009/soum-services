import { colors } from '@src/tokens/colors';

export const selectStyles = {
  container: (provided: Record<string, unknown>) => ({
    ...provided,
    width: '16.125rem',
    height: '2.125rem',
    textAlign: 'left',
  }),
  control: (
    provided: Record<string, unknown>,
    { isDisabled }: { isDisabled: boolean }
  ) => ({
    ...provided,
    backgroundColor: isDisabled ? colors.static.grays[50] : '#6C757D',
    cursor: 'pointer',
    height: '30px',

    '&:hover': {
      borderColor: colors.static.blue,
    },
  }),
  valueContainer: (provided: Record<string, unknown>) => ({
    ...provided,
    padding: '0 0.5rem',
  }),
  input: (provided: Record<string, unknown>) => ({
    ...provided,
    cursor: 'pointer',
    margin: '0 2px',
    padding: 0,

    '&:disabled': {
      backgroundColor: 'red',
      color: 'red',
    },
  }),
  indicatorsContainer: (provided: Record<string, unknown>) => ({
    ...provided,
    height: '2.125rem',
  }),
  dropdownIndicator: (
    provided: Record<string, unknown>,
    { isDisabled }: { isDisabled: boolean }
  ) => ({
    ...provided,
    color: isDisabled ? colors.static.gray : colors.static.white,
    cursor: 'pointer',
    padding: '6px 0.5rem',
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

export const inputStyles = (
  padding: Record<string, unknown>,
  placeholderStyles: Record<string, unknown>
) => ({
  fontFamily:
    "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  height: '2.125rem',
  width: '14.125rem',
  fontSize: 'baseText',
  ...padding,
  borderRadius: 4,
  backgroundColor: '#6C757D',
  border: '1px solid',
  borderColor: 'static.blue',
  color: 'static.white',
  '::-webkit-input-placeholder': placeholderStyles,
  '::-ms-input-placeholder': placeholderStyles,
  '::placeholder': placeholderStyles,
  '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  transition: 'all ease',
  transitionDuration: '200ms',
  appearance: 'none',

  ':hover': {
    border: '1px solid',
    borderColor: 'hover.blue',
    outline: 'none !important',
  },
  ':active, :focus': {
    border: '1px solid',
    borderColor: 'static.blue',
    outline: 'none !important',
  },
  ':disabled': {
    opacity: 1,
    borderColor: 'static.grays.50',
    backgroundColor: 'static.grays.50',
    color: 'static.gray',
  },
});
