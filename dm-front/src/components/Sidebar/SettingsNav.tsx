import { RoutePath, SideNav } from './SideNav';
import { CogIcon } from './CogIcon';

const routePaths: RoutePath[] = [
  {
    url: '/settings/activityLog',
    fullTitle: 'Activity Log',
    shortTitle: 'AC',
  },
  {
    url: '/settings/users',
    fullTitle: 'Users',
    shortTitle: 'Usrs',
  },
  {
    url: '/settings/appUsers',
    fullTitle: 'App Users',
    shortTitle: 'AppUsrs',
  },
  {
    url: '/settings/whatsapp',
    fullTitle: 'Whatsapp',
    shortTitle: 'WH',
  },
  {
    url: '/settings/omAutomations',
    fullTitle: 'OM 2.0 Automation',
    shortTitle: 'OMA',
  },
  {
    url: '/settings/courierAutomations',
    fullTitle: 'Courier Automation',
    shortTitle: 'CA',
  },
  {
    url: '/settings/account',
    fullTitle: 'Account',
    shortTitle: 'Acc',
  },
  {
    url: '/settings/wallet',
    fullTitle: 'Wallet',
    shortTitle: 'Wlt',
  },
  {
    url: '/settings/questions',
    fullTitle: 'Questions',
    shortTitle: 'Qtions',
  }
];

export function SettingsNav() {
  return (
    <SideNav>
      {({ isContainerOpen, handleToggle, open }) => (
        <>
          <SideNav.MenuButton
            open={open}
            isContainerOpen={isContainerOpen}
            handleToggle={handleToggle}
            navIcon={<CogIcon />}
            navText="Settings"
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
