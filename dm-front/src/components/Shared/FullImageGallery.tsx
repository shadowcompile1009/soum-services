import styled from 'styled-components';
import css from '@styled-system/css';
import Image from 'next/image';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import { CommonModal } from '@/components/Modal';
import { PlayCircle } from 'lucide-react';
import { useRef, useState } from 'react';

type Image = {
  original: string;
  isVideo?: boolean;
};

interface FullScreenImageGalleryProps {
  onClose: () => void;
  isOpen: boolean;
  images: Image[];
}

const Center = styled('div')(() => {
  return css({
    display: 'flex',
    justifyContent: 'center',
  });
});

export const ImageContainer = styled('div')(() => {
  return css({
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  });
});

export function FullScreenImageGallery(props: FullScreenImageGalleryProps) {
  const { onClose, isOpen, images } = props;
  const videoRef = useRef<Array<HTMLVideoElement | null>>([]);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const handlePlay = (index: number) => {
    const video = videoRef.current[index];
    if (video) {
      video.play();
      setIsPlaying(index);
    }
  };
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
          {images.map((image, index) => (
            <ImageContainer key={image.original}>
              {image.isVideo ? (
                <>
                  <video
                    ref={(el) => (videoRef.current[index] = el)}
                    src={image.original}
                    className="object-cover w-full h-full"
                    muted
                    controls
                    onPlay={() => setIsPlaying(index)}
                    onPause={() => setIsPlaying(null)}
                  />
                  {isPlaying !== index && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer"
                      onClick={() => handlePlay(index)}
                    >
                      <PlayCircle className="text-white text-3xl" />
                    </div>
                  )}
                </>
              ) : (
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
              )}
            </ImageContainer>
          ))}
        </Carousel>
      </Center>
    </CommonModal>
  );
}
