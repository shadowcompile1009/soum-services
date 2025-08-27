import React from 'react';
import styled from 'styled-components';
import { Text } from '../Text';
import {
  PaginationContainer,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrevious,
} from './Pagination.styled';
import { PaginationInfo } from './hooks/useAdminPagination';
import css from '@styled-system/css';

interface CustomPaginationProps extends PaginationInfo {
  onPageChange: (pageNum: number) => void;
}

const Button = styled.button(({ isActive }: { isActive?: boolean }) => {
  return css({
    paddingX: 8,
    paddingY: 4,
    display: 'inline-block',
    transition: 'all 200ms ease-in',
    color: isActive ? 'static.white' : 'static.blue',
    border: 'none',
    outline: 'none',
    ':focus': {
      outline: 'none',
    },
    ':hover': {
      color: 'static.blues.10',
    },
  });
});

export function CustomPagination({
  onPageChange,
  current_page,
  total_pages,
  has_previous_page,
  has_next_page,
  first_page,
  last_page,
}: CustomPaginationProps) {
  const getVisiblePages = () => {
    const visiblePages: number[] = [];

    for (let i = first_page; i <= last_page; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  return (
    <PaginationContainer
      direction="horizontal"
      justify="space-between"
      align="center"
    >
      <Text color="static.grays.10" fontSize="baseText" fontWeight="regular">
        {`Showing page ${current_page} out of ${total_pages} pages`}
      </Text>
      <PaginationList>
        {has_previous_page && (
          <PaginationPrevious>
            <Button onClick={() => onPageChange(current_page - 1)}>
              Previous
            </Button>
          </PaginationPrevious>
        )}

        {first_page > 1 && (
          <PaginationListItem>
            <Button onClick={() => onPageChange(1)}>{'<<'}</Button>
          </PaginationListItem>
        )}

        {getVisiblePages().map((pageNum: number, index: number) => (
          <React.Fragment key={index}>
            <PaginationListItem isActive={current_page === pageNum}>
              <Button
                onClick={() => onPageChange(pageNum)}
                isActive={current_page === pageNum}
              >
                {pageNum}
              </Button>
            </PaginationListItem>
          </React.Fragment>
        ))}

        {last_page < total_pages && (
          <PaginationListItem>
            <Button onClick={() => onPageChange(total_pages)}>{'>>'}</Button>
          </PaginationListItem>
        )}

        {has_next_page && (
          <PaginationNext onClick={() => onPageChange(current_page + 1)}>
            <Button>Next</Button>
          </PaginationNext>
        )}
      </PaginationList>
    </PaginationContainer>
  );
}
