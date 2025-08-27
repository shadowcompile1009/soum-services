import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Cities {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  name: string;

  @Property({ nullable: true })
  arabicName: string;

  @Property()
  sellerTier: number;

  @Property()
  buyerTier?: number;

  @Property({ nullable: true })
  deletedAt?: Date;

  constructor(
    name: string,
    arabicName: string,
    sellerTier: number,
    buyerTier: number,
    deletedAt?: Date,
  ) {
    this.name = name;
    this.arabicName = arabicName;
    this.sellerTier = sellerTier;
    this.buyerTier = buyerTier;
    this.deletedAt = deletedAt;
  }
}
