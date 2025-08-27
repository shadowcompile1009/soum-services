import { Entity, EntitySchema, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Notification {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  userId: string;

  @Property()
  eventType: string;

  @Property()
  platform: string;

  @Property({ nullable: true })
  service?: string;

  @Property()
  messageTitle: string;

  @Property()
  messageBody: string;

  @Property()
  isRead?: boolean;

  @Property({ nullable: true })
  weTransactionId?: string;

  @Property({ nullable: true })
  overrideData?: object;

  @Property({ nullable: true })
  deletedAt?: Date;

  constructor(
    userId: string,
    eventType: string,
    platform: string,
    title: string,
    body: string,
    isRead: boolean,
    service: string,
    deletedAt?: Date,
  ) {
    this.userId = userId;
    this.eventType = eventType;
    this.platform = platform;
    this.messageTitle = title;
    this.messageBody = body;
    this.isRead = isRead;
    this.service = service;
    this.deletedAt = deletedAt;
  }
}
