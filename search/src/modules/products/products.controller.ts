import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchReqDTO } from './dto/search-req.dto';
import { ProductsService } from './products.service';

@Controller('/')
@ApiTags('Products')
export class ProductsController {
  @Inject(ProductsService)
  private readonly productsService: ProductsService;

  @Get('/status')
  async getStatus() {
    return { statu: 'OK' };
  }

  @Post('/products')
  search(@Body() searchReq: SearchReqDTO) {
    return this.productsService.getProducts(searchReq);
  }
}
