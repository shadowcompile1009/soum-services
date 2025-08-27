import { SideNav } from './SideNav';
import { OrderIcon } from './OrderIcon';

export function OrderV2Nav() {
  return (
    <SideNav>
      {({ isContainerOpen, handleToggle, open }) => (
        <>
          <SideNav.MenuButton
            open={open}
            isContainerOpen={isContainerOpen}
            handleToggle={handleToggle}
            navIcon={<OrderIcon />}
            navText="Order Management 2.0"
          />
          <SideNav.NavLinks
            isContainerOpen={isContainerOpen}
            open={open}
            routePaths={[
              // TODO: Add All Orders Back in
              // {
              //   url: '/orders/all',
              //   fullTitle: 'All Orders',
              //   shortTitle: 'allOrders',
              // },
              {
                url: '/orders/car-real-state',
                fullTitle: 'Cars and Real State',
                shortTitle: 'Car',
              },
              {
                url: '/orders/confirmation',
                fullTitle: 'Confirmation',
                shortTitle: 'Cfrm',
              },
              {
                url: '/orders/shipping',
                fullTitle: 'Shipping',
                shortTitle: 'Ship',
              },
              {
                url: '/orders/delivery',
                fullTitle: 'Delivery',
                shortTitle: 'Delv',
              },
              {
                url: '/orders/dispute',
                fullTitle: 'Dispute',
                shortTitle: 'Disp',
              },
              {
                url: '/orders/backlog',
                fullTitle: 'Backlog',
                shortTitle: 'BLog',
              },
            ]}
          />
        </>
      )}
    </SideNav>
  );
}
