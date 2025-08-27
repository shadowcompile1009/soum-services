import { SideNav } from './SideNav';
import { OrderIcon } from './OrderIcon';

export function DisputeNav() {
  return (
    <SideNav>
      {({ isContainerOpen, handleToggle, open }) => (
        <>
          <SideNav.MenuButton
            open={open}
            isContainerOpen={isContainerOpen}
            handleToggle={handleToggle}
            navIcon={<OrderIcon />}
            navText="Dispute Management"
          />
          <SideNav.NavLinks
            isContainerOpen={isContainerOpen}
            open={open}
            routePaths={[
              {
                url: '/dispute/orders',
                fullTitle: 'Dispute Orders',
                shortTitle: 'disputeOrders',
              },
            ]}
          />
        </>
      )}
    </SideNav>
  );
}
