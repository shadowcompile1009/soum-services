import NextLink from 'next/link';

import { EyeIcon } from '@/components/Shared/EyeIcon';
import { IconLink } from '@/components/Shared/IconLink';

import { useState } from 'react';
import { IStory } from '@/models/Story';
import { Button } from '@/components/Button';
import { IconContainer } from '@/components/Shared/IconContainer';
import StoriesModal from '../StoriesModal';
import StoriesDeleteModal from '../StoriesDeleteModal';
import { DeleteIcon } from '@/components/Shared/DeleteIcon';
import { EditIcon } from '@/components/Settings/EditIcon';

export function ListingDetailsLink(props: {
  story?: IStory;
  queryKey: string;
}) {
  const { story } = props;
  const pathname = `/story/${story?.id}`;

  return (
    <NextLink
      href={{
        pathname: pathname,
      }}
      passHref
    >
      <IconLink>
        <EyeIcon />
      </IconLink>
    </NextLink>
  );
}

export const DetailEditLink = ({
  story,
  refetch,
}: {
  story: IStory;
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
      <StoriesModal
        isOpen={isOpen}
        onClose={toggleAddAddonModal}
        isLoading={false}
        story={story}
        refetch={refetch}
      />
    </>
  );
};

export const DetailDeleteLink = ({
  storyId,
  refetch,
}: {
  storyId: string;
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
      <StoriesDeleteModal
        refetch={refetch}
        isOpen={isOpen}
        onClose={handleToggleModalDelete}
        storyId={storyId}
      />
    </>
  );
};
