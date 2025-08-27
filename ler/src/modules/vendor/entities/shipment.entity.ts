import {
  Embeddable,
  Embedded,
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { ShipmentType } from '../dto/torod.dto';
@Embeddable()
export class TrackingNumber {
  @Property()
  shipmentType: ShipmentType;
  @Property()
  trackingNumber: string;
  @Property()
  errorMessage: string;
  @Property()
  reqData: string;
}

@Entity()
export class Shipment {
  @PrimaryKey()
  id: string = uuidv4();

  @Property({ unique: true })
  soumOrderNumber: string;

  @Embedded(() => TrackingNumber, { array: true, nullable: true })
  trackingNumbers: TrackingNumber[];

  @Property()
  createdAt = new Date();
}
