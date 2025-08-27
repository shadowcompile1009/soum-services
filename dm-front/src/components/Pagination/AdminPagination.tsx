import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Text } from '@/components/Text';

import { PaginationInfo } from './hooks/useAdminPagination';

interface AdminPaginationProps extends PaginationInfo {}

import {
  PaginationContainer,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrevious,
} from './Pagination.styled';

export function AdminPagination(props: AdminPaginationProps) {
  const {
    current_page,
    total_pages,
    has_previous_page,
    previous_page,
    has_next_page,
    next_page,
    first_page,
    last_page,
  } = props;
  const router = useRouter();
  const { query, pathname } = router;

  function buildPages() {
    let pages = [];
    for (let i = first_page; i <= last_page; i++) {
      pages.push(
        <PaginationListItem key={i} isActive={i === current_page}>
          <NextLink
            passHref
            href={{
              pathname: pathname,
              query: {
                ...query,
                page: i,
              },
            }}
          >
            <a>{i}</a>
          </NextLink>
        </PaginationListItem>
      );
    }
    return pages;
  }

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
            <NextLink
              href={{
                pathname: pathname,
                query: {
                  ...query,
                  page: previous_page,
                },
              }}
            >
              <a>Previous</a>
            </NextLink>
          </PaginationPrevious>
        )}
        {first_page > 1 && (
          <PaginationListItem>
            <NextLink
              passHref
              href={{
                pathname: pathname,
                query: {
                  ...query,
                  page: 1,
                },
              }}
            >
              <a>{'<<'}</a>
            </NextLink>
          </PaginationListItem>
        )}
        {buildPages()}

        {last_page < total_pages && (
          <PaginationListItem>
            <NextLink
              passHref
              href={{
                pathname: pathname,
                query: {
                  ...query,
                  page: total_pages,
                },
              }}
            >
              <a>{'>>'}</a>
            </NextLink>
          </PaginationListItem>
        )}
        {has_next_page && (
          <PaginationNext>
            <NextLink
              passHref
              href={{
                pathname: pathname,
                query: {
                  ...query,
                  page: next_page,
                },
              }}
            >
              <a>Next</a>
            </NextLink>
          </PaginationNext>
        )}
      </PaginationList>
    </PaginationContainer>
  );
}
