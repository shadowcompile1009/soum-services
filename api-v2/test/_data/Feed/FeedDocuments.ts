import { FeedStatus } from '../../../src/enums/FeedStatus';
import { FeedDocument } from '../../../src/models/Feed';

export const FeedDocuments = [
  {
    _id: '614c336a43c9a7d7567b1717',
    arName: 'عروض ساخنه',
    enName: 'Hot Deals',
    status: FeedStatus.Active,
    items: [],
  } as FeedDocument,
  {
    _id: '614c336a43c9a7d7567b1718',
    arName: 'عروض ساخنه',
    enName: 'Hot Deals',
    status: FeedStatus.InActive,
    items: [
      {
        productId: '614c336a43c9a7d7567b1718',
        sellPrice: 100,
        sellStatus: 'Sold',
        modelName: 'test',
        expiryDate: '12-4-2022',
      } as any,
    ],
  } as FeedDocument,
];

export const feedForSoumUserWithNoItems = {
  _id: '614c336a43c9a7d7567b1717',
  arName: 'عروض ساخنه',
  enName: 'Hot Deals',
  items: [] as any[],
};
