import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  Request,
  GenerateSmsaTrackingResponse,
  GetInvoiceGenerationFlagRequest,
  GetInvoiceGenerationFlagResponse,
  GetOrderDetailByIdResponse,
  GetOrderDetailByUserTypeRequest,
  GetOrderDetailRequest,
  GetPenalizedOrdersRequest,
  GetPenalizedOrdersResponse,
  GetUserRequest,
  GetUserResponse,
  UpdatePenaltyFlagRequest,
  UpdatePenaltyFlagResponse,
  V2ServiceClient,
  V2_PACKAGE_NAME,
} from '@modules/grpc/proto/v2.pb';

@Injectable()
export class V2Service implements OnModuleInit {
  private service: V2ServiceClient;
  constructor(
    @Inject(V2_PACKAGE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<V2ServiceClient>('V2Service');
  }

  async getUser(payload: GetUserRequest): Promise<GetUserResponse> {
    return firstValueFrom(this.service.getUser(payload), {
      defaultValue: null,
    });
  }

  async updatePenaltyFlag(
    payload: UpdatePenaltyFlagRequest,
  ): Promise<UpdatePenaltyFlagResponse> {
    return firstValueFrom(this.service.updatePenaltyFlag(payload), {
      defaultValue: null,
    });
  }

  async getInvoiceGenerationFlag(
    payload: GetInvoiceGenerationFlagRequest,
  ): Promise<GetInvoiceGenerationFlagResponse> {
    return firstValueFrom(this.service.getInvoiceGenerationFlag(payload), {
      defaultValue: null,
    });
  }

  async getPenalizedOrders(
    payload: GetPenalizedOrdersRequest,
  ): Promise<GetPenalizedOrdersResponse> {
    return firstValueFrom(this.service.getPenalizedOrders(payload), {
      defaultValue: null,
    });
  }

  async getOrderDetailById(
    payload: GetOrderDetailRequest,
  ): Promise<GetOrderDetailByIdResponse> {
    return firstValueFrom(this.service.getOrderDetailById(payload), {
      defaultValue: null,
    });
  }

  async getOrderDetailByUserType(
    payload: GetOrderDetailByUserTypeRequest,
  ): Promise<GetOrderDetailByIdResponse> {
    return firstValueFrom(this.service.getOrderDetailByUserType(payload), {
      defaultValue: null,
    });
  }

  async generateSMSATracking(
    payload: Request,
  ): Promise<GenerateSmsaTrackingResponse> {
    return firstValueFrom(this.service.generateSmsaTracking(payload), {
      defaultValue: null,
    });
  }

  async createDMOrder(payload: Request): Promise<GetOrderDetailByIdResponse> {
    return firstValueFrom(this.service.createDmOrder(payload), {
      defaultValue: null,
    });
  }

  async updateDMOrder(payload: Request): Promise<GetOrderDetailByIdResponse> {
    return firstValueFrom(this.service.updateDmOrder(payload), {
      defaultValue: null,
    });
  }
}
