import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { Container } from 'typedi';

import { Banner, GetBannersRequest, GetBannersResponse } from './proto/v2.pb';
import { BannerService } from '../services/bannerService';
import { BannerFilterDto } from '../dto/banner/BannerFilterDto';
import { BannerDocument } from '../models/Banner';

const bannerService = Container.get(BannerService);

export const GetBanners = async (
  call: ServerUnaryCall<GetBannersRequest, GetBannersResponse>,
  callback: sendUnaryData<GetBannersResponse>
) => {
  try {
    const filter = {
      bannerPage: call.request.bannerPage,
      bannerPosition: call.request.bannerPosition,
      region: call.request.region,
      lang: call.request.lang,
      type: call.request.type || '',
    } as BannerFilterDto;

    const data: BannerDocument[] = await bannerService.getBanners(filter);

    const banners: Banner[] = data.map((bannerDoc: BannerDocument) => {
      const {
        id,
        banner_image,
        banner_name,
        banner_page,
        banner_position,
        position,
        banner_type,
        banner_value,
        lang,
      } = bannerDoc;

      return {
        id: id,
        bannerImage: banner_image,
        bannerName: banner_name,
        bannerPage: banner_page,
        bannerPosition: banner_position,
        bannerType: banner_type,
        bannerValue: banner_value,
        position,
        lang,
      } as Banner;
    });

    callback(null, { banners });
  } catch (error) {
    console.log(error);
    callback(new Error(error.message), null);
  }
};
