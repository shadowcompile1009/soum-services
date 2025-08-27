import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypesenseUtil } from './utils/typesense';
import { SearchReqDTO } from './dto/searchReqDto';
import { SearchRequest } from './modules/grpc/proto/search.pb';
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  async getProducts(searchReq: SearchReqDTO | SearchRequest) {
    const collection =
      'products' + '_' + this.configService.get('kafka.PREFIX');
    const searchRes = await TypesenseUtil.fetchResults(
      collection,
      searchReq.filters,
    );
    return searchRes;
  }
}
