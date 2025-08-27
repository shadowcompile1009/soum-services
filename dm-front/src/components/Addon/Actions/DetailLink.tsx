import { useState } from 'react';

import { Button } from '@src/components/Button';
import { EditIcon } from '@src/components/Shared/Action/EditIcon';
import { DeleteIcon } from '@src/components/Shared/DeleteIcon';
import { IconContainer } from '@src/components/Shared/IconContainer';
import { IAddon } from '@src/models/Addon';

import AddonDeleteModal from '../AddonDeleteModal';
import MainAddonModal from '../AddonModal/MainAddonModal';

export const DetailEditLink = ({
  addon,
  refetch,
}: {
  addon: IAddon;
  refetch: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleAddAddonModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button
        onClick={toggleAddAddonModal}
        variant="outline"
        cssProps={{ padding: 0 }}
      >
        <IconContainer>
          <EditIcon />
        </IconContainer>
      </Button>
      <MainAddonModal
        isOpen={isOpen}
        onClose={toggleAddAddonModal}
        isLoading={false}
        addon={addon}
        refetch={refetch}
      />
    </>
  );
};

export const DetailDeleteLink = ({
  addonId,
  refetch,
}: {
  addonId: string;
  refetch: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleModalDelete = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button
        variant="outline"
        cssProps={{ padding: 0 }}
        onClick={handleToggleModalDelete}
      >
        <IconContainer color="static.red">
          <DeleteIcon />
        </IconContainer>
      </Button>
      <AddonDeleteModal
        refetch={refetch}
        isOpen={isOpen}
        onClose={handleToggleModalDelete}
        addonId={addonId}
      />
    </>
  );
};
