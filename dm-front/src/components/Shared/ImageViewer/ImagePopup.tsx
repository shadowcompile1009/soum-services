import React from 'react';
import styled from 'styled-components';
import { CommonModal } from '@/components/Modal'; // Assuming you're using a modal component

const PopupImage = styled('img')`
  width: 600px;
  height: 600px;
`;

interface ImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ isOpen, onClose, src }) => {
  return (
    <CommonModal onClose={onClose} isOpen={isOpen}>
      <PopupImage src={src} alt="Expanded view" />
    </CommonModal>
  );
};

export default ImagePopup;
