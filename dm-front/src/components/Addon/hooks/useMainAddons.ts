import { QUERY_KEYS } from '@/constants/queryKeys';
import { Addon } from '@/models/Addon';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useMainAddons = () => {
  const router = useRouter();
  const { offset = 0, limit = 15 } = router.query;

  return useQuery([QUERY_KEYS.addOns, String(offset), String(limit)], () => {
    return Addon.getMainAddons(Number(offset), Number(limit));
  });
};
