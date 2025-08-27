interface usePaginationProps {
  limit: string;
  offset: string;
  total: number;
}
export function usePagination({ limit, offset, total }: usePaginationProps) {
  const limitNumber = Number(limit);
  const offsetNumber = Number(offset);
  const totalNumber = Number(total);

  const parsedTotal = Math.ceil(totalNumber / limitNumber);
  const totalPages = parsedTotal > 0 ? parsedTotal : 1;
  const currentPage = Math.floor(offsetNumber / limitNumber) + 1;
  const itemsCount = currentPage * limitNumber;
  const currentItemsCount = itemsCount < totalNumber ? itemsCount : totalNumber;

  const items = Array(totalPages)
    .fill(null)
    .map((_, index) => ({
      pageNumber: index + 1,
      offset: index * limitNumber,
    }));

  return {
    totalPages,
    currentPage,
    currentItemsCount,
    total: totalNumber,
    items,
    limit: limitNumber,
    offset: offsetNumber,
  };
}
