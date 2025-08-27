import styled from 'styled-components';
import css from '@styled-system/css';
import Image from 'next/image';

interface ActualImageProps {
  imageUrl: string;
  width?: number;
  height?: number;
}

const ImageContainer = styled('div')(() => {
  return css({
    borderRadius: 8,
    overflow: 'hidden',
  });
});

export function ActualImage(props: ActualImageProps) {
  const { imageUrl, width = 150, height = 150 } = props;
  return (
    <ImageContainer>
      <Image
        objectFit="contain"
        alt="Actual product image"
        width={width}
        height={height}
        src={imageUrl}
        unoptimized
        layout="fixed"
      />
    </ImageContainer>
  );
}
