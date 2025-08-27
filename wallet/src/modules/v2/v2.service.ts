import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  GetUserRequest,
  GetUserResponse,
  GetUsersRequest,
  GetUsersResponse,
  GetOrderDetailRequest,
  GetOrderDetailResponse,
  V2ServiceClient,
  V2_PACKAGE_NAME,
  GetDmUserRequest,
  GetDmUserResponse,
  GetDmUsersRequest,
  GetDmUsersResponse,
  GetUsersByPhoneRequest,
  GetUsersByPhoneResponse,
  CancelOrderRequest,
  CancelOrderResponse,
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

  async getDmUserById(payload: GetDmUserRequest): Promise<GetDmUserResponse> {
    return firstValueFrom(this.service.getDmUser(payload), {
      defaultValue: null,
    });
  }

  async getUserById(payload: GetUserRequest): Promise<GetUserResponse> {
    return firstValueFrom(this.service.getUser(payload), {
      defaultValue: null,
    });
  }

  async getUsersByIds(payload: GetUsersRequest): Promise<GetUsersResponse> {
    return firstValueFrom(this.service.getUsers(payload), {
      defaultValue: null,
    });
  }

  async getOrderDetailById(
    payload: GetOrderDetailRequest,
  ): Promise<GetOrderDetailResponse> {
    return firstValueFrom(this.service.getOrderDetail(payload), {
      defaultValue: null,
    });
  }

  async getDmUsersByIds(
    payload: GetDmUsersRequest,
  ): Promise<GetDmUsersResponse> {
    return firstValueFrom(this.service.getDmUsers(payload), {
      defaultValue: null,
    });
  }

  async getUserByPhoneNumber(
    payload: GetUsersByPhoneRequest,
  ): Promise<GetUsersByPhoneResponse> {
    return firstValueFrom(this.service.getUsersByPhone(payload), {
      defaultValue: null,
    });
  }

  async cancelOrder(payload: CancelOrderRequest): Promise<CancelOrderResponse> {
    return firstValueFrom(this.service.cancelOrder(payload), {
      defaultValue: null,
    });
  }
}
