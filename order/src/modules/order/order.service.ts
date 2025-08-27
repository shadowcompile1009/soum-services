import { Injectable } from '@nestjs/common';
import { V2Service } from '../v2/v2.service';
import { RedisClient } from '@src/utils/redis';

@Injectable()
export class OrderService {
  constructor(private readonly v2Service: V2Service) {}
  async getRecentlySoldProducts(hours: number, limit: number, offset: number, categoryId: string = '') {
    const key = `recentlySoldProds_${hours}_${limit}_${offset}`;
    let recentlySoldProd = await RedisClient.getCache(key); // read from cashed data
    const result = await this.v2Service.getRecentlySoldProducts(
      hours,
      limit,
      offset,
      categoryId,
    );
    recentlySoldProd = (result.products || []).map((elem) => {
      return {
        arGrade: elem.gradeAr,
        grade: elem.grade,
        arModelName: elem?.deviceModel?.nameAr,
        arVariantName: elem?.variant?.nameAr,
        variantName: elem.variant,
        attributes: elem.attributes,
        modelName: elem?.deviceModel?.name,
        originalPrice: elem.originalPrice,
        productId: elem.id,
        productImage: elem.productImage,
        productImages: elem.productImages,
        sellPrice: elem.sellPrice,
        sellStatus: elem.sellStatus,
        grandTotal: elem?.grandTotal,
        buyAmount: elem?.buyAmount,
        shippingCharge: elem?.shippingCharge,
        vat: elem?.vat,
        tags: elem.tags,
        sellDate: elem.sellDate,
        condition: elem.condition,
      };
    });
    await RedisClient.setCache(key, recentlySoldProd, 1 * 60);
    return recentlySoldProd;
  }

  async getRecentlySoldProductsByCategory(hours: number, limit: number, offset: number, categoryId: string) {
    const key = `recentlySoldProds_${hours}_${limit}_${offset}_${categoryId}`;
    let recentlySoldProd = await RedisClient.getCache(key); // read from cashed data
    if (recentlySoldProd) return recentlySoldProd;
    const result = await this.v2Service.getRecentlySoldProducts(
      hours,
      limit,
      offset,
      categoryId,
      true
    );
    recentlySoldProd = (result.products || []).map((elem) => {
      return {
        arGrade: elem.gradeAr,
        grade: elem.grade,
        arModelName: elem?.deviceModel?.nameAr,
        arVariantName: elem?.variant?.nameAr,
        variantName: elem.variant,
        attributes: elem.attributes,
        modelName: elem?.deviceModel?.name,
        originalPrice: elem.originalPrice,
        productId: elem.id,
        productImage: elem.productImage,
        productImages: elem.productImages,
        sellPrice: elem.sellPrice,
        sellStatus: elem.sellStatus,
        grandTotal: elem?.grandTotal,
        buyAmount: elem?.buyAmount,
        shippingCharge: elem?.shippingCharge,
        vat: elem?.vat,
        tags: elem.tags,
        sellDate: elem.sellDate,
        condition: elem.condition,
      };
    });
    await RedisClient.setCache(key, recentlySoldProd, 1 * 60);
    return recentlySoldProd;
  }
}
