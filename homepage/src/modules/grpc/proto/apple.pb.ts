/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "apple";

export interface GetApplesRequest {
}

export interface GetApplesResponse {
  apples: GetApplesResponse_Apple[];
}

export interface GetApplesResponse_Apple {
  color: string;
  price: number;
}

export const APPLE_PACKAGE_NAME = "apple";

export interface AppleServiceClient {
  getApples(request: GetApplesRequest): Observable<GetApplesResponse>;
}

export interface AppleServiceController {
  getApples(request: GetApplesRequest): Promise<GetApplesResponse> | Observable<GetApplesResponse> | GetApplesResponse;
}

export function AppleServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getApples"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AppleService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AppleService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const APPLE_SERVICE_NAME = "AppleService";
