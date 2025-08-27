import React from 'react';

import styled from 'styled-components';
import css from '@styled-system/css';

import { inputStyles } from './styles';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  value?: string | number; // explicitly add value prop
}

// Change from Box to direct styled.input
export const Input = styled('input')<InputProps>(() => {
  const padding = {
    px: 8,
    py: 0,
  };

  const placeholderStyles = {
    color: 'static.gray',
    fontSize: 3,
  };

  return css(inputStyles(padding, placeholderStyles));
});
