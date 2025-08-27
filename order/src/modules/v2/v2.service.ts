import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  GetUserRequest,
  GetUserResponse,
  GetViewedProductsResponse,
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

  async getRecentlySoldProducts(
    hours: number,
    limit: number,
    offset: number,
    categoryId: string = '',
    getSpecificCategory: boolean = false,
  ): Promise<GetViewedProductsResponse> {
    try {
      return firstValueFrom(
        this.service.getRecentlySoldProducts({ hours, limit, offset, categoryId, getSpecificCategory }),
        {
          defaultValue: null,
        },
      );
    } catch (error) {
      return { products: [] };
    }
  }
}
