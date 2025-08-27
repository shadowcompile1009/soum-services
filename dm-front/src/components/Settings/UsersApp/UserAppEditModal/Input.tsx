import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';

import { Box } from '@src/components/Box';
import { inputStyles } from './styles';

const placeholderStyles = {
  color: 'static.gray',
  fontSize: 3,
};

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
}

export const Input = styled(Box).attrs<any>((p) => ({
  as: (p as unknown as { as: string }).as || 'input',
  whiteSpace: 'normal',
  value: p?.value?.replace(/\s+/g, ' ').trim(),
}))<InputProps>(() => {
  const padding = {
    pt: 5,
    pr: 8,
    pb: 5,
    pl: 8,
  };

  return css(inputStyles(placeholderStyles, padding));
});
