import {
  Embeddable,
  Embedded,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  OneToMany,
} from '@mikro-orm/core';
import { ProductStatus } from '../enum/productStatus.enum';
import { ProductSellType } from '../enum/productSellType.enum';
import { CategoryType } from '../enum/categoryType.enum';
import { Settings } from './settings.entity';
import { ObjectId } from 'mongodb';
import { ListingSource } from '../enum/listingSource.enum';
import { ProductImageSection } from './productImageSection.entity';
import { ProductInspectionSettings } from './product-inspection-settings.entity';
@Embeddable()
export class StatusSummary {
  // check this
  @Property({ nullable: true })
  isApproved: boolean;
  @Property({ nullable: true })
  isExpired: boolean;
  @Property({ nullable: true })
  isDeleted: boolean;
  @Property({ nullable: true })
  isReported: boolean;
  @Property({ nullable: true })
  isVerifiedByAdmin: boolean;
  @Property({ nullable: true })
  isFraudDetected: boolean;
  @Property({ nullable: true })
  isSearchSync: boolean;
}
@Embeddable()
export class ListingAddress {
  @Property({ nullable: true })
  address: string;
  @Property({ nullable: true })
  latitude: string;
  @Property({ nullable: true })
  longitude: string;
}
@Embeddable()
export class CategoryInProduct {
  @Property({})
  categoryType: CategoryType;
  @Property({})
  categoryId: string;
}

@Embeddable()
export class StorageLocation {
  @Property({})
  BIN: string;
  @Property({})
  storageNumber: string;
}
@Entity()
export class Product {
  @PrimaryKey({ type: 'ObjectId', onCreate: () => new ObjectId() })
  id!: string;

  @Property({
    nullable: true,
  })
  oldProductId?: string;

  @Property({
    type: 'text',
    length: 500,
    nullable: true,
  })
  description?: string;

  @Property()
  userId: string;

  @Property()
  score: number;

  @Property()
  sellPrice: number;

  @Property({ nullable: true })
  listingSellPrice?: number;

  @Property()
  status: ProductStatus;

  @Property({ nullable: true })
  sellerPromoCodeId?: string;

  @Property()
  sellType: ProductSellType;

  @Property()
  listingSource: ListingSource;

  @Property({ nullable: true })
  groupListingId?: string;

  @Embedded(() => ListingAddress)
  listingAddress?: ListingAddress;

  @Embedded(() => CategoryInProduct, { array: true })
  categories: CategoryInProduct[];

  @Embedded(() => StatusSummary)
  statusSummary: StatusSummary;

  @ManyToOne(() => Settings)
  productSetting: Settings;

  @Property({ type: Number, nullable: true })
  recommendedPrice?: number;
  // @OneToMany(() => ProductAction, (ProductAction) => ProductAction.product)
  // ProductActions: ProductAction[];

  // @OneToMany(
  //   () => ProductImageSection,
  //   (ProductImageSection) => ProductImageSection.product,
  // )
  productImageSections?: ProductImageSection[];

  @Embedded(() => StorageLocation, { nullable: true, object: true })
  storageLocation?: StorageLocation;

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
}
