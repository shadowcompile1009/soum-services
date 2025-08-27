import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { VaultInstance } from '@src/utils/vault.util';
import {
  GetViewedProductsRequest,
  GetViewedProductsResponse_Product,
} from '../grpc/proto/v2.pb';
import { V2Service } from '../v2/v2.service';
import { ProductViewAnalysisDto } from './dto/product-view-analysis.dto';
import { ProductViewDto } from './dto/product-views.dto';
import { ProductView, viewItem } from './entities/product-views.entity';

@Injectable()
export class ProductViewService {
  constructor(
    @InjectRepository(ProductView)
    private readonly productViewRepository: EntityRepository<ProductView>,
    readonly v2Service: V2Service,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly vaultInstance: VaultInstance,
  ) {}
  async getRecentlyViewedProducts(
    userId: string,
    categoryId: string = '',
    getSpecificCategory: boolean = false,
  ): Promise<GetViewedProductsResponse_Product[]> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 8);

      const result = await this.productViewRepository.findOne({
        userId,
      });
      if (!result) {
        return [];
      }
      const productIds: string[] = result.products
        .filter((elem) => elem.viewedAt > sevenDaysAgo)
        .map((productView) => productView.productId);
      const getProductsRequest: GetViewedProductsRequest = {
        productIds,
        categoryId,
        getSpecificCategory,
      };
      const { products } =
        await this.v2Service.getViewedProducts(getProductsRequest);
      if (!products || products.length === 0) {
        return [];
      }
      const formattedProds = this.formatProducts(products, result.products);

      const sortedProducts = this.sortProductsByProductId(
        formattedProds,
        productIds,
      );

      return sortedProducts;
    } catch (error) {
      console.error('Error in getRecentlyViewedProducts:', error);
      return [];
    }
  }
  private sortProductsByProductId(
    products: GetViewedProductsResponse_Product[],
    productIds: string[],
  ): GetViewedProductsResponse_Product[] {
    const customSort = (
      a: GetViewedProductsResponse_Product,
      b: GetViewedProductsResponse_Product,
    ): number => {
      const indexA = productIds.indexOf(a.id);
      const indexB = productIds.indexOf(b.id);
      return indexA - indexB;
    };

    return products.sort(customSort);
  }

  private formatProducts(
    products: GetViewedProductsResponse_Product[],
    productViews: viewItem[],
  ): any {
    const modifiedProducts = products.map((product) => {
      const matchedView = productViews.find(
        (view) => view.productId === product.id,
      );

      return {
        id: product?.id,
        deviceModel: product.deviceModel,
        variant: product.variant,
        productImage: product?.productImage,
        grade: product?.grade,
        gradeAr: product?.gradeAr,
        attributes: product?.attributes || [],
        isGreatDeal: product?.isGreatDeal,
        isMerchant: product?.isMerchant || false,
        originalPrice: product?.originalPrice,
        productImages: product?.productImages,
        sellPrice: product?.sellPrice,
        grandTotal: matchedView?.grandTotal ?? 0,
        tags: product?.tags || '',
        sellStatus: product?.sellStatus,
        sellDate: product?.sellDate,
        condition: product?.condition,
        showSecurityBadge: product?.showSecurityBadge,
        brand: {
          name: product?.brand?.name || '',
          nameAr: product?.brand?.nameAr || '',
        },
        categoryName: product?.category?.name || '',
        categoryNameAr: product?.category?.nameAr || '',
        expressDeliveryBadge: product?.expressDeliveryBadge || false,
        Year: product?.year || '',
        Condition: product?.condition?.name || '',
        productId: product.id, // to be deprecated
        modelName: product?.deviceModel?.name, // to be deprecated
        arModelName: product?.deviceModel?.nameAr, // to be deprecated
        arVariantName: product?.variant?.nameAr, // to be deprecated
        variantName: product?.variant?.name, // to be deprecated
      };
    });
    return modifiedProducts;
  }

  private async cleanupOldUserProductViews(userId: string): Promise<void> {
    try {
      const userProductViews = await this.productViewRepository.findOne({
        userId: userId,
      });

      if (userProductViews.products.length > 15) {
        userProductViews.products = userProductViews.products.slice(0, 15);
        await this.productViewRepository.upsert(userProductViews);
        await this.productViewRepository
          .getEntityManager()
          .persistAndFlush(userProductViews);
      }
    } catch (error) {
      console.error('Error in cleanupOldUserProductViews:', error?.details);
      return;
    }
  }

  async logProductView(productViewReq: ProductViewDto): Promise<any> {
    try {
      let userViewsRecord = await this.productViewRepository.findOne({
        userId: productViewReq.userId,
      });
      if (userViewsRecord) {
        userViewsRecord.products = [
          {
            productId: productViewReq.productId,
            grandTotal: productViewReq.grandTotal,
            viewedAt: new Date(),
          },
          ...userViewsRecord.products.filter(
            (elem) => elem.productId !== productViewReq.productId,
          ),
        ];
      } else {
        userViewsRecord = this.productViewRepository.create({
          userId: productViewReq.userId,
          products: [
            {
              productId: productViewReq.productId,
              grandTotal: productViewReq.grandTotal,
              viewedAt: productViewReq.viewedAt,
            },
          ],
        });
      }
      await this.productViewRepository.upsert(userViewsRecord);
      await this.productViewRepository
        .getEntityManager()
        .persistAndFlush(userViewsRecord);
      await this.cleanupOldUserProductViews(productViewReq.userId);
      let key = `user-rvp-cars-${productViewReq.userId}`;
      await this.cacheManager.del(key);
      key = `user-rvp-${productViewReq.userId}`;
      await this.cacheManager.del(key);
    } catch (error) {
      console.error('Error in logProductView:', error);
      return;
    }
  }
  async validateCountViewAndClickProduct(
    productViews: ProductViewAnalysisDto[],
  ) {
    const secretData = await this.vaultInstance.getSecretData('product');
    const minBuyNowCount = Number(secretData?.minBuyNowCount || '6');
    const minViewCount = Number(secretData?.minViewCount || '39');

    await Promise.all(
      productViews.map((productView) => {
        if (productView.viewCount >= minViewCount) {
          productView.viewCount =
            productView.viewCount >= 1000 ? 1000 : productView.viewCount;
        }
        if (productView.buyNowClickCount > minBuyNowCount) {
          productView.viewCount = 0;
          productView.buyNowClickCount = productView.buyNowClickCount;
        }
      }),
    );
    return productViews;
  }
}
