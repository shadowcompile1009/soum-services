import { RoutePath, SideNav } from './SideNav';
import { OrderIcon } from './OrderIcon';

const routePaths: RoutePath[] = [
  {
    url: '/upfronts/new',
    fullTitle: 'New',
    shortTitle: 'New',
  },
  {
    url: '/upfronts/recieved',
    fullTitle: 'Ready to Inspect',
    shortTitle: 'Ready',
  },
  {
    url: '/upfronts/approved',
    fullTitle: 'Approved',
    shortTitle: 'Apvd',
  },
  {
    url: '/upfronts/payoutToSeller',
    fullTitle: 'Payout to Seller',
    shortTitle: 'Payout',
  },
  {
    url: '/upfronts/rejected',
    fullTitle: 'Rejected',
    shortTitle: 'Rejet',
  },
  {
    url: '/upfronts/closed',
    fullTitle: 'Closed',
    shortTitle: 'Clse',
  },
];

export function UpfrontPaymentNav() {
  return (
    <SideNav>
      {({ isContainerOpen, handleToggle, open }) => (
        <>
          <SideNav.MenuButton
            open={open}
            isContainerOpen={isContainerOpen}
            handleToggle={handleToggle}
            navIcon={<OrderIcon />}
            navText="Consignments"
          />
          <SideNav.NavLinks
            isContainerOpen={isContainerOpen}
            open={open}
            routePaths={routePaths}
          />
        </>
      )}
    </SideNav>
  );
}
