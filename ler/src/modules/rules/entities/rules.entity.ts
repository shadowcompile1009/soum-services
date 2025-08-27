import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Vendor } from '../../vendor/entities/vendor.entity';
import { UserType } from '../../usertypes/entities/userType.entity';
@Entity()
export class Rules {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @ManyToOne(() => Vendor)
  vendor?: Vendor;

  @ManyToOne(() => UserType)
  userType?: UserType;

  @Property()
  sellerTier: number;

  @Property()
  buyerTier?: number;

  @Property({ nullable: true })
  deletedAt?: Date;

  constructor(
    sellerTier: number,
    buyerTier: number,
    userType?: UserType,
    vendor?: Vendor,
    deletedAt?: Date,
  ) {
    this.sellerTier = sellerTier;
    this.buyerTier = buyerTier;
    this.userType = userType;
    this.vendor = vendor;
    this.deletedAt = deletedAt;
  }
}
