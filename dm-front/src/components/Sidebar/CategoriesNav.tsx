import React from 'react';

import { SideNav } from './SideNav';
import { OrderIcon } from './OrderIcon';

const CategoriesNav = () => {
  return (
    <SideNav>
      {({ isContainerOpen, handleToggle, open }) => (
        <>
          <SideNav.MenuButton
            open={open}
            isContainerOpen={isContainerOpen}
            handleToggle={handleToggle}
            navIcon={<OrderIcon />}
            navText="Categories"
          />
          <SideNav.NavLinks
            isContainerOpen={isContainerOpen}
            open={open}
            routePaths={[
              {
                url: '/categories/addons',
                fullTitle: 'Addons',
                shortTitle: 'AO',
              },
              {
                url: '/categories',
                fullTitle: 'Categories',
                shortTitle: 'Cat',
              },
            ]}
          />
        </>
      )}
    </SideNav>
  );
};

export default CategoriesNav;
