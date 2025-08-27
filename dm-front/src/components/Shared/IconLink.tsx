import styled from 'styled-components';
import css from '@styled-system/css';

export const IconLink = styled.a(() =>
  css({
    color: 'static.grays.10',
    cursor: 'pointer',
    transition: 'color 150ms ease-in-out',
    '&:hover': {
      color: 'static.blue',
    },
  })
);
