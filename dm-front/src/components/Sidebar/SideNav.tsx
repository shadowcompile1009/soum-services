import { useState } from 'react';
import useResizeObserver from 'use-resize-observer/polyfilled';
import styled from 'styled-components';
import css from '@styled-system/css';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { Box } from '@/components/Box';
import { Stack } from '@/components/Layouts';
import { Button } from '@/components/Button';
import { CaretIcon } from '@/components/Shared/CaretIcon';
import { CaretIconContainer } from '@/components/Shared/CaretIconContainer';

import { DotIcon } from './DotIcon';

export const MenuButton = styled(Button)(() =>
  css({ width: '100%', display: 'flex' })
);

const NavLinkItemContainer = styled('div')(
  ({
    isCollapsed,
    active = false,
  }: {
    isCollapsed: boolean;
    active?: boolean;
  }) => {
    return css({
      cursor: 'pointer',
      display: 'flex',
      borderRadius: 4,
      whiteSpace: 'nowrap',
      alignItems: 'center',
      margin: isCollapsed ? '0 auto' : null,
      backgroundColor: active ? 'static.blue' : 'transparent',
      width: '100%',
      '&:hover': {
        backgroundColor: active ? 'static.blue' : 'static.blues.10',
      },
      '& > a': {
        paddingX: 5,
        paddingY: 5,
        fontSize: 'smallText',
        fontWeight: 'semibold',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-flex',
        width: '100%',
        color: active ? 'static.white' : 'static.grays.10',
        '&:hover, &:focus, &:active': {
          cursor: 'pointer',
          textDecoration: 'none',
          color: active ? 'static.white' : 'static.grays.10',
        },
      },
      '& > a > svg': {
        marginRight: 8,
      },
    });
  }
);

interface SideNavProps {
  children: ({
    isContainerOpen,
    handleToggle,
    open,
  }: {
    isContainerOpen: boolean;
    handleToggle: () => void;
    open: boolean;
  }) => React.ReactNode;
}

export function SideNav(props: SideNavProps) {
  const { children } = props;
  const [open, setOpen] = useState<boolean>(true);

  // default width of 260, assuming that on intial load sidebar will always be open
  const { ref, width = 260 } = useResizeObserver<HTMLDivElement>();

  function handleToggle() {
    setOpen((open) => !open);
  }

  const isContainerOpen = width > 150;

  return (
    <Stack direction="vertical" gap="2" ref={ref}>
      {children({ isContainerOpen, handleToggle, open })}
    </Stack>
  );
}

interface SideNavMenuButtonProps {
  isContainerOpen: boolean;
  open: boolean;
  handleToggle: () => void;
  navIcon: React.ReactElement;
  navText: string;
}
SideNav.MenuButton = function SideNavMenuButton(props: SideNavMenuButtonProps) {
  const {
    handleToggle,
    isContainerOpen,
    navIcon: NavIcon,
    open,
    navText,
  } = props;
  return (
    <MenuButton
      variant="outline"
      onClick={handleToggle}
      cssProps={{
        fontSize: '0.8125rem',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{NavIcon}</span>
      {isContainerOpen && (
        <>
          {navText}
          <CaretIconContainer open={open}>
            <CaretIcon />
          </CaretIconContainer>
        </>
      )}
    </MenuButton>
  );
};

export interface RoutePath {
  url: string;
  fullTitle: string;
  shortTitle: string;
}
interface SideNavLinksProps {
  open: boolean;
  isContainerOpen: boolean;
  routePaths: RoutePath[];
}
SideNav.NavLinks = function SideNavLinks(props: SideNavLinksProps) {
  const { open, isContainerOpen, routePaths } = props;

  const route = useRouter();
  const pageUrl = routePaths
    .map((route: RoutePath) => route.url)
    .find((item: string) => route.pathname.includes(item));

  return (
    <>
      <Box cssProps={{ paddingX: 5, paddingLeft: isContainerOpen ? 16 : 5 }}>
        <Stack direction="vertical" gap="2">
          <>
            {open &&
              routePaths.map((route) => (
                <NavLinkItemContainer
                  key={route.url}
                  isCollapsed={!isContainerOpen}
                  active={pageUrl === route.url}
                >
                  <NextLink href={route.url} passHref>
                    <a>
                      {isContainerOpen && <DotIcon />}
                      {isContainerOpen ? route.fullTitle : route.shortTitle}
                    </a>
                  </NextLink>
                </NavLinkItemContainer>
              ))}
          </>
        </Stack>
      </Box>
      <Box cssProps={{ border: '1px solid', borderColor: 'static.grays.25' }} />
    </>
  );
};
