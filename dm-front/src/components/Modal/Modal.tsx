import React from 'react';
import StyledModal, { BaseModalBackground } from 'styled-react-modal';
import styled from 'styled-components';
import css from '@styled-system/css';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
  width?: number | string;
  height?: number | string;
  maxHeight?: number | string;
}

export const ModalBackground = styled(BaseModalBackground)(() =>
  css({ backgroundColor: 'static.blacks.backdrop', zIndex: 200 })
);

const ModalContainer = styled('div')(
  ({
    width,
    maxHeight,
    height,
  }: {
    width: number | string | undefined;
    maxHeight: number | string | undefined;
    height: number | string | undefined;
  }) =>
    css({
      width: width || 580,
      minHeight: 240,
      maxHeight: maxHeight || 480,
      height: height ?? 'auto',
      backgroundColor: 'static.white',
      padding: 10,
      borderRadius: '0.625rem',
      overflow: 'auto',
      position: 'relative',
    })
);

export function CommonModal(props: ModalProps) {
  const { isOpen, onClose, width, maxHeight, height } = props;
  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={onClose}
      onEscapeKeydown={onClose}
    >
      <ModalContainer width={width} maxHeight={maxHeight} height={height}>
        {props.children}
      </ModalContainer>
    </StyledModal>
  );
}
