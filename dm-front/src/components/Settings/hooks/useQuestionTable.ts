import { useQuery } from '@tanstack/react-query';

import { toast } from '@/components/Toast';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Setting } from '@/models/Setting';

export function useQuestionTable({
  categoryId,
  limit = '10',
  page = '1',
}: {
  categoryId: string;
  limit?: string;
  page?: string;
}) {
  return useQuery(
    [QUERY_KEYS.questionSettings, limit, page, categoryId],
    () =>
      Setting.getQuestionsSettings({
        limit: String(limit),
        page: String(page),
        categoryId,
      }),
    {
      enabled: Boolean(categoryId),
      onError(error: any) {
        if (error?.response?.status === 403) {
          toast.error(toast.getMessage('onUnauthorizedAccessError'));
        }
      },
    }
  );
}
