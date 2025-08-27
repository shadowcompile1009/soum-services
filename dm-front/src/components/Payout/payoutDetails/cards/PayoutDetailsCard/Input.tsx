import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';

import { Box } from '@src/components/Box';

import { inputStyles } from '../../styles';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
}

export const Input = styled(Box).attrs(() => ({
  as: 'input',
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Regex pattern: matches empty string OR numbers 0-99.99 OR exactly 100
    const pattern = /^$|^100$|^(\d|[1-9]\d)(\.\d{0,2})?$/;

    if (!pattern.test(value)) {
      e.target.value = value.slice(0, -1);
    }
  },
}))<InputProps>(() => {
  const padding = {
    px: 8,
    py: 2,
  };

  const placeholderStyles = {
    color: 'static.gray',
    fontSize: 3,
  };

  return css(inputStyles(padding, placeholderStyles));
});
