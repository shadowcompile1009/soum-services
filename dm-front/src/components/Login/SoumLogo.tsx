import css from '@styled-system/css';
import styled from 'styled-components';
import Image from 'next/image';

const SoumLogoContainer = styled.div(() =>
  css({
    height: 50,
    width: 50,
    marginBottom: 50,
  })
);

export function SoumLogo() {
  return (
    <SoumLogoContainer>
      <Image
        src="/assets/images/soum.jpg"
        width="100%"
        height="100%"
        objectFit="contain"
        alt="Soum logo"
      />
    </SoumLogoContainer>
  );
}
