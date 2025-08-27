import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  PRODUCT_PACKAGE_NAME,
  ProductServiceClient,
  UpdateConsignmentStatusRequest,
  UpdateConsignmentStatusResponse,
} from '../grpc/proto/product.pb';

@Injectable()
export class ProductService implements OnModuleInit {
  private service: ProductServiceClient;
  constructor(
    @Inject(PRODUCT_PACKAGE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service =
      this.client.getService<ProductServiceClient>('ProductService');
  }

  async updateConsignmentStatus(
    payload: UpdateConsignmentStatusRequest,
  ): Promise<UpdateConsignmentStatusResponse> {
    return firstValueFrom(this.service.updateConsignmentStatus(payload), {
      defaultValue: null,
    });
  }
}
