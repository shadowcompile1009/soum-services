import styled from 'styled-components';
import css from '@styled-system/css';

export interface StackProps {
  gap?: string; // theme.space token
  direction?: 'horizontal' | 'vertical';
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
  inline?: boolean;
  flex?: React.CSSProperties['alignItems'];
  marginBottom?: React.CSSProperties['marginBottom'];
  flexWrap?: React.CSSProperties['flexWrap'];
  rowGap?: React.CSSProperties['columnGap'];
  borderBottom?: React.CSSProperties['borderBottom'];
  padding?: React.CSSProperties['padding'];
  margin?: React.CSSProperties['margin'];
  objectFit?: React.CSSProperties['objectFit'];
  width?: React.CSSProperties['width'];
}

export const Stack = styled('div')<StackProps>(
  ({
    gap = 0,
    direction = 'horizontal',
    justify,
    align,
    inline,
    flex,
    marginBottom = 0,
    flexWrap,
    rowGap,
    borderBottom,
    padding,
    margin,
    objectFit,
    width,
  }) =>
    css({
      display: inline ? 'inline-flex' : 'flex',
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      justifyContent: justify,
      alignItems: align,
      marginBottom: marginBottom,
      flex,
      flexWrap,
      rowGap,
      borderBottom,
      padding,
      gap,
      margin,
      objectFit,
      width,
    })
);
