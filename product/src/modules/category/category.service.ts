import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CATEGORY_PACKAGE_NAME,
  CategoryServiceClient,
  Condition,
  GetCategoriesRequest,
  GetCategoriesResponse,
  GetConditionsRequest,
  GetProductCatConRequest,
  GetProductCatConResponse,
} from '../grpc/proto/category.pb';

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

  async getProductCondition(
    payload: GetProductCatConRequest,
  ): Promise<GetProductCatConResponse> {
    return await firstValueFrom(this.service.getProductCatCon(payload), {
      defaultValue: null,
    });
  }

  async getConditions(payload: GetConditionsRequest): Promise<Condition[]> {
    return await firstValueFrom(this.service.getConditions(payload), {
      defaultValue: null,
    });
  }

  async getCategories(
    payload: GetCategoriesRequest,
  ): Promise<GetCategoriesResponse> {
    return await firstValueFrom(this.service.getCategories(payload), {
      defaultValue: null,
    });
  }
}
