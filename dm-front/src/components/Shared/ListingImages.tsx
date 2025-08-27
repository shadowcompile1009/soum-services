import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import Image from 'next/image';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { PlayCircle } from 'lucide-react';
import { FullScreenIcon } from '@/components/Shared/FullScreenIcon';
import {
  FullScreenImageGallery,
  ImageContainer,
} from '@/components/Shared/FullImageGallery';

export type Image = {
  isVideo?: boolean;
  original: string;
};
interface ListingImagesProps {
  images: Image[];
  width?: string | number;
  actions?: (image: string) => React.ReactNode;
}

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

export function ListingImages(props: ListingImagesProps) {
  const { images, width = '150px', actions } = props;
  const [isFullScreen, setIsFullScreen] = useState(false);

  const carouselRef = useRef();

  useEffect(() => {
    if (carouselRef?.current) {
      // @ts-ignore
      carouselRef.current.moveTo(0);
    }
  }, [carouselRef, images.length]);

  function handleFullScreenToggle() {
    setIsFullScreen((isFullScreen) => !isFullScreen);
  }

  return (
    <>
      <Carousel
        // @ts-ignore
        ref={carouselRef}
        showThumbs={false}
        emulateTouch
        showArrows={false}
        showStatus={false}
        width={width}
      >
        {images.map((image) => (
          <ImageContainer key={image.original}>
            {image.isVideo ? (
              <>
                <video
                  src={image.original}
                  className="object-cover w-full h-full"
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer">
                  <PlayCircle className="text-white text-3xl" />
                </div>
              </>
            ) : (
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
            )}
            <FullScreenContainer onClick={handleFullScreenToggle}>
              <FullScreenIcon />
            </FullScreenContainer>
            {actions && actions(image.original)}
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
