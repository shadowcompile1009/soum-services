import { SideNav } from './SideNav';
import { MessageIcon } from './MessageIcon';

export function MessageNav() {
  return (
    <SideNav>
      {({ isContainerOpen, handleToggle, open }) => (
        <>
          <SideNav.MenuButton
            open={open}
            isContainerOpen={isContainerOpen}
            handleToggle={handleToggle}
            navIcon={<MessageIcon />}
            navText="Messaging"
          />
          <SideNav.NavLinks
            isContainerOpen={isContainerOpen}
            open={open}
            routePaths={[
              {
                url: '/message/processing',
                fullTitle: 'Processing',
                shortTitle: 'Prcs',
              },
            ]}
          />
        </>
      )}
    </SideNav>
  );
}
