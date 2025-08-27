import { DeviceModel } from '@/models/DeviceModel';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useDeviceModels = (brandId: string = '') => {
  const router = useRouter();
  const { page = 1, size = 20 } = router.query;

  return useQuery([brandId, String(page), String(size)], () => {
    return DeviceModel.getDeviceModels(brandId, Number(page), Number(size));
  });
};
