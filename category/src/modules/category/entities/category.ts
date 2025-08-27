import {
  Collection,
  Embeddable,
  Embedded,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { CategoryStatus } from '../enums/category-status.enum';
import { CategoryTypes } from '../enums/category-types.enums';
import { ObjectId } from 'mongodb';
import { CategoryAttribute } from './categoryAttribute';

@Embeddable()
export class Images {
  @Property()
  type: string;
  @Property()
  url: string;
  @Property()
  source: string;
}

// @Embeddable()
// export class CategoryAttribute {
//   @Property()
//   featureId: string;
//   @Property()
//   attributeId: string;
// }
@Entity()
export class Category {
  @PrimaryKey({ type: 'ObjectId', onCreate: () => new ObjectId() })
  id: string;

  @Property()
  name!: string;

  @Property()
  nameAr!: string;

  @Property()
  position!: number;

  @Property()
  type!: CategoryTypes;

  @Property({
    onCreate: () => CategoryStatus.ACTIVE,
    default: CategoryStatus.ACTIVE,
  })
  status?: CategoryStatus;

  @Property({ nullable: true })
  parentId?: string;

  @Embedded(() => Images, { array: true, nullable: true })
  images?: Images[] = [];

  // @Embedded(() => CategoryAttribute, { array: true, nullable: true })
  // categoryAttributes?: CategoryAttribute[] = [];

  // to be decided
  @Property({ nullable: true })
  maxPercentage?: number; //Category level prop, this represent how much user can go above the variant current price

  @Property({ nullable: true })
  currentPrice?: number; // variant level prop, this represent how much user can go as sell price

  @Property({ nullable: true })
  createdAt?: Date = new Date();

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date = new Date();

  @OneToMany(
    () => CategoryAttribute,
    (categoryAttribute) => categoryAttribute.category,
    {
      orphanRemoval: true,
      default : [],
      eager: true,
    },
  )
  categoryAttributes = new Collection<CategoryAttribute>(this);
}
