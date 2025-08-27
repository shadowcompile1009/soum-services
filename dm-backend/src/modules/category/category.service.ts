import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CATEGORY_PACKAGE_NAME,
  CategoryServiceClient,
  GetProductCatConRequest,
  GetProductCatConResponse,
} from '../grpc/proto/category.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CategoryService implements OnModuleInit {
  private service: CategoryServiceClient;
  constructor(
    @Inject(CATEGORY_PACKAGE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service =
      this.client.getService<CategoryServiceClient>('CategoryService');
  }

  async getProductCondition(
    payload: GetProductCatConRequest,
  ): Promise<GetProductCatConResponse> {
    return firstValueFrom(this.service.getProductCatCon(payload), {
      defaultValue: null,
    });
  }
}
