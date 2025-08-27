import { useMemo } from 'react';
import { MultiValue } from 'react-select';
import { colors } from '@/tokens/colors';

import { MultiSelect } from '@/components/MultiSelect';
import {
  EWhatsAppMessageStatuses,
  OrderedWhatsAppMessageStatuses,
} from '@/models/Message';

export interface IMessageStatus {
  id: EWhatsAppMessageStatuses;
  status: EWhatsAppMessageStatuses;
}

interface MessageStatusSelectProps {
  handleOnSelect: (values: MultiValue<IMessageStatus>) => void;
  initialValues?: IMessageStatus[];
}
const styles = {
  menu: (provided: Record<string, unknown>) => ({
    ...provided,
    width: '350px',
  }),
  placeholder: (provided: Record<string, unknown>) => ({
    ...provided,
    color: colors.static.gray,
    opacity: 0.6,
  }),
  control: (provided: Record<string, unknown>) => ({
    ...provided,
    minHeight: '44px',
    lineHeight: '27px',
    width: '350px',
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSize: '18px',
    borderColor: colors.static.blue,
    '&:hover': {
      borderColor: colors.static.blue,
    },
  }),
};

export function MessageStatusSelect(props: MessageStatusSelectProps) {
  const { handleOnSelect, initialValues } = props;
  const options: IMessageStatus[] = useMemo(
    () =>
      OrderedWhatsAppMessageStatuses.map(
        (status: EWhatsAppMessageStatuses) => ({
          id: status,
          status,
        })
      ),
    []
  );
  return (
    <MultiSelect
      // @ts-ignore
      getOptionLabel={(option: IMessageStatus) => option.status}
      // @ts-ignore
      getOptionValue={(option: IMessageStatus) => option.id}
      placeHolder="Filter messages by statuses"
      instanceId="message-status-select"
      // @ts-ignore
      handleOnSelect={handleOnSelect}
      isSearchable={true}
      options={options}
      styles={styles}
      value={initialValues}
    />
  );
}
