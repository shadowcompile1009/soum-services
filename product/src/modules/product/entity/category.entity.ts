import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Category {
  @PrimaryKey({})
  id!: string;

  @Property({ length: 500 })
  name: string;

  @Property({ length: 500 })
  nameAr: string;

  @Property()
  type: string;
}