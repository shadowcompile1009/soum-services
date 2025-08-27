import { SideNav, RoutePath } from './SideNav';
import { PurchaseOrder } from './PurchaseOrder';

const routePaths: RoutePath[] = [
  {
    url: '/logistics/vendors',
    fullTitle: 'Logistics Vendors',
    shortTitle: 'LV',
  },
  {
    url: '/logistics/citiesTiers',
    fullTitle: 'Logistics Tiers',
    shortTitle: 'LT',
  },
  {
    url: '/logistics/rules',
    fullTitle: 'Rules Engine',
    shortTitle: 'LR',
  },
];

export function LogisticsNav() {
  return (
    <SideNav>
      {({ isContainerOpen, handleToggle, open }) => (
        <>
          <SideNav.MenuButton
            open={open}
            isContainerOpen={isContainerOpen}
            handleToggle={handleToggle}
            navIcon={<PurchaseOrder />}
            navText="Logistics"
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
