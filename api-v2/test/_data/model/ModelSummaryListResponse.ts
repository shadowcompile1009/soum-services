import { DeviceModelSummaryDto } from '../../../src/dto/deviceModel/DeviceModelSummaryDto';

export const modelSummaryListResponse = [
  {
    id: '614c336a43c9a7d7567b1717',
    arName: 'arName',
    enName: 'test',
    modelIcon: 'https://images/image.png',
    totalAvailableProducts: 50,
  } as DeviceModelSummaryDto,
  {
    id: '614c336a43c9a7d7567b1718',
    arName: 'arName1',
    enName: 'test 1',
    modelIcon: 'https://images/image1.png',
    totalAvailableProducts: 30,
  } as DeviceModelSummaryDto,
];

export const totalProductsPerModelArray = [
  {
    _id: '614c336a43c9a7d7567b1717',
    totalAvailableProducts: 8,
  },
  {
    _id: '614c336a43c9a7d7567b1718',
    totalAvailableProducts: 3,
  },
];

export const modelSummaryListResponseWithFilter = [
  {
    id: '614c336a43c9a7d7567b1717',
    arName: 'arName',
    enName: 'test',
    modelIcon: 'https://images/image.png',
    totalAvailableProducts: 8,
  } as DeviceModelSummaryDto,
  {
    id: '614c336a43c9a7d7567b1718',
    arName: 'arName1',
    enName: 'test 1',
    modelIcon: 'https://images/image1.png',
    totalAvailableProducts: 3,
  } as DeviceModelSummaryDto,
];
