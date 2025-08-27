import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Product } from '@src/modules/product/entity/product.entity';
import { ObjectId } from 'mongodb';
import { ConsignmentDeliveryProviders } from '../enum/consignment.delivery-providers.enum';
import { ConsignmentStatus } from '../enum/consignment.status.enum';

export interface ConsignmentNotification {
  priceAdjustmentNotified?: boolean;
}

@Entity()
export class Consignment {
  @PrimaryKey({ type: 'ObjectId', onCreate: () => new ObjectId() })
  id!: string;

  @ManyToOne(() => Product)
  product!: Product;

  @Property({
    nullable: false,
  })
  status: ConsignmentStatus;

  @Property()
  userId: string;

  @Property()
  payoutAmount: number;

  @Property()
  orderNumber: string;

  @Property({ nullable: true })
  trackingNumber: string;

  @Property({ nullable: true })
  deliveryProvider: ConsignmentDeliveryProviders;

  @Property({
    type: 'date',
    onCreate: () => new Date(),
  })
  createdAt: Date;

  @Property({
    type: 'date',
    nullable: true,
    onUpdate: () => new Date(),
  })
  updatedAt?: Date;

  @Property({
    type: 'json',
    default: '{}',
  })
  sellerNotificationRecord: ConsignmentNotification = {};
}
