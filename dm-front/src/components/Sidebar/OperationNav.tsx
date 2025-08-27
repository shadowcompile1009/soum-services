import { SideNav } from './SideNav';
import { OrderIcon } from './OrderIcon';

export function OperationNav() {
  return (
    <SideNav>
      {({ isContainerOpen, handleToggle, open }) => (
        <>
          <SideNav.MenuButton
            open={open}
            isContainerOpen={isContainerOpen}
            handleToggle={handleToggle}
            navIcon={<OrderIcon />}
            navText="Order Mangement"
          />
          <SideNav.NavLinks
            isContainerOpen={isContainerOpen}
            open={open}
            routePaths={[
              { url: '/orders/new', fullTitle: 'New', shortTitle: 'New' },
              {
                url: '/orders/replacement',
                fullTitle: 'Replacement',
                shortTitle: 'Rplc',
              },
              { url: '/orders/active', fullTitle: 'Active', shortTitle: 'Act' },
              {
                url: '/orders/closed',
                fullTitle: 'Closed',
                shortTitle: 'Clse',
              },
              {
                url: '/orders/bnpl-order',
                fullTitle: 'BNPL',
                shortTitle: 'BNPL',
              },
              {
                url: '/orders/reservation',
                fullTitle: 'Reservations',
                shortTitle: 'Rsrv',
              },
            ]}
          />
        </>
      )}
    </SideNav>
  );
}
