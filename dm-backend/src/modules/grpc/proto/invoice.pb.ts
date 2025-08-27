/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "invoice";

export interface CreateInvoiceRequest {
  orderId: string;
  invoiceType: string;
  userType: string;
  eventName: string;
  buyerBusinessModel: string;
  sellerBusinessModel: string;
}

export interface CreateInvoiceResponse {
}

export const INVOICE_PACKAGE_NAME = "invoice";

export interface InvoiceServiceClient {
  createInvoice(request: CreateInvoiceRequest): Observable<CreateInvoiceResponse>;
}

export interface InvoiceServiceController {
  createInvoice(
    request: CreateInvoiceRequest,
  ): Promise<CreateInvoiceResponse> | Observable<CreateInvoiceResponse> | CreateInvoiceResponse;
}

export function InvoiceServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createInvoice"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("InvoiceService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("InvoiceService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const INVOICE_SERVICE_NAME = "InvoiceService";
