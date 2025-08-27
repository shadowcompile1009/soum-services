import { Inject, Injectable } from '@nestjs/common';
import {
  CATEGORY_PACKAGE_NAME,
  CategoryServiceClient,
  GetCategoriesRequest,
  GetCategoriesResponse,
} from '../grpc/proto/category.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CategoryService {
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
    payload: GetCategoriesRequest
  ): Promise<GetCategoriesResponse> {
    return await firstValueFrom(this.service.getCategories(payload), {
      defaultValue: null,
    });
  }
}
