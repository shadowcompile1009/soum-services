import { useState } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import Image from 'next/image';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import { CommonModal } from '@/components/Modal';

type Image = {
  original: string;
};
interface ListingImageProps {
  images: Image[];
}

const ImageContainer = styled('div')(() => {
  return css({
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  });
});

const Center = styled('div')(() => {
  return css({
    display: 'flex',
    justifyContent: 'center',
  });
});

const FullScreenContainer = styled('span')(() => {
  return css({
    color: 'static.white',
    position: 'absolute',
    top: 1,
    display: 'inline-block',
    height: '24px',
    width: '24px',
    right: 1,
    cursor: 'pointer',

    '&:hover': {
      transform: 'scale(1.1)',
      transition: 'all ease-in-out 200ms',
    },
  });
});

function FullScreen() {
  return (
    <svg
      className="image-gallery-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
    </svg>
  );
}

interface FullScreenImageGalleryProps {
  onClose: () => void;
  isOpen: boolean;
  images: Image[];
}

function FullScreenImageGallery(props: FullScreenImageGalleryProps) {
  const { onClose, isOpen, images } = props;
  return (
    <CommonModal onClose={onClose} isOpen={isOpen}>
      <Center>
        <Carousel
          showThumbs={false}
          emulateTouch
          showArrows={false}
          showStatus={false}
          width="550px"
        >
          {images.map((image) => (
            <ImageContainer key={image.original}>
              <Image
                key={image.original}
                objectFit="contain"
                alt="Actual product image"
                width="100%"
                height="100%"
                src={image.original}
                unoptimized
                layout="responsive"
              />
            </ImageContainer>
          ))}
        </Carousel>
      </Center>
    </CommonModal>
  );
}

export function ListingImage(props: ListingImageProps) {
  const { images } = props;
  const [isFullScreen, setIsFullScreen] = useState(false);

  function handleFullScreenToggle() {
    setIsFullScreen((isFullScreen) => !isFullScreen);
  }

  return (
    <>
      <Carousel
        showThumbs={false}
        emulateTouch
        showArrows={false}
        showStatus={false}
        width="150px"
      >
        {images.map((image) => (
          <ImageContainer key={image.original}>
            <Image
              key={image.original}
              objectFit="cover"
              alt="Actual product image"
              width="100%"
              height="100%"
              src={image.original}
              unoptimized
              layout="responsive"
            />
            <FullScreenContainer onClick={handleFullScreenToggle}>
              <FullScreen />
            </FullScreenContainer>
          </ImageContainer>
        ))}
      </Carousel>
      <FullScreenImageGallery
        images={images}
        isOpen={isFullScreen}
        onClose={handleFullScreenToggle}
      />
    </>
  );
}
