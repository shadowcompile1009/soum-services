import NextLink from 'next/link';
import styled from 'styled-components';
import css from '@styled-system/css';

const NavigateOrderDetails = styled.a(() =>
  css({
    color: 'static.black',
    transition: 'color 200ms ease-in-out',
    textDecoration: 'underline',
    '&:hover': {
      color: 'static.blue',
      textDecoration: 'underline',
    },
  })
);

interface OrderDetailsLinkProps {
  orderId: string;
  children: any;
}

export function OrderDetailsLink(props: OrderDetailsLinkProps) {
  const { orderId } = props;
  const pathname = `/orders/${orderId}`;

  return (
    <NextLink
      href={{
        pathname: pathname,
      }}
      passHref
    >
      <NavigateOrderDetails>{props.children}</NavigateOrderDetails>
    </NextLink>
  );
}
