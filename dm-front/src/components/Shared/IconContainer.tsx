import styled from 'styled-components';
import css from '@styled-system/css';

export const IconContainer = styled.span(
  ({ color, cursor }: { color?: string; cursor?: string }) =>
    css({
      display: 'inline-flex',
      color: color ? color : 'static.blue',
      height: 16,
      width: 16,
      justifyContent: 'center',
      alignItems: 'center',
      cursor: cursor ? cursor : '',
    })
);
