import css from '@styled-system/css';
import styled from 'styled-components';

import { Stack } from '@/components/Layouts';
import { IStory } from '@/models/Story';

import { DetailDeleteLink, DetailEditLink } from './StoryDetailsLink';

export interface ActionProps {
  story: IStory;
  queryKey: string[];
  refetch: () => void;
}

const ActionsContainer = styled(Stack)(() => css({}));

export function Actions(props: ActionProps) {
  const { story: listing, refetch } = props;

  return (
    <Stack direction="vertical" gap="8" justify="center" align="center">
      <ActionsContainer gap="5" direction="horizontal" align="center">
        <DetailEditLink story={listing} refetch={refetch} />
        <DetailDeleteLink storyId={listing?.id} refetch={refetch} />
      </ActionsContainer>
    </Stack>
  );
}
