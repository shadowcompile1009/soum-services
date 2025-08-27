import React from 'react';
import { SideNav } from './SideNav';
import StoriesIcon from './StoriesIcon';

const routePaths = [
  {
    url: '/stories',
    fullTitle: 'Stories',
    shortTitle: 'St',
  },
];

const StoriesNav = () => {
  return (
    <SideNav>
      {({ isContainerOpen, handleToggle, open }) => (
        <>
          <SideNav.MenuButton
            open={open}
            isContainerOpen={isContainerOpen}
            handleToggle={handleToggle}
            navIcon={<StoriesIcon />}
            navText="Stories"
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
};

export default StoriesNav;
