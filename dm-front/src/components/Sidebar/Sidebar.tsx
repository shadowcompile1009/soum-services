import styled from 'styled-components';
import css from '@styled-system/css';
import { default as NextLink } from 'next/link';
import Image from 'next/image';
import { useLocalStorage } from 'usehooks-ts';

import { Stack } from '@/components/Layouts';
import { Button } from '@/components/Button';

import { LogoutIcon } from './LogoutIcon';
import { ArrowIcon } from './ArrowIcon';

const SIDEBAR_KEY = '__x-sidebar__';

const Checkbox = styled.input(() =>
  css({
    display: 'none',
  })
);

export function SidebarCheckbox() {
  const [isOpen, setIsOpen] = useLocalStorage(SIDEBAR_KEY, false);

  function handleOnChange() {
    setIsOpen((isOpen) => !isOpen);
  }

  return (
    <Checkbox
      id="sidebar-toggle"
      name="sidebar-toggle"
      type="checkbox"
      onClick={handleOnChange}
      onChange={handleOnChange}
      checked={isOpen}
    />
  );
}

export const SidebarLabel = styled.label(() =>
  css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    cursor: 'pointer',
  })
);

export const Sidebar = styled('aside')(() => {
  return css({
    '#sidebar-toggle:checked ~ &': {
      maxWidth: 35,
    },
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    width: '100%',
    maxWidth: 113,
    top: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: 'static.white',
    boxShadow: 3,
    transition: 'max-width 400ms ease',
  });
});

const SBHeader = styled('div')(() => {
  return css({
    height: 33,
    borderBottom: '1px solid',
    borderColor: 'static.grays.25',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  });
});

const SBFooter = styled(Stack)(() => {
  return css({
    [`#sidebar-toggle:checked ~ ${Sidebar} & #logout-button`]: {
      display: 'none',
    },
    [`#sidebar-toggle:checked ~ ${Sidebar} & #settings`]: {
      display: 'none',
    },
    display: 'flex',
    flexDirection: 'row',
    marginTop: 'auto',
    justifyContent: 'center',
    paddingBottom: 5,
    alignItems: 'center',
  });
});

export const SidebarBody = styled('div')(() =>
  css({ flex: 1, overflow: 'auto', overflowX: 'hidden' })
);

const SoumLogoContainer = styled.div(() =>
  css({
    [`#sidebar-toggle:checked ~ ${Sidebar} &`]: {
      opacity: 0,
    },
    height: 33,
    width: 33,
    cursor: 'pointer',
    transition: 'opacity 400ms ease',
  })
);

const Toggle = styled.div(() =>
  css({
    [`#sidebar-toggle:checked ~ ${Sidebar} &`]: {
      transform: 'rotate(180deg)',
    },
    position: 'absolute',
    height: 15,
    width: 15,
    backgroundColor: 'static.blue',
    borderRadius: 20,
    color: 'static.white',
    right: '-12px',
    top: '20px',
    transition: 'transform 400ms ease',
  })
);

export function SoumLogo() {
  return (
    <SoumLogoContainer>
      <Image
        src="/assets/images/soum.jpg"
        width="100%"
        height="100%"
        objectFit="contain"
        alt="Soum logo"
        style={{ cursor: 'pointer' }}
      />
    </SoumLogoContainer>
  );
}

function SidebarToggle() {
  return (
    <Toggle>
      <SidebarLabel htmlFor="sidebar-toggle">
        <ArrowIcon />
      </SidebarLabel>
    </Toggle>
  );
}

export function SidebarHeader() {
  return (
    <SBHeader>
      <NextLink href="/orders" passHref>
        <a>
          <>
            <SoumLogo />
          </>
        </a>
      </NextLink>
      <SidebarToggle />
    </SBHeader>
  );
}

export function SidebarFooter(props: { onClick: () => void }) {
  const { onClick } = props;
  return (
    <SBFooter direction="horizontal">
      <Button variant="outline" onClick={onClick}>
        <span
          style={{
            cursor: 'pointer',
            transform: 'rotate(180deg)',
            marginRight: '5px',
          }}
        >
          <LogoutIcon />
        </span>
        <span id="logout-button">Logout</span>
      </Button>
    </SBFooter>
  );
}
