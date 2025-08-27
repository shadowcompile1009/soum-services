import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

interface LabelWithIconProps {
  icon: React.ReactElement;
  enLabel: string;
  arLabel: string;
  active: boolean;
}

interface SubElementProps {
  active: boolean;
}

const Icon = styled.div<SubElementProps>`
  font-size: 24px;
  margin-right: 10px;
  color: ${({ active }) => (active ? '#0071F2' : '#838E8F')};
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ArLabel = styled.div<SubElementProps>`
  font-size: 14px;
  font-weight: #838E8F;
  color: ${({ active }) => (active ? '#0071F2' : '#838E8F')};
`;

const EnLabel = styled.div<SubElementProps>`
  font-size: 10px;
  color: #838E8F;
  color: ${({ active }) => (active ? '#0071F2' : '#838E8F')};
`;
const LabelWithIcon = (props: LabelWithIconProps)  => {
  const { icon, enLabel, arLabel, active } = props;
  return (
    <Container>
      <Icon active={active}>{icon}</Icon>
      <TextContainer>
        <ArLabel active={active}>{arLabel}</ArLabel>
        <EnLabel active={active}>{enLabel}</EnLabel>
      </TextContainer>
    </Container>
  );
};

export default LabelWithIcon;