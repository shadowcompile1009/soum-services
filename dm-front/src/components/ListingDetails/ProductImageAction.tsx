import { useRouter } from 'next/router';

import { Loader } from '@/components/Loader';
import { Button } from '@/components/Button';
import { IconContainer } from '@/components/Shared/IconContainer';
import { RecycleBinIcon } from '@/components/Shared/RecycleBinIcon';

import { useListingDetails, useUpdateImageMutation } from './hooks';

export function ProductImageAction({ imageName }: { imageName: string }) {
  const { data, isLoading } = useListingDetails();
  const mutation = useUpdateImageMutation();
  const router = useRouter();
  const {
    query: { listingId },
  } = router;
  if (isLoading) return null;

  function handeImageDelete() {
    const filteredImage = data?.images.filter((image) => image !== imageName);

    mutation.mutate({
      listingId: String(listingId),
      images: filteredImage ?? [],
    });
  }
  return (
    <Button variant="red_filled" type="button" onClick={handeImageDelete}>
      <IconContainer color="static.white">
        {mutation.isLoading ? (
          <Loader size="12px" border="static.blue" />
        ) : (
          <RecycleBinIcon />
        )}
      </IconContainer>
    </Button>
  );
}
