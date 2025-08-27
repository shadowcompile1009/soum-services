import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/auth.guard';
import {
  ProductViewAnalysisDto,
  ProductViewerDto,
  ProductViewerSPPDto,
} from './dto/product-view-analysis.dto';
import { ProductViewService } from './product-views.service';

@Controller('/')
@ApiTags('ProductViews')
@ApiHeader({
  name: 'token',
  description: 'Auth token',
})
export class ProductViewsController {
  constructor(
    @Inject(ProductViewService)
    private readonly productViewService: ProductViewService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('/status')
  async getStatus() {
    return { statu: 'OK' };
  }

  @Get('/recently-viewed')
  @UseGuards(JwtAuthGuard)
  async recentlyViewedProducts(@Req() request: any) {
    const userId = request?.user?.userId;
    const key = `user-rvp:${userId}`;
    let recentlyViewed = await this.cacheManager.get<any>(key);
    if (recentlyViewed === null || recentlyViewed === undefined) {
      recentlyViewed = await this.productViewService.getRecentlyViewedProducts(
        userId,
        request?.query?.categoryId?.toString(),
      );
      await this.cacheManager.set(key, recentlyViewed, 60 * 60 * 1000);
    }
    return recentlyViewed;
  }

  @Get('/recently-viewed/:categoryId')
  @UseGuards(JwtAuthGuard)
  async recentlyViewedProductsByCategory(@Req() request: any) {
    const userId = request?.user?.userId;
    const key = `user-rvp:${request?.params?.categoryId}:${userId}`;
    let recentlyViewed = await this.cacheManager.get<any>(key);
    if (recentlyViewed === null || recentlyViewed === undefined) {
      recentlyViewed = await this.productViewService.getRecentlyViewedProducts(
        userId,
        request?.params?.categoryId?.toString(),
        true,
      );
      await this.cacheManager.set(key, recentlyViewed, 60 * 60 * 1000);
    }
    return recentlyViewed;
  }

  @Post('/view-analysis')
  @HttpCode(200)
  async getViewersAndBuyClicksProduct(
    @Payload() viewersProductDto: ProductViewerDto,
  ) {
    return {
      buyNowClickCount: 0,
      productId: viewersProductDto.productId,
      viewCount: 0,
    } as ProductViewAnalysisDto;
    // const productId = viewersProductDto?.productId;
    // const key = `'cloud-function-product-views-buy-clicks-'${productId}`;
    // let recentlyDataView = await getCache<ProductViewAnalysisDto>(key) as ProductViewAnalysisDto;
    // if (recentlyDataView === null || recentlyDataView === undefined) {
    //   recentlyDataView = new ProductViewAnalysisDto();
    //   const recentlyViewedData =  await getViewersOrClicksProduct([productId]);
    //   recentlyDataView.viewCount = recentlyViewedData?.[0]?.sppViewed || 0;
    //   recentlyDataView.buyNowClickCount = recentlyViewedData?.[0]?.clickedBuyNow || 0;
    //   const data = await this.productViewService.validateCountViewAndClickProduct([recentlyDataView]);
    //   await setCache(key,data[0], 30 * 60);
    // }
    // return recentlyDataView;
  }
  @Post('/view-analysis/mpp')
  @HttpCode(200)
  async getViewersAndBuyClicksProductSPP(
    @Payload() viewersProductSPPDto: ProductViewerSPPDto,
  ) {
    return (viewersProductSPPDto?.productIds || []).map((elem) => {
      return {
        buyNowClickCount: 0,
        productId: elem,
        viewCount: 0,
      } as ProductViewAnalysisDto;
    });
    // const productIds = viewersProductSPPDto?.productIds;
    // const key = createKey('cloud-function-product-views-buy-clicks-spp', [productIds?.join('_')]);
    // let recentlyDataViews = await getCache<ProductViewAnalysisDto[]>(key) as ProductViewAnalysisDto[];
    // if (recentlyDataViews === null || recentlyDataViews === undefined) {
    //   const viewDataMap = new Map<string, ProductViewerClickCloudFuncDto>();
    //   const recentlyViewedData =  await getViewersOrClicksProduct(productIds);
    //   recentlyViewedData.forEach((view: ProductViewerClickCloudFuncDto) => {
    //     viewDataMap.set(view.productId, view);
    //   });
    //   recentlyDataViews = productIds.map(productId => {
    //     if (viewDataMap.has(productId)) {
    //       return {
    //         productId,
    //         viewCount: viewDataMap.get(productId)?.sppViewed,
    //         buyNowClickCount: viewDataMap.get(productId)?.clickedBuyNow
    //       };
    //     }
    //   })
    //   await setCache(key, recentlyDataViews, 30 * 60);
    // }
    // return recentlyDataViews;
  }
}
