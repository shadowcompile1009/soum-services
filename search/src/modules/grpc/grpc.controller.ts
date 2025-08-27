import { Controller } from '@nestjs/common';
import {
  SEARCH_SERVICE_NAME,
  SearchRequest,
  SearchResultsResponse,
} from './proto/search.pb';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductsService } from '../products/products.service';

@Controller('grpc')
export class GrpcController {
  constructor(private readonly productsService: ProductsService) {}

  @GrpcMethod(SEARCH_SERVICE_NAME, 'GetProducts')
  async getProducts(payload: SearchRequest): Promise<SearchResultsResponse> {
    const result = await this.productsService.getProducts(payload);
    if (result.products?.length) return result as SearchResultsResponse;
  }
}
