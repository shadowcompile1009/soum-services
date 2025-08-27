import styled from 'styled-components';
import {
  typography,
  color,
  TypographyProps,
  ColorProps,
  width,
} from 'styled-system';

import { textTypes, colorTypes } from '@/types';

export interface TextProps extends TypographyProps, ColorProps {
  fontSize: textTypes | string;
  fontWeight: textTypes;
  color: colorTypes;
  width?: React.CSSProperties['width'];
  inline?: boolean;
}

export const Text = styled.p<TextProps>`
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  ${typography}
  ${color}
  ${width}
  ${({ inline }) => (inline ? 'display: inline' : 'display: block')}
`;

export const SpanText = styled.span<TextProps>`
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  ${typography}
  ${color}
${width}
${({ inline }) => (inline ? 'display: inline' : 'display: block')}
`;
