import { Stack } from '@/components/Layouts';
import { Loader } from '@/components/Loader';
import { IconContainer } from '@/components/Shared/IconContainer';
import { RecycleBinIcon } from '@/components/Shared/RecycleBinIcon';

import { ActionProps } from './Actions';

import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { useState } from 'react';
import { usePromocodeDelete } from '../hooks/usePromocodeDelete';

export function DeleteListing({ promocode }: Readonly<ActionProps>) {
  const { mutate } = usePromocodeDelete();
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleDeleteListing() {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <>
      {false ? (
        <Stack justify="center">
          <Loader size="12px" border="static.blue" />
        </Stack>
      ) : (
        <IconContainer
          color="static.red"
          role="button"
          onClick={handleDeleteListing}
        >
          <RecycleBinIcon />
        </IconContainer>
      )}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        resolve={() => {
          mutate(promocode?.id);
          handleDeleteListing();
        }}
        reject={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
