import { useMutation } from '@tanstack/react-query';
import { Box } from '../Box';
import { Button } from '../Button';
import { Stack } from '../Layouts';
import { CommonModal } from '../Modal';
import { CloseIcon } from '../Shared/CloseIcon';
import { IconContainer } from '../Shared/IconContainer';
import { Text } from '../Text';
import { Story } from '@/models/Story';
import { toast } from '../Toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  storyId: string;
}

const StoriesDeleteModal = ({ isOpen, onClose, refetch, storyId }: Props) => {
  const deleteStoriesMutation = useMutation(Story.deleteStory, {
    onSuccess: () => {
      toast.success(toast.getMessage('onDeleteStorySuccess'));
      refetch();
      onClose();
    },
    onError: () => {
      toast.error(toast.getMessage('onDeleteStoryError'));
      onClose();
    },
  });
  const onSubmit = () => {
    deleteStoriesMutation.mutate(storyId);
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
            Delete story?
          </Text>
          <IconContainer color="static.black" role="button" onClick={onClose}>
            <CloseIcon />
          </IconContainer>
        </Stack>
      </Box>
      <Text fontSize="baseText" fontWeight="regular" color="static.black">
        Are you sure you want to delete the story? This will delete from admin
        and home page
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
            Ignore
          </Button>
        </Stack>
      </Box>
    </CommonModal>
  );
};

export default StoriesDeleteModal;
