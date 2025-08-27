import { Addon } from '@/models/Addon';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useSubAddons = (modelId: string = '') => {
  const router = useRouter();
  const { offset = 0, limit = 15 } = router.query;

  return useQuery([modelId, String(offset), String(limit)], () => {
    return Addon.getSubAddons(modelId, Number(offset), Number(limit));
  });
};
