import styled from 'styled-components';
import css from '@styled-system/css';

export const IconContainer = styled('span')(({ color }) =>
  css({
    display: 'inline-block',
    color: color ? color : 'static.blue',
    height: 24,
    width: 24,
  })
);
