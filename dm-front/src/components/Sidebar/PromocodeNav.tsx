import { PromocodeIcon } from './PromocodeIcon';
import { SideNav } from './SideNav';

export function PromocodeNav() {
  return (
    <SideNav>
      {({ isContainerOpen, handleToggle, open }) => (
        <>
          <SideNav.MenuButton
            open={open}
            isContainerOpen={isContainerOpen}
            handleToggle={handleToggle}
            navIcon={<PromocodeIcon />}
            navText="Promocode"
          />
          <SideNav.NavLinks
            isContainerOpen={isContainerOpen}
            open={open}
            routePaths={[
              {
                url: '/promocode/list',
                fullTitle: 'List',
                shortTitle: 'Lst',
              },
            ]}
          />
        </>
      )}
    </SideNav>
  );
}
