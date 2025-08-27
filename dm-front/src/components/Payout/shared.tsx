import { Text } from '@/components/Text';
import { Stack } from '@/components/Layouts';
import { textTypes } from '@/types/index';

export function OrderDetailsText(props: {
  text: string;
  value: number;
  fontWeight?: textTypes;
}) {
  const { text, value, fontWeight = 'regular' } = props;
  return (
    <Stack direction="horizontal" justify="space-between">
      <Text fontSize="baseText" fontWeight={fontWeight} color="static.brown">
        {text}
      </Text>
      <Text fontSize="baseText" fontWeight={fontWeight} color="static.brown">
        {value}
      </Text>
    </Stack>
  );
}
