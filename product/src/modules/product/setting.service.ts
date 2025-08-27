import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Settings } from './entity/settings.entity';
import { SettingStatus } from './enum/settingStatus.enum';

@Injectable()
export class SettingService {
  /**
   *
   */
  constructor(
    @InjectRepository(Settings)
    private readonly settingRepository: EntityRepository<Settings>,
  ) {}
  async getSettings() {
    let productSetting = await this.settingRepository.findOne({
      status: SettingStatus.ACTIVE,
    });
    // this is temp if condition will remove soon
    if (!productSetting) {
      productSetting = this.settingRepository.create({
        applyDeliveryFeeMPPs: false,
        applyDeliveryFeeSPP: true,
        applyDF: true,
        applyListingFees: false,
        delayListingTime: 1440000,
        deliveryFee: 29,
        deliveryThreshold: 3500,
        referralPercentage: 10,
        refFixedAmount: 75,
        repeatUnFulfillmentSF: false,
        shippingPercentage: 0,
        status: SettingStatus.ACTIVE,
        vatPercentage: 15,
      });
      await this.settingRepository
        .getEntityManager()
        .persistAndFlush(productSetting);
    }

    return productSetting;
  }
}
