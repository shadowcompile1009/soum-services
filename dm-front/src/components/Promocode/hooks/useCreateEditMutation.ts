import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/Toast';
import { Promocode } from '@/models/Promocode';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useCreateEditMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      id,
    }: {
      data: Parameters<typeof Promocode.createEdit>[0];
      id?: string;
    }) => {
      const response = await Promocode.createEdit(data, id);

      return response;
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.createEditPromocode],
      });

      // Snapshot the previous value
      const previousPromocodes = queryClient.getQueryData([
        QUERY_KEYS.createEditPromocode,
      ]);

      // Return a context object with the snapshotted value
      return { previousPromocodes };
    },
    onSuccess: (_, variables) => {
      toast.success(
        toast.getMessage(
          variables.id
            ? 'onUpdateSpecificationSuccess'
            : 'onGeneratePromocodeSuccess'
        )
      );
      // Invalidate and refetch
      queryClient.invalidateQueries([QUERY_KEYS.promocodeList]);
    },
    onError: (error: any) => {
      if (error.response?.data) {
        // Handle validation errors
        if (typeof error.response.data === 'object') {
          Object.values(error.response.data).forEach((message: any) => {
            if (typeof message === 'string') {
              toast.error(message);
            }
          });
        } else {
          // If it's a simple error message
          toast.error(error.response.data);
        }
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    },
  });
};
