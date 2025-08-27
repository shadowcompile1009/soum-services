import css from '@styled-system/css';
import styled from 'styled-components';

import { colors } from '@src/tokens/colors';

export const FormContainer = styled.form(() =>
  css({
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    rowGap: '0.5rem',
    width: '100%',
  })
);

export const Item = styled.div(() =>
  css({
    display: 'flex',
    columnGap: '3rem',
  })
);

export const CheckboxElement = styled.input(() =>
  css({
    accentColor: colors.static.blue,
    cursor: 'pointer',
    height: '1.125rem',
    width: '1.125rem',
    borderColor: colors.static.grays[50],

    ':hover': {
      border: '1px solid',
      borderColor: 'red',
      outline: 'none !important',
    },
    ':active, :focus': {
      border: '1px solid',
      borderColor: colors.static.blue,
      outline: 'none !important',
    },
    ':disabled': {
      opacity: 1,
      borderColor: 'static.grays.50',
      color: 'static.grays.600',
      cursor: 'not-allowed',
    },
  })
);

export const CheckboxLabel = styled.label(() =>
  css({
    fontSize: '14px',
    fontWeight: 'regular',
  })
);

export const SaveButtonElement = styled.button(() =>
  css({
    backgroundColor: 'static.blue',
    borderRadius: '0.5rem',
    color: 'static.white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'regular',
    fontWeight: 'bold',
    marginTop: '1rem',
    height: '3.125rem',
    width: '100%',
    cursor: 'pointer',
  })
);

export const selectStyles = {
  placeholder: (provided: Record<string, unknown>) => ({
    ...provided,
    color: colors.static.gray,
    opacity: 0.6,
  }),
  control: (provided: Record<string, unknown>) => ({
    ...provided,
    cursor: 'pointer',
    minHeight: '2.75rem',
    lineHeight: '1.6875rem',
    width: '100%',
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSize: 18,
    boxShadow: 'none',
    borderColor: colors.static.grays[50],
    ':hover': {
      border: '1px solid',
      borderColor: colors.static.blue,
      outline: 'none !important',
    },
    ':active, :focus': {
      border: '1px solid',
      borderColor: colors.static.blue,
      outline: 'none !important',
    },
    ':disabled': {
      opacity: 1,
      borderColor: 'static.grays.50',
      color: 'static.grays.600',
    },
  }),
};

export const inputStyles = (
  placeholderStyles: Record<string, unknown>,
  padding: Record<string, unknown>
) => ({
  fontFamily:
    "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  height: 44,
  width: '100%',
  fontSize: 3,
  ...padding,
  borderRadius: 4,
  backgroundColor: 'static.white',
  border: '1px solid',
  borderColor: 'static.grays.50',
  color: 'static.black',
  '::-webkit-input-placeholder': placeholderStyles,
  '::-ms-input-placeholder': placeholderStyles,
  '::placeholder': placeholderStyles,
  transition: 'all ease',
  transitionDuration: '200ms',
  appearance: 'none',
  whiteSpace: 'normal',
  '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '&[type=number]': {
    MozAppearance: 'textfield',
  },

  ':hover': {
    border: '1px solid',
    borderColor: 'static.blue',
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
    color: 'static.grays.600',
  },
});
