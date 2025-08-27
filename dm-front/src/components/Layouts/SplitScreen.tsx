import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import Image from 'next/image';

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  min-height: 100%;
`;

const Halves = styled.div`
  flex: 1;
`;

const RightHalf = styled(Halves)(() =>
  css({
    backgroundColor: 'static.white',
  })
);

const LeftHalfWithoutImage = styled(Halves)(() =>
  css({
    backgroundColor: 'static.blue',
    position: 'relative',
  })
);

interface ReactChildrenProps {
  children: React.ReactNode;
}

export function SplitScreen(props: ReactChildrenProps): React.ReactElement {
  const { children } = props;

  return <Container>{children}</Container>;
}

SplitScreen.RightHalf = RightHalf;

SplitScreen.LeftHalf = function LeftHalf(): React.ReactElement {
  return (
    <LeftHalfWithoutImage>
      <Image
        src="/assets/images/sign_bg.jpg"
        layout="fill"
        objectFit="cover"
        quality={50}
        alt="Soum sign in background"
      />
    </LeftHalfWithoutImage>
  );
};
