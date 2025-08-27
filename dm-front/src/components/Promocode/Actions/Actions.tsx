import { Stack } from '@/components/Layouts';
import { Promocode } from '@/models/Promocode';

import { DeleteListing } from './DeleteListing';
import { EditIcon, EyeIcon } from '../assets';

export interface ActionProps {
  promocode: Promocode;
  setSelectedPromocode?: (promocode: Promocode | null) => void;
  setIsModalOpen?: (value: boolean) => void;
  isModalOpen?: boolean;
  isBulk?: boolean;
  isBulkModalOpen?: boolean;
  setIsBulkModalOpen?: (value: boolean) => void;
}

export function Actions(props: ActionProps) {
  const {
    promocode,
    isModalOpen,
    setIsModalOpen,
    setSelectedPromocode,
    isBulk,
    isBulkModalOpen,
    setIsBulkModalOpen,
  } = props;

  const handleEdit = () => {
    setSelectedPromocode?.(promocode);
    setIsModalOpen?.(!isModalOpen);
  };

  const handleBulkPrefix = () => {
    setSelectedPromocode?.(promocode);
    setIsBulkModalOpen?.(!isBulkModalOpen);
  };
  return (
    <Stack direction="horizontal" gap="5" justify="center" align="center">
      {isBulk && (
        <button onClick={handleBulkPrefix} style={{ border: 'none' }}>
          <EyeIcon />
        </button>
      )}
      <button onClick={handleEdit} style={{ border: 'none' }}>
        <EditIcon />
      </button>
      <DeleteListing promocode={promocode} />
    </Stack>
  );
}
