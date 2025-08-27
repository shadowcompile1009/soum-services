/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const emailPackage = "email";

export interface SendEmailRequest {
  userId: string;
  fullName: string;
  orderId?: string;
  productId?: string;
  fileNames: string[];
  fileContents: Uint8Array[];
}

export interface SendEmailResponse {
  code: number;
  message?: string;
}

export interface EmailServiceClient {
  sendEmailFinance(request: SendEmailRequest): Observable<SendEmailResponse>;
}

export interface EmailServiceController {
  sendEmailFinance(
    request: SendEmailRequest,
  ): Promise<SendEmailResponse> | Observable<SendEmailResponse> | SendEmailResponse;
}

export function EmailServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["sendEmailFinance"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("EmailService", method)(constructor.prototype[method], method, descriptor);
    }

    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("EmailService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const EMAIL_SERVICE_NAME = "EmailService";
