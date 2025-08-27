import { PaginateResult } from 'mongoose';

export type PaginationDto<T> = Pick<
  PaginateResult<T>,
  'docs' | 'totalDocs' | 'hasNextPage'
>;
