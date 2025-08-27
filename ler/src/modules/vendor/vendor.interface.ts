import { CreateShipmentReq } from '../grpc/proto/ler.pb';

export interface IProvider {
  cancelShipment(trackingOrOrderId: string);
  createShipmentOrder(createOrderDto: CreateShipmentReq);
}
