import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const FixedComponent = styled.div`
  flex-shrink: 0;
`;

const MainComponent = styled.div`
  flex-grow: 1;
`;

interface ReactChildrenProps {
  children: React.ReactNode;
}

export function StickyHeaderFooter(
  props: ReactChildrenProps
): React.ReactElement {
  const { children } = props;
  return <Container>{children}</Container>;
}

StickyHeaderFooter.Main = MainComponent;
StickyHeaderFooter.Fixed = FixedComponent;
