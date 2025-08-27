/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "addon";

export interface GetAddonsRequest {
  addonIds: string[];
  modelId: string;
  price: number;
}

export interface AddonItem {
  id: string;
  status: string;
  type: string;
  image: string;
  nameEn: string;
  nameAr: string;
  taglineAr: string[];
  taglineEn: string[];
  descriptionEn: string;
  descriptionAr: string;
  priceType: string;
  price: number;
  validityType: string;
  validity: number;
  modelIds: string[];
  sellerIds: string[];
}

export interface GetAddonsResponse {
  addons: AddonItem[];
}

export const ADDON_PACKAGE_NAME = "addon";

export interface AddonServiceClient {
  getAddons(request: GetAddonsRequest): Observable<GetAddonsResponse>;
}

export interface AddonServiceController {
  getAddons(request: GetAddonsRequest): Promise<GetAddonsResponse> | Observable<GetAddonsResponse> | GetAddonsResponse;
}

export function AddonServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAddons"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AddonService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AddonService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ADDON_SERVICE_NAME = "AddonService";
