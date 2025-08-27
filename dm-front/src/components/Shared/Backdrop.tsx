import styled from 'styled-components';
import css from '@styled-system/css';

export const Backdrop = styled('div')(() =>
  css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  })
);
