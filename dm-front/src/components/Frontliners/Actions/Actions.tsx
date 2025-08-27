import styled from 'styled-components';
import css from '@styled-system/css';

import { Stack } from '@/components/Layouts';
import { FlaggedListing } from '@/models/FlaggedListings';

import { VerifiedCheckBox } from './VerifiedCheckBox';
import { ListingDetailsLink } from './ListingDetailsLink';
import { ApprovedSwitch } from './ApprovedSwitch';
import { LockUser } from './LockUser';
import { DeleteListing } from './DeleteListing';
import { RejectListing } from './RejectListing';

export interface ActionProps {
  listing: FlaggedListing;
  queryKey: string;
}

const ActionsContainer = styled(Stack)(() => css({}));

export function Actions(props: ActionProps) {
  const { listing, queryKey } = props;

  return (
    <Stack direction="vertical" gap="8" justify="center" align="center">
      <ActionsContainer gap="5" direction="horizontal" align="center">
        <ListingDetailsLink listing={listing} queryKey={queryKey} />
        <VerifiedCheckBox listing={listing} queryKey={queryKey} />
      </ActionsContainer>
      <ActionsContainer gap="5" direction="horizontal" align="center">
        <ApprovedSwitch listing={listing} queryKey={queryKey} />
        <LockUser listing={listing} queryKey={queryKey} />
        <DeleteListing listing={listing} queryKey={queryKey} />
      </ActionsContainer>
      <ActionsContainer>
        <RejectListing listing={listing} queryKey={queryKey} />
      </ActionsContainer>
    </Stack>
  );
}
