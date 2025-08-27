import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CATEGORY_PACKAGE_NAME,
  CategoryServiceClient,
  GetCatConPriceRangeRequest,
  GetCatConPriceRangeResponse,
} from '../grpc/proto/category.pb';
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

  async GetCategoryConditionPriceRange(
    payload: GetCatConPriceRangeRequest,
  ): Promise<GetCatConPriceRangeResponse> {
    return firstValueFrom(this.service.getCatConPriceRange(payload), {
      defaultValue: null,
    });
  }
}
