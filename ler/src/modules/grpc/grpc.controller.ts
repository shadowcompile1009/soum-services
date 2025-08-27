import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BeOne } from '@src/modules/vendor/beone/beone';
import { CitiesService } from '../cities/cities.service';
import { Cities } from '../cities/entities/cities.entity';
import { Rules } from '../rules/entities/rules.entity';
import { RulesService } from '../rules/rules.service';
import { Service } from '../service/entities/service.entity';
import { ServiceService } from '../service/service.service';
import { UserTypesService } from '../usertypes/usertypes.service';
import { Vendor } from '../vendor/entities/vendor.entity';
import { ShipmentService } from '../vendor/shipment.service';
import { VendorService } from '../vendor/vendor.service';
import {
  CancelShipmentRequest,
  CancelShipmentResponse,
  CreatePickupForAccessoriesRequest,
  CreatePickupRequest,
  CreatePickupResponse,
  CreateShipmentReq,
  CreateShipmentResponse,
  GetCityTiersRequest,
  GetCityTiersResponse,
  GetLogisticServicesRequest,
  GetLogisticServicesResponse,
  GetLogisticServicesResponse_LogisticService,
  GetLogisticServicesResponse_LogisticVendor,
  GetPickupStatusRequest,
  LER_SERVICE_NAME,
  MapLogisticsServicesRequest,
  MapLogisticsServicesResponse,
} from './proto/ler.pb';

@Controller('grpc')
export class GrpcController {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly rulesService: RulesService,
    private readonly userTypesService: UserTypesService,
    private readonly vendorService: VendorService,
    private readonly serviceService: ServiceService,
    private readonly shipmentService: ShipmentService,
  ) {}

  @GrpcMethod(LER_SERVICE_NAME, 'GetCityTiers')
  async getCityTiers(
    payload: GetCityTiersRequest,
  ): Promise<GetCityTiersResponse> {
    try {
      const city: Cities = await this.citiesService.findOne(payload.name);
      return {
        name: city?.name,
        sellerTier: city?.sellerTier,
        buyerTier: city?.buyerTier,
      };
    } catch (err) {
      return { name: '', sellerTier: 0, buyerTier: 0 };
    }
  }

  @GrpcMethod(LER_SERVICE_NAME, 'MapLogisticsServices')
  async mapLogisticsServices(
    payload: MapLogisticsServicesRequest,
  ): Promise<MapLogisticsServicesResponse> {
    const sellerType = payload.isKeySeller ? 'SIS' : 'Individual';
    const sellerTypeObj = await this.userTypesService.findOne(sellerType);
    const services = await this.serviceService.find();
    const rules: Rules[] = await this.rulesService.findRule(
      payload.sellerCityTier,
      payload.buyerCityTier,
      sellerTypeObj?.id,
    );
    let logisticServices = '';
    let isAvailableToPickup = false;
    let vendorId = '';
    let serviceId = '';
    let numberOfService = 0;
    for (const rule of rules) {
      const vendor = await this.vendorService.findOneById(rule.vendor.id);
      if (vendor) {
        vendorId = vendor.id;
        const vendorServicesIds = vendor.services?.split(',');
        for (const vendorServiceId of vendorServicesIds) {
          const service = services.find((item) => item.id === vendorServiceId);
          serviceId = service?.id;
          logisticServices += `(${service.name} - ${vendor.name})`;
          numberOfService += 1;
          if (service?.name === 'Pickup') {
            isAvailableToPickup = true;
            vendorId = vendor.id;
          }
        }
      }
    }
    return {
      logisticServices,
      isAvailableToPickup,
      vendorId: numberOfService === 1 ? vendorId : '',
      serviceId: numberOfService === 1 ? serviceId : '',
      isAvailableToOneService: numberOfService === 1,
    };
  }

  @GrpcMethod(LER_SERVICE_NAME, 'CreatePickup')
  async createPickup(
    payload: CreatePickupRequest,
  ): Promise<CreatePickupResponse> {
    try {
      return await BeOne.createOrder(payload);
    } catch (err) {
      return { awbNo: '' };
    }
  }

  @GrpcMethod(LER_SERVICE_NAME, 'CreateShipment')
  async CreateShipment(
    payload: CreateShipmentReq,
  ): Promise<CreateShipmentResponse> {
    try {
      const trackingNumber = await this.shipmentService.createShipment(
        payload,
        'torod', // this is cuz for now only torod was moved to ler
      );
      return {
        trackingNumber,
      } as CreateShipmentResponse;
    } catch (err) {
      return { trackingNumber: null };
    }
  }

  @GrpcMethod(LER_SERVICE_NAME, 'CancelShipment')
  async cancelShipment(
    payload: CancelShipmentRequest,
  ): Promise<CancelShipmentResponse> {
    try {
      const result = await this.shipmentService.cancelShipment(
        payload.trackingOrOrderId,
        'torod',
      );

      return {
        success: true,
        message: result
          ? 'Shipment cancelled successfully'
          : 'Cancellation failed',
      } as CancelShipmentResponse;
    } catch (err) {
      console.error('Error in cancelShipment:', err);
      return {
        success: false,
        message: 'Error cancelling shipment',
      } as CancelShipmentResponse;
    }
  }

  @GrpcMethod(LER_SERVICE_NAME, 'CreatePickUpForAccessories')
  async CreatePickUpForAccessories(
    payload: CreatePickupForAccessoriesRequest,
  ): Promise<CreatePickupResponse> {
    try {
      return await BeOne.CreatePickUpForAccessories(payload);
    } catch (err) {
      return { awbNo: null };
    }
  }

  @GrpcMethod(LER_SERVICE_NAME, 'GetPickupStatus')
  async GetPickupStatus(
    payload: GetPickupStatusRequest,
  ): Promise<GetPickupStatusRequest> {
    const awbNumbers = [];
    for (const awbNo of payload.awbNo) {
      try {
        const status = await BeOne.getOrderStatus(awbNo, payload.isDelivered);
        if (status) {
          awbNumbers.push(awbNo);
        }
      } catch (err) {}
    }
    return {
      awbNo: awbNumbers,
      isDelivered: payload.isDelivered,
    };
  }

  @GrpcMethod(LER_SERVICE_NAME, 'GetLogisticServices')
  async getLogisticServices(
    _payload: GetLogisticServicesRequest,
  ): Promise<GetLogisticServicesResponse> {
    try {
      const serviceArr: Service[] = await this.serviceService.find();
      const services: GetLogisticServicesResponse_LogisticService[] =
        serviceArr.map((service) => {
          return {
            serviceId: service.id,
            serviceName: service.name,
          };
        });
      const vendorArr: Vendor[] = await this.vendorService.find();
      const vendors: GetLogisticServicesResponse_LogisticVendor[] =
        vendorArr.map((vendor) => {
          return {
            vendorId: vendor.id,
            vendorName: vendor.name,
            services: vendor.services,
          };
        });

      return {
        services,
        vendors,
      };
    } catch (err) {
      return { services: [], vendors: [] };
    }
  }
}
