import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class GroupListing {
  @PrimaryKey({ type: 'uuid', onCreate: uuidv4 })
  id!: string;

  @Property({})
  isModelImage?: boolean;

  @Property({})
  STK: number;

  @Property({
    type: 'date',
    onCreate: () => new Date(),
  })
  createdAt: Date;

  @Property({
    type: 'date',
    onUpdate: () => new Date(),
  })
  updatedAt: Date;
}
