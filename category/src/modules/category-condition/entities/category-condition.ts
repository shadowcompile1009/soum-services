import {
  Entity,
  Index,
  JsonType,
  ManyToOne,
  PrimaryKey,
  Property,
  Embedded,
  Embeddable,
} from '@mikro-orm/core';
import { Condition } from '@src/modules/condition/entities/condition';
import { Status } from '@src/modules/condition/enums/status.enum';
import { v4 as uuidv4 } from 'uuid';
export class PriceNudge {
  min: number;
  max: number;
}

@Embeddable()
export class PriceQuality {
  @Property()
  name: string;

  @Property()
  price: number;

  @Property()
  TTS: number;

  @Property()
  position: number;
}
export enum PriceQualityNames {
  EXCELLENT = 'Excellent',
  FAIR = 'Fair',
  FAIR_EXPENSIVE = 'FairExpensive',
  ABOVE = 'Above',
  EXPENSIVE = 'Expensive',
  EXPENSIVE_UPPER = 'ExpensiveUpper',
}
@Index({
  name: 'custom_idx_condition_id_and_category_id',
  properties: ['categoryId', 'condition'],
})
@Entity()
export class CategoryCondition {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  categoryId: string;

  @Property({ type: JsonType })
  priceNudge: PriceNudge;

  @Embedded(() => PriceQuality, { array: true })
  priceQualityList: PriceQuality[];

  @Property({ onCreate: () => new Date() })
  createdAt? = new Date();

  @Property({ onCreate: () => Status.ACTIVE, default: Status.ACTIVE })
  status?: Status;

  @ManyToOne(() => Condition)
  condition: Condition;

  @Property({ default: 10000 })
  position?: number;

  @Property({ onUpdate: () => new Date() })
  updatedAt? = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;
}
