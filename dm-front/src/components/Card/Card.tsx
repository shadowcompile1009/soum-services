import css from '@styled-system/css';
import styled from 'styled-components';

import { Stack } from '@/components/Layouts';
import { Text } from '@/components/Text';

const CardContainer = styled.div(
  ({
    padding,
    paddingBottom,
  }: {
    padding: string | number | undefined;
    paddingBottom: string | number | undefined;
  }) =>
    css({
      backgroundColor: 'static.white',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'visible',
      padding: padding,
      paddingBottom: paddingBottom || '1rem',
      height: '100%',
      boxShadow: 1,
    })
);

const CardHeader = styled.div(
  ({ cardHeaderPadding }: { cardHeaderPadding: string | number | undefined }) =>
    css({
      backgroundColor: 'static.white',
      borderColor: 'static.gray',
      padding: cardHeaderPadding || '1.0625rem',
      paddingY: 8,
      gap: '0.5rem',
    })
);

const CardBody = styled.div(({ paddingBodyX }: { paddingBodyX?: string }) =>
  css({
    paddingX: paddingBodyX || '1.0625rem',
    paddingY: 8,
    overflow: 'visible',
  })
);

interface CardProps {
  heading?: string | React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fontSize?: string;
  padding?: string;
  paddingBottom?: number | string;
  cardHeaderPadding?: number | string;
  paddingBodyX?: string;
}
export function Card(props: CardProps) {
  const {
    heading,
    children,
    icon,
    padding,
    paddingBottom,
    cardHeaderPadding,
    fontSize,
    paddingBodyX,
  } = props;

  function HeadingComponent() {
    return typeof heading === 'string' ? (
      <Stack direction="horizontal" align="center" gap="6">
        {icon}
        <Text
          fontSize={fontSize || 'baseSubtitle'}
          fontWeight="semibold"
          color="static.black"
        >
          {heading}
        </Text>
      </Stack>
    ) : (
      <>{heading}</>
    );
  }

  return (
    <CardContainer padding={padding} paddingBottom={paddingBottom}>
      <CardHeader cardHeaderPadding={cardHeaderPadding}>
        <HeadingComponent />
      </CardHeader>
      <CardBody paddingBodyX={paddingBodyX}>{children}</CardBody>
    </CardContainer>
  );
}
