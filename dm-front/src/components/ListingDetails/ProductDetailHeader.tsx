import { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Loader } from '@/components/Loader';
import { IconContainer } from '@/components/Shared/IconContainer';
import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { RecycleBinIcon } from '@/components/Shared/RecycleBinIcon';
import { useDeleteListingMutation } from '@/components/Frontliners/hooks';
import {
  DeleteConfirmationModal,
  InvalidReason,
} from '@/components/Frontliners';
import { useAwaitableComponent } from '@/components/Shared/hooks';
import { toast } from '@/components/Toast';
import { ProductListing } from '@/models/ProductListing';
import { ImageUploadModal } from '@/components/Shared/ImageUploadModal';

import { useListingDetails, useUpdateImageMutation } from './hooks';
import { FolderIcon } from './FolderIcon';
import { ProductConditionSelect } from './ProductConditionSelect';

export function ProductDetailHeader() {
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const router = useRouter();
  const { listingId, tab } = router.query;
  const { data } = useListingDetails();
  const deleteMutation = useDeleteListingMutation();
  const updateImageMutation = useUpdateImageMutation();

  const [status, execute, resolve, reject, resetStatus] =
    useAwaitableComponent();

  function toggleImageUploadModal() {
    setIsUploadingImage((prev) => !prev);
  }

  function handleUpdateImage(files: File[]) {
    updateImageMutation.mutate({
      listingId: data?.productId!,
      images: data?.images!,
      newImages: files,
    });
  }

  async function handleDeleteListing() {
    await execute()
      .then((reason) => {
        if (!reason) {
          toast.error(toast.getMessage('onEmptyDeleteRejectReason'));
          return;
        }
        deleteMutation.mutate(
          {
            listing: data as ProductListing,
            reason: (reason as InvalidReason).value,
          },
          {
            onSuccess() {
              router.back();
            },
          }
        );
      })
      .catch(() => resetStatus());
  }
  const isConfirmDialogVisible = status === 'awaiting';

  return (
    <>
      <Stack direction="horizontal" justify="space-between">
        <Stack direction="horizontal" gap="2" align="center">
          <IconContainer>
            <FolderIcon />
          </IconContainer>
          <Text
            fontSize="baseSubtitle"
            fontWeight="semibold"
            color="static.black"
          >
            Listing Details
          </Text>
        </Stack>
        <Stack direction="horizontal" gap="2" align="center">
          {(data?.categoryName === 'Cars' ||
            data?.categoryName === 'Real Estate') && (
            <NextLink
              passHref
              href={`${listingId}/${data?.categoryName}/specification`}
            >
              <Button as="a" variant="filled">
                Add Specifications
              </Button>
            </NextLink>
          )}
          {data?.categoryName === 'Cars' ||
          data?.categoryName === 'Real Estate' ? (
            <NextLink
              passHref
              href={`${listingId}/${data?.categoryName}/inspection`}
            >
              <Button as="a" variant="green_filled">
                Add Inspection Report
              </Button>
            </NextLink>
          ) : null}
          {tab === 'consignment' && (
            <ProductConditionSelect
              categoryId={data?.categoryId}
              conditionId={data?.conditionId}
              listingId={listingId as string}
              width="200px"
            />
          )}
          <Button variant="filled" onClick={toggleImageUploadModal}>
            Upload Images
          </Button>
          <Button
            variant="red_filled"
            onClick={handleDeleteListing}
            disabled={deleteMutation.isLoading}
          >
            <IconContainer color="static.white">
              {deleteMutation.isLoading ? (
                <Loader size="12px" border="static.blue" />
              ) : (
                <RecycleBinIcon />
              )}
            </IconContainer>
            <span>Delete Listing</span>
          </Button>
        </Stack>
      </Stack>
      <DeleteConfirmationModal
        isOpen={isConfirmDialogVisible}
        resolve={resolve}
        reject={reject}
      />
      <ImageUploadModal
        isOpen={isUploadingImage}
        onClose={toggleImageUploadModal}
        onSave={handleUpdateImage}
        isLoading={updateImageMutation.isLoading}
      />
    </>
  );
}
