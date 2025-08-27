import { CreatePickupRequest } from '@src/modules/grpc/proto/ler.pb';
import { Injectable } from '@nestjs/common';
import { BeOne } from './beone';

@Injectable()
export class BeoneService {
  cancelShipment(trackingOrOrderId: string) {
    throw new Error('Method not implemented.');
  }
  createShipmentOrder(createOrderDto: CreatePickupRequest) {
    return BeOne.createOrder(createOrderDto);
  }
}
