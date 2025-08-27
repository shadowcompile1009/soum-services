import styled from 'styled-components';
import css from '@styled-system/css';
import deepmerge from 'deepmerge';

import { textTypes } from '@/types/index';

export type ButtonVariants =
  | 'filled'
  | 'outline'
  | 'darkFilled'
  | 'red_filled'
  | 'purple_filled'
  | 'green_filled'
  | 'bordered'
  | 'gray_filled';

export interface ButtonProps {
  fontSize?: textTypes;
  fontWeight?: textTypes;
  cssProps?: Record<string, unknown>;
  variant: ButtonVariants;
  paddingX?: number | string;
  paddingY?: number | string;
}

const variantStyles = {
  filled: {
    backgroundColor: 'static.blue',
    color: 'static.white',
    border: '1px solid transparent',
    textWrap: 'nowrap',
    '&:active': {
      backgroundColor: 'static.blue',
    },
    '&:hover': {
      backgroundColor: 'hover.blue',
    },
    '&:disabled': {
      backgroundColor: 'static.grays.50',
      color: 'static.gray',
    },
  },
  darkFilled: {
    backgroundColor: 'static.black',
    color: 'static.white',
    border: '1px solid transparent',
    '&:active': {
      backgroundColor: 'static.blue',
    },
    '&:hover': {
      backgroundColor: 'hover.blue',
    },
    '&:disabled': {
      backgroundColor: 'static.grays.50',
      color: 'static.gray',
      cursor: 'not-allowed',
    },
  },
  red_filled: {
    backgroundColor: 'static.red',
    color: 'static.white',
    border: '1px solid transparent',
    '&:active': {
      backgroundColor: 'static.reds.300',
    },
    '&:hover': {
      backgroundColor: 'static.reds.300',
    },
    '&:disabled': {
      backgroundColor: 'static.grays.50',
      color: 'static.gray',
      cursor: 'not-allowed',
    },
  },
  purple_filled: {
    width: 100,
    backgroundColor: 'static.purple',
    color: 'static.black',
    fontWeight: 'semibold',
    border: '1px solid transparent',
    '&:active': {
      backgroundColor: 'static.blue',
    },
    '&:hover': {
      backgroundColor: 'hover.purple',
    },
    '&:disabled': {
      backgroundColor: 'static.grays.50',
      color: 'static.gray',
    },
  },
  green_filled: {
    width: 130,
    backgroundColor: 'static.greens.500',
    color: 'static.white',
    fontWeight: 'semibold',
    border: '1px solid transparent',
    '&:active': {
      backgroundColor: 'static.greens.300',
    },
    '&:hover': {
      backgroundColor: 'hover.greens.300',
    },
    '&:disabled': {
      backgroundColor: 'static.grays.50',
      color: 'static.gray',
    },
  },
  gray_filled: {
    backgroundColor: 'static.grays.50',
    color: 'static.black',
    border: '1px solid transparent',
    '&:active': {
      color: 'static.blue',
      backgroundColor: 'static.white',
      borderColor: 'static.blue',
    },
    '&:hover': {
      color: 'static.blue',
      backgroundColor: 'static.white',
      borderColor: 'static.blue',
    },
  },
  outline: {
    border: 'none',
    color: 'static.blue',
    '&:active': {
      color: 'static.blue',
    },
    '&:hover': {
      color: 'hover.blue',
    },
  },
  bordered: {
    border: '1px solid',
    borderColor: '#D0D4D9',
    color: 'static.black',

    '&:active': {
      color: 'static.gray',
    },
    '&:hover': {
      color: 'static.grays.500',
    },
  },
};

const commonStyles = ({
  paddingX,
  paddingY,
}: {
  paddingX?: number | string;
  paddingY?: number | string;
}) => ({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 'none', // as a flex child
  cursor: 'pointer',
  fontFamily:
    "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  paddingX: paddingX || 5,
  paddingY: paddingY || 3,
  lineHeight: 1.5,
  textDecoration: 'none',
  borderRadius: 4,
  width: 'fit-content',
  alignSelf: 'flex-end',

  '> *': {
    cursor: 'pointer',
  },
  '> *:not(:last-child)': {
    marginRight: 5,
  },

  position: 'relative',
  ':focus': {
    outline: 'none',
  },
});

export const Button = styled('button')<ButtonProps>((props) => {
  const { fontSize = 'baseText', fontWeight = 'baseText', variant } = props;

  const cssProps = props.cssProps || ({} as Record<string, unknown>);

  const styles = deepmerge.all([
    commonStyles({ paddingX: props.paddingX, paddingY: props.paddingY }),
    variantStyles[variant],
    cssProps,
  ]);
  return css({
    fontSize,
    fontWeight,
    ...styles,
  });
});
