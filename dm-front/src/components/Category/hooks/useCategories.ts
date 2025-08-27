import { CategoriesValues, Category } from '@/models/Category';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useCategories = (
  categoryType: CategoriesValues,
  categoryId: string = '',
) => {
  const router = useRouter();
  const { page = 1, size = 20 } = router.query;

  return useQuery([categoryType, String(page), String(size)], () => {
    return Category.getCategories(
      categoryType,
      categoryId,
      Number(page),
      Number(size),
    );
  });
};
