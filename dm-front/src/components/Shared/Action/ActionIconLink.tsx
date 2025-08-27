import styled from 'styled-components';
import css from '@styled-system/css';

export const ActionIconLink = styled.a(() =>
  css({
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    transition: 'color 150ms ease-in-out',
    gap: 1,
  })
);
