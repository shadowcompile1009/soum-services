import styled from 'styled-components';
import css from '@styled-system/css';

import { Box } from '@src/components/Box';

const placeholderStyles = {
  color: 'static.white',
  fontSize: 'regularText',
};

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
}

export const Input = styled(Box).attrs((p) => ({
  as: (p as unknown as { as: string }).as || 'input',
}))<InputProps>(() => {
  const padding = {
    pt: 3,
    pr: 2,
    pb: 3,
    pl: 4,
  };

  return css({
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    height: 38,
    width: '18rem',
    fontSize: 'regularText',
    ...padding,
    borderRadius: 4,
    backgroundColor: '#6C757D',
    border: '1px solid',
    borderColor: 'static.blue',
    color: '#fff',
    '::-webkit-input-placeholder': placeholderStyles,
    '::-ms-input-placeholder': placeholderStyles,
    _placeholder: placeholderStyles,
    '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    '&[type=number]': {
      MozAppearance: 'textfield',
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
});
