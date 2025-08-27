import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { SettingStatus } from '../enum/settingStatus.enum';
import { Product } from './product.entity';
@Entity()
export class Settings {
  @PrimaryKey({ type: 'uuid', onCreate: uuidv4 })
  id!: string;

  @Property()
  shippingPercentage: number;

  @Property()
  vatPercentage: number;

  @Property()
  referralPercentage: number;

  @Property()
  refFixedAmount: number;

  @Property()
  deliveryThreshold: number;

  @Property()
  applyDF: boolean;

  @Property()
  deliveryFee: number;

  @Property()
  applyDeliveryFeeMPPs: boolean;

  @Property()
  applyDeliveryFeeSPP: boolean;

  @Property()
  status: SettingStatus;

  @Property()
  delayListingTime: number;

  @Property()
  applyListingFees: boolean;

  @Property()
  repeatUnFulfillmentSF: boolean;

  @OneToMany(() => Product, (Product) => Product.productSetting)
  products: Product[];

  @Property({
    type: 'date',
    onCreate: () => new Date(),
  })
  createdAt: Date;
}
