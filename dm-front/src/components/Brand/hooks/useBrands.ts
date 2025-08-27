import { Brand } from '@/models/Brand';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useBrands = (categoryId: string = '') => {
  const router = useRouter();
  const { page = 1, size = 20 } = router.query;

  return useQuery([categoryId, String(page), String(size)], () => {
    return Brand.getBrands(categoryId, Number(page), Number(size));
  });
};
