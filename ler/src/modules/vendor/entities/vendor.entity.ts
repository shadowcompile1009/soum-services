import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { Rules } from '../../rules/entities/rules.entity';
@Entity()
export class Vendor {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ unique: true })
  name: string;

  @Property({ nullable: true })
  arabicName: string;

  @Property()
  sellerTiers: string;

  @Property()
  buyerTiers: string;

  @Property()
  services: string;

  @OneToMany(() => Rules, (rules) => rules.vendor)
  rules?: Rules[];

  @Property({ nullable: true })
  deletedAt?: Date;
  
  constructor(
    name: string,
    arabicName: string,
    sellerTiers: string,
    buyerTiers: string,
    services: string,
    rules?: Rules[],
    deletedAt?: Date,
  ) {
    this.name = name;
    this.arabicName = arabicName;
    this.sellerTiers = sellerTiers;
    this.buyerTiers = buyerTiers;
    this.services = services;
    this.rules = rules;
    this.deletedAt = deletedAt;
  }
}
