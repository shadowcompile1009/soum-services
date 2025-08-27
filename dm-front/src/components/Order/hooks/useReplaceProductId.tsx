import { useCallback } from 'react';

import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Order } from '@/models/Order';

import { IssueReplacement } from '../ReplacementOrders';
import { ReplaceProductId } from '../ReplacementOrders/ReplaceProductId';

export const useReplaceProductId = ({
  rowId,
  replacedProductId,
  replacementRefs,
  queryKey,
  orderId,
}: {
  rowId: string;
  replacedProductId?: string;
  replacementRefs: React.MutableRefObject<Record<string, string>>;
  queryKey: string[];
  orderId: string;
}) => {
  const queryClient = useQueryClient();
  const isMutating = useIsMutating({
    mutationKey: [orderId, replacedProductId],
  });

  const replaceProductIdMutation = useMutation(
    ({ orderId, productId }: { orderId: string; productId: string }) =>
      Order.replaceProductId(orderId, productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
        toast.success('Product ID replaced successfully');

        if (replacementRefs.current[rowId]) {
          delete replacementRefs.current[rowId];
        }
      },
      mutationKey: [orderId, replacedProductId],
      onError: (error: any) => {
        console.log('error', error);

        if (error?.response?.data?.message) {
          const errorMessage = error?.response?.data?.message;
          try {
            const message = JSON.parse(errorMessage) || [];
            toast.error(message[0]?.msg);
          } catch (e) {
            toast.error(errorMessage);
          }
        } else {
          toast.error('Failed to replace product ID');
        }
      },
    }
  );

  const handleInputChange = useCallback(
    (value: string) => {
      replacementRefs.current[rowId] = value;
    },
    [rowId, replacementRefs]
  );

  const handleSubmit = useCallback(() => {
    const value = replacementRefs.current[rowId] || '';

    if (value.length > 3) {
      replaceProductIdMutation.mutate({
        orderId: orderId,
        productId: value,
      });
    }
  }, [rowId, replacementRefs, queryClient, queryKey]);

  const ReplaceProductIdInput = useCallback(
    () => (
      <ReplaceProductId
        value={replacementRefs.current[rowId] || ''}
        onChange={handleInputChange}
        placeholder="Enter Product ID"
      />
    ),
    [handleInputChange, rowId, replacementRefs]
  );

  const ReplaceProductIdSubmit = useCallback(
    () => (
      <IssueReplacement
        onSubmit={handleSubmit}
        isDisabled={!!replacedProductId}
        isMutating={!!isMutating}
      />
    ),
    [handleSubmit, replacedProductId, isMutating]
  );

  return { ReplaceProductIdInput, ReplaceProductIdSubmit };
};
