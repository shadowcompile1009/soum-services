import { SideNav, RoutePath } from './SideNav';
import { PeopleIcon } from './PeopleIcon';

const routePaths: RoutePath[] = [
  {
    url: '/frontliners/unfiltered',
    fullTitle: 'Un-Filtered',
    shortTitle: 'UF',
  },
  {
    url: '/frontliners/recent',
    fullTitle: 'Most Recent',
    shortTitle: 'R',
  },
  {
    url: '/frontliners/positive',
    fullTitle: 'Positive Flag (AI)',
    shortTitle: 'PF',
  },
  {
    url: '/frontliners/discount',
    fullTitle: 'Highest Discount %',
    shortTitle: 'HD',
  },
  {
    url: '/frontliners/unchecked',
    fullTitle: 'Unchecked',
    shortTitle: 'Unchk',
  },
  {
    url: '/frontliners/consignment',
    fullTitle: 'Consignment',
    shortTitle: 'Cgnt',
  },
  {
    url: '/frontliners/onhold',
    fullTitle: 'On Hold',
    shortTitle: 'OH',
  },
];

export function FrontlinerNav() {
  return (
    <SideNav>
      {({ isContainerOpen, handleToggle, open }) => (
        <>
          <SideNav.MenuButton
            open={open}
            isContainerOpen={isContainerOpen}
            handleToggle={handleToggle}
            navIcon={<PeopleIcon />}
            navText="The Frontliners"
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
