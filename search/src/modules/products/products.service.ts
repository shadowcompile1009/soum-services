import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchReqDTO } from './dto/search-req.dto';
import { TypesenseUtil } from '@src/utils/typesense';
import { SearchRequest } from '../grpc/proto/search.pb';

@Injectable()
export class ProductsService {
  constructor(private configService: ConfigService) {}
  async getProducts(searchReq: SearchReqDTO | SearchRequest) {
    const collection =
      'products' + '_' + this.configService.get('kafka.PREFIX');
    const searchRes = await TypesenseUtil.fetchResults(
      collection,
      searchReq.filters,
    );
    return { products: searchRes };
  }
}
