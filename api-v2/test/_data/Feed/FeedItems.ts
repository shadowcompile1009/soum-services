import { GetAdminFeedItemDto } from '../../../src/dto/AdminCollection/GetAdminFeedItemDto';

export const validFeedItem = {
  productId: '61ff617ef04b9c442cbbbe8e',
  sellStatus: 'Available',
  expiryDate: new Date(3022, 1, 1),
  sellPrice: 100,
  modelName: 'test Name',
  position: 0,
} as GetAdminFeedItemDto;
