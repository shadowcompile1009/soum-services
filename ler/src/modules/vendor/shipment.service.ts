import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateShipmentReq } from '../grpc/proto/ler.pb';
import { ShipmentType } from './dto/torod.dto';
import { Shipment } from './entities/shipment.entity';
import { TorodShipmentService } from './torod/torod.service';
import { IProvider } from './vendor.interface';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: EntityRepository<Shipment>,
    private torodService: TorodShipmentService,
    private readonly em: EntityManager,
  ) {}
  // this param should be commings as vendor but in phase 2
  public setProvider(paymentProviderEnum: string): IProvider {
    switch (paymentProviderEnum) {
      case 'torod':
        return this.torodService;
      default:
        break;
    }
  }

  async cancelShipment(id: string, serviceName: string) {
    const provider: IProvider = this.setProvider(serviceName);
    return provider.cancelShipment(id);
  }

  async createShipment(payload: CreateShipmentReq, serviceName: string) {
    const provider: IProvider = this.setProvider(serviceName);
    let shipment = await this.shipmentRepository.findOne({
      soumOrderNumber: payload.trackingNumber,
    });

    const shipmentTrackingObject = (shipment?.trackingNumbers || []).find(
      (elem) => elem.shipmentType == payload.shipmentType,
    );
    if (shipmentTrackingObject?.trackingNumber) {
      console.log(
        `Dublicated shipment already created ${shipment.id}, ${shipmentTrackingObject?.trackingNumber}`,
      );
      return shipmentTrackingObject?.trackingNumber;
    }
    let trackingNumber = null,
      errorMessage = null;
    try {
      trackingNumber = await provider.createShipmentOrder(payload);
    } catch (error) {
      console.log(error);
      trackingNumber = null;
      errorMessage = error.message;
    }

    const shipmentData = {
      shipmentType: payload.shipmentType as ShipmentType,
      trackingNumber,
      errorMessage,
      reqData: JSON.stringify(payload),
    };
    // case first time for this order to go to torod
    if (!shipment) {
      shipment = this.shipmentRepository.create({
        soumOrderNumber: payload.trackingNumber,
        trackingNumbers: [shipmentData],
      });
    }
    // case one of the shipmentType failed and we are trying again
    else if (shipmentTrackingObject) {
      shipment.trackingNumbers =
        shipment.trackingNumbers.filter(
          (elem) => elem.shipmentType !== shipmentTrackingObject.shipmentType,
        ) || [];
      shipment.trackingNumbers.push(shipmentData);
    }
    // case shipment object was there but shipmentType is new
    else {
      shipment.trackingNumbers = shipment.trackingNumbers || [];
      shipment.trackingNumbers.push(shipmentData);
    }

    await this.em.persistAndFlush(shipment);
    return trackingNumber;
  }

  getCreatedShipment(soumOrderNumber: string) {
    return this.shipmentRepository.find({ soumOrderNumber });
  }
}
