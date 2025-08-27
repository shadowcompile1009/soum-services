import { DeepKeys } from '@tanstack/react-table';

import { Story } from '@/models/Story';

export interface Column {
  accessor: DeepKeys<Story>;
  header: string;
  id?: string;
}

export const storiesColumn: Column[] = [
  {
    accessor: 'nameEn',
    header: 'Stories Name En',
  },
  {
    accessor: 'nameAr',
    header: 'Stories Name Ar',
  },
  {
    accessor: 'storyURLs',
    header: 'Images/ Stories',
  },
  {
    accessor: 'startDate',
    header: 'Start Date',
  },
  {
    accessor: 'endDate',
    header: 'End Date',
  },
];
