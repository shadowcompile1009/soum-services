import React from 'react';
import styled from 'styled-components';
import { IconContainer } from '@/components/Shared/IconContainer';
import { RecycleBinIcon } from '@/components/Shared/RecycleBinIcon';
import { FullScreenIcon } from '@/components/Shared/FullScreenIcon';

const ImageContainer = styled('div')`
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  margin-right: 4px;
`;

const DeleteButton = styled(IconContainer)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  cursor: pointer;
  background-color: white;
`;

const ExpandButton = styled(IconContainer)`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  cursor: pointer;
  background-color: white;
`;

const StyledImage = styled('img')`
  object-fit: cover;
  width: 60px;
  height: 60px;
`;

interface ImageItemProps {
  src: string;
  alt: string;
  onDelete: () => void;
  onExpand: () => void;
}

const ImageItem: React.FC<ImageItemProps> = ({ src, alt, onDelete, onExpand }) => {
  return (
    <ImageContainer>
      <DeleteButton onClick={onDelete}>
        <RecycleBinIcon />
      </DeleteButton>
      <ExpandButton onClick={onExpand}>
        <FullScreenIcon />
      </ExpandButton>
      <StyledImage src={src} alt={alt} />
    </ImageContainer>
  );
};

export default ImageItem;

