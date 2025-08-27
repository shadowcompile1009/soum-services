import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';

import { Box } from '../Box';

const placeholderStyles = {
  color: 'static.gray',
  fontSize: 3,
};

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
}

export const Input = styled(Box).attrs((p) => ({
  as: (p as unknown as { as: string }).as || 'input',
}))<InputProps>((props) => {
  const padding = {
    pt: 5,
    pr: 8,
    pb: 5,
    pl: 8,
  };

  return css({
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    height: props?.height || 44,
    width: '100%',
    fontSize: 3,
    ...padding,
    borderRadius: 4,
    backgroundColor: 'static.white',
    border: '1px solid',
    borderColor: 'static.blue',
    color: 'static.black',
    '::-webkit-input-placeholder': placeholderStyles,
    '::-ms-input-placeholder': placeholderStyles,
    '::placeholder': placeholderStyles,
    transition: 'all ease',
    transitionDuration: '200ms',
    appearance: 'none',
    ...props.style,

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
