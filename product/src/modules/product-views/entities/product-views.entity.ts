import {
  Embeddable,
  Embedded,
  Entity,
  Index,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

@Embeddable()
export class viewItem {
  @Property()
  @IsNotEmpty()
  productId!: string;
  @Property()
  @IsNumber()
  grandTotal!: number;
  @Property({ type: 'date' })
  viewedAt: Date = new Date();
}
@Entity()
@Index({ name: 'custom_idx_userId', properties: ['userId'] })
export class ProductView {
  @PrimaryKey({ type: 'uuid', onCreate: uuidv4 })
  id!: string;

  @Property()
  userId!: string;

  @Embedded(() => viewItem, { array: true, nullable: true })
  products!: viewItem[];

  @Property({
    type: 'date',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  createdAt: Date;

  @Property({
    type: 'date',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt: Date;
}
