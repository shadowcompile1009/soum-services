import React, { useState } from 'react';
import styled from 'styled-components';
import ImageItem from './ImageItem';
import ImagePopup from './ImagePopup';

interface ImageGalleryProps {
  initialImages: string[];
  checkEn: string;
  itemEn: string;
  onDelete: (itemEn: string, checkEn: string, urlToDelete: string) => void;
}

const ImageContainer = styled('div')`
  display: flex;
  width: 100%;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const ImageGallery: React.FC<ImageGalleryProps> = ({ initialImages, onDelete, itemEn, checkEn }) => {
  const [popupSrc, setPopupSrc] = useState<string | null>(null);
  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleExpand = (src: string) => {
    setPopupSrc(src);
    setPopupOpen(true);
  };

  return (
    <ImageContainer>
      {initialImages.map((src: string) => (
        <ImageItem
          key={src}
          src={src}
          alt={`Image ${src}`}
          onDelete={() => onDelete(itemEn, checkEn, src)}
          onExpand={() => handleExpand(src)}
        />
      ))}
      {popupSrc && (
        <ImagePopup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} src={popupSrc} />
      )}
    </ImageContainer>
  );
};

export default ImageGallery;
