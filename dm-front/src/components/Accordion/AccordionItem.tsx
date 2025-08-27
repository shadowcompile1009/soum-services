import { useState } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';

import { CaretIcon } from '@/components/Shared/CaretIcon';
import { CaretIconContainer } from '@/components/Shared/CaretIconContainer';
import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';

const AccordionContainer = styled.div(() =>
  css({
    borderRadius: 8,
    border: '1px solid',
    borderColor: 'static.grays.100',
    backgroundColor: 'static.white',
    overflow: 'hidden',
  })
);

const AccordionHeader = styled.div<{ isOpen: boolean }>(({ isOpen }) =>
  css({
    backgroundColor: 'static.grays.25',
    borderBottom: isOpen ? '1px solid' : null,
    borderColor: isOpen ? 'static.gray' : null,
    paddingX: 12,
    paddingY: 8,
  })
);

const AccordionBody = styled.div(() =>
  css({
    paddingX: 12,
    paddingY: 8,
    overflow: 'hidden',
  })
);

interface AccordionItemProps {
  heading: string;
  children: React.ReactNode;
  onToggle?: (isOpen: boolean) => void;
}
export function AccordionItem(props: AccordionItemProps) {
  const { heading, children, onToggle } = props;
  const [isOpen, setIsOpen] = useState(true);

  function toggleOpen() {
    setIsOpen((isOpen) => !isOpen);
    if (onToggle) {
      onToggle(!isOpen);
    }
  }

  return (
    <AccordionContainer>
      <AccordionHeader onClick={toggleOpen} isOpen={isOpen}>
        <Stack direction="horizontal" justify="space-between">
          <Text fontSize="baseText" fontWeight="baseText" color="static.black">
            {heading}
          </Text>
          <CaretIconContainer open={isOpen}>
            <CaretIcon />
          </CaretIconContainer>
        </Stack>
      </AccordionHeader>

      {isOpen && <AccordionBody>{children}</AccordionBody>}
    </AccordionContainer>
  );
}
