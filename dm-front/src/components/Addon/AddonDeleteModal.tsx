import { useMutation } from '@tanstack/react-query';
import { Box } from '../Box';
import { Button } from '../Button';
import { Stack } from '../Layouts';
import { CommonModal } from '../Modal';
import { CloseIcon } from '../Shared/CloseIcon';
import { IconContainer } from '../Shared/IconContainer';
import { Text } from '../Text';
import { Addon } from '@/models/Addon';
import { toast } from '../Toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  addonId: string;
  refetch: () => void;
}

const AddonDeleteModal = ({ isOpen, onClose, addonId, refetch }: Props) => {
  const { mutate: deleteAddon } = useMutation(Addon.deleteAddons, {
    onSuccess() {
      toast.success(toast.getMessage('onDeleteAddonSuccess'));
      onClose();
      refetch();
    },
    onError() {
      toast.error(toast.getMessage('onDeleteAddonError'));
    },
  });
  const onSubmit = () => {
    deleteAddon({
      addonId,
    });
  };
  return (
    <CommonModal onClose={onClose} isOpen={isOpen} width={656} height={168}>
      <Box
        cssProps={{
          marginBottom: '20px',
        }}
      >
        <Stack justify="space-between" align="center">
          <Text
            fontWeight="regular"
            fontSize="bigSubtitle"
            color="static.black"
          >
            Delete add on
          </Text>
          <IconContainer color="static.black" role="button" onClick={onClose}>
            <CloseIcon />
          </IconContainer>
        </Stack>
      </Box>
      <Text fontSize="baseText" fontWeight="regular" color="static.black">
        Are you sure you want to delete this add on?
      </Text>
      <Box marginTop={10}>
        <Stack gap="10">
          <Button
            type="button"
            variant="red_filled"
            fontWeight="semibold"
            onClick={onSubmit}
          >
            Delete
          </Button>
          <Button
            type="button"
            variant="filled"
            fontWeight="semibold"
            onClick={onClose}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </CommonModal>
  );
};

export default AddonDeleteModal;
