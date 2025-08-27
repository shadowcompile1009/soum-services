import css from '@styled-system/css';
import styled from 'styled-components';

export const FooterContainer = styled.div(() =>
  css({
    display: 'flex',
    height: 80,
    paddingX: 10,
    paddingY: 10,
  })
);

export const MainContainer = styled.div(() =>
  css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    maxWidth: 210,
    margin: '0 auto',
  })
);
