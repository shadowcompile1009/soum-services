import { Suspense } from 'react';

import styled from 'styled-components';
import css from '@styled-system/css';
import dynamic from 'next/dynamic';

const UserDetails = dynamic(() => import('./UserDetails'), {
  ssr: false,
});

export const MainContent = styled.main(() =>
  css({
    '#sidebar-toggle:checked ~ &': {
      marginLeft: 35,
    },
    marginLeft: 113,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'static.grays.25',
    transition: 'margin 400ms ease',
  })
);

export const Shell = styled.div(() =>
  css({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingX: 10,
    paddingY: 15,
  })
);

interface ShellContainerProps {
  children: React.ReactNode;
}

export function ShellContainer(props: ShellContainerProps): React.ReactElement {
  return (
    <MainContent>
      <Navbar>
        <Nav>
          <Suspense fallback={`Loading...`}>
            <UserDetails />
          </Suspense>
        </Nav>
      </Navbar>
      <Shell>{props.children}</Shell>
    </MainContent>
  );
}

export const Navbar = styled.nav(() =>
  css({
    height: 33,
    backgroundColor: 'static.white',
  })
);

export const Nav = styled.div(() =>
  css({
    display: 'flex',
    height: '100%',
    justifyContent: 'flex-end',
    paddingX: 15,
  })
);
