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
import { IStory, Story } from '@/models/Story';
import { useOrderStories } from './hooks/useOrderStories';
import EmptyIcon from 'pages/stories/EmptyIcon';

interface Props {
  isOpen: boolean;
  data?: any;
  setOpen: () => void;
  refetch: () => void;
}

const StoriesOrderModal = ({ isOpen, setOpen, refetch }: Props) => {
  const [storyList, setStoryList] = useState<IStory[]>([]);

  const { data, refetch: refetchStories } = useOrderStories({
    limit: 100,
  });

  const storiesData = useMemo(() => data?.items || [], [data?.items]);

  const { mutate: ChangeOrderStories } = useMutation(
    Story.updatePositionStory,
    {
      onSuccess() {
        toast.success(toast.getMessage('onOrderStorySuccess'));
        refetch();
        setOpen();
      },
      onError() {
        toast.error(toast.getMessage('onOrderStoryError'));
        setOpen();
      },
    }
  );

  useEffect(() => {
    if (storiesData) {
      const newData = storiesData.map((story: IStory, index: number) => ({
        position: index + 1,
        nameEn: story.nameEn,
        id: story.id,
      }));
      setStoryList(newData);
    }
  }, [storiesData]);

  useEffect(() => {
    if (isOpen) {
      refetchStories();
    }
  }, [isOpen]);

  const handleSave = () => {
    const newFormValues = {
      stories: storyList.map((story) => ({
        id: story.id,
        position: story.position,
      })),
    };

    ChangeOrderStories({
      formValues: newFormValues.stories,
    });
  };

  const handleClose = () => {
    if (storiesData) {
      const resetData = storiesData.map((story: IStory, index: number) => ({
        position: index + 1,
        nameEn: story.nameEn,
        id: story.id,
      }));
      setStoryList(resetData);
    }
    setOpen();
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setStoryList((stories) => {
        const oldIndex = stories.findIndex(
          (item) => item.position + 1 === active.id
        );
        const newIndex = stories.findIndex(
          (item) => item.position + 1 === over.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedStories = arrayMove(stories, oldIndex, newIndex);

          const updatedStories = reorderedStories.map((story, index) => ({
            ...story,
            position: index + 1,
          }));

          return updatedStories;
        }
        return stories;
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
              Order stories
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
        {storiesData?.length === 0 ? (
          <Stack
            flex="1"
            justify="center"
            align="center"
            style={{ marginTop: 40 }}
          >
            <EmptyIcon />
          </Stack>
        ) : (
          <>
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
                  maxHeight: '300px',
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
                    items={storyList.map((story) => story.position + 1)}
                    strategy={verticalListSortingStrategy}
                  >
                    {storyList.map((story) => (
                      <StoryItem key={story.position + 1} story={story} />
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
          </>
        )}
      </Box>
    </CommonModal>
  );
};

interface IStoryProps {
  story: IStory;
}
const StoryItem = ({ story }: IStoryProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: story.position + 1 });

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
              {story.position}
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
              {story.nameEn}
            </Text>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default StoriesOrderModal;
