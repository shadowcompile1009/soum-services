import styled from 'styled-components';
import css from '@styled-system/css';

export const FullBleedContainer = styled('div')(() =>
  css({
    borderBottom: '1px solid',
    borderColor: 'static.grays.10',
    margin: -10,
    padding: 10,
  })
);
