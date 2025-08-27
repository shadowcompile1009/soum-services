import { Box, IBoxProps } from '@/components/Box';
import { Text, TextProps } from '@/components/Text';

interface StatusBadgeProps {
  boxProps: IBoxProps;
  textProps: TextProps;
  children: React.ReactNode;
}
export function StatusBadge(props: StatusBadgeProps) {
  const { boxProps, textProps } = props;
  return (
    <Box {...boxProps}>
      <Text {...textProps}>{props.children}</Text>
    </Box>
  );
}
