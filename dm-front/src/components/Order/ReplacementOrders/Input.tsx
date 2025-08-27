import { InputHTMLAttributes } from 'react';

import styled from 'styled-components';
import css from '@styled-system/css';

import { Box } from '@/components/Box';

import { inputStyles } from './styles';

const placeholderStyles = {
  color: 'static.black',
  fontSize: 'smallText',
};

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
}

export const Input = styled(Box).attrs<any>((p) => ({
  as: (p as unknown as { as: string }).as || 'input',
  whiteSpace: 'normal',
  value: p?.value?.replace(/\s+/g, ' ').trim(),
}))<InputProps>(() => {
  const padding = {
    px: 5,
  };

  return css(inputStyles(placeholderStyles, padding));
});
