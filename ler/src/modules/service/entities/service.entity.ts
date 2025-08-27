import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Service {
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

  @Property({ nullable: true })
  deletedAt?: Date;

  constructor(
    name: string,
    arabicName: string,
    deletedAt?: Date
  ) {
    this.name = name;
    this.arabicName = arabicName;
    this.deletedAt = deletedAt;
  }
}
