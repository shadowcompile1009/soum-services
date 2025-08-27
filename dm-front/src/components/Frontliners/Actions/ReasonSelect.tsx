import { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import isEmpty from 'lodash.isempty';

import { styles } from '@/components/Shared/commonSelectStyles';
import {
  InvalidReasons,
  InvalidReasonsType,
  InvalidReasonsValues,
} from '@/models/FlaggedListings';
import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';
import { Input } from '@/components/Form';

export interface InvalidReason {
  id: InvalidReasonsType;
  displayName: InvalidReasonsValues;
  value: InvalidReasonsValues;
}

function mapInvalidReason(reasons: typeof InvalidReasons): InvalidReason[] {
  return Object.entries(reasons).map(([id, displayName]) => ({
    id,
    displayName,
    value: displayName,
  })) as InvalidReason[];
}

const mappedInvalidReasons = mapInvalidReason(InvalidReasons);

interface DeleteRejectReasonSelectProps {
  onChange: (reason: SingleValue<InvalidReason>) => void;
}

export function DeleteRejectReasonSelect(props: DeleteRejectReasonSelectProps) {
  const { onChange } = props;

  const [isOtherReasonShown, setIsOtherReasonShown] = useState(false);
  const [otherReason, setOtherReason] = useState('false');

  function handleOtherReason(evt: React.ChangeEvent<HTMLInputElement>) {
    setOtherReason(evt.target.value);

    if (isEmpty(otherReason) || otherReason.length > 20) return;

    const reason = {
      id: 'other-reason',
      displayName: otherReason,
      value: otherReason,
    } as unknown as InvalidReason;

    onChange(reason);
  }

  function handleOnSelect(reason: SingleValue<InvalidReason>) {
    if (isEmpty(reason)) return;

    if (reason.value === 'Other') {
      setIsOtherReasonShown(true);
      return;
    }

    onChange(reason);
  }
  return (
    <Stack direction="vertical" gap="10">
      <Select
        isDisabled={false}
        // @ts-ignore
        styles={styles}
        onChange={handleOnSelect}
        placeholder="Select reasons for deletion or rejection"
        isLoading={false}
        options={mappedInvalidReasons}
        getOptionLabel={(option) => option.displayName}
        getOptionValue={(option) => option.id}
        isSearchable={true}
        id="reason-delete-rejection-listing-select"
        instanceId="reason-delete-rejection-listing-select"
      />
      {isOtherReasonShown && (
        <Stack direction="vertical" gap="2">
          <Text
            fontWeight="smallText"
            fontSize="smallText"
            color="static.grays.500"
          >
            Please describe briefly (max: 20 characters)
          </Text>
          <Input
            disabled={otherReason.length > 20}
            onChange={handleOtherReason}
            placeholder="Reason for deletion or rejection"
          />
        </Stack>
      )}
    </Stack>
  );
}
