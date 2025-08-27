import styled from 'styled-components';
import css from '@styled-system/css';

import { ListingImages, Image } from '@/components/Shared/ListingImages';

import { ProductImageAction } from './ProductImageAction';
import { useListingDetails } from './hooks';

const ActionPosition = styled('div')(() =>
  css({ position: 'absolute', top: 2, left: 2 })
);

export function ProductImageSlider() {
  const { data, isLoading } = useListingDetails();

  if (isLoading) return null;

  const { images } = data!;

  const mappedImages = images.map((image) => ({
    original: image,
  })) as Image[];

  return (
    <ListingImages
      images={mappedImages}
      width="355px"
      actions={(image) => (
        <ActionPosition>
          <ProductImageAction imageName={image} />
        </ActionPosition>
      )}
    />
  );
}
