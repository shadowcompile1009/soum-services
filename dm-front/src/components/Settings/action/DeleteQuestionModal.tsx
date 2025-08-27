import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import { Setting } from '@/models/Setting';
import { useMutation } from '@tanstack/react-query';
import { toast } from '../../Toast';
import { Stack } from '@/components/Layouts';
import { IconContainer } from '@/components/Shared/IconContainer';
import { CloseIcon } from '@/components/Shared/CloseIcon';
import { CommonModal } from '@/components/Modal';
import { Button } from '@/components/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  refetchQuestions: () => void;
}

const DeleteQuestionModal = ({
  questionId,
  isOpen,
  onClose,
  refetchQuestions,
}: Props) => {
  const { mutate: deleteQuestionSettings } = useMutation(
    Setting.deleteQuestionSettings,
    {
      onSuccess() {
        toast.success(toast.getMessage('onDeleteQuestionSuccess'));
        onClose();
        refetchQuestions();
      },
      onError() {
        toast.error(toast.getMessage('onDeleteQuestionError'));
      },
    }
  );
  const onSubmit = () => {
    deleteQuestionSettings({
      questionId,
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
            Delete question
          </Text>
          <IconContainer color="static.black" role="button" onClick={onClose}>
            <CloseIcon />
          </IconContainer>
        </Stack>
      </Box>
      <Text fontSize="baseText" fontWeight="regular" color="static.black">
        Are you sure you want to delete this question?
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

export default DeleteQuestionModal;
