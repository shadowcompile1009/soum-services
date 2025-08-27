import { Injectable } from '@nestjs/common';
import { V2Service } from '../v2/v2.service';
import { Banner, GetBannersRequest, GetFeedRequest } from '../grpc/proto/v2.pb';
import { CategoryService } from '../category/category.service';
import { GetCategoriesRequest } from '../grpc/proto/category.pb';
import { FeedType } from './enums/feedtype.enum';
import { CategoryType } from './enums/categoryType.enum';
import { BannerPage } from './enums/bannerPage.enum';

@Injectable()
export class HomepageService {
  constructor(
    private readonly v2Service: V2Service,
    private readonly categoryService: CategoryService,
  ) {}
  async getHomepageData() {
    const getBannersRequest: GetBannersRequest = {
      bannerPage: [BannerPage.HOME, BannerPage.SEO],
      bannerPosition: '',
      region: '',
      lang: '',
      type: '',
    };

    let enBanners: Banner[] = [];
    let arBanners: Banner[] = [];
    try {
      const banners = await this.v2Service.getBanners(getBannersRequest);
      enBanners = banners.banners.filter((banner) => banner.lang === 'en');
      arBanners = banners.banners.filter((banner) => banner.lang === 'ar');
    } catch (err) {
      console.log('failed to get banners', err);
      enBanners = [];
      arBanners = [];
    }

    const getFeedRequest: GetFeedRequest = {
      size: 10,
      feedTypes: [FeedType.HOME_PAGE, FeedType.OFFERS, FeedType.BUDGET],
      brands: [],
      models: [],
      categories: [],
      category: '',
    };

    let feeds = [];
    let mostSoldModels = [];
    try {
      ({ feeds, mostSoldModels } =
        await this.v2Service.getFeeds(getFeedRequest));
    } catch (err) {
      console.log('failed to fetch feeds', err);
      feeds = [];
      mostSoldModels = [];
    }

    const getCategoriesReq: GetCategoriesRequest = {
      limit: 50,
      offset: 0,
      type: CategoryType.CATEGORY,
    };

    let categories = [];
    try {
      const _categories =
        await this.categoryService.getCategories(getCategoriesReq);
      categories = _categories.categories.map((category) => {
        return {
          id: category?.id || '',
          categoryNameAr: category?.nameAr || '',
          categoryName: category?.name || '',
          miniCategoryIcon: category?.icon?.url || '',
          position: category?.position || '',
          type: CategoryType.CATEGORY,
          _id: category?.id || '', // will be deprecated
          category_name_ar: category?.nameAr || '', // will be deprecated
          category_name: category?.name || '', // will be deprecated
          mini_category_icon: category?.icon?.url || '', // will be deprecated
        };
      });
    } catch (err) {
      console.log('failed to fetch categories', err);
      categories = [];
    }

    const homeJson = {
      categories: categories || [],
      banners: {
        ar: arBanners || [],
        en: enBanners || [],
      },
      mostSoldModels: mostSoldModels || [],
      feeds: feeds || [],
    };

    return homeJson;
  }

  async getHomepageDataByCategory(category: string) {
    const getBannersRequest: GetBannersRequest = {
      bannerPage: [BannerPage.HOME, BannerPage.SEO],
      type: category,
      bannerPosition: '',
      region: '',
      lang: '',
    };

    let enBanners: Banner[] = [];
    let arBanners: Banner[] = [];
    try {
      const banners = await this.v2Service.getBanners(getBannersRequest);
      enBanners = banners.banners.filter((banner) => banner.lang === 'en');
      arBanners = banners.banners.filter((banner) => banner.lang === 'ar');
    } catch (err) {
      console.log('failed to get banners', err);
      enBanners = [];
      arBanners = [];
    }

    const getFeedRequest: GetFeedRequest = {
      size: 10,
      feedTypes: [FeedType.HOME_PAGE],
      category,
      brands: [],
      models: [],
      categories: [],
    };

    let feeds = [];
    let mostSoldModels = [];
    try {
      ({ feeds, mostSoldModels } =
        await this.v2Service.getFeeds(getFeedRequest));
    } catch (err) {
      console.log('failed to fetch feeds', err);
      feeds = [];
      mostSoldModels = [];
    }

    const getCategoriesReq: GetCategoriesRequest = {
      limit: 50,
      offset: 0,
      type: CategoryType.CATEGORY,
    };

    let categories = [];
    try {
      const _categories =
        await this.categoryService.getCategories(getCategoriesReq);
      categories = _categories.categories.map((category) => {
        return {
          id: category?.id || '',
          categoryNameAr: category?.nameAr || '',
          categoryName: category?.name || '',
          miniCategoryIcon: category?.icon?.url || '',
          position: category?.position || '',
          type: CategoryType.CATEGORY,
          _id: category?.id || '', // will be deprecated
          category_name_ar: category?.nameAr || '', // will be deprecated
          category_name: category?.name || '', // will be deprecated
          mini_category_icon: category?.icon?.url || '', // will be deprecated
        };
      });
    } catch (err) {
      console.log('failed to fetch categories', err);
      categories = [];
    }

    const homeJson = {
      categories: categories || [],
      banners: {
        ar: arBanners || [],
        en: enBanners || [],
      },
      mostSoldModels: mostSoldModels || [],
      feeds: feeds || [],
    };

    return homeJson;
  }
}
