import { SideNav, RoutePath } from './SideNav';
import { BriefcaseIcon } from './BriefcaseIcon';

const routePaths: RoutePath[] = [
  {
    url: '/wallet/withdrawal',
    fullTitle: 'Withdrawal',
    shortTitle: 'Wdra',
  },
  {
    url: '/wallet/list',
    fullTitle: 'Wallet Lists',
    shortTitle: 'WMan',
  },
];

export function WalletNav() {
  return (
    <SideNav>
      {({ isContainerOpen, handleToggle, open }) => (
        <>
          <SideNav.MenuButton
            open={open}
            isContainerOpen={isContainerOpen}
            handleToggle={handleToggle}
            navIcon={<BriefcaseIcon />}
            navText="Wallet"
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
