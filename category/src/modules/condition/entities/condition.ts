import {
  Embeddable,
  Embedded,
  Entity,
  Index,
  JsonType,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Status } from '../enums/status.enum';
import { BannerSource } from '../enums/banner-source.enum';
import { BannerLang } from '../enums/lang.enum';
import { CategoryCondition } from '@src/modules/category-condition/entities/category-condition';
@Embeddable()
export class Banner {
  @Property()
  lang: BannerLang;
  @Property()
  url: string;
  @Property()
  source: BannerSource;
}
export class ScoreRange {
  min: number;
  max: number;
}
@Index({
  name: 'custom_idx_category_id_and_isPreset',
  properties: ['categoryId', 'isPreset'],
})
@Entity()
export class Condition {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  name: string;

  @Property()
  nameAr: string;

  @Property()
  categoryId: string;

  @Property()
  labelColor: string;

  @Property({ default: '' })
  textColor?: string;

  @Property({ type: JsonType })
  scoreRange: ScoreRange;

  @Embedded(() => Banner, { array: true })
  banners: Banner[] = [];

  @Property({ default: 10000 })
  positionEn?: number;

  @Property({ default: 10000 })
  positionAr?: number;

  @Property()
  status: Status;

  @Property()
  isPreset: boolean;

  @Property({ default: false })
  isSynced?: boolean;

  @Property({ onCreate: () => new Date(), nullable: true })
  createdAt? = new Date();

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt? = new Date();

  @OneToMany(
    () => CategoryCondition,
    (categoryCondition) => categoryCondition.condition,
  )
  categoryConditions: CategoryCondition[];
}
