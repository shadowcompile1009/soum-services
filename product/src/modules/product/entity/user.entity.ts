import {
  Entity,
  Index,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ObjectId } from 'mongodb';

@Entity()
@Index({ properties: ['mobileNumber'] })
export class SoumUser {
  @PrimaryKey({ type: 'ObjectId', onCreate: () => new ObjectId() })
  id: string;

  @Property()
  name: string;

  @Property()
  mobileNumber: string;
}
