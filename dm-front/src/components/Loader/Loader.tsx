import styled, { css as styledCss, keyframes } from 'styled-components';
import css from '@styled-system/css';

import { colorTypes } from '@/types/index';

const rotate = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); } `;

interface LoaderProps {
  size?: string;
  border?: colorTypes;
  marginRight?: string;
}

export const Loader = styled('div')<LoaderProps>((props) => {
  const { size = '18px', border = 'static.white', marginRight = '5px' } = props;
  return css({
    height: size,
    width: size,
    background: 'transparent',
    position: 'relative',
    border: '1px solid transparent',
    borderColor: border,
    borderTop: '1px solid white',
    borderRadius: '50%',
    marginRight: marginRight,
  });
}, styledCss`animation: ${rotate} 500ms linear infinite`);
