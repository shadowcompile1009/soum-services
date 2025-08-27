import { EWhatsAppMessageStatuses } from '@/models/Message';
import { Text } from '@/components/Text';
import { colorTypes } from '@/types/index';

interface MessageStatusProps {
  status: EWhatsAppMessageStatuses;
}

const StatusColorMap: Record<EWhatsAppMessageStatuses, colorTypes> = {
  [EWhatsAppMessageStatuses.Read]: 'static.greens.300',
  [EWhatsAppMessageStatuses.Pending]: 'static.grays.10',
  [EWhatsAppMessageStatuses.Success]: 'static.greens.300',
  [EWhatsAppMessageStatuses.Failed]: 'static.gray',
  [EWhatsAppMessageStatuses.Accepted]: 'static.greens.300',
  [EWhatsAppMessageStatuses.Sent]: 'static.grays.10',
  [EWhatsAppMessageStatuses.Inprogress]: 'static.grays.10',
  [EWhatsAppMessageStatuses.Delivered]: 'static.greens.300',
};

export function MessageStatus(props: MessageStatusProps) {
  const { status } = props;
  const color = StatusColorMap[status];
  return (
    <Text fontSize="regular" fontWeight="semibold" color={color}>
      {status}
    </Text>
  );
}
