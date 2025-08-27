import React, { Fragment } from 'react';

import { Button } from '../Button';
import { Stack } from '../Layouts';
import MainAddonModal from './AddonModal/MainAddonModal';

const AddonHeader = ({ refetch }: { refetch: () => void }) => {
  const [isOpenAddAddonModal, setIsOpenAddAddonModal] = React.useState(false);
  const toggleAddAddonModal = () => {
    setIsOpenAddAddonModal(!isOpenAddAddonModal);
  };

  return (
    <Fragment>
      <Stack direction="horizontal" gap="20" justify="flex-end" align="center">
        <Button variant="filled" onClick={toggleAddAddonModal}>
          Add
        </Button>
      </Stack>
      <MainAddonModal
        isOpen={isOpenAddAddonModal}
        onClose={toggleAddAddonModal}
        isLoading={false}
        refetch={refetch}
      />
    </Fragment>
  );
};

export default AddonHeader;
