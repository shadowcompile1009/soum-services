import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Rules } from '../../rules/entities/rules.entity';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class UserType {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  name: string;

  @Property({ nullable: true })
  deletedAt?: Date;

  @OneToMany(() => Rules, (rules) => rules.userType)
  rules?: Rules[];

  constructor(name: string, rules?: Rules[], deletedAt?: Date) {
    this.name = name;
    this.rules = rules;
    this.deletedAt = deletedAt;
  }
}
