import { Button } from '@/components/Button';

export const IssueReplacement = ({
  onSubmit,
  isDisabled,
  isMutating,
}: {
  onSubmit: () => void;
  isDisabled: boolean;
  isMutating: boolean;
}) => {
  return (
    <Button
      variant="filled"
      type="submit"
      onClick={onSubmit}
      disabled={isDisabled || !!isMutating}
    >
      {isMutating
        ? 'Replacing...'
        : isDisabled
        ? 'Order Replaced'
        : 'Replace Order'}
    </Button>
  );
};
