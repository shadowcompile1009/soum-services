import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { Container } from 'typedi';

import { FeedItem, GetFeedRequest, GetFeedsResponse } from './proto/v2.pb';
import { FeedService } from '../services/feedService';
import { ProductRepoFilters } from '../repositories/productRepository';
import { GetFullFeedDto } from '../dto/AdminCollection/GetFullFeedDto';
import { ModelService } from '../services/modelService';
import { FeedType } from '../enums/FeedType';

const feedService = Container.get(FeedService);
const modelService = Container.get(ModelService);

export const GetFeeds = async (
  call: ServerUnaryCall<GetFeedRequest, GetFeedsResponse>,
  callback: sendUnaryData<GetFeedsResponse>
) => {
  try {
    const productRepoFilters = {
      page: 1,
      size: 10,
    } as ProductRepoFilters;
    const data = await feedService.getFeeds(
      call.request?.feedTypes as FeedType[],
      productRepoFilters,
      call.request?.category,
      false
    );

    const { docs } = await modelService.getMostSoldModels(
      call.request?.category
    );

    const feeds: FeedItem[] = data.map((feedDoc: GetFullFeedDto) => {
      const {
        id,
        arName,
        enName,
        items,
        arTitle,
        enTitle,
        expiryDate,
        feedType,
        maxBudget,
        imgURL,
        position,
        totalActiveProducts,
        totalProducts,
      } = feedDoc;
      for (const item of items) {
        item.showSecurityBadge = item?.seller?.hasOptedForSF || false;
      }
      return {
        id,
        arName,
        enName,
        items,
        arTitle,
        enTitle,
        expiryDate: expiryDate?.toISOString(),
        feedType: feedType?.toString(),
        maxBudget,
        imgURL,
        position,
        totalActiveProducts,
        totalProducts,
      } as FeedItem;
    });

    callback(null, { feeds: feeds, mostSoldModels: docs });
  } catch (error) {
    console.log(error);
    callback(new Error(error.message), null);
  }
};
