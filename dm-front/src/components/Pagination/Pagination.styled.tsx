import styled from 'styled-components';
import css from '@styled-system/css';

import { Stack } from '@/components/Layouts';

export interface PaginationItem {
  pageNumber: number;
  offset: number;
}

export interface PaginationProps {
  limit: number;
  offset: number;
  currentPage: number;
  currentItemsCount: number;
  totalItems: number;
  items: PaginationItem[];
  maxPageLimit?: number;
  minPageLimit?: number;
}

export function DotIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

export const PaginationContainer = styled(Stack)(() =>
  css({
    marginTop: 'auto',
  })
);

export const PaginationList = styled('ul')(() =>
  css({
    display: 'flex',
    listStyle: 'none',

    borderRadius: 4,
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  })
);

export const PaginationListItem = styled('li')(
  ({ isActive }: { isActive?: boolean }) => {
    return css({
      backgroundColor: isActive ? 'static.blue' : 'transparent',
      borderTop: !isActive ? '1px solid' : 'none',
      borderBottom: !isActive ? '1px solid' : 'none',
      borderColor: 'static.blue',
      '& > a:hover': {
        color: 'static.blues.10',
      },
      '& > a': {
        paddingX: 8,
        paddingY: 4,
        display: 'inline-block',
        transition: 'all 200ms ease-in',
        color: isActive ? 'static.white' : 'static.blue',
      },
      '&:not(:last-child)': {
        borderRight: '1px solid',
        borderColor: 'static.blue',
      },
    });
  }
);

export const PaginationPrevious = styled(PaginationListItem)(() =>
  css({
    borderLeft: '1px solid',
    borderColor: 'static.blue',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  })
);

export const PaginationNext = styled(PaginationListItem)(() =>
  css({
    borderRight: '1px solid',
    borderColor: 'static.blue',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  })
);
