import { QUERY_KEYS } from '@/constants/queryKeys';
import { Story } from '@/models/Story';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

interface UseStoryProps {
  limit?: number;
  page?: number;
}
export const useOrderStories = (props: UseStoryProps) => {
  const { limit = 100 } = props;
  const router = useRouter();
  const { query } = router;
  const { page = 1 } = query;
  const pageSize = limit;
  return useQuery([QUERY_KEYS.stories, String(page), String(pageSize)], () =>
    Story.getStories(Number(page), Number(pageSize))
  );
};
