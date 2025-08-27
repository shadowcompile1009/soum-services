import { DeepKeys } from '@tanstack/react-table';
import { DeviceModel } from '@/models/DeviceModel';

export interface DeviceModelColumn {
  accessor: DeepKeys<DeviceModel>;
  header: string;
}
export const deviceModelsColumns: DeviceModelColumn[] = [
  {
    header: 'Picture',
    accessor: 'modelIcon',
  },
  {
    header: 'Model Name',
    accessor: 'name',
  },
];
