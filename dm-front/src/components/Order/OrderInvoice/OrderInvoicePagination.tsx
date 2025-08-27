import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Box } from '@src/components/Box';
import { Text } from '@src/components/Text';

import {
  PaginationContainer,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrevious,
  PaginationProps,
} from './OrderInvoicePagination.styled';

export function OrderInvoicePagination(props: PaginationProps) {
  const router = useRouter();
  const { query, pathname } = router;

  const {
    currentItemsCount,
    totalItems,
    currentPage,
    totalPages,
    minPageLimit = 3,
    maxPageLimit = 2,
  } = props;

  const currentMaxPageLimit = Math.min(currentPage + maxPageLimit, totalPages);
  const currentMinPageLimit = Math.max(currentPage - minPageLimit, 1);

  return (
    <PaginationContainer
      direction="horizontal"
      justify="space-between"
      align="center"
    >
      <Text color="static.grays.10" fontSize="baseText" fontWeight="regular">
        {`Showing ${currentItemsCount} out of ${totalItems} items`}
      </Text>
      <PaginationList>
        <PaginationPrevious>
          {currentPage > 1 ? (
            <NextLink
              href={{
                pathname,
                query: {
                  ...query,
                  page: currentPage - 1,
                },
              }}
            >
              <a>Previous</a>
            </NextLink>
          ) : (
            <Box cssProps={{ paddingX: 8, paddingY: 4 }}>
              <Text
                as="span"
                color="static.gray"
                fontSize="regular"
                fontWeight="regular"
              >
                Previous
              </Text>
            </Box>
          )}
        </PaginationPrevious>
        {currentMinPageLimit > 1 && (
          <PaginationListItem>
            <NextLink
              passHref
              href={{
                pathname,
                query: {
                  ...query,
                  page: 1,
                },
              }}
            >
              <a>1</a>
            </NextLink>
          </PaginationListItem>
        )}
        {currentMinPageLimit > 2 && (
          <PaginationListItem>...</PaginationListItem>
        )}
        {Array.from(
          { length: currentMaxPageLimit - currentMinPageLimit + 1 },
          (_, i) => currentMinPageLimit + i
        ).map((pageNumber) => (
          <PaginationListItem
            key={pageNumber}
            isActive={pageNumber === currentPage}
          >
            <NextLink
              passHref
              href={{
                pathname,
                query: {
                  ...query,
                  page: pageNumber,
                },
              }}
            >
              <a>{pageNumber}</a>
            </NextLink>
          </PaginationListItem>
        ))}
        {currentMaxPageLimit < totalPages - 1 && (
          <PaginationListItem>...</PaginationListItem>
        )}
        {currentMaxPageLimit < totalPages && (
          <PaginationListItem>
            <NextLink
              passHref
              href={{
                pathname,
                query: {
                  ...query,
                  page: totalPages,
                },
              }}
            >
              <a>{totalPages}</a>
            </NextLink>
          </PaginationListItem>
        )}
        <PaginationNext>
          {currentPage < totalPages ? (
            <NextLink
              passHref
              href={{
                pathname,
                query: {
                  ...query,
                  page: currentPage + 1,
                },
              }}
            >
              <a>Next</a>
            </NextLink>
          ) : (
            <Box cssProps={{ paddingX: 8, paddingY: 4 }}>
              <Text
                as="span"
                color="static.gray"
                fontSize="regular"
                fontWeight="regular"
              >
                Next
              </Text>
            </Box>
          )}
        </PaginationNext>
      </PaginationList>
    </PaginationContainer>
  );
}
