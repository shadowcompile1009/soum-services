import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Box } from '@/components/Box';
import { Text } from '@/components/Text';

import {
  DotIcon,
  PaginationContainer,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrevious,
  PaginationProps,
} from './Pagination.styled';

export function Pagination(props: PaginationProps) {
  const router = useRouter();
  const { query, pathname } = router;

  const {
    currentItemsCount,
    totalItems,
    limit,
    items,
    currentPage,
    minPageLimit = 3,
    maxPageLimit = 2,
  } = props;
  const currentMaxPageLimit = currentPage + maxPageLimit;
  const currentMinPageLimit = currentPage - minPageLimit;

  // Fix for the lastPageOffset calculation
  const totalPages = Math.ceil(totalItems / limit);
  const lastPageOffset = (totalPages - 1) * limit;

  const previousOffset = items.find(
    (item) => item.pageNumber === currentPage - 1
  );
  const nextOffset = items.find((item) => item.pageNumber === currentPage + 1);

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
          {/* starting from page 2 will enable the btn */}
          {currentPage > 1 ? (
            <NextLink
              href={{
                pathname: pathname,
                query: {
                  ...query,
                  limit: limit,
                  offset: previousOffset?.offset,
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
        {currentMinPageLimit >= 1 && (
          <PaginationListItem>
            <NextLink
              passHref
              href={{
                pathname,
                query: {
                  ...query,
                  limit,
                  offset: 0, // First page always starts at offset 0
                },
              }}
            >
              <a>1</a>
            </NextLink>
          </PaginationListItem>
        )}

        {currentMinPageLimit >= 1 && (
          <PaginationListItem>
            <NextLink
              passHref
              href={{
                pathname: pathname,
                query: {
                  ...query,
                  limit: limit,
                  offset: previousOffset?.offset,
                },
              }}
            >
              <a>
                <DotIcon />
                <DotIcon />
                <DotIcon />
              </a>
            </NextLink>
          </PaginationListItem>
        )}
        {items.map((item) => {
          if (
            item.pageNumber <= currentMaxPageLimit &&
            item.pageNumber > currentMinPageLimit
          ) {
            return (
              <PaginationListItem
                key={item.pageNumber}
                isActive={item.pageNumber === currentPage}
              >
                <NextLink
                  passHref
                  href={{
                    pathname: pathname,
                    query: {
                      ...query,
                      limit: limit,
                      offset: item.offset,
                    },
                  }}
                >
                  <a>{item.pageNumber}</a>
                </NextLink>
              </PaginationListItem>
            );
          }
        })}

        {items.length > currentMaxPageLimit && (
          <PaginationListItem>
            <NextLink
              passHref
              href={{
                pathname: pathname,
                query: {
                  ...query,
                  limit: limit,
                  offset: nextOffset?.offset,
                },
              }}
            >
              <a>
                <DotIcon />
                <DotIcon />
                <DotIcon />
              </a>
            </NextLink>
          </PaginationListItem>
        )}
        {currentMaxPageLimit < totalPages && (
          <PaginationListItem>
            <NextLink
              passHref
              href={{
                pathname,
                query: {
                  ...query,
                  limit,
                  offset: lastPageOffset,
                },
              }}
            >
              <a>{totalPages}</a>
            </NextLink>
          </PaginationListItem>
        )}
        <PaginationNext>
          {/* check if there is next offset to disable and enable next */}
          {nextOffset ? (
            <NextLink
              passHref
              href={{
                pathname: pathname,
                query: {
                  ...query,
                  limit: limit,
                  offset: nextOffset?.offset,
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
