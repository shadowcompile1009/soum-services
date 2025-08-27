import { instanceToPlain } from 'class-transformer';
import { apiGatewayClient } from '@/api';
import isEmpty from 'lodash.isempty';

interface ILogisticVendorResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  arabicName: string;
  sellerTiers: string;
  buyerTiers: string;
  services: string;
}

export interface ILogisticVendor {
  id: string;
  displayName: string;
  name: string;
}

const LogisticVendorEndpoints = {
  getLogisticVendors: 'ler/vendor',
};

interface IServiceResponse {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  arabicName: string;
}

interface IVenderServiceResponse {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  arabicName: string;
  sellerTiers: string;
  buyerTiers: string;
  services: IServiceResponse[];
}

export interface IVendorService {
  id: string;
  name: string;
  displayName: string;
}

const VenderServiceEndpoints = {
  getVendorServices(vendorId: string) {
    return `ler/vendor/${vendorId}`;
  },
  allVendorServices: '/ler/service',
};

export class VendorService {
  public id: string;
  public displayName: string;
  public name: string;

  static async getAllVendorServices() {
    const result = await apiGatewayClient.client.get(
      VenderServiceEndpoints.allVendorServices
    );

    if (isEmpty(result)) return [];
    if (isEmpty(result.data)) return [];

    return instanceToPlain(
      VendorService.mapVendorService(result.data)
    ) as VendorService[];
  }

  static async getVendorServices(vendorId: string) {
    const result = await apiGatewayClient.client.get<IVenderServiceResponse>(
      VenderServiceEndpoints.getVendorServices(vendorId)
    );

    if (isEmpty(result)) return [];
    if (isEmpty(result.data)) return [];
    if (isEmpty(result.data.services)) return [];

    return instanceToPlain(
      VendorService.mapVendorService(result.data.services)
    ) as VendorService[];
  }

  static async mapVendorService(services: IVenderServiceResponse['services']) {
    return services.map(
      (service) =>
        new VendorService({
          id: service.id,
          name: service.name.trim(),
          displayName: service.name.trim(),
        })
    );
  }

  constructor({ id, displayName, name }: IVendorService) {
    this.id = id;
    this.displayName = displayName;
    this.name = name;
  }
}

export class LogisticVendor {
  static async getLogisticVendors() {
    const result = await apiGatewayClient.client.get(
      LogisticVendorEndpoints.getLogisticVendors
    );

    if (isEmpty(result)) return [];
    if (isEmpty(result.data)) return [];

    return instanceToPlain(
      LogisticVendor.mapLogisticVendor(result.data)
    ) as LogisticVendor[];
  }

  static async mapLogisticVendor(vendors: ILogisticVendorResponse[]) {
    return vendors.map(
      (vendor) =>
        new LogisticVendor({
          id: vendor.id,
          name: vendor.name,
          displayName: vendor.name,
        })
    );
  }

  public id: string;
  public displayName: string;
  public name: string;

  constructor({ id, displayName, name }: ILogisticVendor) {
    this.id = id;
    this.displayName = displayName;
    this.name = name;
  }
}
