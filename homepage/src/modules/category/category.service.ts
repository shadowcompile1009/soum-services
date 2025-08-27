import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  CategoryServiceClient,
  CATEGORY_PACKAGE_NAME,
  GetCategoriesRequest,
  GetCategoriesResponse,
} from '@modules/grpc/proto/category.pb';

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

  async getCategories(
    payload: GetCategoriesRequest,
  ): Promise<GetCategoriesResponse> {
    return firstValueFrom(this.service.getCategories(payload), {
      defaultValue: null,
    });
  }
}
