import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  InspectionReport,
  ProductInspectionSettings,
  SpecificationReport,
} from './entity/product-inspection-settings.entity';

@Injectable()
export class ProductInspectionSettingsService {
  constructor(
    @InjectRepository(ProductInspectionSettings)
    private readonly settingRepository: EntityRepository<ProductInspectionSettings>,
  ) {}

  async findOne(productId: string) {
    return await this.settingRepository.findOne({
      productId,
    });
  }

  public async addNewInspectionReport(
    productId: string,
    categoryName: string,
    inspectionReport: InspectionReport[],
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const productSettings: ProductInspectionSettings =
          await this.findOne(productId);

        if (productSettings) {
          productSettings.inspectionReport = inspectionReport;
          await this.settingRepository.upsert(productSettings);
          await this.settingRepository
            .getEntityManager()
            .persistAndFlush(productSettings);
          resolve(productSettings);

          return;
        }
        const newProductSetting: ProductInspectionSettings =
          new ProductInspectionSettings(
            productId,
            categoryName,
            inspectionReport,
            [],
          );
        await this.settingRepository.create(newProductSetting);
        await this.settingRepository
          .getEntityManager()
          .persistAndFlush(newProductSetting);
        resolve(newProductSetting);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async addNewSpecificationReport(
    productId: string,
    categoryName: string,
    specificationReport: SpecificationReport[],
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const productSettings: ProductInspectionSettings =
          await this.findOne(productId);

        if (productSettings) {
          productSettings.specificationReport = specificationReport;
          await this.settingRepository.upsert(productSettings);
          await this.settingRepository
            .getEntityManager()
            .persistAndFlush(productSettings);
          resolve(productSettings);

          return;
        }
        const newProductSetting: ProductInspectionSettings =
          new ProductInspectionSettings(
            productId,
            categoryName,
            [],
            specificationReport,
        );
        await this.settingRepository.create(newProductSetting);
        await this.settingRepository
          .getEntityManager()
          .persistAndFlush(newProductSetting);
        resolve(newProductSetting);
      } catch (err) {
        reject(err);
      }
    });
  }
}
