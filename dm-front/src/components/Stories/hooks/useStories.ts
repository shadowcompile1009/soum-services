import { QUERY_KEYS } from '@/constants/queryKeys';
import { Story } from '@/models/Story';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useStories = () => {
  const router = useRouter();
  const {
    limit = '10',
    page = '1',
    search = '',
    filterDate = '',
  } = router.query;
  return useQuery(
    [
      QUERY_KEYS.stories,
      String(page),
      String(limit),
      String(search),
      String(filterDate),
    ],
    () =>
      Story.getStories(
        Number(page),
        Number(limit),
        String(search),
        String(filterDate)
      )
  );
};
