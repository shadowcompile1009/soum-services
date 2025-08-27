import { Setting } from '@/models/Setting';
import { Box } from '../Box';

import { Stack } from '../Layouts';
import { CommonModal } from '../Modal';
import { CloseIcon } from '../Shared/CloseIcon';
import { IconContainer } from '../Shared/IconContainer';
import { Text } from '../Text';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import { useEffect, useMemo, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '../Button';
import { useMutation } from '@tanstack/react-query';
import { toast } from '../Toast';
import { useQuestionTable } from './hooks/useQuestionTable';

interface Props {
  isOpen: boolean;
  setOpen: () => void;
  category: string;
  refetch: () => void;
}

interface IOrder {
  order: number;
  questionEn: string;
  version: number;
  questionId: string;
}

const OrderQuestionModal = ({ isOpen, setOpen, category, refetch }: Props) => {
  const [questionList, setQuestionList] = useState<IOrder[]>([]);

  const { data } = useQuestionTable({
    categoryId: category,
    limit: '100',
  });

  const questionSettingsData = useMemo(() => data?.items || [], [data?.items]);

  const { mutate: ChangeOrderQuestionSettings } = useMutation(
    Setting.changeOrderQuestionSettings,
    {
      onSuccess() {
        toast.success(toast.getMessage('onChangeQuestionSuccess'));
        refetch();
      },
      onError() {
        toast.error(toast.getMessage('onChangeQuestionError'));
      },
    }
  );

  const handleSave = () => {
    const newFormValues = {
      descriptionEn: questionSettingsData[0].descriptionEn,
      descriptionAr: questionSettingsData[0].descriptionAr,
      categoryId: questionSettingsData[0].categoryId,
      questions: questionList.map((question) => ({
        questionId: question.questionId,
        version: question.version,
        order: question.order,
        isRequired: true,
      })),
    };

    ChangeOrderQuestionSettings({
      settingsId: questionSettingsData[0]._id,
      formValues: newFormValues,
    });
    handleClose();
  };

  useEffect(() => {
    if (
      questionSettingsData &&
      questionSettingsData[0] &&
      questionSettingsData[0].questions
    ) {
      const newData = questionSettingsData[0].questions.map(
        (question, index) => ({
          order: index + 1,
          questionEn: question.questionEn,
          version: question.version,
          questionId: question.questionId,
        })
      );
      setQuestionList(newData);
    }
  }, [questionSettingsData]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleClose = () => {
    setOpen();
  };
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestionList((questions) => {
        const oldIndex = questions.findIndex(
          (item) => item.order + 1 === active.id
        );
        const newIndex = questions.findIndex(
          (item) => item.order + 1 === over.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedQuestions = arrayMove(questions, oldIndex, newIndex);

          const updatedQuestions = reorderedQuestions.map(
            (question, index) => ({
              ...question,
              order: index + 1,
            })
          );

          return updatedQuestions;
        }
        return questions;
      });
    }
  }

  return (
    <CommonModal onClose={handleClose} isOpen={isOpen} width={570}>
      <Box padding={5}>
        <Box
          cssProps={{
            borderBottom: '1px solid #ccc',
            paddingBottom: '10px',
            marginBottom: '20px',
          }}
        >
          <Stack justify="space-between" align="center">
            <Text
              fontWeight="regular"
              fontSize="bigSubtitle"
              color="static.black"
            >
              Order question
            </Text>
            <IconContainer
              color="static.black"
              role="button"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconContainer>
          </Stack>
        </Box>
        <Box marginTop={5}>
          <Box cssProps={{ backgroundColor: '#ccc' }} paddingY={4}>
            <Stack>
              <Box paddingX={60} cssProps={{ width: '150px' }}>
                <Text
                  fontWeight="regular"
                  fontSize="bigSubtitle"
                  color="static.black"
                >
                  No
                </Text>
              </Box>
              <Box cssProps={{ flex: 1 }}>
                <Text
                  fontWeight="regular"
                  fontSize="bigSubtitle"
                  color="static.black"
                >
                  Name
                </Text>
              </Box>
            </Stack>
          </Box>
          <Box
            cssProps={{
              overflow: 'hidden',
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext
                items={questionList.map((question) => question.order + 1)}
                strategy={verticalListSortingStrategy}
              >
                {questionList.map((question) => (
                  <QuestionItem key={question.order + 1} question={question} />
                ))}
              </SortableContext>
            </DndContext>
          </Box>
        </Box>
        <Button
          type="submit"
          variant="filled"
          cssProps={{ width: '100%', marginTop: '40px' }}
          fontWeight="semibold"
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>
    </CommonModal>
  );
};

interface IQuestionProps {
  question: IOrder;
}
const QuestionItem = ({ question }: IQuestionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.order + 1 });

  const [isHovered, setIsHovered] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isHovered ? '0 2px 10px rgba(0, 0, 0, 0.5)' : 'none',
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        paddingY={6}
        cssProps={{ cursor: 'move', borderTop: '1px solid #ccc' }}
      >
        <Stack>
          <Box paddingX={60} cssProps={{ width: '150px' }}>
            <Text
              fontWeight="regular"
              fontSize="bigSubtitle"
              color="static.black"
              style={{
                cursor: 'move',
              }}
            >
              {question.order}
            </Text>
          </Box>
          <Box cssProps={{ flex: 1 }}>
            <Text
              fontWeight="regular"
              fontSize="bigSubtitle"
              color="static.black"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '300px',
                cursor: 'move',
              }}
            >
              {question.questionEn}
            </Text>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default OrderQuestionModal;
