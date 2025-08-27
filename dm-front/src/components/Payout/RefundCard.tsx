import css from '@styled-system/css';
import styled from 'styled-components';

const CardContainer = styled.div(
  ({ paddingBottom }: { paddingBottom: string | number | undefined }) =>
    css({
      backgroundColor: 'static.white',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'visible',
      paddingBottom: paddingBottom || '4.6875rem',
      height: '100%',
      boxShadow: 1,
    })
);

interface CardProps {
  children: React.ReactNode;
  paddingBottom?: number | string;
}
export function RefundCard(props: CardProps) {
  const { children, paddingBottom } = props;

  return (
    <CardContainer paddingBottom={paddingBottom}>{children}</CardContainer>
  );
}
